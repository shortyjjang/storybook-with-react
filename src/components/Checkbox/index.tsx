import { useEffect, useState } from 'react'
import checkon from '../../images/check_on.png'
import checkoff from '../../images/check_off.png'

export function Checkbox({
    checked,
    value,
    onChange,
    label,
    className = '',
    style={}
}:{
    checked: boolean,
    value?: string,
    onChange: (check:boolean) => void,
    label?: string,
    className?: string,
    style?: React.CSSProperties
}) {
  const [px, setPx] = useState<number>(1)
  useEffect(() => {
    setPx(window.innerWidth/960)
  }, [])
  return (
    <div className={`inline-flex gap-2 items-center ${className}`} style={{
      fontSize: 14 * px + 'px',
      ...style
    }} onClick={() => onChange(!checked)}>
        <input type="checkbox" readOnly checked={checked} value={value} className=" appearance-none border border-lightgray bg-white rounded-sm bg-no-repeat bg-center checked:bg-black" style={{
            backgroundImage: `url(${checked ? checkon : checkoff})`,
            backgroundSize: '63% auto',
            height: px * 24 + 'px',
            width: px * 24 + 'px',
        }}/>
        <label className={checked ?'text-black':' text-darkgray '}>{label}</label>
    </div>
  )
}