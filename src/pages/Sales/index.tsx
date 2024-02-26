import { ReactNode, useEffect, useState } from "react"
import { DISPLAY_MODE, EdiorModeType, MenuItemsType, MenuListsType, OrderStepType, orderDataType } from "../../atom/type"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { disposalReasons } from "../../atom/disposalReason"
import { CartLists } from "../../atom/cart"
import { disCountReasons } from "../../atom/discountReason"
import { cancelReasons } from "../../atom/cancelReason"
import { MenuLists } from "../../atom/menu"
import { screenPx } from "../../atom/px"
import { userInfo } from "../../atom/user"
import { indexedDb } from "../../lib/db"
import dayjs from "dayjs"
import { A2dApi } from "../../lib/api"
import Loading from "../Loading"
import { Header } from "../../components/Header"
import CheckButton from "../../components/CheckButton"
import { Button } from "../../components/Button"
import Menus from "./menus"
import Options from "./options"
import Customer from "./customer"
import { Checkbox } from "../../components/Checkbox"
import Disposed from "./disposed"
import Discount from "./discount"
import { Pagable } from "../../components/Pagable"
import NumberKeypad from "../../components/NumberKeypad"
import PopupContainer from "../../components/PopupContainer"
import font_on from "../../images/icon_text_on.png"
import font_off from "../../images/icon_text_off.png"
import gear_on from "../../images/icon_gear_on.png"
import gear_off from "../../images/icon_gear_off.png"
import check_on from "../../images/icon_check_on.png"
import check_off from "../../images/icon_check_off.png"
import delete_icon from "../../images/icon_delete.png"

let requestOrder = false

