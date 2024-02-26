import { useRecoilValue } from "recoil"
import { DISPLAY_MODE, DailyInfoType, Employ, ValueEmploy } from "../../atom/type"
import { userInfo } from "../../atom/user"
import { useEffect, useRef, useState } from "react"
import { screenPx } from "../../atom/px"
import { A2dApi } from "../../lib/api"
import dayjs from "dayjs"
import Loading from "../Loading"
import { Button } from "../../components/Button"
import Keyboard from "../../components/Keyboard"
import Title from "../../components/Title"
import { TextCursor } from "../../components/TextCursor"
import {Header} from "../../components/Header"
import EmpolyWorkingTime from "./employ"




export default function Finish({
    setDisplayType,
    displayType,
    lastPage
}:{
    setDisplayType: (displayType: DISPLAY_MODE) => void
    displayType: DISPLAY_MODE
    lastPage: DISPLAY_MODE
}) {
    const user = useRecoilValue(userInfo)
    const scrollArea = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const px = useRecoilValue(screenPx)
    const [dailyInfo, setDailyInfo] = useState<DailyInfoType>()
    const [employeeList, setemployeeList] = useState<ValueEmploy[]>([])
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0
    });
    const [defaultValues, setDefaultValues] = useState<string>('')
    const [focusInput, setFocusInput] = useState('')
    const [description, setDescription] = useState('')
    const [showIndex, setShowIndex] = useState<number | null>(null)

    //마감 리포트 저장
    const saveReport = async () => {
        //직원이 없을 경우
        if(dailyInfo?.daySales?.totalAmount === null || dailyInfo?.daySales?.totalAmount === undefined) return alert('매출 데이터가 없어 마감을 진행 하실 수 없습니다.')
        if(employeeList.length === 0) return alert('직원을 추가해주세요.')

        //근무시간이 0일 경우
        if((employeeList || []).some((next) => ((next?.endTime[0] || 0) + ((next?.endTime[1] || 0)/6)) - ((next?.startTime[0] || 0) + ((next?.startTime[1] || 0)/6)) - ((next?.breakTime[0] || 0) + ((next?.breakTime[1] || 0)/6)) === 0)) return alert('근무시간을 확인해주세요.')


        let body = {
            ...dailyInfo,
            employeeList: employeeList.map((employ) => ({
                ...employ,
                startTime: employ.startTime.map(time => String(time < 10 ? `0${time}`:time)).join(':'),
                endTime: employ.endTime.map(time => String(time < 10 ? `0${time}`:time)).join(':'),
                breakTime: employ.breakTime.map(time => String(time < 10 ? `0${time}`:time)).join(':')
            })),
            closureMemo: description
        }

        if(window.confirm('마감 리포트를 제출하시겠습니까?\n제출 후 잔디로 발송됩니다\n취소 영수증은 별도로 첨부해주세요')) {
            const request = await A2dApi.post('/api/v1/store/day-close/save',body)
            if(!request || request?.resultMsg) return alert(request?.resultMsg || '마감 리포트를 제출하는데 실패했습니다.')
            alert('마감 리포트가 제출되었습니다.\n오늘도 수고 많으셨습니다.')
            setDisplayType('')
        }
    }

    //마감 리포트 불러오기
    const getDailyReport = async () => {
        let today = dayjs()

        if(dayjs().hour() < 2) today = dayjs().add(-1,'day')

        //마감 리포트 불러오기
        const request = await A2dApi.get(`/api/v1/store/day-close/${user.loginId}`,{
            salesDate: dayjs(today).format('YYYY-MM-DD')
        })
        if(!request || request?.resultMsg) return alert(request?.resultMsg || '마감 리포트를 불러오는데 실패했습니다.')
        

        //오늘의 에러 로그 전송
        const historyError = JSON.parse(localStorage.getItem(`ERROR_${dayjs().format('YYYYMMDD')}`) || '[]');
        if(historyError.length > 0) {
            const errorRequest = await A2dApi.post('/api/v1/store/error',JSON.stringify({
                "loginId": user.loginId,
                "selJson": {
                    errors: historyError,
                    errorType: '미전송 에러'
                }
            }))
            if(!errorRequest || errorRequest?.resultMsg) alert(errorRequest?.resultMsg || '에러 로그를 전송하는데 실패했습니다.\n관리자에게 문의해주세요.')
            else localStorage.removeItem(`ERROR_${dayjs().format('YYYYMMDD')}`)
        }


        setLoading(false)
        setDailyInfo(request)
        setemployeeList((request.employeeList || []).map((employ:Employ) => ({
            employeeName: employ.employeeName,
            employeeType: employ.employeeType,
            startTime: (employ?.startTime || '0:0:0').split(':').map((time) => parseInt(time)),
            endTime: (employ?.endTime || '0:0:0').split(':').map((time) => parseInt(time)),
            breakTime: (employ?.breakTime || '0:0:0').split(':').map((time) => parseInt(time))
        })))

        //마감 리포트 작성 여부 체크
        const checkClosure = await A2dApi.get(`/api/v1/store/day-close/${user.loginId}/check`,{
            salesDate: dayjs(today).format('YYYY-MM-DD')
        })
        if(checkClosure === true) {
            if(!window.confirm(`이미 마감 리포트가 작성되었습니다. 수정하시겠습니까?`)) return setDisplayType(lastPage)
        }
    }
    useEffect(() => {
        if(!navigator.onLine) {
            alert('인터넷 연결을 확인해주세요.')
            setDisplayType('')
            return;
        }
        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
        getDailyReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if(loading) return (<Loading />)
    return (
        <div className='bg-white h-screen' style={{
            fontSize: 12.5 * px + 'px',
            paddingBottom: 25 * px + 'px'
        }}>
            <div className='flex justify-between bg-black items-center' style={{
                height: 41 * px + 'px',
                paddingRight: 15 * px + 'px'
            }}>
                <Header setDisplayType={setDisplayType} displayType={displayType} onHome={() => {
                    setDisplayType('')
                }}  />
                <div className="flex items-center" style={{
                    gap: 5 * px + 'px'
                }}>
                    <Button buttonType="dimmend" size="sm" onClick={() => setDisplayType(lastPage)}>취소</Button>
                    <Button buttonType="secondary" size="sm" onClick={() => {
                        saveReport()
                    }}>제출</Button>
                </div>
            </div>
            {focusInput === 'description' && <Keyboard defaultValue={focusInput === 'description' ? defaultValues: ''} setValue={(value) => {
                setDescription(value)
            }} />}
            <div ref={scrollArea} className="overflow-auto" onClick={(e) => {
                e.stopPropagation()
                setFocusInput('')
                setShowIndex(null)
            }} style={{
                paddingLeft: 25 * px + 'px',
                paddingRight: 25 * px + 'px',
                height: screenSize.height - (66 * px) + 'px',
                paddingBottom: (focusInput === 'description' || focusInput === 'employeeName' || focusInput === 'employeeType') ? 265 * px + 'px' : 0
            }}>
                <div className='flex justify-center items-center' style={{
                    height:65 * px + 'px',
                }}>
                    <Title style={{paddingBottom: 0}}>마감 리포트</Title>
                </div>
                <div className="border-bordergray grid" style={{
                    borderWidth: `${1 * px}px 0`,
                    gridTemplateColumns: `${176 * px}px auto`
                }}>
                    <h3 className="bg-lightgray text-darkgray flex justify-center items-center border-b border-bordergray">edi 매출</h3>
                    {dailyInfo?.hasEdiSalesAmountYn === 'Y' ?<div className="border-b border-lightgray" style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        {(dailyInfo?.ediTotalSalesAmount || 0).toLocaleString()}원
                        {(dailyInfo?.ediSalesList || []).length > 1 && (dailyInfo?.ediSalesList || []).map((edi, index) => <div key={index}>
                            {edi.departmentName} &gt; {edi.branchName} &gt; {edi.brandName}: {(edi.salesAmount || 0).toLocaleString()}원
                        </div>)}
                    </div>: <div className="border-b border-lightgray" style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        {(dailyInfo?.ediSalesList || []).some(edi => edi.ediInterWorkingYn === 'N') ? '등록된 데이터가 없습니다.' :'데이터를 불러올 수 없습니다. (관리자 문의)'}
                        
                    </div>}
                    <h3 className="bg-lightgray text-darkgray flex justify-center items-center border-b border-bordergray">총  매출</h3>
                    <div className="border-b border-lightgray" style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        POS: {(dailyInfo?.daySales?.posPaidAmount || 0).toLocaleString()}원 
                        {dailyInfo?.hasEdiSalesAmountYn === 'Y' && <span className={((dailyInfo?.ediTotalSalesAmount || 0) - (dailyInfo?.daySales?.posPaidAmount || 0)) < 0 ?'text-[#ff1111]':'text-a2dblue-dark'}>
                        ({((dailyInfo?.ediTotalSalesAmount || 0) - (dailyInfo?.daySales?.posPaidAmount || 0)).toLocaleString()}원)
                        </span>}<br />
                        계좌: {(dailyInfo?.daySales?.bankPaidAmount || 0).toLocaleString()}원
                    </div>
                    <h3 className="bg-lightgray text-darkgray flex justify-center items-center border-b border-bordergray">서비스 매출 (총 할인 금액)</h3>
                    <div className="border-b border-lightgray" style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        {(dailyInfo?.daySales?.discountAmount || 0).toLocaleString()}원
                    </div>
                    <h3 className="bg-lightgray text-darkgray flex justify-center items-center border-b border-bordergray">취소 건수</h3>
                    <div className="border-b border-lightgray" style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        {(dailyInfo?.daySales?.cancelCount || 0).toLocaleString()}건, 취소금액 {(dailyInfo?.daySales?.cancelAmount || 0).toLocaleString()}원 (*영수증 잔디 별도 첨부)
                    </div>
                    <h3 className="bg-lightgray text-darkgray flex justify-center items-center border-b border-bordergray">폐기 건수</h3>
                    <div className="border-b border-lightgray" style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        {(dailyInfo?.daySales?.disposeCount || 0).toLocaleString()}건
                    </div>
                    <h3 className="bg-lightgray text-darkgray flex justify-center items-center border-b border-bordergray">백화점직원</h3>
                    <div className="border-b border-lightgray" style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        총 근무인원: {(employeeList || []).length}명<br/>
                        총 근무시간:{" "}
                        {(employeeList || []).reduce((prev, next) => prev +  ((next?.endTime[0] || 0) + ((next?.endTime[1] || 0)/6)) - ((next?.startTime[0] || 0) + ((next?.startTime[1] || 0)/6)) - ((next?.breakTime[0] || 0) + ((next?.breakTime[1] || 0)/6)) ,0).toFixed(1).at(-1) === '0' ?
                        (employeeList || []).reduce((prev, next) => prev +  ((next?.endTime[0] || 0) + ((next?.endTime[1] || 0)/6)) - ((next?.startTime[0] || 0) + ((next?.startTime[1] || 0)/6)) - ((next?.breakTime[0] || 0) + ((next?.breakTime[1] || 0)/6)) ,0).toFixed(0)
                        :(employeeList || []).reduce((prev, next) => prev +  ((next?.endTime[0] || 0) + ((next?.endTime[1] || 0)/6)) - ((next?.startTime[0] || 0) + ((next?.startTime[1] || 0)/6)) - ((next?.breakTime[0] || 0) + ((next?.breakTime[1] || 0)/6)) ,0).toFixed(1)}시간
                        <div style={{
                            fontSize: 11 * px + 'px',
                            marginTop: 11 * px + 'px'
                        }}>
                            <div className="grid py-px bg-lightgray gap-px text-darkgray" style={{
                                gridTemplateColumns: ` auto ${104 * px}px ${72 * px}px ${122 * px}px ${72 * px}px ${72 * px}px`,
                                height: 30 * px + 'px'
                            }}>
                                <span className="bg-bggray flex justify-center items-center">이름</span>
                                <span className="bg-bggray flex justify-center items-center">구분</span>
                                <span className="bg-bggray flex justify-center items-center">시작</span>
                                <span className="bg-bggray flex">
                                    <span className="flex justify-center items-center border-r border-lightgray" style={{
                                        width: 50 * px + 'px'
                                    }}>~</span>
                                    <span className="flex justify-center items-center" style={{
                                        width: 72 * px + 'px'
                                    }}>종료</span>
                                </span>
                                <span className="bg-bggray flex justify-center items-center">휴게</span>
                                <span className="bg-bggray flex justify-center items-center"></span>
                            </div>
                            {(employeeList || []).map((employ, index) =>  <div key={index} className="grid border-b border-lightgray bg-lightgray gap-x-px" style={{
                                gridTemplateColumns: ` auto ${104 * px}px ${72 * px}px ${122 * px}px ${72 * px}px ${72 * px}px`,
                                fontSize:11 * px + 'px',
                            }} ><EmpolyWorkingTime setOffsetY={(y) => {
                                if(!focusInput) setTimeout(() => scrollArea.current?.scrollTo(0,y),400)
                            }} orderNum={index} showIndex={showIndex} setShowIndex={setShowIndex} setFocusInput={setFocusInput} focusInput={focusInput} employ={employ} px={px} onChange={(e) => setemployeeList(
                                employeeList.map((employ, i) => i === index ? e : employ)
                            )} />
                            <div className="flex items-center justify-center bg-white text-darkgray" onClick={(e) =>{
                                    e.stopPropagation() 
                                    setemployeeList(employeeList.filter((_, i) => i !== index))
                                }}  style={{
                                gap: 3 * px + 'px',
                            }}>
                                <span className={`bg-no-repeat bg-center bg-contain `}style={{
                                    width: 11 * px + 'px',
                                    height: 12 * px + 'px',
                                    backgroundImage: `url(/images/icon_delete.png)`
                                }}></span>
                                삭제
                            </div>
                            </div>)}
                            <button className={`$text-black border-black font-medium border rounded-md flex justify-center items-center`} style={{
                                fontSize: 11 * px + 'px',
                                height: 30 * px + 'px',
                                padding: `0 ${15 * px}px`,
                                marginTop: 10 * px + 'px'
                            }} onClick={(e) => {
                                e.stopPropagation()
                                if(!focusInput) setTimeout(() => scrollArea.current?.scrollTo(0,e.pageY),400)
                                setemployeeList([
                                    ...employeeList,
                                    {
                                        "employeeName": '',
                                        "employeeType": '',
                                        "startTime":[0,0,0],
                                        "endTime": [0,0,0],
                                        "breakTime": [0,0,0]
                                    }
                                ])
                                setFocusInput('employeeName')
                                setShowIndex(employeeList.length)
                            }}>근무인원 추가</button>
                        </div>
                    </div>
                    <h3 className="bg-lightgray text-darkgray flex justify-center items-center ">메모</h3>
                    <div className={`${description ? '' :'text-darkgray'} ${focusInput === 'description' ? 'relative':''}`} onClick={(e) => {
                        e.stopPropagation()
                        setFocusInput('description')
                        setDefaultValues(description)
                        if(!focusInput) setTimeout(() => scrollArea.current?.scrollTo(0,e.pageY),400)
                    }} style={{
                        padding: `${11 * px}px ${15 * px}px`
                    }}>
                        <span dangerouslySetInnerHTML={{
                            __html: description.replaceAll('\n','<br />')
                        }}></span>
                        {focusInput === 'description' &&  <TextCursor height={12.5} />}
                        {!description && '취소사유 /대량주문/ 계좌 입금 건  등 메모 작성'}
                    </div>
                </div>
            </div>
    </div>)
}

