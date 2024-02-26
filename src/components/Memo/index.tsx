import { CSSProperties, useEffect, useState } from "react"
import Title from "../Title"
import { TextCursor } from "../TextCursor"
import {ButtonArea} from "../ButtonArea"
import Keyboard from "../Keyboard"


export function Memo({onSubmit, onCancel, style = {}, value = '', className = 'fixed w-full bottom-0 z-10'}:{
  onSubmit: (value: string) => void
  onCancel: () => void
  style?: CSSProperties
  value?: string
  className?: string
}) {
  const [content, setContent] = useState('')
  const [px, setPx] = useState<number>(1)
  useEffect(() => {
    setPx(window.innerWidth/960)
    setContent(value)
  },[value])
  return (
    <div className={` ${className} w-full bg-[#f7f7f9] flex flex-col justify-center items-center`} style={{
        ...style,
        paddingBottom: 265 * px + 'px',
    }}>
      <Title style={{
        paddingBottom: 8 * px + 'px',
      }}>특이 사항</Title>
      <div className='bg-white border border-lightgray' style={{
        width: 600 * px + 'px',
        height: 160 * px + 'px',
        padding:`${10 * px}px ${15 * px}px`,
        fontSize: 12.5 * px + 'px',
      }}>{content}<TextCursor height={12.5} />{!content && <span className='text-darkgray'>내용을 입력하세요.</span>}</div>
      <ButtonArea onSubmit={() => {
        onSubmit(content)
      }} onCancel={onCancel} />
      <Keyboard defaultValue={value} setValue={value => setContent(value)} />
    </div>
  )
}
