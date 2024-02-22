import React, { useEffect, useState } from 'react'
import Hangul from 'hangul-js'

export default function Keyboard({setValue, className = '', enterTxt = 'enter', onEnter, defaultValue ='', defaultKeyboard = 'koNormal'}:{
    setValue: (value: string) => void
    className?: string,
    enterTxt?: string,
    onEnter?: () => void,
    defaultValue?: string,
    defaultKeyboard?: 'koNormal' | 'koShift' | 'enShift' | 'enNormal' | 'numberNormal' | 'numberShift',
}) {
    const [px, setPx] = useState<number>(1)
    useEffect(() => {
      setPx(window.innerWidth/960)
    }, [])
    const [originalText, setOriginalText] = React.useState<string>('')
    const [keyboardType, setKeyboardType] = React.useState<'koNormal' | 'koShift' | 'enShift' | 'enNormal' | 'numberNormal' | 'numberShift'>('koNormal')
    const [charList, setCharList] = React.useState<string[]>([])
    useEffect(() => {
        setOriginalText(defaultValue)
        setCharList(defaultValue.split(''))

        return () => {
            setOriginalText('')
            setCharList([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() => {
        setKeyboardType(defaultKeyboard)
    },[defaultKeyboard])
    return (
        <div className={`fixed bottom-0 left-0 w-full bg-[#f7f7f9] z-[1]`}>
        <div className={`grid ${className} bg-black bg-opacity-50`} style={{
            gridAutoRows: '1fr',
            gap: 5 * px + 'px',
            padding: `${10 * px}px 0`,
        }}>{
            (keyboardBtns[keyboardType] || []).map((row:string[], index:number) => <div key={index} className='flex justify-center' style={{
                gap: 5 * px + 'px',
            }}>
                {row.map((btn:string, index:number) => <button key={index} onClick={(e) => {
                    e.stopPropagation()
                    let chars = keyboardType.includes('ko') ? charList : (originalText || '').split('')
                    if(btn === 'shift') {
                        setKeyboardType(keyboardType === 'koNormal' ? 'koShift' : 
                        keyboardType === 'koShift' ?'koNormal':
                        keyboardType === 'enNormal' ? 'enShift' :
                        'enNormal')
                    } else if(btn === '한/영') {
                        setKeyboardType((keyboardType === 'enNormal' || keyboardType === 'enShift') ? 'koNormal' : 'enNormal')
                    } else if(btn === '123' || btn === '#+=') {
                        setKeyboardType(keyboardType === 'numberNormal' ? 'numberShift' : 'numberNormal')
                    } else if(btn === 'backspace') {
                        chars = chars.slice(0,charList.length-1)
                    } else if(btn === 'space') {
                        chars = [...chars, ' ']
                    } else if(btn === 'enter') {
                        if(onEnter) {
                            onEnter();
                            setKeyboardType('koNormal')
                            setCharList([])
                            return;
                        }
                        chars = [...chars, '\n']
                    } else {
                        chars = [...chars, btn]
                    } 
                    setCharList(chars)
                    setOriginalText(keyboardType.includes('ko') ? Hangul.assemble(chars): chars.join(''))
                    setValue(keyboardType.includes('ko') ? Hangul.assemble(chars): chars.join(''))
                }} style={{
                    fontSize: 17.5 * px + 'px',
                    height: 57.5 * px + 'px',
                    width: ((btn === 'shift' || btn === 'backspace') ? 89 : (btn === 'space' ? 245 : (btn === 'enter' ? 120 :57.5)))* px + 'px', 
                }} className={`
                    bg-[#3d3d3e] rounded-lg text-white
                    ${(btn === 'shift' || btn === 'backspace') ? '' : btn === 'space' ? '':'aspect-square'} `}>
                        {btn === 'shift' ? <span className='block bg-no-repeat bg-center bg-contain mx-auto' style={{
                            width: 16.5 * px + 'px',
                            height: 20 * px + 'px',
                            backgroundImage: `url('/images/icon_shift.png')`
                        }}></span> 
                        : btn === 'backspace' ? <span className='block bg-no-repeat bg-center bg-contain mx-auto' style={{
                            width: 28.5 * px + 'px',
                            height: 21.5 * px + 'px',
                            transform: `translateX(-${3 * px}px)`,
                            backgroundImage: `url('/images/icon_remove.png')`
                        }}></span>
                        : btn === '한/영' ? <span className='block bg-no-repeat bg-center bg-contain mx-auto' style={{
                            width: 23.5 * px + 'px',
                            height: 23.5 * px + 'px',
                            backgroundImage: `url('/images/icon_lang.png')`
                        }}></span> 
                        : btn === 'enter' ? enterTxt : btn}
                    </button>)}
            </div>)
        }</div>
        </div>
    )
}

const keyboardBtns = {
    koNormal : [
        ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
        ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ',],
        ['shift','ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ','backspace'],
        ['123','한/영',"space",'@','.', 'enter']
    ], 
    koShift : [
        ['ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅒ', 'ㅖ'],
        ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ', ],
        ['shift','ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ','backspace'],
        ['123','한/영',"space",'@','.', 'enter']
    ],
    enNormal : [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l',],
        ['shift','z','x','c','v','b','n','m','backspace'],
        ['123','한/영',"space",'@','.', 'enter']
    ],
    enShift : [
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L',],
        ['shift','Z','X','C','V','B','N','M','backspace'],
        ['123','한/영',"space",'@','.', 'enter']
    ],
    numberNormal: [
        ['1','2','3','4','5','6','7','8','9','0'],
        ['-','/',':',';','(',')','$','&'],
        [',','?','!','\'','"','backspace'],
        ['123','한/영',"space",'@','.', 'enter']
    ],
    numberShift: [
        ['!','@','#','$','%','^','&','*','(',')'],
        ['_','+','{','}','[',']','\\','|',],
        [',','?','!','\'','"','backspace'],
        ['#+=','한/영',"space",'@','.', 'enter']
    ]
}   