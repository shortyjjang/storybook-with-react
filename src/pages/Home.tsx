import { ReactNode, useEffect, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { disCountReasons } from "../atom/discountReason"
import { disposalReasons } from "../atom/disposalReason"
import { cancelReasons } from "../atom/cancelReason"
import { DISPLAY_MODE, MenuItemsType, MenuListsType, orderDataType } from "../atom/type"
import { userInfo } from "../atom/user"
import { screenPx } from "../atom/px"
import Cookies from 'js-cookie'
import { A2dApi } from "../lib/api"
import dayjs from "dayjs"
import { indexedDb } from "../lib/db"
import Loading from "./Loading"
import Login from "./Login"
import Title from "../components/Title"
import DailySalesLists from "./History/lists"
import Finish from "./History/finish"
import History from "./History"
import Sales from "./Sales"
import logout_icon from "../images/icon_logout.png"

export default function Home() {
    const [displayType, setDisplayType] = useState<DISPLAY_MODE>('')
    const [user, setUser] = useRecoilState(userInfo)
    const [loading,setLoading] = useState<boolean>(true)
    const [syncDate, setSyncDate] = useState<string>('')
    const [status, setStatus] = useState<string | ReactNode>('')
    const [lastPage, setLastPage] = useState<DISPLAY_MODE>('')
    const [px, setPx] = useRecoilState(screenPx)
    const setDisposal = useSetRecoilState(disposalReasons)
    const setDiscount = useSetRecoilState(disCountReasons)
    const setCancel = useSetRecoilState(cancelReasons)
    const logout = () => {
        Cookies.remove('userSetting')
        Cookies.remove('accessToken')
        setUser({
            token: '',
            loginId: '',
            name: '',
            brandName: '',
            departmentStore: {
                branchName: '',
                brandName: '',
                departmentStoreName: ''
            }
        })
    }

    //상품정보 동기화
    const sync = (callback?:() => void) => {
        if(navigator?.onLine === false) return setStatus(<>인터넷이 연결되어있지 않습니다. 인터넷을 연결해주세요.</>)
        console.log('sync')
        setLoading(true)
        const reasons = ['order-cancel','order-discount','product-disposal']

        //사유업데이트
        const getReason = async (type:string) => {
            return new Promise(async (resolve, reject) => {
                const request = await A2dApi.get(`/api/v1/store/code-reasons/list/only/${type}`)
                if(request?.resultMsg || !Array.isArray(request)) {
                    reject(request?.resultMsg || `${type}를 동기화하는데 실패하였습니다.`)
                }
                if(type === 'order-cancel') {
                    localStorage.setItem('cancelReasons',JSON.stringify(request))
                    setCancel(request)
                }
                if(type === 'order-discount') {
                    localStorage.setItem('discountReasons',JSON.stringify(request))
                    setDiscount(request)
                }
                if(type === 'product-disposal') {
                    localStorage.setItem('disposalReasons',JSON.stringify(request))
                    setDisposal(request)
                }
                resolve(request)
                reasons.findIndex((item) => item === type) < reasons.length - 1 && getReason(reasons[reasons.findIndex((item) => item === type) + 1])
                if(reasons.findIndex((item) => item === type) === reasons.length - 1) {
                    let syncDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
                    localStorage.setItem('syncDate',syncDate)
                    setSyncDate(syncDate)
                    setStatus('')
                    if(!localStorage.getItem('fontSize')) localStorage.setItem('fontSize','normal')
                    if(callback) setTimeout(() => callback(),0)
                }
            }).catch((err) => {
                setStatus(err)
            })
        }
        new Promise(async (resolve, reject) => {
            const userSetting = JSON.parse(Cookies.get('userSetting') || '{}')
            if(!user.loginId) {
                if(Cookies.get('userSetting')) {
                    setUser({
                        ...userSetting
                    })
                }else {
                    setStatus(<>유저정보를 찾을 수 없습니다. 다시 로그인해주세요</>)
                    setUser({
                        token: '',
                        loginId: '',
                        name: '',
                        brandName: '',
                        departmentStore: {
                            branchName: '',
                            brandName: '',
                            departmentStoreName: ''
                        }
                    })
                    localStorage.removeItem('accessToken')
                    return;
                }
            }
            const request = await A2dApi.get(`/api/v1/store/${user.loginId || userSetting.loginId}`)
            if(request?.resultMsg || !Array.isArray(request.menus)) {
                setStatus(<>{request.resultMsg || '동기화 실패하였습니다.'} 관리자에게 문의해주세요.</>)
                reject(request.resultMsg)
                setLoading(false)
            }
            resolve(request)
        
        }).then((res) => {
            const request = res as {menus:MenuListsType[]}
            const hasBeenMenus:any[] = JSON.parse(localStorage.getItem('menus') || '[]')
            localStorage.setItem('menus',JSON.stringify([
                //기존에 있던 카테고리들 업데이트
                ...(request.menus || []).filter((cate:MenuListsType) => hasBeenMenus.some((hasCate) => hasCate.categoryId === cate.categoryId))
                    .map((cate:MenuListsType) => ({
                        ...cate,
                        //위치정보빼고 업데이트
                        displayOrder: hasBeenMenus.find((hasCate) => hasCate.categoryId === cate.categoryId).displayOrder,
                        productList: [
                            //기존에 있던 상품들
                            ...(cate.productList || [])
                                .filter((item) => hasBeenMenus.find((hasCate) => hasCate.categoryId === cate.categoryId).productList.some((hasItem:MenuItemsType) => hasItem.productId === item.productId))
                                .map((item) => ({
                                    ...item,
                                    //위치정보와 배경색빼고 업데이트
                                    backgroundColor: hasBeenMenus.find((hasCate) => hasCate.categoryId === cate.categoryId).productList.find((hasItem:MenuItemsType) => hasItem.productId === item.productId).backgroundColor || backgroundColors.find((color) => (color.cateogryCardColor).replace('#','') === (cate.backgroundColor ||'').replace('#',''))?.menuCardColor,
                                    displayOrder: hasBeenMenus.find((hasCate) => hasCate.categoryId === cate.categoryId).productList.find((hasItem:MenuItemsType) => hasItem.productId === item.productId).displayOrder,
                                })),
                            //새로운 상품들은 뒤로 추가
                            ...(cate.productList || [])
                                .filter((item) => !hasBeenMenus.find((hasCate => hasCate.categoryId === cate.categoryId)).productList.some((hasItem:MenuItemsType) => hasItem.productId === item.productId))
                                .map((item, index) => ({
                                    ...item,
                                    //정해진 배경색으로 업데이트
                                    backgroundColor: backgroundColors.find((color) => (color.cateogryCardColor).replace('#','') === (cate.backgroundColor ||'').replace('#',''))?.menuCardColor,
                                    displayOrder: (cate.productList || [])
                                    .filter((item) => hasBeenMenus.find((hasCate) => hasCate.categoryId === cate.categoryId).productList.some((hasItem:MenuItemsType) => hasItem.productId === item.productId)).length + index + 1,
                                })),
                        ].sort((a,b) => a.displayOrder - b.displayOrder) //모든 상품들 다시한번 정렬
                    })),
                //새로운 카테고리들은 뒤로 추가
                ...request.menus.filter((cate:MenuListsType) => !hasBeenMenus.some((hasCate) => hasCate.categoryId === cate.categoryId))
                .map((cate:MenuListsType, index:number) => ({
                    ...cate,
                    displayOrder: hasBeenMenus.length + index + 1,
                    productList: (cate.productList || []).map((item, index) => ({
                        ...item,
                        //정해진 배경색으로 업데이트
                        backgroundColor: backgroundColors.find((color) => (color.cateogryCardColor).replace('#','') === (cate.backgroundColor ||'').replace('#',''))?.menuCardColor,
                    })).sort((a,b) => a.displayOrder - b.displayOrder) //모든 상품들 다시한번 정렬
                })),
            ].sort((a,b) => a.displayOrder - b.displayOrder))) //모든 카테고리들 다시한번 정렬
        
            let favorites = JSON.parse(localStorage.getItem('favorite') || '[]'), favoritesLists:MenuItemsType[] = []
            favorites.forEach((item:MenuItemsType) => {
                //동기화된 메뉴에 아직 즐겨찾기에 있는 상품들만 추가
                if((request.menus || []).some((cate:MenuListsType) => cate.productList.some((product:MenuItemsType) => product.productId === item.productId))) {
                    console.log((request.menus || []).find((cate:MenuListsType) => cate.productList.some((product:MenuItemsType) => product.productId === item.productId)))
                    favoritesLists.push({
                        ...(((request.menus || []).find((cate:MenuListsType) => cate.productList.some((product:MenuItemsType) => product.productId === item.productId))?.productList || []).find((product:MenuItemsType) => product.productId === item.productId) || item),
                        backgroundColor: item.backgroundColor || backgroundColors.find((color) => (color.cateogryCardColor).replace('#','') === ((request.menus || []).find((cate:MenuListsType) => cate.productList.some((product:MenuItemsType) => product.productId === item.productId))?.backgroundColor ||'').replace('#',''))?.menuCardColor,
                    })
                }
            })
            localStorage.setItem('favorite',JSON.stringify(favoritesLists.map((item,idx) => ({
                ...item,
                displayOrder: idx + 1,
            })) || []))

            //사유업데이트 시작
            getReason('order-cancel')
        }).catch((err) => {
            if(err === '허용되지 않은 접근입니다.') {
                setUser({
                    token: '',
                    loginId: '',
                    name: '',
                    brandName: '',
                    departmentStore: {
                        branchName: '',
                        brandName: '',
                        departmentStoreName: ''
                    }
                })
            }
            setStatus(<>{err}
            관리자에게 문의해주세요.</>)
        })
    }

    //주문데이터 동기화(판매내역, 일별 판매요약 접근시 실행)
    const syncOrder = async (callback:() => void) => {
        let allLists:orderDataType[] = []
        await indexedDb.createObjectStore(['ORDER_LIST']);
        Promise.all(times.map(async (item) => {
            //인덱스디비에서 오늘날짜의 주문데이터를 가져옴
            const lists = await indexedDb.getValue(
                'ORDER_LIST',
                `${dayjs().format('YYYYMMDD')}_${item < 10 ? `0${item}`:item}`
            ) || [];
            return lists
        })).then(async (res) => {
            //그중 주문번호가 없는 주문데이터만 추출
            allLists = res.flat().filter((order) => !order.orderId)
            let errors:orderDataType[] = []
            if(allLists.length > 0) {
                Promise.allSettled(allLists.map(async (list) => {
                    //주문데이터를 하나씩 서버로 전송
                    const request = await A2dApi.post('/api/v1/store/order/create', list)
                    //실패시 에러리스트에 추가
                    if(!request || request?.resultMsg) {
                        errors.push(list)
                        alert(list.orderTime+' 주문데이터가 전송되지 못했습니다.\n'+ request?.resultMsg)
                    }
                })).finally(async () => {
                    //모든 주문데이터를 전송하고 에러리스트가 있을경우 에러리스트를 서버로 전송
                    if(errors.length > 0 ) {
                        const request = await A2dApi.post('/api/v1/store/error', {
                            loginId: user.loginId,
                            selJson: JSON.stringify({
                                errorOrder: errors,
                                errorType: '주문오류'
                            })
                        })
                        if(request?.resultMsg) alert('에러내역이 전송되지 못했습니다.\n관리자에게 문의해주세요.')
                    }
                    //모든 주문데이터를 인덱스 디비에서 삭제
                    await indexedDb.deleteAllValue('ORDER_LIST')
                    
                    //콜백함수 실행
                    setTimeout(() => callback(),1000)
                })
                
            }
            callback()
        })

    }
    useEffect(() => {

        console.log(JSON.parse(Cookies.get('userSetting') || '{}'))
        if(!user.token && Cookies.get('accessToken') && Cookies.get('userSetting')) {
            //아톰에 저장된 토큰이 없으나, 쿠키에 아직 토큰이 있고 유저정보가 있을경우
            const userSetting = JSON.parse(Cookies.get('userSetting') || '{}')
            setUser(userSetting)
            setLoading(false)
        }else {
            setLoading(false)
        }
    //   eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.token])

    useEffect(() => {
        if(localStorage.getItem('syncDate')) {
            setSyncDate(localStorage.getItem('syncDate') || '')
        }
        //새벽두시에 자동으로 로그아웃
        if(dayjs().format('HH') === '02') {
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
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[displayType])

    useEffect(() => {
        //화면크기에 따른 px값 변경
        setPx(window.innerWidth/960)
        const changeWindowWidth = () => {
            setPx(window.innerWidth/960)
            if(window.innerWidth < window.innerHeight) {
                setLoading(true)
            }
        }
        window.onresize = changeWindowWidth
        window.addEventListener('resize',changeWindowWidth)
        window.addEventListener('orientationchange', changeWindowWidth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[loading])


    if(loading) return (
        <Loading />
    )

    // 로그인시
    if(user.token) {


        //상품판매
        if(displayType === 'MODE_SALES') return(
            <Sales displayType={displayType} setDisplayType={setDisplayType} setStatus={setStatus} />
        )

        //판매내역
        if(displayType === 'MODE_HISTORY') return(
            <History syncOrder={syncOrder} setDisplayType={(type:DISPLAY_MODE) => {
                if(type === 'MODE_CREATE_REPORT') setLastPage(displayType)
                setDisplayType(type)
            }} displayType={displayType} />
        )

        if(displayType === 'MODE_DAILY_SALESLIST') return(
            <DailySalesLists syncOrder={syncOrder} setDisplayType={(type:DISPLAY_MODE) => {
                if(type === 'MODE_CREATE_REPORT') setLastPage(displayType)
                setDisplayType(type)
            }} displayType={displayType} />
        )

        if(displayType === 'MODE_CREATE_REPORT') return(
            <Finish setDisplayType={setDisplayType} displayType={displayType} lastPage={lastPage} />
        )

        //메인화면
        return (
            <div className="flex justify-center flex-col items-center h-screen" style={{
                paddingBottom: 30 * px + 'px',
            }}>
                <Title>{
                    user?.departmentStore?.departmentStoreName === "HYUNDAI"? '현대'
                    : user?.departmentStore?.departmentStoreName === "SHINSEGAE"? '신세계'
                    : user?.departmentStore?.departmentStoreName === "LOTTE"? '롯데'
                    : user?.departmentStore?.departmentStoreName === 'GALLERIA'? '갤러리아'
                    : user?.departmentStore?.departmentStoreName
                } {user?.departmentStore?.branchName} &gt; {user?.brandName}</Title>
                <button className="absolute top-0 right-0 flex items-center  bg-no-repeat" style={{
                    backgroundImage: `url(${logout_icon})`,
                    backgroundSize: `${19 * px}px ${22 * px}px`,
                    backgroundPosition: '0 center',
                    height: `${52 * px}px`,
                    fontSize: `${12.5 * px}px`,
                    paddingLeft: `${26 * px}px`,
                    paddingRight: `${10 * px}px`,
                }} onClick={logout}>로그아웃</button>
                <div className="grid grid-cols-2" style={{
                    gridAutoColumns: '1fr',
                    gridAutoRows: '1fr',
                    gap: `${15 * px}px`,
                    width: `${435 * px}px`,
                }}>
                    {([['MODE_SALES','상품판매/폐기'],['MODE_HISTORY','판매내역/취소/마감'],['MODE_DAILY_SALESLIST','일자별 판매 요약']] as [string,string][]).map((item,index) => <button key={index} onClick={async () => {
                        setDisplayType(item[0] as DISPLAY_MODE)
                    }} 
                    className="aspect-[21/14] flex flex-col justify-center items-center bg-white border border-black rounded-md" style={{
                        fontSize: `${20 * px}px`,
                    }}>
                        {item[1]}
                    </button>)}
                    <button onClick={() => {
                        const callback = () =>window.location.reload()
                        sync(callback)
                    }} className="relative aspect-[21/14] flex flex-col justify-center items-center bg-white border border-black rounded-md" style={{
                        fontSize: `${20 * px}px`,
                    }}>
                            동기화
                            <span className="absolute left-0 w-full text-center  text-darkgray" style={{
                                fontSize: `${11 * px}px`,
                                bottom: `${15 * px}px`,
                            }}>{syncDate}</span>
                        <span className={`absolute top-full left-0 w-full text-[#f10000]`} style={{
                            marginTop: `${8 * px}px`,
                            fontSize: `${11 * px}px`,
                        }}>{status}</span>
                    </button>
                </div>
            </div>
        )
    } 


    // 로그아웃시 로그인 화면
    return (
        <Login sync={sync} setStatus={setStatus} status={status || ''} />
    )
}

const times = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

export const salesLayout = {
    rows: [0.5, 9.5],
    cols: [66.6666, 33.3334],
    menus: [1.5,6,2.5],
    orders: [1,6,2],
    options: [1.5,6.8,1.7],
    orderList: {
        cols: [6,4],
        list: [2,8],
        detail: [1.2,7.8,1],
    }
}

export const backgroundColors = [
    {
        cateogryCardColor: '#f5ce32',
        menuCardColor: '#fcf0c1',
        menuBackgroundColor: '#fef9e6',
    },{
        cateogryCardColor: '#e25c2d',
        menuCardColor: '#f6cec0',
        menuBackgroundColor: '#fbebe6',
    },{
        cateogryCardColor: '#b20000',
        menuCardColor: '#e8b2b2',
        menuBackgroundColor: '#f6e0e0',
    },{
        cateogryCardColor: '#d54891',
        menuCardColor: '#f2c8de',
        menuBackgroundColor: '#fae9f2',
    },{
        cateogryCardColor: '#70529f',
        menuCardColor: '#d4cbe2',
        menuBackgroundColor: '#eeeaf3',
    },{
        cateogryCardColor: '#1f3260',
        menuCardColor: '#bbc1cf',
        menuBackgroundColor: '#e4e6ec',
    },{
        cateogryCardColor: '#00429a',
        menuCardColor: '#b2c6e1',
        menuBackgroundColor: '#e0e8f3',
    },{
        cateogryCardColor: '#2084c7',
        menuCardColor: '#bcdaee',
        menuBackgroundColor: '#e4f0f8',
    },{
        cateogryCardColor: '#006934',
        menuCardColor: '#b2d2c2',
        menuBackgroundColor: '#e0ede7',
    },{
        cateogryCardColor: '#8bbc3c',
        menuCardColor: '#dcebc4',
        menuBackgroundColor: '#f1f7e7',
    },
]
