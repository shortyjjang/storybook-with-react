import { useRecoilValue } from "recoil";
import { DISPLAY_MODE } from "../../atom/type";
import { userInfo } from "../../atom/user";
import { useEffect, useState } from "react";
import { screenPx } from "../../atom/px";
import { A2dApi } from "../../lib/api";
import dayjs from "dayjs";
import Loading from "../Loading";
import {Header} from "../../components/Header";
import { Button } from "../../components/Button";
import Title from "../../components/Title";
import Calendar from "../../components/Calendar";

import "dayjs/locale/ko"; //한국어
import {Pagable} from "../../components/Pagable";
import calendar from "../../images/icon_calendar.png";
dayjs.locale("ko");

export default function DailySalesLists({
    setDisplayType,
    displayType,
    syncOrder
}:{
    setDisplayType: (displayType: DISPLAY_MODE) => void
    displayType: DISPLAY_MODE
    syncOrder: (callback:() =>void) => void
}) {
    const user = useRecoilValue(userInfo)
    const [date, setDate] = useState<Date>(new Date())
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0
    });
    const [lists, setLists] = useState<any[]>([])
    const [showCalendar, setShowCanlendar] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const px = useRecoilValue(screenPx)
    const [sortColumn, setSortColumn] = useState<string>('salesCountUp')
    //일자별 판매 요약 조회
    const searchList = async (d = date) => {
        const request = await A2dApi.post('/api/v1/store/order/day-total', {
            targetDate: dayjs(d).format('YYYY-MM-DD'),
            loginId: user.loginId  
        })
        if(!request || request.resultMsg) alert(request.resultMsg)
        else setLists(request?.daySalesProductList || [])
        setLoading(false)
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
        syncOrder(() => {
            searchList()
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if(loading) return (<Loading />)
    return (
        <div className='bg-white h-screen' style={{
            fontSize: 11 * px + 'px',
        }}>
            <div className='flex justify-between bg-black items-center' style={{
                height: 41 * px + 'px',
                paddingRight: 15 * px + 'px'
            }}>
                <Header setDisplayType={setDisplayType} displayType={displayType} onHome={() => {
                    setDisplayType('')
                }}  />
                <Button buttonType="secondary" onClick={() => setDisplayType('MODE_CREATE_REPORT')}>마감</Button>
            </div>
            <div style={{
                paddingLeft: 25 * px + 'px',
                paddingRight: 25 * px + 'px',
            }}>
                <div className='relative flex justify-center items-center z-[1]' style={{
                    height:65 * px + 'px',
                }}>
                    <Title style={{paddingBottom: 0}}>일자별 판매 요약</Title>
                    {showCalendar && <div className='fixed top-0 w-full h-full bg-black bg-opacity-50 right-0' onClick={() => setShowCanlendar(false)}></div>}
                    <div className={`absolute top-1/2 right-0 ${showCalendar ? 'bg-white border-black':' border-lightgray bg-[#f7f7f9]'} flex border items-center`} onClick={() => setShowCanlendar(!showCalendar)} style={{
                        width: 240 * px + 'px',
                        height: 40 * px + 'px',
                        padding: `0 ${12.5 * px}px`,
                        fontSize: 12.5 * px + 'px',
                        marginTop: - 20 * px + 'px'
                    }}>
                        {dayjs(date).format('YYYY-MM-DD')}
                        <span className='absolute bg-no-repeat bg-center bg-contain top-1/2 -translate-y-1/2' style={{
                            backgroundImage: `url(${calendar})`,
                            width: 16.5 * px + 'px',
                            height: 16.5 * px + 'px',
                            right: 12 * px + 'px'
                        }}></span>
                        {showCalendar && <div className='absolute top-full right-0 bg-white border border-black -mr-px shadow-md' style={{
                            width:240 * px + 'px',
                        }}>
                        <Calendar date={date} setDate={(value) => {
                            setDate(value)
                            searchList(value)
                        }} />
                        </div>}
                    </div>
                </div>
                <div className='relative z-0'>
                <div className='bg-lightgray border-bordergray grid text-deepdark' style={{
                    height: 30 * px + 'px',
                    borderTopWidth: 1 * px + 'px',
                    gridTemplateColumns: `${107 * px}px ${400 * px}px ${120 * px}px ${120 * px}px auto`,
                }}>
                    <span className={`relative flex items-center justify-center ${(sortColumn === 'storeCategoryNameUp' || sortColumn === 'storeCategoryNameDown') ?'text-black':''}`} onClick={() => {
                        sortColumn === 'storeCategoryNameUp' ? setSortColumn('storeCategoryNameDown') : setSortColumn('storeCategoryNameUp')
                        setLists([...lists].sort((a, b) => {
                            if(sortColumn === 'storeCategoryNameUp') return a.storeCategoryName < b.storeCategoryName ? 1 : -1
                            else return b.storeCategoryName < a.storeCategoryName ? 1 : -1
                        }))
                    }}>카테고리
                     <span className={`absolute top-1/2 border-t border-l ${sortColumn === 'storeCategoryNameUp' ? 'border-black':'border-deepdark'} rotate-45`} style={{
                        width: 6 * px + 'px',
                        height: 6 * px + 'px',
                        marginTop: -5.5 * px + 'px',
                        right: 12.5 * px + 'px'
                     }} />
                     <span className={`absolute bottom-1/2 border-t border-l ${sortColumn === 'storeCategoryNameDown' ? 'border-black':'border-deepdark'} rotate-[225deg]`} style={{
                        width: 6 * px + 'px',
                        height: 6 * px + 'px',
                        marginBottom: -5.5 * px + 'px',
                        right: 12.5 * px + 'px'
                     }} />
                    </span>
                    <span className={`relative flex items-center justify-center border-x border-bordergray ${sortColumn === 'productNameUp' || sortColumn === 'productNameDown' ? 'text-black':''}`} onClick={() => {
                        sortColumn === 'productNameUp' ? setSortColumn('productNameDown') : setSortColumn('productNameUp')
                        setLists([...lists].sort((a, b) => {
                            if(sortColumn === 'productNameUp') return a.productName < b.productName ? 1 : -1
                            else return b.productName < a.productName ? 1 : -1
                        }))
                    }}>상품명
                     <span className={`absolute top-1/2 border-t border-l ${sortColumn === 'productNameUp' ? 'border-black':'border-deepdark'} rotate-45`} style={{
                        width: 6 * px + 'px',
                        height: 6 * px + 'px',
                        marginTop: -5.5 * px + 'px',
                        right: 12.5 * px + 'px'
                     }} />
                     <span className={`absolute bottom-1/2 border-t border-l ${sortColumn === 'productNameDown' ? 'border-black':'border-deepdark'} rotate-[225deg]`} style={{
                        width: 6 * px + 'px',
                        height: 6 * px + 'px',
                        marginBottom: -5.5 * px + 'px',
                        right: 12.5 * px + 'px'
                     }} /></span>
                    <span className={`relative flex items-center justify-center ${sortColumn === 'salesCountUp' || sortColumn === 'salesCountDown' ? 'text-black':''}`} onClick={() => {
                        sortColumn === 'salesCountUp' ? setSortColumn('salesCountDown') : setSortColumn('salesCountUp')
                        setLists([...lists].sort((a, b) => {
                            if(sortColumn === 'salesCountUp') return a.salesCount - b.salesCount
                            else return b.salesCount - a.salesCount
                        }))
                    }}>판매건수
                     <span className={`absolute top-1/2 border-t border-l ${sortColumn === 'salesCountUp' ? 'border-black':'border-deepdark'} rotate-45`} style={{
                        width: 6 * px + 'px',
                        height: 6 * px + 'px',
                        marginTop: -5.5 * px + 'px',
                        right: 12.5 * px + 'px'
                     }} />
                     <span className={`absolute bottom-1/2 border-t border-l ${sortColumn === 'salesCountDown' ? 'border-black':'border-deepdark'} rotate-[225deg]`} style={{
                        width: 6 * px + 'px',
                        height: 6 * px + 'px',
                        marginBottom: -5.5 * px + 'px',
                        right: 12.5 * px + 'px'
                     }} /></span>
                     <span className={`relative flex items-center justify-center ${sortColumn === 'disposeCountUp' || sortColumn === 'disposeCountDown' ? 'text-black':''}`} onClick={() => {
                         sortColumn === 'disposeCountUp' ? setSortColumn('disposeCountDown') : setSortColumn('disposeCountUp')
                         setLists([...lists].sort((a, b) => {
                             if(sortColumn === 'disposeCountUp') return a.disposeCount - b.disposeCount
                             else return b.disposeCount - a.disposeCount
                         }))
                     }}>폐기건수
                        <span className={`absolute top-1/2 border-t border-l ${sortColumn === 'disposeCountUp' ? 'border-black':'border-deepdark'} rotate-45`} style={{
                            width: 6 * px + 'px',
                            height: 6 * px + 'px',
                            marginTop: -5.5 * px + 'px',
                            right: 12.5 * px + 'px'
                        }} />
                        <span className={`absolute bottom-1/2 border-t border-l ${sortColumn === 'disposeCountDown' ? 'border-black':'border-deepdark'} rotate-[225deg]`} style={{
                            width: 6 * px + 'px',
                            height: 6 * px + 'px',
                            marginBottom: -5.5 * px + 'px',
                            right: 12.5 * px + 'px'
                        }} /></span>
                     <span className={`relative flex items-center justify-center  ${sortColumn === 'paidAmountUp' || sortColumn === 'paidAmountDown' ? 'text-black':''}`} onClick={() => {
                         sortColumn === 'paidAmountUp' ? setSortColumn('paidAmountDown') : setSortColumn('paidAmountUp')
                         setLists([...lists].sort((a, b) => {
                             if(sortColumn === 'paidAmountUp') return a.paidAmount - b.paidAmount
                             else return b.paidAmount - a.paidAmount
                         }))
                     }} style={{
                        paddingRight: 30 * px + 'px'
                     }}>금액
                      <span className={`absolute top-1/2 border-t border-l ${sortColumn === 'paidAmountUp' ? 'border-black':'border-deepdark'} rotate-45`} style={{
                         width: 6 * px + 'px',
                         height: 6 * px + 'px',
                         marginTop: -5.5 * px + 'px',
                         right: 42.5 * px + 'px'
                      }} />
                      <span className={`absolute bottom-1/2 border-t border-l ${sortColumn === 'paidAmountDown' ? 'border-black':'border-deepdark'} rotate-[225deg]`} style={{
                         width: 6 * px + 'px',
                         height: 6 * px + 'px',
                         marginBottom: -5.5 * px + 'px',
                         right: 42.5 * px + 'px'
                      }} /></span>
                </div>
                <Pagable scrollAlign='vertical' className='border-r border-lightcolor' width={screenSize.width - 50} height={screenSize.height - (195 * px)}>
                    {(lists || []).length > 0 ? (lists || []).filter(item => item.salesCount > 0 || item.disposeCount > 0).map((item, index) => <div key={index}>
                        <div  className='grid border-b border-t-lightgray' style={{
                            height: 30 * px + 'px',
                            gridTemplateColumns: `${107 * px}px ${400 * px}px ${120 * px}px ${120 * px}px auto`,
                        }}>
                            <span className='flex items-center justify-center'>{item.storeCategoryName}</span>
                            <span className='flex items-center justify-start border-x border-lightgray' style={{
                                padding: `${5 *px}px ${12.5 * px}px`
                            }}>{item.productName}</span>
                            <span className='flex items-center justify-center'>{(item.salesCount || 0).toLocaleString()}</span>
                            <span className='flex items-center justify-center border-x border-bordergray '>{(item.disposeCount || 0).toLocaleString()}</span>
                            <span className='flex items-center justify-center'>{(item.paidAmount || 0).toLocaleString()}</span>
                        </div>
                        {(item?.detailList || []).sort((a:any,b:any) => {
                            if(sortColumn === 'salesCountUp') return b.salesCount - a.salesCount
                            else if(sortColumn === 'salesCountDown') return a.salesCount - b.salesCount
                            if(sortColumn === 'disposeCountUp') return b.disposeCount - a.disposeCount
                            else if(sortColumn === 'disposeCountDown') return a.disposeCount - b.disposeCount
                            if(sortColumn === 'paidAmountUp') return b.addTotalPrice - a.addTotalPrice
                            else if(sortColumn === 'paidAmountDown') return a.addTotalPrice - b.addTotalPrice
                            if(sortColumn === 'productNameUp') return a.setItemName > b.setItemName ? 1 : -1
                            else return b.setItemName > a.setItemName ? 1 : -1
                        }).map((option:any, i:number) => <div key={i} className='grid border-b border-t-lightgray text-darkgray' style={{
                            height: 30 * px + 'px',
                            gridTemplateColumns: `${107 * px}px ${400 * px}px ${120 * px}px ${120 * px}px auto`,
                        }}>
                            <span className='flex items-center justify-center'></span>
                            <span className='flex items-center justify-start border-x border-lightgray' style={{
                                padding: `${5 *px}px ${12.5 * px}px`
                            }}><span className='mr-1'>ㄴ</span>{option.setItemName}</span>
                            <span className='flex items-center justify-center'>{(option.salesCount || 0).toLocaleString()}</span>
                            <span className='flex items-center justify-center border-x border-bordergray '>{(option.disposeCount || 0).toLocaleString()}</span>
                            <span className='flex items-center justify-center'>{(option.addTotalPrice || 0).toLocaleString()}</span>
                        </div>)}
                    </div>)
                    :<div className='text-darkgray flex justify-center items-center' style={{
                        fontSize:16 * px + 'px',
                        height: screenSize.height - (195 * px) + 'px'
                    }}>판매내역이 없습니다</div>}
                </Pagable>
                <div className='bg-a2dblue-light  border-bordergray border-y border-t-lightgray grid text-black font-bold' style={{
                    height: 30 * px + 'px',
                    borderBottomWidth: 1 * px + 'px',
                    gridTemplateColumns: `${107 * px}px ${400 * px}px ${120 * px}px ${120 * px}px auto`,
                }}>
                    <span></span><span className='flex items-center justify-start border-x border-l-a2dblue-light border-r-lightgray'style={{
                            padding: `0 ${12.5 * px}px`
                    }}>총합</span>
                    <span className='flex items-center justify-center'>{(lists || []).reduce((a,b) => a + b.salesCount,0).toLocaleString()}</span>
                    <span className='flex items-center justify-center'>{(lists || []).reduce((a,b) => a + b.disposeCount,0).toLocaleString()}</span>
                    <span className='flex items-center justify-center' style={{
                        paddingRight: 30 * px + 'px'
                     }}>{(lists || []).reduce((a,b) => a + b.paidAmount,0).toLocaleString()}</span>
                </div>
                </div>
            </div>
        </div>
    )
}
