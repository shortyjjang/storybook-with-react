import { useRecoilValue } from 'recoil'
import { screenPx } from '../atom/px'
import logo from '../images/logo.png'

export default function Loading() {
    const px = useRecoilValue(screenPx)
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center">
        <img src={logo} alt="atd.POS" className="mx-auto" style={{
            width: px * 158 + 'px',
            height: px * 29 + 'px',
        }}/>
    </div>
  )
}