export default function Sales({
    setDisplayType,
    displayType,
    setStatus,
}:{
    setDisplayType: (value:DISPLAY_MODE) => void,
    displayType: DISPLAY_MODE,
    setStatus: (value: string | ReactNode) => void
}) {
    const [carts, setCarts] = useRecoilState(CartLists)
    const [fontSize, setFontSize] = useState('normal')
    const setDisposalReasons = useSetRecoilState(disposalReasons)
    const setCancelReasons = useSetRecoilState(cancelReasons)
    const [discountType, setDiscountReasons] = useRecoilState(disCountReasons)
    const [menus, setMenus] = useRecoilState(MenuLists)
    const [favoriteMenus, setFavoriteMenus] = useState<MenuItemsType[]>([])
    const [step, setStep] = useState<OrderStepType>('CUSTOMER')
    const [loading, setLoading] = useState(true)
    const [backupLists, setBackupLists] = useState<MenuListsType[]>([])
    const [editorMode, setEditorMode] = useState<EdiorModeType>(null)
    const [selectedsIndexs, setSelectedsIndexs] = useState<number[]>([])
    const [showChangeQuantity, setShowChangeQuantity] = useState(false)
    const px = useRecoilValue(screenPx)
    const user = useRecoilValue(userInfo)
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0
    });
    const [currentColor, setCurrentColor] = useState('')
    const [defaultColor, setDefaultColor] = useState('')
    const [orderData, setOrderData] = useState<orderDataType>(intitalOrderData)
    const [currentCategory, setCurrentCategory] = useState<number>(0)
    const [optionInfo, setOptionInfo] = useState<MenuItemsType | null>(null)
    const [showEditorButton, setShowEditorButton] = useState<false | 'BUTTON_FONT' | 'BUTTON_SETTING' | 'BUTTON_LIST'>(false)
    const [selectKeyPadIndex, setSelectKeyPadIndex] = useState<number | null>(null)

    //결제하기
    const saveOrder = async () => {
        if(requestOrder) return;
        requestOrder = true

        //고객정보가 없으면 고객정보를 입력하도록 한다.
        if(orderData.customerInfo.gender === '' || orderData.customerInfo.age === '' || !orderData.customerInfo.age || !orderData.customerInfo.gender) return setStep('CUSTOMER')
        if(!orderData.paymentType) return;

        //주문상품에 금액이 없는 경우 결제를 할 수 없다.
        if(carts.length === 0) return;
        if(carts.some(cart => cart.quantity === 0 || cart.storeProductPrice === undefined) || 
        typeof carts.reduce((prev, next) => prev + ((next.storeProductPrice + (next.groupItemList || []).reduce((opPrev,opNext) => opPrev + (opNext.optionAddPrice * opNext.quantity), 0)) * next.quantity) - (next.discountPrice || 0),0) !== 'number'
        ) return;
        const totalAmount = carts.reduce((prev, next) => prev + ((next.storeProductPrice + (next.groupItemList || []).reduce((opPrev,opNext) => opPrev + (opNext.optionAddPrice * opNext.quantity), 0)) * next.quantity) - (next.discountPrice || 0),0)

        //총 금액이 없으면 결제를 할 수 없다.
        if(totalAmount < 0) return;
        
        //기존 결제 내역을 조회한다(오늘일자)
        await indexedDb.createObjectStore(['ORDER_LIST']);
        const historyList = await indexedDb.getValue(
            'ORDER_LIST',
            dayjs().format('YYYYMMDD_HH')
        ) || [];
        let body = {
            "loginId":user.loginId,
            "orderTime":dayjs().format('YYYY-MM-DD HH:mm:ss'),
            "orderPayType":orderData.paymentType,
            "customerInfo":orderData.customerInfo,
            "totalPaidAmount":totalAmount,
            "productList": carts.map((cart) => ({
                "storeProductId":cart.storeProductId,
                "storeProductName":cart.storeProductName,
                "storeProductPrice":cart.storeProductPrice + (cart.groupItemList || []).reduce((prev, next) => 
                    prev + ((next.optionAddPrice * next.quantity) || 0),0), //상품개당 총가격
                "quantity":cart.quantity,
                "discountPrice":cart.discountPrice,
                "discountRate":cart.discountRate,
                "crnId":cart.crnId,
                etcDiscountReason: cart.discountDesc,
                "groupItemList":(cart.groupItemList ||[]).map((groupItem) => ({
                    "optionId":groupItem.optionId,
                    "quantity":groupItem.quantity,
                    "optionAddPrice":groupItem.optionAddPrice,
                    "optionName":groupItem.optionName
                }))

            })),
        }
        //서버로 주문내역을 보내고 주문번호를 받는다.
        const request = await A2dApi.post('/api/v1/store/order/create', body)
        //주문내역을 로컬스토리지에 저장한다.
        if(request?.resultMsg || !request) await indexedDb.putValue(
            'ORDER_LIST',
            [
                ...historyList, 
                {
                    ...body,
                    orderId: ''
                }
            ],
            dayjs().format('YYYYMMDD_HH')
        );
        
        //주문내역을 초기화한다.
        setCarts([])
        setSelectedsIndexs([])
        setOrderData(intitalOrderData)
        setStep('CUSTOMER')
        requestOrder = false
    }
    useEffect(() => {
        if(carts.length === 1 && selectedsIndexs.length < 1) setSelectedsIndexs([0])
    }, [carts, selectedsIndexs.length])
    useEffect(() => {
        if(!editorMode && !showEditorButton && step !== 'CUSTOMER' && (!orderData?.customerInfo?.gender || !orderData?.customerInfo?.age)) setStep('CUSTOMER')
    },[step, orderData.customerInfo, editorMode, showEditorButton])
    useEffect(() => {
        if(!localStorage.getItem('menus') || !localStorage.getItem('disposalReasons') || !localStorage.getItem('cancelReasons') || !localStorage.getItem('cancelReasons')) {
            setStatus(<>
                동기화된 정보를 찾을 수 없습니다. 다시 동기화해주세요.
            </>)
            setDisplayType('')
            setLoading(false)
            return;
        }
        setStatus('')
        setFontSize(localStorage.getItem('fontSize') || 'normal')
        setDiscountReasons(JSON.parse(localStorage.getItem('discountReasons') || '[]'))
        setCancelReasons(JSON.parse(localStorage.getItem('cancelReasons') || '[]'))
        setDisposalReasons(JSON.parse(localStorage.getItem('disposalReasons') || '[]'))
        setFavoriteMenus(JSON.parse(localStorage.getItem('favorite') || '[]'))
        const _menus = JSON.parse(localStorage.getItem('menus') || '[]')
        setMenus(_menus)
        if(orderData.customerInfo.gender && orderData.customerInfo.age) setStep('SELECT_MENU')
        setLoading(false)
        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight > window.innerWidth ? window.innerWidth * 0.625 : window.innerHeight
        })
        // window.addEventListener("orientationchange", () => {
        //     setScreenSize({
        //         width: window.innerWidth < 960 ? 0 :window.innerWidth,
        //         height: window.innerWidth < 960 ? 0 :window.innerHeight
        //     })
        // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if(loading) return <Loading />
    if(menus.length > 0 && screenSize.width > 0) return (
        <div className='w-full h-screen grid' style={{
            gridTemplateColumns: `calc(66.6666% + 1px) auto`,
        }}>
            <div className=''>
                <div className='flex justify-between items-center bg-black border-r border-bordergray' style={{
                    height: 41 * px + 'px',
                    paddingRight: 15 * px + 'px'
                }}>
                    <Header setDisplayType={setDisplayType} displayType={displayType} onHome={() => {
                        setCarts([])
                        setBackupLists([])
                        setStep('CUSTOMER')
                        setEditorMode(null)
                        setOrderData(intitalOrderData)
                        setDisplayType('')
                    }} onSales={() => {
                    }} onHistory={() => {
                        setCarts([])
                        setBackupLists([])
                        setStep('CUSTOMER')
                        setEditorMode(null)
                        setOrderData(intitalOrderData)
                        setDisplayType('MODE_HISTORY')
                    }} />
                    {showEditorButton ? 
                        <div className={`items-center flex ${showEditorButton ? 'relative z-[2]':''}`}>
                            <div className='relative'>
                                <button style={{
                                    width: 36 * px + 'px',
                                    height: 41 * px + 'px'
                                }} onClick={() => setShowEditorButton(showEditorButton === 'BUTTON_FONT' ? 'BUTTON_LIST':'BUTTON_FONT')}>
                                    <span className='block bg-center mx-auto bg-no-repeat bg-contain' style={{
                                        width: 16 * px + 'px',
                                        height: 17.5 * px + 'px',
                                        backgroundImage: `url(${showEditorButton === 'BUTTON_FONT' ? font_on : font_off})`
                                    }}></span>
                                </button>
                                {showEditorButton === 'BUTTON_FONT' && <div style={{
                                    width: 100 * px + 'px',
                                    paddingTop: 5 * px + 'px',
                                    paddingBottom: 5 * px + 'px',
                                }} className='absolute top-full left-0 border border-black border-t-0 bg-white z-[1]'>
                                    {([['보통','normal'],['크게','large']]).map((font, index) => <CheckButton key={index} selected={fontSize === font[1]} onClick={() => {
                                        setFontSize(font[1])
                                        setShowEditorButton('BUTTON_LIST')
                                    }}>{font[0]}</CheckButton>)}
                                </div>}
                            </div>
                            <div className='relative' style={{
                                marginRight: 10 * px + 'px'
                            }}>
                                <button style={{
                                    width: 37.5 * px + 'px',
                                    height: 41 * px + 'px'
                                }} onClick={() => setShowEditorButton(showEditorButton === 'BUTTON_SETTING' ? 'BUTTON_LIST':'BUTTON_SETTING')}>
                                    <span className='block mx-auto bg-center bg-no-repeat bg-contain' style={{
                                        width: 17.5 * px + 'px',
                                        height: 17.5 * px + 'px',
                                        backgroundImage: `url(${showEditorButton === 'BUTTON_SETTING' ? gear_on : gear_off})`
                                    }}></span>
                                </button>
                                {showEditorButton === 'BUTTON_SETTING' && <div style={{
                                    paddingTop: 5 * px + 'px',
                                    paddingBottom: 5 * px + 'px',
                                    width:  100 * px + 'px',
                                }} className='absolute top-full left-0 border border-black border-t-0 bg-white z-[2]'>
                                    {([['위치변경','EDIT_DISPLAY_ORDER'],['즐겨찾기','EDIT_FAVORITE_MENU'],['색상변경','EDIT_BG_COLOR']]).map((edit, index) => <CheckButton key={index} selected={editorMode === edit[1]} onClick={() => {
                                        setEditorMode(edit[1] as EdiorModeType)
                                        if(edit[1] === 'EDIT_BG_COLOR') setCurrentColor('#ffffff')
                                        else setShowEditorButton('BUTTON_LIST')
                                    }}>{edit[0]}</CheckButton>)}
                                    {editorMode === 'EDIT_BG_COLOR' && <div className='absolute -top-px left-full -ml-px h-full bg-white border border-black  border-l-lightgray flex flex-col justify-between' style={{
                                        height: 'calc(100% + 2px)',
                                        width: 140 * px + 'px',
                                        padding: `${12 * px}px ${12.5 * px}px`
                                    }}>
                                        <div className='flex gap-2'>
                                            {(['#ffffff', ...(backgroundColors || []).filter((color) => color.menuCardColor !== defaultColor).filter((color, index) => index < 2 ).map(color => color.menuCardColor)])
                                            .map((color, index) => <button key={index} className={`rounded-md flex justify-center items-center border ${currentColor === color ? 'border-black' : 'border-lightgray'}`} style={{
                                                backgroundColor: color || '',
                                                width: 28 * px + 'px',
                                                height: 28 * px + 'px',
                                            }} onClick={() => {
                                                setCurrentColor(color || '')
                                            }}><span className='bg-center bg-no-repeat bg-contain' style={{
                                                width: 15 * px + 'px',
                                                height: 12 * px + 'px',
                                                backgroundImage: `url(${currentColor === color ? check_on: check_off})`
                                            }}></span></button>)}
                                        </div>
                                        <div className='flex gap-2'>
                                            {(backgroundColors || []).filter((color) => color.menuBackgroundColor !== defaultColor).filter((color, index) => index > 2 && index < 6).map((color, index) => <button key={index} className={`rounded-md flex justify-center items-center border ${currentColor === color.menuCardColor ? 'border-black' : 'border-lightgray'}`} style={{
                                                backgroundColor: color.menuCardColor,
                                                width: 28 * px + 'px',
                                                height: 28 * px + 'px',
                                            }} onClick={() => {
                                                setCurrentColor(color.menuCardColor)
                                            }}><span className='bg-center bg-no-repeat bg-contain' style={{
                                                width: 15 * px + 'px',
                                                height: 12 * px + 'px',
                                                backgroundImage: `url(${currentColor === color.menuCardColor ? check_on: check_off})`
                                            }}></span></button>)}
                                        </div>
                                    </div>}
                                </div>}
                            </div>
                            <Button buttonType="secondary" size="sm" onClick={() => {
                                localStorage.setItem('favorite',JSON.stringify(favoriteMenus))
                                if(backupLists.length > 0) {
                                    setMenus([])
                                    localStorage.setItem('menus',JSON.stringify(backupLists))
                                    setMenus(backupLists)
                                    setBackupLists([])
                                } 
                                setShowEditorButton(false)
                                setEditorMode(null)
                                setStep(orderData.customerInfo.gender && orderData.customerInfo.age ?'SELECT_MENU':'CUSTOMER')
                                localStorage.setItem('fontSize',fontSize)
                            }} style={{
                                marginLeft: 10 * px + 'px'
                            }}>저장</Button>
                            <Button buttonType="dimmend" size="sm" onClick={() => {
                                setBackupLists([])
                                setTimeout(() => {
                                    setMenus(JSON.parse(localStorage.getItem('menus') || '[]'))
                                    setFavoriteMenus(JSON.parse(localStorage.getItem('favorite') || '[]'))
                                },)
                                setShowEditorButton(false)
                                setEditorMode(null)
                                setFontSize(localStorage.getItem('fontSize') || 'normal')
                                setStep(orderData.customerInfo.gender && orderData.customerInfo.age ?'SELECT_MENU':'CUSTOMER')
                            }} style={{
                                marginLeft: 5 * px + 'px'
                            }}>취소</Button>
                        </div>
                    : <Button buttonType="secondary" size="sm" onClick={() => {
                        setStep('SELECT_MENU')
                        setBackupLists(menus)
                        setEditorMode(null)
                        setShowEditorButton('BUTTON_LIST')
                    }}>편집</Button>}
                </div>
                {step === 'SELECT_MENU' && <Menus fontSize={fontSize} currentColor={currentColor} defaultColor={defaultColor} setDefaultColor={setDefaultColor} setStep={setStep} setOptionInfo={setOptionInfo}
                    setFavoriteMenus={setFavoriteMenus} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory}
                    setBackupLists={setBackupLists} 
                    backupLists={backupLists} 
                    editorMode={editorMode} 
                    screenSize={screenSize} favoriteMenus={favoriteMenus} 
                />}
                {(step !== 'SELECT_MENU' || showEditorButton || showChangeQuantity)  && <div className={`absolute h-full left-0 w-full bg-black bg-opacity-50`} style={{
                    top: ((step === 'CUSTOMER') ? (41 * px):0) +'px',
                    background: showEditorButton ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)',
                    height: editorMode ? 41 * px + 'px' : '100%',
                }}></div>}
                {step === 'SELECT_OPTION' && optionInfo && <Options fontSize={fontSize} screenSize={screenSize} setStep={setStep} setOptionInfo={setOptionInfo} optionInfo={optionInfo} />}
                {step === 'CUSTOMER' && <Customer screenSize={screenSize} setStep={setStep} 
                    setCustomerInfo={(customerInfo) => {
                        setOrderData({
                            ...orderData,
                            customerInfo: customerInfo
                        })
                    }} customerInfo={orderData.customerInfo} 
                />}
                {step === 'DISCOUNT' && <Discount fontSize={fontSize} screenSize={screenSize} setStep={setStep} selectedsIndexs={selectedsIndexs} />}
                {step === 'DISPOSED' && <Disposed setSelectedsIndexs={setSelectedsIndexs} fontSize={fontSize} screenSize={screenSize} setStep={setStep} setOrderData={setOrderData} orderData={orderData} />}
                {step === 'PAYMENT' && <PopupContainer screenSize={screenSize} title="주문 확인" onCancel={() => setStep('SELECT_MENU')} onSubmit={saveOrder}>
                    <div className='font-medium text-center' style={{
                        fontSize: 19 * px + 'px',
                        paddingBottom: 23 * px + 'px'
                    }}>
                        총 {carts.reduce((prev, next) => prev + next.quantity,0).toLocaleString()}개 품목,{" "}
                        총 주문 금액 {carts.reduce((prev, next) => prev + ((next.storeProductPrice + (next.groupItemList || []).reduce((opPrev,opNext) => opPrev + (opNext.optionAddPrice * opNext.quantity), 0)) * next.quantity) - (next.discountPrice || 0),0).toLocaleString()}원<br />
                        실 주문(입금) 후 확인 버튼을 눌러주세요
                    </div>
                    <Checkbox checked={orderData.paymentType === 'BANK'} label="계좌 입금" onChange={() => setOrderData({
                        ...orderData,
                        paymentType: orderData.paymentType === 'POS' ? 'BANK': 'POS'
                    })} />
                    {orderData.paymentType === 'BANK' && <div className='bg-white text-darkgray' style={{
                        marginTop: 8 * px + 'px',
                        padding: `${12 * px}px ${60 *px}px`,
                        fontSize: (fontSize === 'large' ? 14: 12.5) * px + 'px',
                    }}>
                        <h5 className='font-bold'>입금 계좌 정보</h5>
                        <div>* 은행명 : KB 국민은행</div>
                        <div>* 계좌번호 : 857201-00-060081</div>
                        <div>* 예금주 : 주식회사 올투딜리셔스</div>
                    </div>}
                </PopupContainer>}
            </div>
            <div className={`grid bg-white relative border-l border-bordergray`} style={{
                gridTemplateRows: `${41 * px}px auto ${61 * px}px ${60 * px}px`
            }}>
                {showChangeQuantity && selectKeyPadIndex !== null && <ChangeQtyKeypad selectKeyPadIndex={selectKeyPadIndex} setShowChangeQuantity={setShowChangeQuantity} />}
                <div className='flex justify-between border-b border-lightgray' style={{
                    paddingLeft: 12 * px + 'px',
                }}>
                    <Checkbox checked={carts.length > 0 && selectedsIndexs.length === carts.length} label="전체선택" onChange={() => setSelectedsIndexs(
                        (carts.length > 0 && selectedsIndexs.length === carts.length) ? [] 
                        : (carts || []).map((cart, i) => i)
                    )} />
                    <button className='flex items-center text-darkgray' style={{
                        height: 41 * px + 'px',
                        paddingLeft: 12 * px + 'px',
                        paddingRight: 12 * px + 'px',
                        gap: 6 * px + 'px',
                        fontSize: 14 * px + 'px',
                    }} onClick={() => {
                        setCarts(carts.filter((cart,index) => !selectedsIndexs.some(idx => idx === index)))
                        setSelectKeyPadIndex(null)
                        setSelectedsIndexs([])
                    }}>
                        <span className={`bg-no-repeat bg-center bg-contain `} style={{
                            width: 16 * px + 'px',
                            height: 17.5 * px + 'px',
                            backgroundImage: `url(${delete_icon})`
                        }}></span>
                        삭제
                    </button>
                </div>
                <Pagable scrollAlign='vertical' className=' bg-white' width={screenSize.width - ((screenSize.width * 66.6666))} height={screenSize.height - ((41 + 61 + 60) * px)}>
                    {carts.map((cart, index) => <div key={index} style={{
                        padding: `${10 * px}px ${12 * px}px ${12 * px}px ${12 * px}px`,
                    }} className={`
                        border-b border-lightgray relative
                        ${selectedsIndexs.some(idx => idx === index) ? 'bg-[#d7d7d9]':''}
                    `}><div className='absolute top-0 left-0 w-full h-full' onClick={(e) => {
                        e.stopPropagation()
                        setSelectedsIndexs(
                        selectedsIndexs.some(idx => idx === index) ? selectedsIndexs.filter(idx => idx !== index)
                        : [...selectedsIndexs, index])
                    }} />
                        {selectedsIndexs.some(idx => idx === index) && <div style={{
                            height: 40 * px + 'px',
                            marginBottom: 5 * px + 'px'
                        }} className={`relative flex border border-lightgray rounded-lg bg-white ${showChangeQuantity && index === selectKeyPadIndex ? 'z-[2]':''}`}>
                            <button className='flex items-center justify-center w-full' onClick={(e) => {
                                e.stopPropagation()
                                if(cart.crnId) return alert("할인 적용된 상품은 수량 변경이 불가합니다")
                                setCarts(carts.map((cart, i) =>
                                    i === index ? ({
                                        ...cart,
                                        quantity: cart.quantity - 1,
                                        discountPrice: ((cart.discountPrice || 0) / cart.quantity) * (cart.quantity - 1),
                                    }) : cart
                                ).filter(cart => cart.quantity > 0))  
                            }}><span className='bg-black' style={{
                                width: 13 * px + 'px',
                                height: px + 'px',
                            }}></span></button>
                            <button className={`flex items-center justify-center w-full border-x border-lightgray bg-[#f7f7f9]`} onClick={(e) => {
                                e.stopPropagation()
                                if(cart.crnId) return alert("할인 적용된 상품은 수량 변경이 불가합니다")
                                setSelectKeyPadIndex(index)
                                setShowChangeQuantity(true)
                            }} style={{
                                fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                            }}>{cart.quantity}</button>
                            <button className='flex items-center justify-center w-full' onClick={(e) => {
                                e.stopPropagation()
                                if(cart.crnId) return alert("할인 적용된 상품은 수량 변경이 불가합니다")
                                setCarts(carts.map((cart, i) =>
                                    i === index ? ({
                                        ...cart,
                                        quantity: cart.quantity + 1,
                                        discountPrice: ((cart.discountPrice || 0) / cart.quantity) * (cart.quantity + 1),
                                    }) : cart
                                ))  
                            }}><span className='bg-black relative' style={{
                                width: 13 * px + 'px',
                                height: px + 'px',
                            }}><span className='bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90' style={{
                                width: 13 * px + 'px',
                                height: px + 'px',
                            }}></span></span></button>
                        </div>}
                        <div className={`grid w-full`} style={{
                            gridTemplateColumns: `auto ${40*px}px ${80*px}px`,
                            paddingTop: 2 * px + 'px',
                            fontSize: (fontSize === 'large' ? 14: 12.5) * px + 'px',
                        }}>
                            <div className='font-medium'>{cart.storeProductName}</div>
                            <div className='font-medium text-darkgray text-center'>{cart.quantity.toLocaleString()}</div>
                            <div className='text-deepdark text-right'>{((cart.storeProductPrice + (cart.groupItemList || []).reduce((prev, next) => prev + ((next.optionAddPrice * next.quantity) || 0),0)) * cart.quantity).toLocaleString()}원</div>
                        </div>
                        {(cart.discountPrice || 0) > 0 && cart.crnId && <div className={`
                            grid text-[#f10000]
                        `} style={{
                            paddingBottom: 2 * px + 'px',
                            fontSize: (fontSize === 'large' ? 12.5: 11) * px + 'px',
                            gridTemplateColumns: `auto 25%`
                        }}>
                            <div className='flex items-start break-all'><span className='whitespace-normal'>ㄴ{" "}</span>{discountType.find(type => String(type.crnId) === String(cart.crnId))?.crnName}</div>
                                <div className='text-right'>-{(cart.discountPrice || 0).toLocaleString()}원</div>
                        </div>}
                        {selectedsIndexs.some(idx => idx === index) && cart.groupItemList && (cart.groupItemList || []).length > 0 && <div style={{
                            marginTop: 6 * px + 'px',
                            padding: `${3 * px}px ${10 * px}px`,
                        }} className='w-full text-darkgray bg-white'>
                        
                        {(cart.groupItemList || []).map((groupItem, index) => <div key={index} className={`
                            grid 
                        `} style={{
                            fontSize: (fontSize === 'large' ? 12.5: 11) * px + 'px',
                            gridTemplateColumns: `auto ${40*px}px ${70*px}px`,
                            paddingTop: 2.5 * px + 'px',
                            paddingBottom: 2.5 * px + 'px',
                            lineHeight: 1.2,
                        }}>
                            <div className='flex justify-start items-start text-deepdark'><span className='whitespace-nowrap'>ㄴ{" "}</span>{groupItem.optionName}</div>
                            <div className='flex justify-center items-center'>{((groupItem?.quantity * cart.quantity) || 0).toLocaleString()}</div>
                            <div className='flex justify-end items-center'>{(groupItem.optionAddPrice * groupItem.quantity * cart.quantity || 0).toLocaleString()}원</div>
                        </div>)}</div>}
                    </div>)}
                </Pagable>
                <div className='flex items-center border-t border-lightgray' style={{
                    height: 61 * px + 'px',
                }}>
                    <div className={`grid grid-cols-2 text-deepdark w-full`} style={{
                        paddingLeft: 12 * px + 'px',
                        paddingRight: 12 * px + 'px',
                        fontSize: (fontSize === 'large' ? 14: 12.5) * px + 'px',
                    }}>
                        <div>총 주문 금액</div>
                        <div className='text-right'>{carts.reduce((prev, next) => prev + (next.storeProductPrice + (next.groupItemList || []).reduce((opPrev,opNext) => opPrev + (opNext.optionAddPrice * opNext.quantity), 0)) * next.quantity,0).toLocaleString()}원</div>
                        <div className='text-[#ff0000]'>총 할인 금액</div>
                        <div className='text-right text-[#ff0000]'>
                            {(carts.reduce((prev, next) => prev + Number(next.discountPrice || 0),0)).toLocaleString()}
                            원</div>
                    </div>
                </div>
                <div className='flex' style={{
                    height: 60 * px + 'px',
                }}>
                    <button style={{
                        width: 65 * px + 'px',
                        fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                    }} className={`bg-[#acacb2] font-bold text-[white]`} onClick={() => setStep('DISPOSED')} disabled={carts.length === 0}>폐기</button>
                    <button style={{
                        width: 65 * px + 'px',
                        fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                        borderTopWidth: 1 * px + 'px',
                    }} className={`bg-white font-bold border-t-[#acacb2] text-black`} onClick={() => setStep('DISCOUNT')} disabled={selectedsIndexs.length === 0 || carts.length === 0}>할인</button>
                    <button className={`flex justify-between font-bold items-center bg-black text-white`} style={{
                        width: `calc(100% - ${130 * px}px)`,
                        paddingLeft: 12.5 * px + 'px',
                        paddingRight: 12.5 * px + 'px',
                        fontSize: (carts.reduce((prev, next) => prev + ((next.storeProductPrice + (next.groupItemList || []).reduce((opPrev,opNext) => opPrev + (opNext.optionAddPrice * opNext.quantity), 0)) * next.quantity) - (next.discountPrice || 0),0) > 1000000 ? 17: 17.5) * px + 'px',
                    }} onClick={() => setStep('PAYMENT')} disabled={carts.length === 0}>
                        <span style={{
                            fontSize: (carts.reduce((prev, next) => prev + next.quantity,0) > 999 ? 11 :12.5) * px + 'px',
                            width: 27.5 * px + 'px',
                            height: 27.5 * px + 'px',
                        }} className={`bg-white text-black flex justify-center items-center rounded-full`}>{carts.reduce((prev, next) => prev + next.quantity,0).toLocaleString()}</span>
                        {carts.reduce((prev, next) => prev + ((next.storeProductPrice + (next.groupItemList || []).reduce((opPrev,opNext) => opPrev + (opNext.optionAddPrice * opNext.quantity), 0)) * next.quantity) - (next.discountPrice || 0),0).toLocaleString()}원{" "}
                        결제
                    </button>
                </div>
                {(step !== 'SELECT_MENU' || showEditorButton || showChangeQuantity) && <div className='absolute flex justify-center items-center top-0 h-full -left-px w-full bg-black bg-opacity-50 z-[1] box-content pr-px'>
                    {showEditorButton && <div className='text-white' style={{
                        fontSize: 20 * px + 'px',
                    }}>편집모드입니다</div>}
                </div>}
            </div>
        </div>
    )
    return <div className='w-full h-screen flex justify-center items-center'>
    </div>
}
function ChangeQtyKeypad({selectKeyPadIndex, setShowChangeQuantity
}:{selectKeyPadIndex: number, setShowChangeQuantity:(val:boolean) => void}) {
    const px = useRecoilValue(screenPx);
    const [carts, setCarts] = useRecoilState(CartLists)
    const [startChangeQty, setStartChangeQty] = useState(false)
    const [discount, setDiscount] = useState(0)
    return (
        <div style={{
            top: 50 * px + 'px',
            width: 265 * px + 'px',

        }} className='absolute right-full shadow-lg border border-lightgray z-[2]'><NumberKeypad value={
            startChangeQty ?
                (carts.find((cart, index) => index === selectKeyPadIndex)?.quantity || 0)
            : 0
            } onClick={(value) => {
                if(!startChangeQty && discount === 0) setDiscount((carts.find((cart, index) => index === selectKeyPadIndex)?.discountPrice || 0) / (carts.find((cart, index) => index === selectKeyPadIndex)?.quantity || 0))
                setCarts(carts.map((cart, index) => index === selectKeyPadIndex ?
                    {
                        ...cart,
                        quantity: value,
                        discountPrice: (startChangeQty ? discount : (cart.discountPrice || 0) / cart.quantity) * value,
                    }:cart
                ))
                setStartChangeQty(true)
            }}/>
            <button onClick={() => {
                setCarts(carts.filter(cart => cart.quantity > 0))
                setShowChangeQuantity(false)
                setStartChangeQty(false)
            }} className='bg-white w-full font-bold' style={{
                fontSize: 17 * px + 'px',
                height: 58 * px + 'px'
            }}>확인</button>
        </div>
    )
}
export const salesLayout = {
    rows: [0.5, 9.5],
    cols: [7, 3],
    menus: [1.5,6,2.5],
    orders: [1,6,2],
    options: [1.5,6.8,1.7],
}

