import { ReactNode, useEffect, useState } from 'react'
import { Button } from '../Button'

export function ButtonArea({
    className = '',
    onSubmit,
    submitText = '확인',
    onCancel,
    cancelText = '취소',
    size = 'md',
    cancelDisabled = false,
    submitDisabled = false
}: {
    className?: string,
    onSubmit?: () => void,
    onCancel?: () => void,
    submitText?: string | ReactNode,
    cancelText?: string | ReactNode,
    size?: 'sm' | 'md' | 'lg',
    cancelDisabled?: boolean
    submitDisabled?:boolean
}) {
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
    }, [])
  return (
    <div className={`flex mx-auto ${className}`} style={{
      width: 287.5 * px + 'px',
      gap: 7.5 * px + 'px',
      paddingTop: 12 * px + 'px',
    }}>
        {onCancel &&<Button size={size} disabled={cancelDisabled} className='w-full' onClick={onCancel}>{cancelText}</Button>}
        {onSubmit && <Button size={size} disabled={submitDisabled} buttonType='primary' className='w-full' onClick={onSubmit}>{submitText}</Button>}
    </div>
  )
}
