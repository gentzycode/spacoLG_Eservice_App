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
        <div className="w-full col-span-1 my-0 hidden md:flex items-center bg-[#0d544c]">
            <div className="space-y-2 md:space-y-8 md:pl-8 p-4 md:p-0">
                <div className='w-full flex justify-center'>
                    <img src={Logo} alt="logo" width='100px' /> 
                </div>
                <div className="w-full flex justify-center text-2xl text-white break-normal leading-tight font-semibold">
                    Welcome To LGA E-Services Portal
                </div>
                <div className='w-full flex justify-center'>
                    <img src={AuthImg} alt="logo"className='w-3/5 hidden md:block' /> 
                </div>
                <div className="w-full">
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
