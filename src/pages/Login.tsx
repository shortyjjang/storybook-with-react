import { ReactNode, useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { userInfo } from "../atom/user"
import { screenPx } from "../atom/px"
import Cookies from "js-cookie"
import { A2dApi } from "../lib/api"
import logo from "../images/logo.png"
import dayjs from "dayjs"
import { TextCursor } from "../components/TextCursor"
import { Button } from "../components/Button"
import { Checkbox } from "../components/Checkbox"
import Keyboard from "../components/Keyboard"

export default function Login({
    sync,
    setStatus,
    status,
}:{
    sync: () => void
    status: string | ReactNode,
    setStatus: (value: string | ReactNode) => void
}) {
    const setUser = useSetRecoilState(userInfo)
    const [idSave, setIdSave] = useState<boolean>(false)
    const px = useRecoilValue(screenPx)
    const [showKeyPad, setShowKeyPad] = useState<boolean>(false)
    const [value, setValue] = useState({
        username: '',
        password: '',
    })
    const [focusValue, setFocusValue] = useState<'username' | 'password' | ''>('' as 'username' | 'password' | '')
    const loginSubmit = async () => {

        if(idSave) {
            Cookies.set('idSave',JSON.stringify({
                loginId: value.username,
                password: value.password,
            }))
        }
        const request :any = await A2dApi.post('/login-proc',value, false)
        if(!request || request?.resultMsg || !request?.token) return setStatus((request?.resultMsg || '로그인에 실패하였습니다.')+' 관리자에게 문의해주세요');
        

        if( !request.token) return;
        if(request.useAdminYn === 'Y') return setStatus('포스 계정만 접근이 가능합니다.')
        // 아톰에 유저정보 저장
        setUser(request)
        // 쿠키에 유저정보 저장(유효시간 다음날 새벽 2시까지)
        Cookies.set('userSetting',JSON.stringify(request), {expires: ((1/24)/60)/60  * dayjs(dayjs().add(1,'day').format('YYYY-MM-DD 02:00:00')).diff(dayjs(),'second')}) 
        Cookies.set('accessToken', request.token, {expires: ((1/24)/60)/60  * dayjs(dayjs().add(1,'day').format('YYYY-MM-DD 02:00:00')).diff(dayjs(),'second')})
        sync()
    }
    useEffect(() => {
        if(window.innerWidth < 960) {
            setStatus('모바일에서는 사용할 수 없습니다.')
        }
        if(Cookies.get('idSave')) {
            setIdSave(true)
            setValue({
                ...value,
                username: JSON.parse(Cookies.get('idSave') || '').loginId,
                password: JSON.parse(Cookies.get('idSave') || '').password,
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='flex w-full h-screen justify-center items-center max-w-full' style={{
            paddingBottom: showKeyPad ? 300 * px + 'px' : 0,
        }}>
            <form autoComplete="off" className='w-full'>
                <h1 style={{
                    marginBottom: 30 * px + 'px'
                }}>
                    <img src={logo} alt="atd.POS" className="mx-auto" style={{
                        width: px * 158 + 'px',
                        height: px * 29 + 'px',
                    }}/>
                </h1>
                <div className="bg-lightgray p-px flex flex-col gap-px w-full mx-auto" style={{
                    maxWidth: 400 * px + 'px'
                }}>
                    <span className='fixed top-0 left-0 w-full h-full' onClick={() => {
                        setFocusValue('')
                        setShowKeyPad(false)
                    }}></span>
                    <div className='w-full bg-white relative' onClick={(e) => {
                        e.stopPropagation()
                        setFocusValue('username')
                        setShowKeyPad(true)
                    }} style={{
                        padding: `${21.5 * px}px ${25 * px}px`,
                        fontSize: 20 * px + 'px',
                    }}>{value.username}{focusValue === 'username' && <TextCursor height={20} />}
                    {!value.username && <span className='text-darkgray'>아이디</span>}</div>
                    <div className='w-full bg-white relative' onClick={(e) => {
                        e.stopPropagation()
                        setFocusValue('password')
                        setShowKeyPad(true)
                    }}  style={{
                        padding: `${21.5 * px}px ${25 * px}px`,
                        fontSize: 20 * px + 'px',
                    }}>{value.password.split('').map(v => '*')}{focusValue === 'password' && <TextCursor height={20} />}
                    {!value.password && <span className='text-darkgray'>비밀번호</span>}</div>
                </div>
                <div className="text-center">
                    <p className="text-[#f10000] flex items-center justify-center" style={{
                        fontSize: 11 * px + 'px',
                        height: 31 * px + 'px',
                        marginBottom: 8 * px + 'px'
                    }}>{status}</p>
                    <Checkbox className='relative' checked={idSave} label="아이디/비밀번호 저장" onChange={() => setIdSave(!idSave)} />
                </div>
                <Button onClick={() => loginSubmit()} size='lg' buttonType="primary" disabled={!value.username || !value.password} className='block mx-auto w-full relative' style={{
                    maxWidth: 210 * px + 'px',
                    marginTop: 20 * px + 'px',
                }}>
                시작하기
                </Button>
            </form>
            {showKeyPad && focusValue && (['username','password']).map((item, index) => focusValue === item && <Keyboard key={index} defaultValue={item === 'username' ? value.username : value.password} defaultKeyboard='enNormal' setValue={(val) => {
                if(!item) return;
                setValue({
                    ...value,
                    [item]: val
                })
            }} enterTxt={'다음'} onEnter={() =>{
                if(item === 'username' && !value.password) {
                    setFocusValue('password')
                }
                else if(item === 'password' && value.username && value.password) {
                    setFocusValue('')
                    loginSubmit()
                    setShowKeyPad(false)
                }else {
                    setFocusValue('')
                    setShowKeyPad(false)
                }
            }} />)}
        </div>
    )
}