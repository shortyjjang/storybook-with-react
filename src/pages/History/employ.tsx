import { ValueEmploy } from "../../atom/type"
import Keyboard from "../../components/Keyboard"
import { TextCursor } from "../../components/TextCursor"
import Timepicker from "../../components/TimePicker"

export default function EmpolyWorkingTime({
    employ,
    px,
    onChange,
    focusInput,
    setFocusInput,
    orderNum,
    showIndex,
    setShowIndex,
    setOffsetY
}:{
    employ: ValueEmploy
    px: number,
    onChange: (employ: ValueEmploy) => void
    focusInput: string
    setFocusInput: (focus: string) => void
    orderNum: number,
    showIndex: number | null,
    setShowIndex: (index: number | null) => void
    setOffsetY: (offset: number) => void
}) {
    return(<>
        {(Object.keys(employ) || []).map((key, index) => <span key={index} className={`flex justify-center items-center bg-white ${(key === 'employeeName' || key === 'employeeType') && key === focusInput && showIndex === orderNum ? 'relative':''}`} onClick={(e) => {
            e.stopPropagation()
            setFocusInput(key)
            setShowIndex(showIndex === orderNum ? null:orderNum)
            setOffsetY(e.pageY)
        }}>
            {key === 'endTime' && <span className="border-r border-lightgray flex justify-center items-center" style={{
                width: 50 * px + 'px',
                height: 30 * px + 'px'
            }}>~</span>}
            <span className="flex justify-center items-center " style={{
                height: 30 * px + 'px',
            }}>
                {(key === 'employeeName' || key === 'employeeType') && employ[key]}
                {(key === 'employeeName' || key === 'employeeType') && key === focusInput && showIndex === orderNum && <TextCursor height={12} style={{marginTop:0}} />}
            </span>
            {(key === 'startTime' || key === 'endTime' || key === 'breakTime') && <div className={`flex justify-center items-center text-center  ${focusInput === key ? 'relative':''}`} style={{
                width: 72 * px + 'px',
                height: 30 * px + 'px',
            }}>
                {employ[key][0] < 10 ? `0${employ[key][0]}`: employ[key][0]} : {employ[key][1]}0
                {showIndex === orderNum && <Timepicker onHide={() => {
                    setTimeout(() => {
                        setFocusInput('')
                        setShowIndex(null)
                    },500)
                }} currentHour={employ[key][0]} currentMinute={employ[key][1]} onChangeMinutes={(value) => {
                    onChange((focusInput === 'startTime' && employ.endTime[0] === employ.startTime[0]) ? {
                        ...employ,
                        [key]: [employ[key][0], value, employ[key][2]],
                        endTime: [employ[key][0], value, employ[key][2]]
                    }:{
                        ...employ,
                        [key]: [employ[key][0], value, employ[key][2]]
                    })
                }} onChangeHour={(value) => {
                    if(focusInput === 'endTime' && employ.startTime[0] > value) {
                        return alert('시작시간보다 작을 수 없습니다.')
                    }
                    if(focusInput === 'breakTime' && (employ.endTime[0] - employ.startTime[0]) + (employ.endTime[1] - employ.startTime[1])/6 < value) {
                        return alert('휴게시간은 근무시간보다 클 수 없습니다.')
                    }
                    onChange((focusInput === 'startTime' && employ.endTime[0] === 0 && employ.endTime[1] === 0) ? {
                        ...employ,
                        [key]: [value, employ[key][1], employ[key][2]],
                        endTime: [value, employ[key][1], employ[key][2]]
                    }:{
                        ...employ,
                        [key]: [value, employ[key][1], employ[key][2]]
                    })
                }} className={focusInput === key ? 'flex':'hidden'} />}
            </div>}
            {(key === 'employeeName' || key === 'employeeType') && showIndex === orderNum && <div className={focusInput === key ? 'block':'hidden'}><Keyboard defaultValue={showIndex === orderNum ? employ[key]:''} setValue={(value) => {
                onChange({
                    ...employ,
                    [key]: value
                })
            }} /></div>}
        </span>)}
    </>)
}