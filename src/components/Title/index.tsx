
import { CSSProperties, useEffect, useState } from 'react'

export default function Title({children, style={}}:
  {
      children: any,
      style?: CSSProperties
  }) {
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
    }, [])
  return (
    <h3 className='font-bold text-center' style={{
        fontSize: 20 * px + 'px',
        paddingBottom: 18 * px + 'px',
        ...style
    }}>{children}</h3>
  )
}
