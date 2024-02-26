import { useEffect, useState } from "react";
import { DISPLAY_MODE } from "../../atom/type";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { screenPx } from "../../atom/px";
import { userInfo } from "../../atom/user";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import home from "../../images/icon_home.png";

dayjs.locale("ko");

export function Header({
    displayType,
    disabled = false,
    onSales,
    onHistory,
    setDisplayType,
    onHome
}:{
    displayType: DISPLAY_MODE,
    setDisplayType: (displayType: DISPLAY_MODE) => void
    disabled?: boolean
    onSales?: () => void
    onHistory?: () => void
    onHome: () => void
}) {
    const [currentTime, setCurrentTime] = useState<Date>(new Date())
    const px = useRecoilValue(screenPx)
    const setUser = useSetRecoilState(userInfo)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
            //새벽두시에 자동으로 로그아웃
            if(dayjs().format('HH') === '02' || !Cookies.get('accessToken')) {
                Cookies.remove('accessToken')
                setUser({
                    loginId: '',
                    name: '',
                    token: '',
                    brandName: '',
                    departmentStore: {
                        branchName: '',
                        brandName: '',
                        departmentStoreName: ''
                    }
                })
                setDisplayType('')
            }
        },1000)
        return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
    <div className='flex items-center'>
        <button className='flex items-center justify-center' style={{
            width: 50 * px + 'px',
            height: 41 * px + 'px'
        }} onClick={onHome}>
            <span className='bg-no-repeat bg-contain bg-center' style={{
                backgroundImage: `url(${home})`,
                width: 24 * px + 'px',
                height: 23 * px + 'px'
            }}></span>
        </button>
        <div style={{
            width: 120 * px + 'px',
            height: 27 * px + 'px',
            fontSize: 11.5 * px + 'px'
        }} className='flex items-center justify-center text-white border-l border-darkgray'>
            {dayjs(currentTime).format('MM/DD(dd) A h:mm')}
        </div>
        {!onSales && !onHistory && <div className='w-px bg-darkgray' style={{
            height: 41 * px + 'px',
        }}></div>}
        {onSales && <button style={{
            height: 41 * px + 'px',
            fontSize: 12.5 * px + 'px',
            width: 90 * px + 'px'
        }} className={`flex items-center justify-center border-l ${displayType === 'MODE_SALES' ? 'font-bold bg-white text-black border-black' :'text-darkgray border-darkgray'}`} disabled={disabled} onClick={() => onSales()
        }>상품판매</button>}
        {onHistory && <button style={{
            height: 41 * px + 'px',
            fontSize: 12.5 * px + 'px',
            width: 90 * px + 'px'
        }} className={`flex items-center justify-center border-l ${displayType === 'MODE_HISTORY' ? 'font-bold bg-white text-black border-black' :'text-darkgray border-darkgray'}`} disabled={disabled} onClick={() => onHistory()
        }>판매내역</button>}
    </div>
  )
}
