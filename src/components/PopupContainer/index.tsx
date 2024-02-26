

import Title from '../../components/Title'
import { ButtonArea } from '../../components/ButtonArea'
import { useEffect, useState } from 'react'

export default function PopupContainer({
    screenSize,
    title,
    children,
    onSubmit,
    onCancel,
    overflow = true
}:{
    screenSize: {
        width: number,
        height: number
    }
    title: string
    children: any
    onSubmit: () => void
    onCancel: () => void,
    overflow?: boolean
}) {
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
    }, [])
    return (
        <div className='relative flex flex-col justify-center items-center bg-bggray' style={{
            height: screenSize.height - (41 * px) + 'px'
        }}>
            <Title>{title}</Title>
            <div className={`border border-lightgray flex flex-col justify-center items-center ${overflow ? 'overflow-auto':''}`} style={{
                width: 540 * px + 'px',
                height: 400 * px + 'px'
            }}>
                {children}
            </div>
            <ButtonArea onCancel={onCancel} onSubmit={onSubmit} />
        </div>
  )
}
