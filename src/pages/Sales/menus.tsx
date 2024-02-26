import { useRecoilState, useRecoilValue } from "recoil"
import { EdiorModeType, MenuItemsType, MenuListsType, OrderStepType } from "../../atom/type"
import { CartLists } from "../../atom/cart"
import { MenuLists } from "../../atom/menu"
import { backgroundColors } from "."
import { screenPx } from "../../atom/px"
import { useEffect } from "react"
import Editor from "./editor"
import Loading from "../Loading"
import favorite_on from "../../images/icon_favorite_on.png"
import favorite_off from "../../images/icon_favorite_off.png"
import check_on from "../../images/icon_check_on.png"
import check_off from "../../images/icon_check_off.png"

export default function Menus({
    favoriteMenus,
    editorMode,
    screenSize,
    setBackupLists,
    backupLists,
    setFavoriteMenus,
    setStep,
    setOptionInfo,
    fontSize,
    defaultColor,
    currentColor,
    setDefaultColor,
    currentCategory,
    setCurrentCategory
}:{
    favoriteMenus: MenuItemsType[],
    editorMode: EdiorModeType,
    screenSize: {
        width: number,
        height: number
    },
    setBackupLists: (lists:MenuListsType[]) => void,
    backupLists: MenuListsType[]
    setFavoriteMenus: (menus:MenuItemsType[]) => void,
    setStep: (step: OrderStepType) => void
    setOptionInfo: (optionInfo: MenuItemsType | null) => void
    fontSize: string
    defaultColor: string
    currentColor: string
    setDefaultColor: (color: string) => void
    currentCategory: number
    setCurrentCategory: (category: number) => void
}) {
    const menus = useRecoilValue(MenuLists)
    const [carts, setCarts] = useRecoilState(CartLists)
    const clickCategory = (item:MenuListsType) => {
        if(!item) return
        setCurrentCategory(item.categoryId)
        setDefaultColor(backgroundColors.find(cate => (cate.cateogryCardColor).replace('#','') === (item.backgroundColor || '').replace('#',''))?.menuCardColor || '')
    }
    const px = useRecoilValue(screenPx)

    //메뉴 클릭시
    const clickMenu = (item:MenuItemsType) => {
        if(!item || editorMode) return
        if((item.optionGroupList || []).length > 0) {
            setStep('SELECT_OPTION')
            setOptionInfo(item)
            return;
        }
        setCarts(
            carts.some((cart) => cart.storeProductId === item.storeProductId) ? carts.map(cart => cart.storeProductId === item.storeProductId ? ({
                ...cart,
                quantity: cart.quantity + 1
            }): cart) : [{
                "storeProductId": item.storeProductId,
                "storeProductName": item.storeProductName,
                "storeProductPrice": item.storeProductPrice,
                "productId": item.productId,
                "productName": item.productName,
                quantity: 1,
                discountPrice: 0,
                discountRate: 0,
                crnId: 0,
                discountDesc: '',
            },...carts,]
        )
    }

    function CategoryCard({
        item,
        className = '',
        wrapperStyle = {}
    } : {
        item: MenuListsType | null
        className?: string
        wrapperStyle?: any
    }) {
        return <div className={`grid ${editorMode === 'EDIT_DISPLAY_ORDER' ? 'transition-transform duration-300 ease-in-out':''} border-b border-r border-lightgray ${(currentCategory === item?.categoryId && item?.backgroundColor) ? 'text-white font-bold':'text-darkgray font-medium'}`} style={{
            backgroundColor: '#f7f7f9',
            fontSize: (fontSize === 'large' ? 14:12.5) * px + 'px',
            ...wrapperStyle
        }}>
            <div className={`
                flex items-center justify-center
                ${className}
            `} style={{
    
                backgroundColor: (currentCategory === item?.categoryId && item?.backgroundColor) ? `#${item.backgroundColor.replace('#','')}` : '#f7f7f9',
            }}>
            {item?.categoryName}
            </div>
        </div>
    }
    function MenuCard({
        item,
        className = '',
        cardColor = '',
        style={},
        wrapperStyle = {}
    } : {
        item: MenuItemsType | null
        className?: string,
        cardColor?: string,
        style?: any,
        wrapperStyle?: any
    }) {
        return <div className={`grid ${editorMode === 'EDIT_DISPLAY_ORDER' ? 'transition-transform duration-300 ease-in-out':''}`} style={{
            padding: `${2.5 * px}px`,
            ...wrapperStyle
        }}>
            {item?.storeProductName && <div className={`flex flex-col rounded-md justify-between
                ${className ? className :''}
            `} style={{
                padding: `${(fontSize === 'large'? 9: 10) * px}px ${10 * px}px`,
                backgroundColor: item?.backgroundColor ? `#${item.backgroundColor.replace('#','')}` : cardColor,
                ...style
            }}>
                <div className={`font-medium line-clamp-2`} style={{
                    lineHeight: 1.2,
                    fontSize: (fontSize === 'large' ? 16:14) * px + 'px',
                }}>{item?.storeProductName}</div>
                <div className={`text-deepdark`} style={{
                    fontSize: (fontSize === 'large' ? 12:11) * px + 'px',
                }}>{(item?.storeProductPrice || 0).toLocaleString()}원</div>
                {editorMode === 'EDIT_FAVORITE_MENU' && item !== null && <span className='absolute bg-no-repeat bg-contain bg-center' style={{
                    backgroundImage: `url(${item?.favoriteYn === 'Y' ? favorite_on : favorite_off})`,
                    bottom: 10 * px + 'px',
                    right: 10 * px + 'px',
                    width: 14 * px + 'px',
                    height: 13 * px + 'px',
                }} />}
                {editorMode === 'EDIT_BG_COLOR' && item !== null && <span className='absolute bg-no-repeat bg-contain bg-center' style={{
                    backgroundImage: `url(${item.backgroundColor === currentColor ? check_on : check_off})`,
                    bottom: 10 * px + 'px',
                    right: 10 * px + 'px',
                    width: 12.5 * px + 'px',
                    height: 10.5 * px + 'px',
                }} />}
            </div>}
        </div>
    }
    useEffect(() => {
        if(menus.length > 0 && currentCategory === 0) {
            setCurrentCategory(menus[0].categoryId)
            setDefaultColor(backgroundColors.find(cate => (cate.cateogryCardColor).replace('#','') === (menus[0].backgroundColor || '').replace('#',''))?.menuCardColor || '')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCategory, menus])
    if(screenSize.width > 0 && screenSize.height > 0 && menus.length > 0) return (
        <div className='grid' style={{
            width: screenSize.width * 0.666666 + 'px',
            gridTemplateRows: `${82 * px}px auto ${(((screenSize.height - ((41+82+20+31.5+17.5) * px)) * 0.2) + 17.5 + 31.5) * px}px`,
            height: screenSize.height - (41 * px) + 'px',
        }}>
            {/* //카테고리는 위치변경만 가능 */}
            <Editor currentCategory={currentCategory} setBackupLists={(lists:MenuListsType[]) => {
                if(!editorMode) return;
                setBackupLists(lists)
            }} itemNode={CategoryCard} onClick={clickCategory} offset={[0,(41 * px)]} menus={backupLists.length > 0 ? backupLists : menus || []} showScrollButton={true} cols={5} editorMode={
                //위치 변경 모드 외에는 일반모드
                editorMode === 'EDIT_DISPLAY_ORDER' ? 'EDIT_DISPLAY_ORDER': null
            } rows={2} width={(screenSize.width * 0.666666)} height={82 * px} scrollAlign="horizontal" />

            {/* //메뉴는 위치변경, 색상변경, 즐겨찾기 모드 */}
            <Editor currentColor={currentColor} defaultColor={defaultColor} favoriteMenus={favoriteMenus} style={{
                backgroundColor: 
                    backgroundColors.find((color) => color.cateogryCardColor === menus.find((cate) => cate.categoryId === currentCategory)?.backgroundColor)?.menuBackgroundColor || '',
                padding: `${10 * px}px ${42.5 * px}px ${10 * px}px ${12.5 * px}px`,
            }} cardColor={backgroundColors.find((color) => color.cateogryCardColor === menus.find((cate) => cate.categoryId === currentCategory)?.backgroundColor)?.menuCardColor} setBackupLists={(lists:MenuItemsType[]) => {
                if(menus.length === 0) return;
                if(!editorMode) return;

                //즐겨찾기 모드
                if(editorMode === 'EDIT_FAVORITE_MENU') {
                    let item = lists[0]
                    setFavoriteMenus(item.favoriteYn === 'Y' ? (
                        favoriteMenus.some((menu) => menu.storeProductId === item.storeProductId) ? favoriteMenus.sort((a,b) => a.displayOrder - b.displayOrder).map((menu, index) => ({
                            ...menu,
                            displayOrder: index + 1
                        })) : [...favoriteMenus, {
                            ...item,
                            displayOrder: favoriteMenus.length + 1
                        }]
                    ) :
                        favoriteMenus.filter((menu) => menu.storeProductId !== item.storeProductId).sort((a,b) => a.displayOrder - b.displayOrder).map((menu, index) => ({
                            ...menu,
                            displayOrder: index + 1
                        }))
                    )
                    return;
                }

                //위치변경 모드, 색상모드 백업본 저장
                setBackupLists(
                    (backupLists.length > 0 ? backupLists : menus).map((cate:MenuListsType) => {
                        if(cate.categoryId === currentCategory) {
                            return {
                                ...cate,
                                productList: lists
                            }
                        }
                        return cate
                    })
                )
                if(editorMode === 'EDIT_BG_COLOR') {
                    setFavoriteMenus(
                        favoriteMenus.filter(menu => menu !== null).map((menu) => lists.some((backupMenu) => backupMenu !== null && backupMenu.storeProductId === menu.storeProductId) ? ({
                            ...(lists.find((backupMenu) => backupMenu.storeProductId === menu.storeProductId) || menu),
                            displayOrder: menu.displayOrder
                        }) : menu)
                    )
                }
            }} itemNode={MenuCard} onClick={clickMenu} offset={[0,((41+82) * px)]} menus={currentCategory 
                ? (backupLists.length > 0 ? backupLists : menus).find(category => category.categoryId === currentCategory)?.productList || [] 
                : []
            } cols={5} editorMode={editorMode} rows={4} width={screenSize.width * 0.666666 - (25 * px)} height={
                ((screenSize.height - ((41+82+20+31.5+17.5) * px)) * 0.8)
            } scrollAlign="vertical" />
            <div className='border-t border-lightgray' style={{
                padding: `${2.5 * px}px ${12.5 * px}px 0`,
            }}>
                <h3 className='flex items-center font-medium' style={{
                    fontSize: 12.5 * px + 'px',
                    height: 31.5 * px + 'px',
                }}>즐겨찾기</h3>
                <Editor favoriteMenus={favoriteMenus} setBackupLists={(lists:any[]) => {
                    if(!editorMode || editorMode !== 'EDIT_FAVORITE_MENU') return;
                    let favoriteYn = lists[0].favoriteYn === 'Y'
                    setFavoriteMenus(favoriteYn ? [...favoriteMenus, lists[0]] : favoriteMenus.filter((menu) => menu.storeProductId !== lists[0].storeProductId))
                }} itemNode={MenuCard} onClick={clickMenu} offset={[(12.5 * px), (screenSize.height - ((screenSize.height - ((41+82+20+31.5+17.5) * px)) * 0.2) - 15) * px]} 
                menus={favoriteMenus.filter((menu => menu !== null)) || []} cols={5} editorMode={editorMode !== 'EDIT_FAVORITE_MENU'? null: editorMode} rows={1} 
                width={(screenSize.width * 0.666666) - (25 * px)} 
                showScrollButton={false} height={((screenSize.height - ((41+82+20+31.5+17.5) * px)) * 0.2)} scrollAlign="horizontal" />
            </div>
        </div>
    )
    return <Loading />
}