import dayjs from "dayjs"
import { A2dApi } from "../../lib/api"
import {ButtonArea} from "../../components/ButtonArea"
import Title from "../../components/Title"
import { useRecoilState, useRecoilValue } from "recoil"
import { cancelReasons } from "../../atom/cancelReason"
import { useEffect, useState } from "react"
import { screenPx } from "../../atom/px"
import { userInfo } from "../../atom/user"
import {Memo} from "../../components/Memo"

let cancelRequest = false

export default function OrderCancel({
    screenSize,
    setShowCancelType,
    onSuccess,
    orderId
}:{
    screenSize: {
        width: number,
        height: number
    },
    setShowCancelType: (value: boolean) => void
    onSuccess: () => void
    orderId: string
}) {
    const [cancelType, setCancelType] = useRecoilState(cancelReasons)
    const [showDescription, setShowDescription] = useState<boolean>(false)
    const [crnId, setCrnId] = useState<number>(0)
    const [required, setRequired] = useState<boolean>(false)
    const [description, setDescription] = useState<string>('')
    const px = useRecoilValue(screenPx)
    const user = useRecoilValue(userInfo)
    const [fontSize, setFontSize] = useState<string>('normal')
    useEffect(() => {
        setFontSize(localStorage.getItem('fontSize') || 'normal')
        if(cancelType.length === 0 && localStorage.getItem('cancelReasons')) setCancelType(JSON.parse(localStorage.getItem('cancelReasons') || '[]'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[cancelType.length])
    return (<>
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[1]'></div>
        {showDescription ? 
            <Memo value={description} style={{
                top: 0,
                height: screenSize.height + 'px',
            }} onSubmit={(value) => {
                setDescription(value)
                setShowDescription(false)
            }} onCancel={() => {
                setShowDescription(false)
            }} />
        : <div className='relative flex flex-col justify-center items-center bg-bggray z-[1]' style={{
            height: screenSize.height - (41 * px) + 'px'
        }}>
            <Title>주문 취소 사유</Title>
            <div className='grid' style={{
                gridTemplateColumns: 'repeat(2, 1fr)',
                width: 425 * px + 'px',
                gap: 5 * px + 'px'
            }}>
                {cancelType.map((disposal, index) => <button key={index} style={{
                    height: 75 * px + 'px',
                    fontSize: (fontSize === 'large' ? 16: 14) * px + 'px',
                }} className={`
                    border rounded-lg ${crnId === disposal.crnId ? 'bg-white text-black font-bold border-black' :'text-darkgray border-lightgray'} `} onClick={() => {
                        //선택시 사유코드
                        setCrnId(disposal.crnId)
                        //특이사항 입력여부
                        if(disposal.crnNoteDisplayYn === 'Y') setShowDescription(true)
                        //특이사항 필수여부
                        setRequired(disposal.crnNoteReqiredYn === 'Y')
                }}>
                <span>
                    {disposal.crnName}
                    {disposal.crnNoteDisplayYn === 'Y' && (
                        description ? <span className='font-normal'>: 입력완료</span>
                        : <span className='font-normal'>: 사유입력</span>
                    )}
                </span>
                </button>)}
            </div>
            <ButtonArea  onCancel={() => {
                setShowCancelType(false)
            }} onSubmit={async () => {
                if(cancelRequest) return
                cancelRequest = true
                //주문취소 사유 선택여부
                if(!crnId || crnId === 0) return alert('주문 취소 사유를 선택해주세요.')
                //특이사항 필수입력여부
                if(required && !description) return alert('특이사항 입력은 필수입니다.')

                //주문취소
                const request = await A2dApi.post('/api/v1/store/order/cancel', {
                    "loginId": user.loginId,
                    "cancelTime": dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    "originOrderId": orderId,
                    "crnId": crnId,
                    "etcCancelReason":description,
                })
                if(!request || request.resultMsg) return alert(request.resultMsg || '주문 취소에 실패하였습니다.')
                onSuccess()
                cancelRequest = false
                setShowCancelType(false)
            }} />
        </div>}
    </>)
}
