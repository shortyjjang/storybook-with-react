import { useEffect, useRef, useState } from 'react'

export default function Timepicker({
    className = '',
    currentHour,
    currentMinute,
    onChangeHour,
    onChangeMinutes,
    onHide
}:{
    className?: string,
    currentHour: number,
    currentMinute: number,
    onChangeHour: (value: number) => void,
    onChangeMinutes: (value: number) => void
    onHide: () => void
}) {
    const hourRef = useRef<HTMLDivElement>(null)
    const minuteRef = useRef<HTMLDivElement>(null)
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
        if(hourRef.current) hourRef.current.scrollTop = (hours.findIndex(h => h === currentHour) * 30)  * px
        if(minuteRef.current) minuteRef.current.scrollTop = (minutes.findIndex(h => h === currentMinute) * 30)  * px

    },[currentHour, currentMinute, px])
    return (<div className={`flex bg-bggray border border-black items-center shadow-md ${className}`}>
        <div ref={hourRef} className="overflow-auto w-full" style={{
            height: 150 * px + 'px',
            paddingTop: 60 * px + 'px',
            paddingBottom: 60 * px + 'px'
        }}>
            {(hours || []).map((item, index) => <button className={`
                w-full ${currentHour === item ? ' bg-white text-black font-medium':'text-darkgray'}
            `} key={index} onClick={(e) => {
                e.stopPropagation()
                onChangeHour(item)
            }} style={{
                height: 30 * px + 'px',
                fontSize: 11 * px + 'px'
            }}>{item < 10 ? `0${item}`:item}</button>)}
        </div>
        <div ref={minuteRef} className="overflow-auto w-full border-l border-lightgray" style={{
            height: 150 * px + 'px',
            paddingTop: 60 * px + 'px',
            paddingBottom: 60 * px + 'px'
        }}>
            {(minutes || []).map((item, index) => <button className={`
                w-full ${currentMinute === item ? ' bg-white text-medium font-bold':'bg-bggray text-darkgray'}
            `} key={index} onClick={(e) => {
                e.stopPropagation()
                onChangeMinutes(item)
                onHide()
            }} style={{
                height: 30 * px + 'px',
                fontSize: 11 * px + 'px'
            }}>{item}0</button>)}
        </div>
    </div>
  )
}

export let hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
export let minutes = [0,1,2,3,4,5]