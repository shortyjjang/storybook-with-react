import { useEffect, useState } from 'react'

export function Button({
    size = 'md',
    type = 'button',
    className = '',
    disabled = false,
    onClick = () => {},
    children,
    buttonType = 'default',
    style={}
}:{
    size?: 'sm' | 'md' | 'lg' | 'xl',
    type?: 'button' | 'submit' | 'reset',
    className?: string
    disabled?: boolean
    onClick?: () => void,
    children?: React.ReactNode | string
    buttonType?: 'default' | 'primary' | 'secondary' | 'dimmend',
    style?: React.CSSProperties
}) {
  const [px, setPx] = useState<number>(1)
  useEffect(() => {
    setPx(window.innerWidth/960)
  }, [])
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`
        ${buttonType === 'primary' ? 'bg-black border-black text-white font-medium ' : 
          buttonType === 'dimmend' ? 'text-darkgray border-darkgray'
          :buttonType === 'secondary' ? 'text-white border-white'
          :'bg-white border-black text-black' }
        border
        ${size === 'sm' ? 'rounded-sm' :size === 'xl' ? 'rounded-lg' : 
        'rounded-md'
      }
        ${disabled ? 'text-opacity-40 border-opacity-40':''}
        ${className}
    `} style={{
      fontSize: (size === 'sm' ? 11 :size === 'xl' ? 17 : 14) * px + 'px',
      height: (size==='sm' ? 27.5 :size === 'md' ? 45 : size === 'lg'? 50 : 60) * px + 'px',
      padding: `0 ${size === 'sm' ? 0 :size === 'xl' ? 25 : size === 'lg'?15:10}px`,
      width: size === 'sm' ? (55 * px + 'px') : '',
      ...style
    }}>
        {children}
    </button>
  )
}
