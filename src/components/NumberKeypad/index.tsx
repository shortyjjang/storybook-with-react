import { useEffect, useState } from "react"
import  remove from '../../images/icon_remove.png'

export default function NumberKeypad({
    onClick,
    value,
    width = 200
}: {
    onClick: (value: number) => void
    value: number
    width?: number
}) {
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
    }, [])
  return (
    <div className='grid gap-px w-full grid-cols-3' style={{
        gridAutoRows: '1fr',
        gridAutoColumns: '1fr',
        width: width * px + 'px'
    }}>
        {([1,2,3,4,5,6,7,8,9,'00',0].map((item, index) => (<button className='aspect-[88/60] bg-lightgray' style={{
            fontSize: 20 * px  + 'px'
        }} key={index} onClick={(e) => {
            e.stopPropagation()
            onClick(Number(`${value}${item}`))
        }}>
            {item}
        </button>)))}
        <button className='aspect-[88/60] bg-lightgray' onClick={(e) => {
            e.stopPropagation()
            let deletedVal = Number(`${value}`.slice(0,-1))
            onClick(deletedVal)
        }}><span className='inline-block bg-no-repeat bg-center bg-contain align-middle' style={{
            backgroundImage: `url(${remove})`,
            width: 28.5 * px + 'px',
            height: 21.5 * px + 'px',
        }}></span></button>
    </div>
  )
}
