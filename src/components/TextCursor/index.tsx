import { CSSProperties, useEffect, useState } from 'react'

export function TextCursor({
    height = 14,
    style = {},
}:{
  height?: number,
  style?: CSSProperties
}) {
  const [px, setPx] = useState<number>(1)
  useEffect(() => {
    setPx(window.innerWidth/960)
  }, [])
  return (
    <div className='inline-block bg-black align-middle' style={{
        width: 1 * px + 'px',
        height: height * px + 'px',
        marginTop: -2 * px + 'px',
        animation: 'twinkling 0.5s infinite alternate',
        ...style
    }}></div>
  )
}
