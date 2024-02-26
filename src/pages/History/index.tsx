
import { useEffect, useState } from 'react'

import dayjs from 'dayjs';

import "dayjs/locale/ko"; //한국어
import { useRecoilValue } from 'recoil';
import { screenPx } from '../../atom/px';
import { userInfo } from '../../atom/user';
import { DISPLAY_MODE } from '../../atom/type';
import { A2dApi } from '../../lib/api';
import Loading from '../Loading';
import {Header} from '../../components/Header';
import { Button } from '../../components/Button';
import Calendar from '../../components/Calendar';
import {Pagable} from '../../components/Pagable';
import {ButtonArea} from '../../components/ButtonArea';
import Keyboard from '../../components/Keyboard';
import {Memo} from '../../components/Memo';
import OrderCancel from './cancel';
import calendar from '../../images/icon_calendar.png';
import note from '../../images/icon_note.png';
import search from '../../images/icon_search.png';
dayjs.locale("ko");


export default function History({
    setDisplayType,
    displayType,
    syncOrder
}:{
    setDisplayType: (displayType: DISPLAY_MODE) => void
    displayType: DISPLAY_MODE
    syncOrder: (callback: () => void) => void
}) {
    const user = useRecoilValue(userInfo)
    const [detail, setDetail] = useState<OrderDetailType | null>(null)
    const [showCancelType, setShowCancelType] = useState<boolean>(false)
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0
    });
    const [lists, setLists] = useState<orderListData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showCalendar, setShowCanlendar] = useState<boolean>(false)
    const [startEndTime, setStartEndTime] = useState<number[]>([8,10])
    const [date, setDate] = useState<Date>(new Date())
    const px = useRecoilValue(screenPx)
    const [currentPage, setCurrentPage] = useState<number>(-1)
    const [maxPage, setMaxPage] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [showKeyPad, setShowKeyPad] = useState(false)
    const [showMemo, setShowMemo] = useState(false)
    

    // 주문리스트 불러오기
    const searchOrder = async (time:number[] = startEndTime, day = date, page = 0) => {
        let startDate = dayjs(day).format(`YYYY-MM-DD ${time[0] < 10 ? `0${time[0]}`:time[0]}:00:00`)
        let endDate = dayjs(day).format(`YYYY-MM-DD ${time[1] < 10 ? `0${time[1]}`:time[1]}:00:00`)

        let body:{
            loginId:string,
            orderStartTime:string
            orderEndTime:string,
            pageSize: number,
            pageIndex:number,
            paidAmount?:number,
            productName?:string
        } =  {
            "loginId": user.loginId,
            "orderStartTime": startDate,
            "orderEndTime": endDate,
            "pageSize": 30,
            "pageIndex": page,
        }
        if(keyword) {
            body ={
                ...body,
                [Number(keyword.replaceAll(',','')) > -1 ?'paidAmount':'productName']: Number(keyword.replaceAll(',','')) > -1 ? Number(keyword.replaceAll(',','')): keyword
            }
        }

        const request = await A2dApi.post('/api/v1/store/order/list',body)
        if(!request) return alert(request?.resultMsg || '주문리스트를 불러오는데 실패했습니다');
        setCurrentPage(request?.pageable?.pageNumber || 0)
        setMaxPage(Number(request.totalPages || 0))
        setLists(page > 0 ? [...lists, ...request.content] : request.content)
        setShowCanlendar(false)
    }

    //주문상세 불러오기
    const getDetailOrder = async (id:string, callback?:(id:string) => void) => {
        const request = await A2dApi.get(`/api/v1/store/order/${id}`)
        if(!request) return alert(request?.resultMsg || '주문데이터를 부를 수 없습니다.')
        setDetail(request)
    
        let startTime = dayjs(request.orderTime).hour() % 2 === 0 ? dayjs(request.orderTime).hour(): dayjs(request.orderTime).hour() -1

        //주문상세와 좌측 리스트의 날짜가 다를경우 리스트 재조회
        if(dayjs(date).format('YYYY-MM-DD') !== dayjs(request?.orderTime).format('YYYY-MM-DD') || startEndTime[0] !== startTime) {
            setDate(new Date(request?.orderTime))
            setStartEndTime([startTime, startTime + 2])
            setTimeout(() => searchOrder([startTime, startTime + 2],new Date(request?.orderTime), 0),100)
        }

        //취소주문일경우 취소주문으로 이동
        if(callback && request?.cancelOrder?.cancelOrderId) callback(request.cancelOrder.cancelOrderId)
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
        setStartEndTime([dayjs().hour()%2 === 0 ? dayjs().hour() : dayjs().hour() - 1,dayjs().hour()%2 === 0 ? dayjs().hour() +2 : dayjs().hour() + 1])
        
        syncOrder(()=> {
            setLoading(false)
            searchOrder([dayjs().hour()%2 === 0 ? dayjs().hour() : dayjs().hour() - 1, dayjs().hour()%2 === 0 ? dayjs().hour() +2 : dayjs().hour() + 1], new Date() ,0)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if(loading) return (<Loading />)
    return (
        <div className='grid' style={{
            gridTemplateColumns: 'repeat(2, 1fr)',
            fontSize: 12.5 * px + 'px',
        }}>
            <div className='flex justify-between col-span-2 bg-black items-center' style={{
                height: 41 * px + 'px',
                paddingRight: 15 * px + 'px'
            }}>
                <Header setDisplayType={setDisplayType} displayType={displayType} onHome={() => {
                    setDisplayType('')
                }} onSales={() => {
                    setDisplayType('MODE_SALES')
                }} onHistory={() => {
                }} />
                <Button onClick={() => setDisplayType('MODE_CREATE_REPORT')}>마감</Button>
            </div>
            {showCancelType && detail?.orderId ? <OrderCancel setShowCancelType={setShowCancelType} screenSize={screenSize} orderId={detail.orderId} onSuccess={() => {
                setDate(new Date())
                setTimeout(() => {
                    searchOrder([dayjs().hour()%2 === 0 ? dayjs().hour() : dayjs().hour() - 1, dayjs().hour()%2 === 0 ? dayjs().hour() +2 : dayjs().hour() + 1], new Date(), 0)
                    getDetailOrder(detail.orderId, (id) => {
                        getDetailOrder(id)
                    })
                },0)
            }} />
            : <div className='border-r border-lightgray' style={{
                height: screenSize.height - 41 * px + 'px',
            }}>
                <div className='grid border-b border-lightgray bg-white' style={{
                    height: 41 * px + 'px',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                }}>
                    {showCalendar && <span className='fixed left-0 w-full bg-black bg-opacity-50 z-[1]' onClick={() => setShowCanlendar(false)} style={{
                        top: 41 * px +'px',
                        height:screenSize.height - (41 * px) + 'px'
                    }}></span>}
                    <div className={`relative ${showCalendar ? 'z-[1]':''} bg-white flex items-center text-black border-r border-lightgray`} onClick={() => {
                        setShowCanlendar(!showCalendar)
                    }} style={{
                        padding: `0 ${12 * px + 'px'}`,
                    }}>
                        <div >{dayjs(date).format('YYYY-MM-DD(ddd)')} |{' '}
                            {startEndTime.length > 0 && `${startEndTime[0] < 10 ? `0${startEndTime[0]}`:startEndTime[0]}:00 ~ ${startEndTime[1] < 10 ? `0${startEndTime[1]}`:startEndTime[1]}:00`}
                        </div>
                        <span className='absolute bg-no-repeat bg-center bg-contain top-1/2 -translate-y-1/2' style={{
                            backgroundImage: `url(${calendar})`,
                            width: 16.5 * px + 'px',
                            height: 16.5 * px + 'px',
                            right: 12 * px + 'px'
                        }}></span>
                        {showCalendar && <div className='absolute top-full left-0 border border-l-0 shadow-lg border-black grid bg-white' onClick={(e) => {
                            e.stopPropagation()
                        }} style={{
                            width: 372 * px + 'px',
                            gridTemplateColumns: `auto ${130 *px}px`,
                        }}>
                            <Calendar date={date} setDate={(date) => {
                                setDate(date)
                                setStartEndTime([])
                            }} />
                            <div className='border-l border-lightgray flex flex-col w-full' style={{
                                gap: 5 * px + 'px',
                                padding: 15 * px + 'px',
                            }}>
                                {([[8,10],[10,12],[12,14],[14,16],[16,18],[18,20],[20,22]]).map((item, index) => (
                                    <div key={index} className={`${( item[0] === startEndTime[0] && item[1] === startEndTime[1] )?'text-black border-black font-medium':'text-darkgray border-lightgray'} border rounded-md flex justify-center items-center`} style={{
                                        fontSize: 11 * px + 'px',
                                        height: 30 * px + 'px'
                                    }} onClick={() => {
                                        setStartEndTime(item)
                                        setShowCanlendar(false)
                                        setTimeout(() => {
                                            searchOrder(item,date, 0)
                                        },0)
                                    }}>{item[0] < 10 ? `0${item[0]}`:item[0]}:00 ~ {item[1]}:00</div>
                                ))}
                            </div>
                        </div>}
                    </div>
                    <div className={`relative ${showKeyPad ? 'z-[1]':''} bg-white flex items-center ${keyword ?'text-black':'text-darkgray'} line-clamp-1`} onClick={() => setShowKeyPad(!showKeyPad)} style={{
                        paddingLeft: 12 * px + 'px',
                        paddingRight: 40 * px + 'px',
                    }}>
                        {keyword ? keyword : '메뉴명 / 주문금액'}
                        <span className='absolute bg-no-repeat bg-center right-0 bg-contain top-0 h-full' onClick={(e) => {
                            e.stopPropagation()
                            setShowKeyPad(false)
                            searchOrder(startEndTime,date, 0)
                        }} style={{
                            backgroundImage: `url(${search})`,
                            backgroundSize: `${17 * px}px ${17 * px}px`,
                            width: 41 * px + 'px',
                        }}></span>
                    </div>
                </div>
                <div className='grid border-b border-lightgray text-center text-deepdark' style={{
                    height: 41 * px + 'px',
                    gridTemplateColumns: `${82 * px}px auto ${101 * px}px ${75 * px}px`
                }}>
                    <span className='flex items-center justify-center'>주문시간</span>
                    <span className='flex items-center justify-center border-x border-lightgray'>주문내역</span>
                    <span className='flex items-center justify-center'>실 결제금액</span>
                    <span className='flex items-center justify-center border-l border-lightgray' style={{
                        paddingRight: 30 * px + 'px'
                    }}>상태</span>
                </div>
                 <Pagable className='bg-white z-0' scrollAlign='vertical' width={screenSize.width / 2} height={screenSize.height - (123 * px)}>
                    {(lists || []).length > 0 ? (lists || []).map((list, index) => <div key={index} className={`grid border-b ${detail?.orderId === list.orderId ? 'bg-a2dblue-light':''}
                     ${(list.orderStatus === 'CANCEL' || list.orderStatus === 'DISPOSE') ? 'text-darkgray' :'text-black'} border-lightgray text-center`} style={{
                        height: 41 * px + 'px',
                        gridTemplateColumns: `${82 * px}px auto ${101 * px}px ${45 * px}px`
                    }} onClick={() => {getDetailOrder(list.orderId)}}>
                        <span className='flex items-center justify-center'>{dayjs(list.orderTime).format('HH:mm:ss')}</span>
                        <span className={`font-medium ${(list.orderStatus === 'CANCEL' || list.orderStatus === 'DISPOSE') ? 'line-through':''} flex items-center justify-start border-x border-lightgray`} style={{
                            padding:`0 ${12 * px}px`
                        }}><div className=' line-clamp-1'>{list.orderTitle}</div></span>
                        <span style={{
                            padding: `0 ${12 * px}px`
                        }} className={`flex items-center justify-end ${(list.orderStatus === 'CANCEL' || list.orderStatus === 'DISPOSE') ? 'text-[#f10000]':''}`}>{
                            (list.orderStatus === 'DISPOSE') ? 0 : (list.paidAmount || 0).toLocaleString()}원</span>
                        <span className={` ${(list.orderStatus === 'CANCEL' || list.orderStatus === 'DISPOSE') ? 'text-[#f10000]':''} flex items-center justify-center border-l border-lightgray`}>{list.orderStatus === 'SALE' ?'판매':
                        list.orderStatus === 'DISCOUNT' ? '할인' : list.orderStatus === 'DISPOSE' ?'폐기' :'취소'}</span>
                    </div>)
                    :<div className='text-darkgray flex justify-center items-center' style={{
                        fontSize:16 * px + 'px',
                        height: screenSize.height - (123 * px) + 'px'
                    }}>판매내역이 없습니다</div>}
                    {currentPage + 1 < maxPage && <button className='w-full flex justify-center items-center' style={{
                        height: 41 * px + 'px',
                        gap: 5 * px + 'px',
                    }} onClick={() => {
                        searchOrder(startEndTime,date,currentPage + 1)
                    }}>더보기<span className={`border-t border-l border-black rotate-[225deg]`}  style={{
                        width: 6 * px + 'px',
                        height: 6 * px + 'px',
                    }}/></button>}
                 </Pagable>
            </div>}
            <div style={{
                padding: 20 * px + 'px'
            }}>{detail?.orderId && <>
                <div className='flex items-center border-b border-bordergray' style={{
                    borderTopWidth: 1 * px + 'px',
                }}>
                    <div className='bg-lightgray text-darkgray flex items-center' style={{
                        height: 39 * px + 'px',
                        padding: `0 ${20*px}px`
                    }}>{detail.origin ? '취소':'주문'}시간</div>
                    <div style={{
                        padding: `0 ${(detail.orderCancelYn === 'Y' ? 10:20)*px}px`
                    }}>{detail?.orderTime}</div>
                </div>
                <div className='flex items-center border-bordergray text-center' style={{
                    borderBottomWidth: 1 * px +'px'
                }}>
                    <div className='bg-lightgray text-darkgray flex items-center' style={{
                        height: 40 * px + 'px',
                        padding: `0 ${20*px}px`
                    }}>성별</div>
                    <div style={{
                        width: 50 * px + 'px'
                    }}>{detail?.gender}</div>
                    <div className='bg-lightgray text-darkgray flex items-center' style={{
                        height: 40 * px + 'px',
                        padding: `0 ${20*px}px`
                    }}>연령</div>
                    <div style={{
                        width: 50 * px + 'px'
                    }}>{detail?.age}</div>
                    <div className='bg-lightgray text-darkgray flex items-center' style={{
                        height: 40 * px + 'px',
                        padding: `0 ${20*px}px`
                    }}>주문타입</div>
                    <div style={{
                        padding: `0 ${20*px}px`
                    }}>{detail?.orderPayType && (detail?.orderPayType === 'POS' ? '백화점주문' : detail?.orderPayType === 'BANK'? '계좌이체':'')}</div>
                </div>
                <div className='grid border-bordergray text-center text-deepdark bg-lightgray' style={{
                    height: 41 * px + 'px',
                    gridTemplateColumns: `${128 * px}px ${37 * px}px ${120 * px}px auto`,
                    marginTop: 10 * px +'px',
                    borderTopWidth: 1 * px + 'px'
                }}>
                    <span className='flex items-center justify-center'>상품명</span>
                    <span className='flex items-center justify-center border-x border-bordergray'>수량</span>
                    <span className='flex items-center justify-center'>금액</span>
                    <span className='flex items-center justify-center border-l border-bordergray'>비고</span>
                </div>
                <Pagable scrollAlign='vertical' width={(screenSize.width/2) - (40 * px)} height={screenSize.height - (332 * px)}>
                {(detail?.productList || []).map((list, index) => <div key={index} className={`grid border-bordergray text-center border-b text-deepdark`} style={{
                    minHeight: 41 * px + 'px',
                    gridTemplateColumns: `${128 * px}px ${37 * px}px ${120 * px}px auto`,
                }}>
                    <div className='flex items-center justify-start font-medium text-left' style={{
                        padding: `${5 * px}px 0 ${5 * px}px ${10 * px}px`,
                    }}>{list.storeProductName}</div>
                    <div className='flex items-center justify-center border-x border-bordergray'>{(list.quantity).toLocaleString()}</div>
                    <div className='flex items-center text-right justify-end' style={{
                        padding: `${5 * px}px ${10 * px}px`
                    }}>
                        <div>
                        <span className={`inline-block ${(list.discountReason|| detail?.orderStatus === 'CANCEL' || detail?.orderStatus === 'DISPOSE') ? 'text-[#f10000] line-through':''}`}>{
                        (  list.productSalePrice 
                            * list.quantity
                        ).toLocaleString()}원</span>
                        {(list.discountReason) && <span className='block'>{(
                            (list.productSalePrice 
                            * list.quantity) - list.discountPrice
                        ).toLocaleString()}원</span>}
                        </div>
                    </div>
                    <div className='flex items-center justify-start border-l border-bordergray text-[#f10000] line-clamp-2' style={{
                        padding:`0 ${10 * px}px`
                    }}>{list.discountReason && (!(detail?.productList || []).some(other => list.discountReason !== other.discountReason) ? ''
                    : <>
                        {list.discountReason}
                        {list.etcDiscountReason && <>({list.etcDiscountReason})</>} / {" "}
                        {list.discountPercent ? `${list.discountPercent}%`:`${list.discountPrice.toLocaleString()}원`}
                    </>)}</div>
                    {(list.groupItemList || []).map((option, index) => <div className={`col-span-4 grid ${index === 0 ?'border-t border-bordergray':''}`} key={index} style={{
                        gridTemplateColumns: `${128 * px}px ${37 * px}px ${120 * px}px auto`,
                    }}>
                        <div className='text-left flex items-start' style={{
                            padding: `0 ${10 * px}px`,
                            paddingTop: index === 0 ? 10 * px + 'px':'0px',
                            paddingBottom: index === (list.groupItemList || []).length - 1 ? 10 * px + 'px':'0px'
                        }}><span>ㄴ</span>{option.optionName}</div>
                        <div className=' border-x border-bordergray' style={{
                            paddingTop: index === 0 ? 10 * px + 'px':'0px',
                            paddingBottom: index === (list.groupItemList || []).length - 1 ? 10 * px + 'px':'0px'
                        }}>{option.quantity.toLocaleString()}</div>
                        <div className={`text-right ${(list.discountReason|| detail?.orderStatus === 'CANCEL' || detail?.orderStatus === 'DISPOSE') ? 'text-[#f10000] line-through':''}`} style={{
                            padding: `0 ${10 * px}px`,
                            paddingTop: index === 0 ? 10 * px + 'px':'0px',
                            paddingBottom: index === (list.groupItemList || []).length - 1 ? 10 * px + 'px':'0px'
                        }}>{option.optionAddTotalPrice.toLocaleString()}원</div>
                        <div className=' border-l border-bordergray' style={{
                            paddingTop: index === 0 ? 10 * px + 'px':'0px',
                            paddingBottom: index === (list.groupItemList || []).length - 1 ? 10 * px + 'px':'0px'
                        }}></div>
                    </div>)}
                </div>)}
                </Pagable>
                <div className='grid border-bordergray text-center text-black bg-white' style={{
                    height: 50 * px + 'px',
                    gridTemplateColumns: `${128 * px}px ${37 * px}px ${120 * px}px auto`,
                    borderWidth: `${1*px}px 0`
                }}>
                    <div className='flex items-center justify-start font-medium text-left' style={{
                        paddingLeft:10 * px + 'px'
                    }}>{(detail?.productList || []).length > 0 && <div className=' line-clamp-2'>
                        {detail?.productList[0].storeProductName}
                        {(detail?.productList || []).length > 1 && <>{" "}외 {(detail?.productList || []).length - 1}건</>}
                    </div>}</div>
                    <div className='flex items-center justify-center border-x border-bordergray'>{(detail?.productList || []).reduce((prev, next) => prev + next.quantity,0)}</div>
                    <div className='flex items-center justify-end text-right' style={{
                        paddingRight: 10 * px + 'px'
                    }}>
                        <div>
                            <span className={`inline-block ${((detail?.productList || []).some((a) => a.discountReason)|| detail?.orderCancelYn === 'Y' || detail?.orderStatus === 'CANCEL' || detail?.orderStatus === 'DISPOSE') ? 'text-[#f10000] line-through':''}`}>
                            {(detail?.orderStatus === 'DISPOSE') ? 0 : (detail?.totalAmount || 0).toLocaleString()}원</span>
                            {(detail?.productList || []).some((a) => a.discountReason) && <span className='block'>{(detail?.totalPaidAmount || 0).toLocaleString()}원</span>}
                        </div>
                    </div>
                    <div className='flex items-center justify-start border-l border-bordergray text-[#f10000]' style={{
                        padding:`0 ${10 * px}px`
                    }}><div className=' line-clamp-2'>{detail?.orderStatus === 'CANCEL' ? <>
                        주문취소: {detail?.reasonName}
                    </>:detail?.orderCancelYn === 'Y' ? <>
                        주문취소
                    </>:(detail?.orderStatus === 'DISPOSE' ? <>
                        폐기: {detail?.reasonName}
                    </>:(detail?.productList || []).some(list => list.discountReason) ? <> 
                        {(detail?.productList || []).filter((list, index) => list.discountReason 
                            && (detail?.productList || []).findIndex(l => list.discountReason === l.discountReason) === index)
                        .map(list => list.discountReason).join()} / {(detail?.totalDiscountAmount || 0).toLocaleString()}원
                    </>: 
                    <></>)}</div></div>
                </div>
                <ButtonArea size="sm" onSubmit={() => {
                    setShowMemo(true)
                }} className='flex-row-reverse' cancelText={detail?.origin ? '주문서 보기' :
                    detail?.cancelOrder ? '취소주문 보기' :'주문취소'
                } cancelDisabled={detail?.orderStatus === 'DISPOSE'} submitText={<span className={`inline-flex items-center ${detail?.orderDescription ? 'text-white text-bold': 'text-darkgray text-medium'}`} style={{
                    gap : 5 * px + 'px'
                }}><span className='bg-no-repeat bg-contain bg-center' style={{
                    width: 19 * px + 'px',
                    height: 16.5 * px + 'px',
                    backgroundImage: `url(${note})`,
                    opacity: detail?.orderDescription ? 1 : 0.5
                }}>
                </span>특이사항</span>} onCancel={() => {
                        if(detail?.orderCancelYn === 'Y') {
                            getDetailOrder((detail?.origin
                                    ? detail?.origin.orderId
                                    : detail?.cancelOrder?.cancelOrderId)
                                || detail.orderId
                            )
                            return;
                        }
                        setShowCancelType(true)
                    }} />
            </>}
            </div>
            {showKeyPad && <div className='absolute top-0 left-0 w-full h-full z-0 bg-black bg-opacity-50' onClick={() => {
                if(keyword) searchOrder()
                setShowKeyPad(false)
            }}><Keyboard setValue={(value) => setKeyword(value)} enterTxt={keyword ? '검색':'닫기'} onEnter={() => {
                if(keyword) searchOrder()
                setShowKeyPad(false)
            }} /></div>}
            {showMemo && detail?.orderId && <Memo value={detail?.orderDescription} style={{
                top: 41 * px + 'px',
                height: screenSize.height - (41 * px) + 'px'
            }} onSubmit={async (value) => {
                const request = await A2dApi.post(`/api/v1/store/order/change-description`,{
                    "orderId": detail.orderId,
                    "orderDescription": value
                })
                if(!request || request?.resultMsg) return alert(request.resultMsg || '주문메모를 저장하는데 실패했습니다.')
                setShowMemo(false)
                getDetailOrder(detail.orderId)
            }} onCancel={() => {
                setShowMemo(false)
            }}/>}
        </div>
    )
}


type orderListData = {
    orderId: string
    orderTime: string
    orderTitle: string
    paidAmount: string
    orderStatus: string
}

type OrderDetailType = {
    "orderId": string,
    "orderTime": string,
    "orderPayType": string,
    "gender": string,
    "age": string,
    "totalPaidAmount": number,
    "totalAmount": number,
    "totalDiscountAmount": number,
    "orderStatus": string,
    "orderTitle": string,
    "content": string,
    reasonName?:string,
    etcReason?:string,
    orderDescription?:string
    "productList": {
        "storeProductName": string,
        "storeCategoryName": string,
        "productName": string,
        "productSalePrice": number,
        "costPrice": number,
        "quantity": number,
        "discountPrice": number,
        "discountReason"?: string,
        "etcDiscountReason"?:string
        "discountPercent"?:number
        "groupItemList": {
            "quantity": number,
            "optionAddPrice": number,
            "optionName":string,
            "optionSetName": string
            "optionAddTotalPrice": number
        }[]
    }[],
    "lastUpdateTime": string,
    "lastUpdatedBy": string
    "orderCancelYn": "Y" | "N",
    "cancelOrder"?: {
        "cancelOrderId": string,
        "cancelTime": string
    }
    "origin"?: {
        "orderId": string,
        "orderTime": string
    }
}