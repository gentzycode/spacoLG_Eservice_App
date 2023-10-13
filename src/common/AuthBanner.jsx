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
        <div className="w-full col-span-1 my-0 hidden md:flex items-center bg-[url('https://uc5e67b35f7962c90fab7fedba2f.previews.dropboxusercontent.com/p/thumb/ACCMYwzb0WDfn-ZOE1eWk7aKMCYKEkJawDT1CH54y_AkrB5UFuY0VlHk3_0_-SzZtsJAgsmAGlNkayqQ0vWGDZ1IxuPZrpk0qu17ng-c7TUErVv13idHUvbp3TFUgiMM6xiP0A15ve-V9vv6mfH1WxLFZn3H-9KFGqm095PXCXSJhPlaMtoVPAaPBSgAs5AV8Hyif2Q7vtrbqGZfHxAbtz5VXmcgSCwER4EyPiBw8MRuZM6rT8k-ofAW-459riPlEadkX8fr5lpBaqsJ1L4Cv7p9DkNpxYOri8F8z6Kc6luKG9kkuTMpHNqVmWaS0jbqKRK-yazw6cc16czIzfVyt13oPh4unWVEVdJdX0ncTm_VuxNyUkUhiLN9WUkpze4M4pE/p.png')] bg-cover">
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
