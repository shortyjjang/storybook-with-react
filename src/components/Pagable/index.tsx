import { useEffect, useRef, useState } from 'react'
import arrow_l from '../../images/icon_arrow_l.png'

export function Pagable({scrollAlign = 'vertical', width :W,height:H, 
    children,
    touchable = false,
    rowsPerPage = -1,
    offset = [0,0],
    className = '',
    callback
}:{
    scrollAlign: 'vertical' | 'horizontal',
    width: number,
    height: number,
    children: any
    touchable?: boolean
    rowsPerPage?: number
    offset?: number[],
    className?: string,
    callback?: () => void,
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<null | number[]>(null);
    const [touchEnd, setTouchEnd] = useState<null | number[]>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [isNextable, setIsNextable] = useState<boolean>(false);
    const [isPrevable, setIsPrevable] = useState<boolean>(false);
    const [curentTop, setCurrentTop] = useState<number>(0);
    const movePage = (align: 'prev' | 'next') => {
        if(!scrollRef.current || !childrenRef.current) return;
        let pageSize = scrollAlign === 'vertical' ? height : width;
        let currentPosition = touchable ? (curentTop):(scrollAlign === 'vertical' ? scrollRef.current.scrollTop : scrollRef.current.scrollLeft);
        let nextPosition = align === 'prev' ? currentPosition - pageSize : currentPosition + pageSize;

        setIsPrevable(nextPosition > 0)
        setIsNextable(nextPosition < (scrollAlign === 'vertical' ? childrenRef.current.clientHeight : childrenRef.current.clientWidth) - (scrollAlign === 'vertical' ? height : width))
        if(!(nextPosition < (scrollAlign === 'vertical' ? childrenRef.current.clientHeight : childrenRef.current.clientWidth) - (scrollAlign === 'vertical' ? height : width)) && callback) callback();
        if(align === 'prev' && nextPosition < 0) nextPosition = 0;
        if(align === 'next' && nextPosition > (scrollAlign === 'vertical' ? childrenRef.current.clientHeight : childrenRef.current.clientWidth) - (scrollAlign === 'vertical' ? height : width)) nextPosition = (scrollAlign === 'vertical' ? childrenRef.current.clientHeight : childrenRef.current.clientWidth) - (scrollAlign === 'vertical' ? height : width);
        if(touchable) {
            setCurrentTop(nextPosition)
            return;
        }
        scrollRef.current.scrollTo({
            top: scrollAlign === 'vertical' ? nextPosition : 0,
            left: scrollAlign === 'vertical' ? nextPosition : 0,
        })
    }
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
        setPx(window.innerWidth/960)
        if(!scrollRef.current || !childrenRef.current) return;
        setWidth(W - ((scrollAlign === 'vertical' ? 30: 60) * px))
        setHeight(H)
        setIsNextable((scrollAlign === 'vertical' ? scrollRef.current?.clientHeight : scrollRef.current?.clientWidth) < (scrollAlign === 'vertical' ? (childrenRef?.current?.clientHeight || 0) : (childrenRef?.current?.clientWidth || 0)))
        const listner = () => {
            if(!scrollRef.current || !childrenRef.current) return;
            let scroll = scrollAlign === 'vertical' ? scrollRef.current.scrollTop : scrollRef.current.scrollLeft;
            // 다음 스크롤이 가능한지 여부 체크
            setIsPrevable(scroll > 1)
            setIsNextable(scroll + ((scrollAlign === 'vertical' ? height:width)) < (scrollAlign === 'vertical' ? childrenRef.current.clientHeight : childrenRef.current.clientWidth))
            if(!(scroll + ((scrollAlign === 'vertical' ? height:width)) < (scrollAlign === 'vertical' ? childrenRef.current.clientHeight : childrenRef.current.clientWidth)) && callback) callback();
        }
        scrollRef.current.addEventListener('scroll',  listner)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [H, W, children, childrenRef, height, px,scrollRef, rowsPerPage, children, scrollAlign, touchable, width])

    if(children) return (<div className={`relative ${className}`} style={{
        paddingRight: (scrollAlign === 'vertical' ? 30 * px: 60 * px) + 'px',
    }}>
        <div className={`relative w-full 
            ${touchable ? 'overflow-hidden': 'overflow-auto'}
        `} ref={scrollRef} style={{
            height: height > 0 ? height+'px':'auto',
            width: width > 0 ? width+'px':'auto',
        }} onTouchStart={(e) => {
            if(!touchable) return;
            let x = (e.touches[0].pageX - offset[0]),
                y = (e.touches[0].pageY - offset[1]);
            setTouchStart([x,y])
        }} onTouchMove={(e) => {
            if(!touchable) return;
            let x = (e.touches[0].pageX - offset[0]),
                y = (e.touches[0].pageY - offset[1]);
            setTouchEnd([x,y])
        }} onTouchCancel={(e) => {
            if(!touchable) return;
            setTouchStart(null)
            setTouchEnd(null)
        }} onTouchEnd={(e) => {
            if(!touchable) return;
            if(!touchStart) return;
            if(!touchEnd) return;
            let start = scrollAlign === 'vertical' ? touchStart[1] : touchStart[2];
            let end = scrollAlign === 'vertical' ? touchEnd[1] : touchEnd[2];
            if(end > start && end - start > 20*px) movePage('prev')
            else if(end < start && start - end > 20*px) movePage('next')
            setTouchStart(null)
            setTouchEnd(null)
        }}>
            <div ref={childrenRef} className={touchable ? 'absolute top-0 left-0 w-full':''} style={{
                top: touchable && scrollAlign === 'vertical' ? -curentTop + 'px' : 'auto',
                left: touchable && scrollAlign === 'horizontal' ? -curentTop + 'px' : 'auto',
            }}>
                {children}
            </div>
        </div>
        {/* 스크롤버튼 */}
        <button onClick={() => movePage('prev')} className={`
            absolute top-0 border-l border-lightgray bg-white flex justify-center items-center
            ${scrollAlign === 'vertical' ? 'h-1/2' : 'h-full border-b'} 
        `} style={{
            width: (30*px) + 'px',
            right: (scrollAlign === 'vertical' ? 0: 30) * px + 'px',
        }}><span className={`bg-no-repeat bg-center bg-contain ${scrollAlign === 'vertical' ? 'rotate-90' :''}
            ${!isPrevable ? 'opacity-20' : 'opacity-100'}
        `} style={{
            width: (12.5*px) + 'px',
            height: (13.5*px) + 'px',
            backgroundImage: `url(${arrow_l})`,
        }}></span></button>
        <button onClick={() => movePage('next')} className={
            `absolute bg-white right-0 border-l border-lightgray flex justify-center items-center
            ${scrollAlign === 'vertical' ? 'border-t top-1/2 h-1/2' : 'top-0 h-full border-b'}
        `} style={{
            width: (30*px) + 'px',
        }}><span className={`bg-no-repeat bg-center bg-contain ${scrollAlign === 'vertical' ? '-rotate-90' : 'rotate-180'}
            ${!isNextable? 'opacity-20' : 'opacity-100'}
        `} style={{
            width: (12.5*px) + 'px',
            height: (13.5*px) + 'px',
            backgroundImage: `url(${arrow_l})`,
        }}></span></button>
    </div>)
    return (<div></div>)
}
