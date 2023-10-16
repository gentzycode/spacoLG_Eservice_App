import Logo from '../assets/ansg_logo.png'
import AuthImg from '../assets/illustration.png'
import { AiFillHome } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

const AuthBanner = () => {

    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }

    return (
        <div className="w-full col-span-1 my-0 hidden md:flex items-center bg-[url('/assets/authBannerBg.png')] bg-cover">
            <div className="w-full flex justify-center items-center">
                <div className='space-y-2 md:space-y-4 p-4'>
                    <div className='w-full flex justify-center'>
                        <img src={Logo} alt="logo" width='150px' />
                    </div>
                    <div className="text-md md:text-2xl break-normal font-semibold leading-tight text-white text-center uppercase">
                        Welcome To E-Services
                    </div>
                    <div className="text-xl md:text-4xl break-normal font-extrabold leading-tight text-white text-center uppercase">
                        LGA PORTAL
                    </div>
                    <div 
                        className="w-full cursor-pointer"
                        onClick={() => goToHome()}
                    >
                        <div className='flex justify-center items-center space-x-2'>
                            <AiFillHome size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default AuthBanner
