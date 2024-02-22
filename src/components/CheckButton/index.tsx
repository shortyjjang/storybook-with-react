import { useEffect, useState } from "react"

export default function CheckButton({
    onClick,
    children,
    selected,
    className = '',
    disabled = false
}:{
    onClick: () => void
    children: React.ReactNode
    selected: boolean
    className?: string
    disabled?: boolean
}) {
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
    }, [])
  return (
    <button disabled={disabled} onClick={onClick} className={`flex items-center ${selected ? ' text-black': ' text-darkgray'} ${className}`} style={{
      fontSize: 11 * px + 'px',
      height: 28 * px  + 'px',
      paddingLeft: 12.5 * px + 'px',
      paddingRight: 12.5 * px + 'px'
    }}>
        <span className={`border border-bordergray rounded-full ${selected ? 'bg-black': 'bg-white'}`} style={{
          width: 9 * px + 'px',
          height: 9 * px  + 'px',
          marginRight: 4 * px  + 'px'
        }}></span>
        {children}
    </button>
  )
}
