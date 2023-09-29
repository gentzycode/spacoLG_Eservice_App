import Logo from '../../assets/ansg_logo.png'
import { useNavigate } from 'react-router-dom'
import DashboardButton from '../../common/DashboardButton';

const Landing = () => {

    const navigate = useNavigate();

    const goToAuthentication = () => {
        navigate('/auth');
    }

    const goToSrvice = () => {
        navigate('/services');
    }

    return (
        <div className="w-full md:h-screen grid md:flex md:justify-between px-6 md:px-12 m-0 bg-[#02380c]">
            <div className="w-full md:w-[50%] my-8 flex items-center">
                <div className="space-y-6 md:space-y-8">
                    {localStorage.getItem('isLoggedIn') && 
                        <DashboardButton />
                    }
                    <div className='flex justify-center md:justify-start'>
                        <img src={Logo} alt="logo" width='120px' /> 
                    </div>
                    <div className="text-xl md:text-4xl break-normal leading-tight font-semibold text-white text-center md:text-left">
                        Anambra LGA E-Services Solution
                    </div>
                    <div className="text-md md:text-xl text-center md:text-left break-normal text-white">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem repellat asperiores odit, maiores, laboriosam excepturi libero blanditiis, sequi enim cumque quidem vero ea ipsa! Quisquam labore repellendus dolorem quam doloremque!</p>
                    </div>
                    <div className='w-full flex justify-center md:justify-start'>
                        <button className='p-3 w-1/2 md:w-1/3 rounded-full bg-white hover:bg-green-100 text-lg font-medium text-green-950'>
                            Get Started
                        </button>
                    </div> 
                </div>  
            </div>
            <div className="grow my-0 md:my-8 items-center">
                <div className='w-full md:px-12'>
                    <div className="w-full md:w-[80%] my-8 md:mt-32 p-8 rounded-xl bg-gradient-to-r from-gray-100 from-20% via-gray-200 via-30% to-gray-100 to-80%">
                        <div className='text-3xl md:text-4xl text-[#0d544c] font-light text-center'>What You Can Do</div>
                        {/**<div className='text-gray-700 font-medium mt-1 uppercase text-center'>With this E-Services solution</div>*/}
                        <div className='w-full mb-6 space-y-4 md:space-y-4'>
                            
                            <div>
                                <button 
                                    className='w-full p-4  bg-gray-600 rounded-xl from-gray-400 from-20% via-gray-500 via-30% to-gray-600 to-80% !mt-6 border-0 uppercase text-white font-bold'
                                    onClick={() => goToSrvice()}
                                >
                                    Request for a Service
                                </button>
                            </div>

                            <div>
                                <button 
                                    className='w-full p-4  bg-gray-600 rounded-xl from-gray-400 from-20% via-gray-500 via-30% to-gray-600 to-80% !mt-6 border-0 uppercase text-white font-bold'
                                    onClick={() => goToAuthentication()}                                
                                >
                                    Manage your Requests
                                </button>
                            </div>
                            
                            <div>
                                <button className='w-full p-4  bg-gray-600 rounded-xl from-gray-400 from-20% via-gray-500 via-30% to-gray-600 to-80% !mt-6 border-0 uppercase text-white font-bold'>
                                    Check your Request status
                                </button>
                            </div>
                            
                        </div>
                        <div className='text-lg text-gray-500 mt-3 text-center'>Click on any of the options above to proceed</div>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default Landing
