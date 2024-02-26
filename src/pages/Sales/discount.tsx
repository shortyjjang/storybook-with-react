import { useRecoilState, useRecoilValue } from "recoil"
import { OrderStepType } from "../../atom/type"
import { useEffect, useState } from "react"
import { disCountReasons } from "../../atom/discountReason"
import { CartLists } from "../../atom/cart"
import { screenPx } from "../../atom/px"
import { Memo } from "../../components/Memo"
import PopupContainer from "../../components/PopupContainer"
import Loading from "../Loading"
import NumberKeypad from "../../components/NumberKeypad"


const initialDiscountInfo = {
    discountPrice: 0,
    discountType: 'WON' ,
    discountPercent:0,
    discountDesc: '',
    crnId: 0,
}
type discountInfoType = typeof initialDiscountInfo
export default function Discount({
    setStep,
    selectedsIndexs,
    screenSize,
    fontSize
}:{
    setStep: (step:OrderStepType ) => void
    selectedsIndexs: number[],
    screenSize: {
        width: number,
        height: number
    }
    fontSize: string
}) {
    const [discounts, setDiscounts] = useRecoilState(disCountReasons)
    const [showDescription, setShowDescription] = useState<boolean>(false)
    const [discountInfo, setDiscountInfo] = useState<discountInfoType>(initialDiscountInfo)
    const [carts, setCarts] = useRecoilState(CartLists)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const px = useRecoilValue(screenPx)
    useEffect(() => {
        if((discounts || []).length < 1 && localStorage.getItem('discountReasons')) setDiscounts(JSON.parse(localStorage.getItem('discountReasons') || '[]'))
        setTotalPrice(carts.filter((cart, index) => selectedsIndexs.some(idx => idx === index))
        .reduce((prev, next) => 
            prev + 
            (next.storeProductPrice + (next.groupItemList || []).reduce((op, on) => op + on.optionAddPrice * on.quantity, 0)) 
            * next.quantity, 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedsIndexs])
    if(showDescription) return (
        <Memo value={discountInfo.discountDesc} style={{
            top: 0,
            height: screenSize.height + 'px',
        }} onSubmit={(value) => {
            setDiscountInfo({
                ...discountInfo,
                discountDesc: value
            })
            setShowDescription(false)
        }} onCancel={() => {
            setShowDescription(false)
        }} />
    )
    if(selectedsIndexs.length > 0 && discounts.length > 0 )return (
        <PopupContainer screenSize={screenSize} title="할인 선택" onCancel={() => {
            setDiscountInfo(initialDiscountInfo)
            setTotalPrice(0)
            setStep('SELECT_MENU')
        }} onSubmit={() => {
            if(!discountInfo.crnId || discountInfo.crnId === 0) return alert('할인 사유를 선택해주세요.')
            if(discountInfo.discountPrice > totalPrice) return alert('할인 금액이 상품 금액보다 클 수 없습니다.')
            if(discountInfo.discountPrice === 0) return alert('할인 금액을 입력해주세요.')
            if(discountInfo.discountPercent === 0 && String(discountInfo.discountPrice).at(-1) !== '0') return alert('할인금액은 10원 단위로 입력해주세요.')
            if(discounts.find(d => d.crnId === discountInfo.crnId)?.crnNoteReqiredYn === 'Y' && !discountInfo.discountDesc) return alert('특이사항 입력은 필수입니다.')

            let restPrice = discountInfo.discountPrice, //남은 할인할 금액
                restQty = carts.filter((cart, index) => selectedsIndexs.some(idx => idx === index)).reduce((prev, next) => prev + next.quantity,0), //남은 할인할 수량
                onePerCount = restPrice/totalPrice //할인율
            setCarts(carts.map((cart, index) => {
                if(selectedsIndexs.some(idx => idx === index)) {
                    
                    let originalPrice = cart.storeProductPrice + (cart.groupItemList || []).reduce((c,d) => c +(d.optionAddPrice * d.quantity),0) //개당 가격
                    let currentDiscountPrice = Number(Math.ceil(originalPrice * onePerCount * 0.1).toFixed(0) + '0') //할인율에 따른 할인금액(10원 단위로 올림)
                    let discountPrice = currentDiscountPrice * cart.quantity //수량을 곱한 할인금액

                    //할인금액이 상품금액보다 클경우 상품금액으로 할인금액을 변경
                    if(discountPrice > originalPrice * cart.quantity) discountPrice = originalPrice * cart.quantity

                    //남은 할인금액이 남은 금액보다 클경우 남은 금액으로 할인금액을 변경하고 남은 할인금액과 수량을 0으로 변경
                    if(discountPrice > restPrice || index === selectedsIndexs.at(-1)) {
                        discountPrice = restPrice
                        restPrice = 0
                        restQty = 0
                    }else {
                    //일반적으로 할인금액을 차감하고 남은 할인금액과 수량을 차감
                        restPrice = restPrice - discountPrice
                        restQty = restQty - cart.quantity
                    }
                    return({
                        ...cart,
                        discountPrice: discountPrice,
                        discountDesc: discountInfo.discountDesc,
                        crnId: discountInfo.crnId,
                        discountRate: discountInfo.discountPercent
                    })
                }
                return cart
            }))
            //초기화 후 상품판매로 이동
            setDiscountInfo(initialDiscountInfo)
            setTotalPrice(0)
            setStep('SELECT_MENU')
        }}>
            <div className='grid' style={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                width: 540 * px + 'px',
                height: 353 * px + 'px',
                padding: ` ${17 * px}px ${20 * px}px ${20 * px}px ${20 * px}px`,
                gap: 15 * px + 'px'
            }}>
                <div>
                    <h3 className='font-medium' style={{
                        fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                        paddingBottom: 10 * px + 'px'
                    }}>할인 사유</h3>
                    <div className='overflow-auto' style={{
                        height: 282 * px + 'px',
                    }}>
                        <div className='grid grid-cols-2' style={{
                            gridAutoColumns: '1fr',
                            gap: 5 * px + 'px',
                        }}>
                            {discounts.map((discount, index) => <button key={index} style={{
                                fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                            }} className={`
                                border rounded-lg aspect-[59/26]
                                ${discountInfo.crnId === discount.crnId ? 'bg-white border-black text-black' :'border-lightgray text-darkgray'}
                                `} onClick={() => {
                                    setDiscountInfo({
                                        ...discountInfo,
                                        crnId: discount.crnId
                                    })
                                    if(discount.crnNoteDisplayYn === 'Y') setShowDescription(true)
                            }}>
                                <span>
                                    {discount.crnName}
                                    {discount.crnNoteDisplayYn === 'Y' && (discountInfo.discountDesc ? <span className='font-normal'>: 입력완료</span>: <span className='font-normal'>: 사유입력</span>)}
                                </span>
                            </button>)}
                        </div>

                    </div>
                </div>
                <div>
                    <h3 className='font-medium' style={{
                        fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                        paddingBottom: 10 * px + 'px'
                    }}>할인율/원</h3>
                    <div className='flex' style={{
                        height: 54 * px + 'px',
                        marginBottom: 5 * px + 'px'
                    }}>
                        <div className={`border border-lightgray border-r-0 flex w-full items-center ${discountInfo.discountPrice > 0 ? 'text-black': 'text-darkgray'}`} style={{
                            width: `calc(100% - ${115 * px}px)`,
                            fontSize: 17 * px + 'px',
                            paddingLeft: 13 * px + 'px',
                            paddingRight: 13 * px + 'px',
                        }}>
                            {discountInfo.discountPrice > 0 ? (
                                discountInfo.discountType === 'WON' ? discountInfo.discountPrice.toLocaleString() : discountInfo.discountPercent.toLocaleString()
                            ) : '직접 입력'}
                        </div>
                        <button style={{
                            width: 58 * px + 'px',
                            fontSize: 19 * px + 'px',
                        }} className={`border ${discountInfo.discountType === 'PERCENT' ?'border-black text-black' :'border-lightgray text-darkgray'} border-r-black`} onClick={() => setDiscountInfo({
                            ...discountInfo,
                            discountType: 'PERCENT'
                        })}>%</button>
                        <button style={{
                            width: 57 * px + 'px',
                            fontSize: 19 * px + 'px',
                        }}  className={`border ${discountInfo.discountType === 'WON' ?'border-black text-black' :'border-lightgray text-darkgray'} border-l-0`} onClick={() => setDiscountInfo({
                            ...discountInfo,
                            discountType: 'WON'
                        })}>원</button>
                    </div>
                    <div>
                        <NumberKeypad value={
                            discountInfo.discountType === 'WON' ? discountInfo.discountPrice : discountInfo.discountPercent
                        } onClick={(value) => {
                            let price = value
                            if(discountInfo.discountType === 'PERCENT' && value > 100) price = 100
                            if(discountInfo.discountType === 'WON' && value > totalPrice)  price = totalPrice
                            setDiscountInfo({
                                ...discountInfo,
                                discountPercent: discountInfo.discountType === 'PERCENT' ? price : 0,
                                discountPrice: discountInfo.discountType === 'WON' ? price : Number((totalPrice * (price / 100) * 0.1).toFixed(0)) * 10
                            })
                        }} />
                    </div>
                </div>
            </div>
            <div style={{
                width: 540 * px + 'px',
                height: 44 * px + 'px',
                fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                paddingLeft: 12 * px + 'px',
                paddingRight: 12 * px + 'px',
            }} className='flex justify-between items-center border-t border-lightgray'>
                <b className='font-medium'>
                    {carts.filter((cart, index) => selectedsIndexs.some(idx => idx === index))[0]?.storeProductName}
                    {carts.filter((cart, index) => selectedsIndexs.some(idx => idx === index)).length > 1 && 
                    ` 외 ${(carts.filter((cart, index) => selectedsIndexs.some(idx => idx === index)).length - 1)}개`}
                </b>
                <div className='text-darkgray'>
                    <b className='font-medium text-black'>{(totalPrice - discountInfo.discountPrice).toLocaleString()}원</b>
                    ({(totalPrice || 0).toLocaleString()}원
                    <span className='text-[#ff0000]'>-{(discountInfo.discountPrice || 0).toLocaleString()}원</span>)
                </div>
            </div>
        </PopupContainer>
    )
    return <Loading />
}