export type CustomerInfoType = {
    gender: string,
    age: string
}

export const backgroundColors = [
    {
        cateogryCardColor: '#f5ce32',
        menuCardColor: '#fcf0c1',
        menuBackgroundColor: '#fef9e6',
    },{
        cateogryCardColor: '#e25c2d',
        menuCardColor: '#f6cec0',
        menuBackgroundColor: '#fbebe6',
    },{
        cateogryCardColor: '#b20000',
        menuCardColor: '#e8b2b2',
        menuBackgroundColor: '#f6e0e0',
    },{
        cateogryCardColor: '#d54891',
        menuCardColor: '#f2c8de',
        menuBackgroundColor: '#fae9f2',
    },{
        cateogryCardColor: '#70529f',
        menuCardColor: '#d4cbe2',
        menuBackgroundColor: '#eeeaf3',
    },{
        cateogryCardColor: '#1f3260',
        menuCardColor: '#bbc1cf',
        menuBackgroundColor: '#e4e6ec',
    },{
        cateogryCardColor: '#00429a',
        menuCardColor: '#b2c6e1',
        menuBackgroundColor: '#e0e8f3',
    },{
        cateogryCardColor: '#2084c7',
        menuCardColor: '#bcdaee',
        menuBackgroundColor: '#e4f0f8',
    },{
        cateogryCardColor: '#006934',
        menuCardColor: '#b2d2c2',
        menuBackgroundColor: '#e0ede7',
    },{
        cateogryCardColor: '#8bbc3c',
        menuCardColor: '#dcebc4',
        menuBackgroundColor: '#f1f7e7',
    },
]

const intitalOrderData:orderDataType= {
    orderList: [],
    orderTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    status: 'COMPLETE',
    statusDesc: '',
    paymentType: 'POS',
    customerInfo: {
        gender: '',
        age: ''
    },
}