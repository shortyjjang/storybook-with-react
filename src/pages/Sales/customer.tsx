import { useRecoilValue } from "recoil"
import { CustomerInfoType } from "."
import { OrderStepType } from "../../atom/type"
import { screenPx } from "../../atom/px"
import Title from "../../components/Title"


export default function Customer({
    customerInfo,
    setCustomerInfo,
    setStep,
    screenSize
}:{
    customerInfo: CustomerInfoType,
    setCustomerInfo: (value: CustomerInfoType) => void,
    setStep: (value: OrderStepType) => void
    screenSize: {
        width: number,
        height: number
    }
}) {
    const px = useRecoilValue(screenPx)
  return (
    <div className='relative flex flex-col items-center justify-center bg-bggray' style={{
        height: screenSize.height - (41 * px) + 'px'
    }}>
        <Title>고객 정보 수집</Title>
        <div className='grid grid-cols-2 max-w-full' style={{
            gridAutoColumns: '1fr',
            gridAutoRows: '1fr',
            gap: 5 * px + 'px',
            width: 425 * px + 'px',
            marginTop: 15 * px + 'px'
        }}>
            {['남','여'].map((item) => <button key={item} onClick={() => {
                setCustomerInfo({
                    ...customerInfo,
                    gender: item
                })
                if(customerInfo.age !== '') setTimeout(() => setStep('SELECT_MENU'),200)
            }} style={{
                fontSize: 20 * px + 'px',
                height: 75 * px + 'px',
            }} className={`border rounded-lg ${customerInfo.gender === item ? 'border-black text-black bg-white font-bold':'border-lightgray text-darkgray' }`}>
                {item}
            </button>)}
        </div>
        <div className='grid grid-cols-2 max-w-full]' style={{
            gridAutoColumns: '1fr',
            gridAutoRows: '1fr',
            gap: 5 * px + 'px',
            width: 425 * px + 'px',
            marginTop: 25 * px + 'px'
        }}>
            {['~10대','20대','30대','40대','50대','60대~'].map((item) => <button key={item} onClick={() => {
                setCustomerInfo({
                    ...customerInfo,
                    age: item
                })
                if(customerInfo.gender !== '') setTimeout(() => setStep('SELECT_MENU'),200)
            }} style={{
                fontSize: 20 * px + 'px',
                height: 75 * px + 'px',
            }} className={`border rounded-lg ${customerInfo.age === item ? 'border-black text-black bg-white font-bold':'border-lightgray text-darkgray' }`}>
                {item}
            </button>)}
        </div>
    </div>
  )
}
