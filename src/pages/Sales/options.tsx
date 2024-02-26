import { useRecoilState, useRecoilValue } from "recoil"
import { MenuItemsType, MenuOptionGroupType, OptionGroupOrderType, OrderStepType } from "../../atom/type"
import { CartLists } from "../../atom/cart"
import { useEffect, useRef, useState } from "react"
import { screenPx } from "../../atom/px"
import PopupContainer from "../../components/PopupContainer"
import Loading from "../Loading"
import { Pagable } from "../../components/Pagable"
import { Checkbox } from "../../components/Checkbox"

export default function Options({
    optionInfo,
    setOptionInfo,
    setStep,
    screenSize,
    fontSize
}:{
    optionInfo: MenuItemsType,
    setOptionInfo: (optionInfo: MenuItemsType | null) => void
    setStep: (step: OrderStepType) => void
    screenSize: {
        width: number,
        height: number
    }
    fontSize: string
}) {
    const [carts, setCarts] = useRecoilState(CartLists)
    const containerRef = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState<number[]>([0,0])
    const [selectedsOptionId, setSelectedsOptionId] = useState<OptionGroupOrderType[]>([])
    const px = useRecoilValue(screenPx)
    const [defySelectRule, setDefySelectRule] = useState<boolean>(false)
    useEffect(() => {
        if(!containerRef.current) return;
        setOffset([
            containerRef.current.getBoundingClientRect().left,
            containerRef.current.getBoundingClientRect().top
        ])

        //기본선택 메뉴가 있는지 검사후 선택
        setSelectedsOptionId((optionInfo.optionGroupList || []).map((optionGroup:MenuOptionGroupType) => 
            (optionGroup.groupItemList || []).filter((option) => option.defaultSelect).map((option) => ({
                optionGroupId: optionGroup.optionGroupId,
                optionId: option.optionId,
                quantity: option.optionQty || 0,
                optionAddPrice: option.optionAddPrice,
                optionName: option.optionName,
                "optionProductId": option.optionGroupProductId,
            })).flat()
        ).flat())
    }, [optionInfo])
    if(optionInfo) return (
        <PopupContainer screenSize={screenSize} title="옵션 선택" onCancel={() => {
            setOptionInfo(null)
            setStep('SELECT_MENU')
        }} overflow={false} onSubmit={() => {
            if(!optionInfo) return

            //옵션 선택 제한이 있는지 확인후 수량이 맞지 않다면 false
            let checkMinCount = true, checkMaxCount = true
            if(!defySelectRule) optionInfo.optionGroupList.forEach((optionGroup) => {
                if(selectedsOptionId.filter((option) => option.optionGroupId === optionGroup.optionGroupId).reduce((prev, curr) => prev + curr.quantity, 0) < optionGroup.minSelectCount) {
                    checkMinCount = false
                }
                if(selectedsOptionId.filter((option) => option.optionGroupId === optionGroup.optionGroupId).reduce((prev, curr) => prev + curr.quantity, 0) > optionGroup.maxSelectCount) {
                    checkMaxCount = false
                }
            })
            if(!checkMinCount) {
                alert('최소 선택 수량을 확인해주세요')
                return
            }
            if(!checkMaxCount) {
                alert('최대 선택 수량을 확인해주세요')
                return
            }

            //이미 카트에 담긴 상품인지 확인
            let hasBeenItemInCart = carts.findIndex((cart) => cart.productId === optionInfo.productId && 
                cart.storeProductId === optionInfo.storeProductId &&
                (cart.groupItemList || []).every((option) => selectedsOptionId.some((selected) => selected.optionId === option.optionId && selected.optionGroupId === option.optionGroupId && selected.quantity === option.quantity)))
            
            setCarts(hasBeenItemInCart > -1 ? 
                //이미 카트에 담긴 상품이라면 수량만 증가
                carts.map((cart, index) => index === hasBeenItemInCart ? ({
                    ...cart,
                    quantity: cart.quantity + 1
                }):cart)
                //카트에 담긴 상품이 아니라면 새로 추가
                :[
                    {
                        "storeProductId": optionInfo.storeProductId,
                        "storeProductName": optionInfo.storeProductName,
                        "storeProductPrice": optionInfo.storeProductPrice,
                        "productId": optionInfo.productId,
                        "productName": optionInfo.productName,
                        quantity: 1,
                        discountPrice: 0,
                        discountRate: 0,
                        crnId: 0,
                        discountDesc: '',
                        groupItemList: selectedsOptionId.filter((selected) => selected.quantity > 0)
                    },
                    ...carts,
                ]
            )

            //옵션 초기화 후 닫기
            setSelectedsOptionId([])
            setOptionInfo(null)
            setStep('SELECT_MENU')
        }}>
            <div className='relative' style={{
                width: 540 * px + 'px',
                height: 353 * px + 'px'
            }} ref={containerRef}>
            <Checkbox checked={defySelectRule} onChange={(value) => {
                setDefySelectRule(value)
            }} className='absolute bottom-full right-0' style={{
                marginBottom: 22 * px + 'px',
            }} label='옵션 제한 해제' />
            {offset[0] > 0 && <Pagable scrollAlign='vertical' width={540 * px} height={353 * px} offset={offset} rowsPerPage={Math.floor(((optionInfo.optionGroupList || []).length + (optionInfo.optionGroupList || []).reduce((a, b) => a + Math.ceil((b.groupItemList ||[]).length/2),0))/6)}>{
                (optionInfo.optionGroupList || []).map((optionGroup, index) => <div key={index} style={{
                    paddingLeft: 20 * px + 'px',
                    paddingRight: 20 * px + 'px',
                    paddingTop: (index > 0 ? 3: 0) * px + 'px',
                    paddingBottom: (index === (optionInfo.optionGroupList || []).length -1 ? 20 :0) * px + 'px',
                }}>
                    <div style={{
                        paddingTop: 17 * px + 'px',
                        paddingBottom: 10 * px + 'px',
                        fontSize: (fontSize === 'large' ? 12.5: 11) * px + 'px'
                    }}>
                        <b className='font-bold' style={{
                            fontSize: (fontSize === 'large' ? 16: 14) * px + 'px'
                        }}>{optionGroup.optionGroupName}</b>
                        {!defySelectRule && <>
                            <span className=' text-a2dblue-dark' style={{
                                marginLeft: 7 * px + 'px'
                            }}>{selectedsOptionId.filter((selected) => selected.optionGroupId === optionGroup.optionGroupId)
                            .reduce((prev, curr) => prev + curr.quantity, 0)}개 선택</span>
                            {optionGroup.minSelectCount > 0 && <span className=' text-darkgray'>{" "}/ {optionGroup.minSelectCount}개 필수 선택</span>}
                        </>}
                    </div>
                    <div className='grid grid-cols-2 border border-lightgray border-b-0 border-r-0' style={{
                        gridAutoColumns: '1fr',
                        boxShadow: 'inset -1px 0 0 #e9e9ed, inset 0 -1px 0 #e9e9ed',
                    }}>
                        {optionGroup.groupItemList.map((option, index) => <div key={index} className={`
                         border-b border-r border-lightgray
                        ${(selectedsOptionId.find((selected) => selected.optionGroupId === optionGroup.optionGroupId && selected.optionId === option.optionId)?.quantity || 0) > 0 
                            ? ' bg-a2dblue-light'
                            :'bg-white'
                        } flex justify-between items-start`} style={{
                            padding: `${8 * px}px ${10 * px}px`,
                        }}>
                            <div style={{
                                width:`calc(100% - ${97 * px}px)`,
                            }}>
                                <div className='font-medium line-clamp-2 keep-all' style={{
                                    lineHeight: 1.2,
                                    fontSize: (fontSize === 'large' ? 14: 12.5) * px + 'px'
                                }}>{option.optionName}</div>
                                <div className='text-deepdark' style={{
                                    fontSize: (fontSize === 'large' ? 12.5: 11) * px + 'px',
                                    marginTop: 3 * px + 'px'
                                }}>{(option.optionAddPrice || 0).toLocaleString()}원</div>
                            </div>
                            <div className='flex border border-lightgray bg-white rounded-md' style={{
                                width: 97 * px + 'px',
                                height: 32 * px + 'px',
                            }}>
                            <button className='flex items-center justify-center w-full'  onClick={() => {
                                const hasBeenOptIndex = selectedsOptionId.findIndex((selected) => selected.optionGroupId === optionGroup.optionGroupId && selected.optionId === option.optionId)

                                //선택된 옵션이 없으면 무시
                                if(hasBeenOptIndex < 0) return
                                setSelectedsOptionId((
                                    selectedsOptionId[hasBeenOptIndex].quantity === 1 ?
                                    selectedsOptionId.filter((selected, index) => index !== hasBeenOptIndex)
                                    : selectedsOptionId.map((selected, index) => {
                                        if(index === hasBeenOptIndex) {
                                            return {
                                                ...selected,
                                                quantity: selected.quantity - 1
                                            }
                                        }
                                        return selected
                                    })
                                ))
                            }}><span className='bg-black' style={{
                                width: 10 * px + 'px',
                                height: 1 * px + 'px'
                            }}></span></button>
                            <button style={{
                                fontSize: (fontSize === 'large' ? 12.5: 11) * px + 'px',
                            }} className={`flex items-center justify-center w-full bg-[#f7f7f9] border-x border-lightgray`}>{selectedsOptionId.find((selected) => selected.optionGroupId === optionGroup.optionGroupId && selected.optionId === option.optionId)?.quantity || 0}</button>
                            <button className='flex items-center justify-center w-full' onClick={() => {
                                //이미 선택된 옵션이 최대수량을 넘어가면 선택 불가
                                if(!defySelectRule && optionGroup.maxSelectCount <= selectedsOptionId.filter((selected) => selected.optionGroupId === optionGroup.optionGroupId).reduce((prev, curr) => prev + curr.quantity, 0)) {
                                    return
                                }
                                const hasBeenOptIndex = selectedsOptionId.findIndex((selected) => selected.optionGroupId === optionGroup.optionGroupId && selected.optionId === option.optionId)
                                setSelectedsOptionId(hasBeenOptIndex > -1 ? selectedsOptionId.map((selected, index) => {
                                    if(index === hasBeenOptIndex) {
                                        return {
                                            ...selected,
                                            quantity: selected.quantity + 1
                                        }
                                    }
                                    return selected
                                }): [
                                    ...selectedsOptionId,
                                    {
                                        optionGroupId: optionGroup.optionGroupId,
                                        optionId: option.optionId,
                                        quantity: 1,
                                        optionAddPrice: option.optionAddPrice,
                                        optionName: option.optionName,
                                        "optionProductId": option.optionGroupProductId,
                                    }
                                ])
                            }}><span className='bg-black relative' style={{
                                width: 10 * px + 'px',
                                height: 1 * px + 'px'
                            }}><span style={{
                                width: 10 * px + 'px',
                                height: 1 * px + 'px'
                            }} className='bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90'></span></span></button>
                            </div>
                        </div>)}
                    </div>
                </div>)
            }</Pagable>}
            </div>
            <div style={{
                width: 540 * px + 'px',
                height: 44 * px + 'px',
                paddingLeft: 12 * px + 'px',
                paddingRight: 12 * px + 'px',
                fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
            }} className='flex justify-between items-center border-t border-lightgray'>
                <b className='font-medium'>{optionInfo.storeProductName}</b>
                <div className='text-darkgray'>
                    <b className='font-medium text-black'>{(optionInfo.storeProductPrice + selectedsOptionId.reduce((prev, curr) => prev + curr.optionAddPrice * curr.quantity, 0)).toLocaleString()}원</b>
                    ({optionInfo.storeProductPrice.toLocaleString()}원
                    <span className='text-a2dblue-dark'>+{selectedsOptionId.reduce((prev, curr) => prev + curr.optionAddPrice * curr.quantity, 0).toLocaleString()}원</span>)
                </div>
            </div>
        </PopupContainer>
    )
    return <Loading />
}


