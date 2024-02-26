import { useRecoilState, useRecoilValue } from "recoil"
import { OrderStepType, orderDataType } from "../../atom/type"
import { disposalReasons } from "../../atom/disposalReason"
import { useEffect, useState } from "react"
import { userInfo } from "../../atom/user"
import { screenPx } from "../../atom/px"
import { CartLists } from "../../atom/cart"
import { Memo } from "../../components/Memo"
import PopupContainer from "../../components/PopupContainer"
import { indexedDb } from "../../lib/db"
import dayjs from "dayjs"
import { A2dApi } from "../../lib/api"


let requesetDisposing = false

export default function Disposed({
    screenSize,
    setStep,
    setOrderData,
    orderData,
    fontSize,
    setSelectedsIndexs
}:{
    screenSize: {
        width: number,
        height: number
    },
    setStep: (value: OrderStepType) => void
    setOrderData: (value: orderDataType) => void
    orderData: orderDataType
    fontSize: string,
    setSelectedsIndexs: (value: number[]) => void
}) {
    const [disposed, setDisposed] = useRecoilState(disposalReasons)
    const [showDescription, setShowDescription] = useState<boolean>(false)
    const [crnId, setCrnId] = useState<number>(0)
    const [required, setRequired] = useState<boolean>(false)
    const [description, setDescription] = useState<string>('')
    const [carts, setCarts] = useRecoilState(CartLists)
    const px = useRecoilValue(screenPx)
    const user = useRecoilValue(userInfo)
    useEffect(() => {
        if(disposed.length === 0 && localStorage.getItem('disposalReasons')) setDisposed(JSON.parse(localStorage.getItem('disposalReasons') || '[]'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[disposed.length])
    if(showDescription) return (
        <Memo value={description} style={{
            top: 0,
            height: screenSize.height + 'px',
        }} onSubmit={(value) => {
            setDescription(value)
            setShowDescription(false)
        }} onCancel={() => {
            setShowDescription(false)
        }} />
    )
    return (
        <PopupContainer screenSize={screenSize} title="폐기 선택" onCancel={() => {
            setOrderData({
                ...orderData,
                status: 'COMPLETE',
                statusDesc: ''
            })
            setStep('SELECT_MENU')
        }} onSubmit={async () => {
            if(requesetDisposing) return
            requesetDisposing = true
            if(!crnId || crnId === 0) return alert('폐기 사유를 선택해주세요.')
            if(required && !description) return alert('특이사항 입력은 필수입니다.')
            
            //기존 결제 내역을 조회한다(오늘일자)
            await indexedDb.createObjectStore(['ORDER_LIST']);
            const historyList = await indexedDb.getValue(
                'ORDER_LIST',
                dayjs().format('YYYYMMDD_HH')
            ) || [];
            //폐기 주문을 요청한다.
            let body = {
                "loginId": user.loginId,
                "orderTime": dayjs().format('YYYY-MM-DD HH:mm:ss'),
                "productList": carts.map((cart) => ({
                    storeProductId: cart.storeProductId,
                    storeProductName: cart.storeProductName,
                    quantity: cart.quantity,
                    groupItemList: (cart.groupItemList || []).map((groupItem) => ({
                        optionId: groupItem.optionId,
                        quantity: groupItem.quantity,
                        optionName: groupItem.optionName
                    }))
                })),
                "crnId": crnId,
                "etcDisposeReason": description
            }
            const request = await A2dApi.post('/api/v1/store/order/dispose', body)

            //폐기내역을 로컬스토리지에 저장한다.
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
            setOrderData({
                orderList: [],
                orderTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                status: 'COMPLETE',
                statusDesc: '',
                paymentType: 'POS',
                customerInfo: {
                    gender: '',
                    age: ''
                },
            })
            setStep('CUSTOMER')
            requesetDisposing = false
        }}>
            <div className='grid' style={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                width: 425 * px + 'px',
                gap: 5 * px + 'px'
            }}>
                {disposed.map((disposal, index) => <button key={index} style={{
                    height: 75 * px + 'px',
                    fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                }} className={`
                    border rounded-lg ${crnId === disposal.crnId ? 'bg-white text-black font-bold border-black' :'text-darkgray border-lightgray'} `} onClick={() => {
                        setCrnId(disposal.crnId)
                        if(disposal.crnNoteDisplayYn === 'Y') setShowDescription(true)
                        setRequired(disposal.crnNoteReqiredYn === 'Y')
                }}>
                <span>
                    {disposal.crnName}
                    {disposal.crnNoteDisplayYn === 'Y' && (description ? <span className='font-normal'>: 입력완료</span>: <span className='font-normal'>: 사유입력</span>)}
                </span>
                </button>)}
            </div>
        </PopupContainer>
    )
}
