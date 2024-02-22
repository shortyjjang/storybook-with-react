
import ReactDatePicker from 'react-datepicker'

import { ko } from 'date-fns/locale'
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function Calendar({date, setDate,
    width = 300}:{
    date: Date,
    setDate: (date: Date) => void,
    width?: number
}) {
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
    }, [])
    return (
        <div className='grid bg-white' style={{
            fontSize:11 * px + 'px',
            padding: `${15 * px}px`,
            width: width * px + 'px'
        }}>
            <ReactDatePicker selected={date} locale={ko}
            renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => (
                <div className='flex justify-center items-center' style={{
                    paddingBottom: 5 * px + 'px',
                }}>
                    <button onClick={(e) => {
                        e.stopPropagation()
                        decreaseMonth()
                    }} disabled={prevMonthButtonDisabled} style={{
                        padding: 5 * px + 'px',
                    }}>
                        <span className='block rotate-[225deg]' style={{
                            width: 10 * px + 'px',
                            height: 10 * px + 'px',
                            borderWidth: `${2 * px}px ${2 * px}px 0 0`,
                        }}></span>
                    </button>
                    <h1 className='font-bold' style={{
                        fontSize: 15 * px + 'px'
                    }}>{dayjs(date).format('YYYY MM')}</h1>
                    <button onClick={(e) => {
                        e.stopPropagation()
                        increaseMonth()
                    }}  disabled={nextMonthButtonDisabled} style={{
                        padding: 5 * px + 'px',
                    }}>
                        <span className='block rotate-45' style={{
                            width: 10 * px + 'px',
                            height: 10 * px + 'px',
                            borderWidth: `${2 * px}px ${2 * px}px 0 0`,
                        }}></span>
                    </button>
                </div>
            )} onChange={(date) => date && setDate(date)} inline />
        </div>
    )
}
