import { CSSProperties, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { EdiorModeType } from '../../atom/type';
import { screenPx } from '../../atom/px';
import arrow_l from '../../images/icon_arrow_l.png';

export default function Editor({menus, cols, rows, scrollAlign = 'vertical', width:W,height:H, editorMode, offset,
    cardColor,
    itemNode: ItemNode,
    onClick,
    setBackupLists,
    showScrollButton = true,
    style = {},
    currentCategory,
    favoriteMenus,
    currentColor,
    defaultColor,
}:{
    menus: any[],
    cols: number,
    rows: number,
    scrollAlign: 'vertical' | 'horizontal',
    width: number,
    height: number,
    editorMode: EdiorModeType,
    offset: number[],//[x,y]
    itemNode: any,
    cardColor?: string,
    onClick: (value:any) => void
    setBackupLists?: (value:any[]) => void
    showScrollButton?: boolean
    style?: CSSProperties
    currentCategory?: number,
    favoriteMenus?: any[]
    currentColor?: string,
    defaultColor?: string,
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [lists, setLists] = useState<any[]>([]);
    const [rotation, setRotation] = useState<boolean>(false);
    const [touchStart, setTouchStart] = useState<null | number[]>(null);
    const [touchEnd, setTouchEnd] = useState<null | number[]>(null);
    const [dragCell, setDragCell] = useState<null | number>(null); // 드래그 중인 셀 번호
    const [dropCell, setDropCell] = useState<null | number>(null);
    const [blockPaging, setBlockPaging] = useState<boolean>(false);
    const px = useRecoilValue(screenPx)
    const movePage = (align: 'prev' | 'next') => {
        if(!scrollRef.current || !listRef.current) return;
        let next = align === 'prev' ? (currentPage - 1 > -1 ? currentPage - 1: 0)
        : (currentPage + 1 < Math.floor((menus.length / (cols * rows))) ? currentPage + 1: Math.floor((menus.length / (cols * rows))));
        let nextPosition = (next) * (scrollAlign === 'vertical' ? scrollRef.current.clientHeight : scrollRef.current.clientWidth);
        listRef.current.style.top = -(scrollAlign === 'vertical' ? nextPosition: 0) + 'px';
        listRef.current.style.left = -(scrollAlign === 'vertical' ? 0 : nextPosition) + 'px';
        setCurrentPage(next);
    };
    useEffect(() => {
        if(!menus) return;
        if(!editorMode && lists.length > 0 && menus === lists.filter(item => item)) return;
        if(menus.length === 0) return setLists([]);

        setWidth(showScrollButton ? W - ((scrollAlign === 'vertical' ? 30 :60) * px) :W);
        setHeight(H);

        let _menus = [...menus];
        //빈칸에 빈칸을 채워넣기
        let emptyCell = (_menus.length / (cols * rows) === Number((_menus.length / (cols * rows)).toFixed(0))) ? 0 : Math.floor((cols * rows) - (_menus.length % (cols * rows)));
        
        for(let i = 0; i < emptyCell; i++) {
            _menus.push(null);
        }
        setLists(_menus || [])
        setTouchEnd(null);
        setTouchStart(null);
        setDragCell(null);
        setDropCell(null);
        setBlockPaging(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [H, W, cols, menus, rows, showScrollButton, editorMode, lists.length])
    useEffect(() => {
        if(editorMode) return;
        setCurrentPage(0);
        movePage('prev');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menus])
    useEffect(() => {
        setRotation(window.matchMedia('(orientation: portrait) and (pointer:coarse)').matches);
        window.addEventListener("orientationchange", () => {
            setRotation(window.matchMedia('(orientation: portrait) and (pointer:coarse)').matches);
        })
    },[])
    if(lists.length > 0) return (<><div className='relative' style={{
        paddingRight: (showScrollButton ? (scrollAlign === 'vertical' ? 30 * px: 60 * px) : 0) + 'px',
        ...style
    }}>
        <div className='relative w-full overflow-hidden' ref={scrollRef} style={{
            height: height+'px',
            width: width+'px',
        }} onTouchStart={(e) => {
            let x = rotation ? -(e.touches[0].pageY - offset[1]): (e.touches[0].pageX - offset[0]),
                y = rotation ? (e.touches[0].pageX - offset[0]): (e.touches[0].pageY - offset[1]);
            setTouchStart([x,y])
            if(!editorMode) return;
            if(editorMode === 'EDIT_DISPLAY_ORDER' && dragCell === null) {
                let currentCol = Math.floor( x/width *100 / (100 / cols)) + (Math.floor(y/height *100 / (100 / rows))) * cols
                + (currentPage * cols * rows);
                setDragCell(currentCol)
            }
        }} onTouchCancel={(e) => {
            setTouchStart(null)
            setTouchEnd(null)
        }}
        onTouchMove={(e) => {
            let x = rotation ? -(e.touches[0].pageY - offset[1]): (e.touches[0].pageX - offset[0]),
                y = rotation ? (e.touches[0].pageX - offset[0]): (e.touches[0].pageY - offset[1]);
            setTouchEnd([x,y])
            if(!editorMode) return;
            if(editorMode === 'EDIT_DISPLAY_ORDER' && dragCell !== null) {
                let topPercent = y/height *100;
                let leftPercent = x/width *100;
                if(menus.length > cols * rows) {
                    if((scrollAlign ==='vertical' ? topPercent : leftPercent) < 5 && !blockPaging) {
                        setBlockPaging(true);
                        movePage('prev');
                        setTimeout(() => setBlockPaging(false), 1000)
                    }
                    if((scrollAlign ==='vertical' ? topPercent : leftPercent) > 95 && !blockPaging) {
                        setBlockPaging(true);
                        movePage('next');
                        setTimeout(() => setBlockPaging(false), 1000)
                    }
                }
                let currentCol = Math.floor( leftPercent / (100 / cols)) + (Math.floor(topPercent / (100 / rows))) * cols
                + (currentPage * cols * rows);
                setDropCell(currentCol)
            }
        }}
        onTouchEnd={() => {
            if(editorMode === 'EDIT_DISPLAY_ORDER') {
                if(dragCell !== null && dropCell !== null && dragCell !== dropCell) {
                    let _lists = [...lists.filter(list => list !== null && (list.storeProductName || list.categoryName)),];
                    let dragItem = _lists[dragCell];
                    _lists.splice(dragCell, 1);
                    if(dropCell > menus.length) _lists = [..._lists, dragItem, ...lists.filter(list => list === null)];
                    else _lists.splice(dropCell, 0, dragItem);
                    setLists(_lists);
                    setBackupLists && setBackupLists(_lists.filter((item) => item !== null).map((item, idx) => ({
                        ...item,
                        displayOrder: idx + 1
                    })));
                }
                setDragCell(null);
                setDropCell(null);
                return;
            }
            if(!touchStart || !touchEnd) return;
            if( menus.length > cols * rows) {
                let start = scrollAlign === 'vertical' ? touchStart[1] : touchStart[0];
                let end = scrollAlign === 'vertical' ? touchEnd[1] : touchEnd[0];
                if(end > start && end - start > 20 * px) movePage('prev')
                else if(end < start && start - end > 20 * px) movePage('next')
                setTouchStart(null);
                setTouchEnd(null);
            }
        }}>
            <div className={`absolute grid grid-cols-5 top-0 left-0 ${scrollAlign === 'vertical' ? '' : 'flex'}`} style={{
                width: scrollAlign === 'vertical' ?  width + 'px': (lists.length / (cols * rows)) * width + 'px',
                height: scrollAlign === 'vertical' ?  (lists.length / (cols * rows)) * height + 'px': height + 'px',
                gridAutoColumns: '1fr',
                gridAutoRows: '1fr',
            }} ref={listRef}>
                {lists.map((item, idx) => (
                    <div key={idx} className={`grid transition-all duration-300 ease-in-out
                        relative
                    `} onClick={() => {
                        if(!item) return;
                        if(editorMode === 'EDIT_FAVORITE_MENU') {
                            let _lists = [...lists];
                            if(!(favoriteMenus ||[]).some((menu) => menu.storeProductId === _lists[idx]?.storeProductId) && (favoriteMenus || []).length >= 5) return
                            _lists[idx] = {..._lists[idx], favoriteYn: (favoriteMenus ||[]).some((menu) => menu.storeProductId === _lists[idx]?.storeProductId) ? 'N' : 'Y'}
                            setLists(_lists)
                            setBackupLists && setBackupLists([_lists[idx]]);
                            return;
                        }
                        if(editorMode === 'EDIT_BG_COLOR') {
                            let _lists = [...lists];
                            _lists[idx] = {..._lists[idx], backgroundColor: _lists[idx].backgroundColor === currentColor ? defaultColor : currentColor}
                            item = _lists[idx];
                            setLists(_lists)
                            setBackupLists && setBackupLists(_lists.filter((item) => item !== null));
                        }
                        onClick(item)
                    }} style={scrollAlign === 'horizontal' ? {
                        gridColumnStart: (Math.floor(idx/(cols * rows)) * cols) + (idx%cols + 1),
                        gridRowStart: (Math.floor(idx/cols)%rows) + 1,
                    }:{}}>
                        <ItemNode currentCategory={currentCategory} editorMode={editorMode} item={{
                            ...item,
                            favoriteYn: (favoriteMenus ||[]).some((menu) => menu.storeProductId === lists[idx]?.storeProductId) ? 'Y' : 'N',
                            backgroundColor: item?.backgroundColor || defaultColor,
                        }} cardColor={cardColor || ''} style={{
                            backgroundColor: item?.backgroundColor || defaultColor,
                        }}
                        wrapperStyle={{
                            transform: `translateX(
                                ${dragCell !== null && dropCell !== null ?`
                                    ${idx%cols === 0 ? (
                                        dragCell < dropCell ? `${dropCell >= idx && dragCell < idx ? `${(cols-1)*100}%`: '0'}`
                                        : dragCell > dropCell ? `${dropCell < idx && dragCell >= idx ? '100%' : '0'}`
                                        :0
                                    )
                                    : (idx%cols === cols-1) ? (
                                        dragCell < dropCell ? `${dropCell >= idx && dragCell < idx? `-100%`: '0'}`
                                        : dragCell > dropCell ? `${dropCell < idx && dragCell >= idx ? `${(cols-1)*-100}%` : '0'}`
                                        :0
                                    )
                                    : (
                                        dragCell < dropCell ? `${dropCell >= idx && dragCell < idx? `-100%`: '0'}`
                                        : dragCell > dropCell ? `${dropCell <= idx && dragCell >= idx ? '100%' : '0'}`
                                        :0
                                    )}
                                `:0}
                            ) translateY(
                                ${dragCell !== null && dropCell !== null ?`
                                    ${idx%cols === 0 ? (
                                        dragCell < dropCell ? `${dropCell >= idx && dragCell < idx ? `-100%`: '0'}`
                                        : dragCell > dropCell ? `${dropCell < idx && dragCell >= idx ? '0' : '0'}`
                                        :0
                                    )
                                    : (idx%cols === cols-1) ? (
                                        dragCell < dropCell ? `${dropCell >= idx && dragCell < idx? `0`: ''}`
                                        : dragCell > dropCell ? `${dropCell < idx && dragCell >= idx ? `100%` : '0'}`
                                        :0
                                    )
                                    : (
                                        dragCell < dropCell ? `${dropCell >= idx && dragCell < idx? `0`: '0'}`
                                        : dragCell > dropCell ? `${dropCell < idx && dragCell >= idx ? '0' : '0'}`
                                        :0
                                    )}
                                `:0}
                            )`
                        }} className={`
                            transition-transform duration-300 ease-in-out
                            ${dragCell !== null && dragCell === idx ? 'opacity-0' : ''}
                            // ((
                            // dragCell  !== null && dropCell !== null &&  dropCell <= idx && Math.floor(dropCell/cols) === Math.floor(idx/cols)) ? (dropCell%cols < idx%cols ? 'translate-x-full' : '-translate-x-full') 
                            // : ((dragCell  !== null && dropCell !== null &&  dropCell >= idx &&  Math.floor(dropCell/cols) === Math.floor(idx/cols)) ? (dropCell%cols < idx%cols ? '' : '-translate-x-full') : ''))}
                        `} />
                    </div>
                ))}
            </div>
        </div>


        {/* 드래그하는 셀 움직이는 셀 카피 */}
       {editorMode === 'EDIT_DISPLAY_ORDER' && dragCell !== null && dropCell !== null && <div className={`absolute grid top-0 left-0 -translate-x-1/2 -translate-y-1/2`} style={{
            top: touchEnd ? touchEnd[1] + 'px' : '0px',
            left: touchEnd ? touchEnd[0] + 'px' : '0px',
            width: width / cols +'px',
            height: height / rows +'px',
        }}>
            <ItemNode item={lists[dragCell]}  />
        </div>}

        {/* 스크롤버튼 */}
        {showScrollButton && <button onClick={() => movePage('prev')} style={{
            width: 30 * px + 'px',
            right: (scrollAlign === 'vertical' ? 0 : 30) * px + 'px',
        }} className={`
            absolute top-0  border-lightgray bg-white flex justify-center items-center
            ${scrollAlign === 'vertical' ? 'h-1/2 border-l' : 'h-full border-b'} 
        `}><span className={`bg-no-repeat bg-center bg-contain ${scrollAlign === 'vertical' ? 'rotate-90' :''}
        ${currentPage < 1 ? 'opacity-20' : 'opacity-100'}`} style={{
            backgroundImage: `url(${arrow_l})`,
            width: 12.5 * px + 'px',
            height: 13.5 * px + 'px',
        }}></span></button>}
        {showScrollButton && <button onClick={() => movePage('next')} className={
            `absolute bg-white right-0 border-l border-lightgray flex justify-center items-center
            ${scrollAlign === 'vertical' ? 'border-t top-1/2 h-1/2' : 'top-0 h-full border-b'}
        `} style={{
            width: 30 * px + 'px',
        }}><span className={`bg-no-repeat bg-center bg-contain ${scrollAlign === 'vertical' ? '-rotate-90' : 'rotate-180'}
        ${currentPage === Math.floor((menus.length)/(cols * rows))? 'opacity-20' : 'opacity-100'}`} style={{
            backgroundImage: `url(${arrow_l})`,
            width: 12.5 * px + 'px',
            height: 13.5 * px + 'px',
        }}></span></button>}
    </div>
    </>)
    return (<div></div>)
}

// ${dragCell !== null && dropCell !== null ? `


// ${Math.floor(dropCell/cols) === Math.floor(idx/cols) ? //드래그와 같은 줄
// `
//     ${dropCell%cols <= idx%cols ? //드래그가 앞에 있을 때
//         (dragCell !== null && Math.floor(dragCell/cols) === Math.floor(idx/cols) ?`
//             ${dragCell < idx && dropCell < idx ? `
//                 translate-x-0
//             `: dragCell < idx ? `
//                 ${dragCell < dropCell && idx < dropCell ? `-translate-x-[200%]` : '-translate-x-full'}
//             ` : `
//                 translate-x-full
//             `}
//         ` : `translate-x-full`)
//     :''}
// `: ''
// }
// `:''}