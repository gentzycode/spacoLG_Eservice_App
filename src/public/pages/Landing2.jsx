import React from 'react'
import Logo from '../../assets/ansg_logo.png'
import { useNavigate } from 'react-router-dom';
import birth from '../../assets/services/Mother.png'
import death from '../../assets/services/Death.png'
import lgID from '../../assets/services/Student_card.png'
import club from '../../assets/services/Community.png'
import waste from '../../assets/services/Recycle_bin.png'
import streetReg from '../../assets/services/Signboard.png'
import PublicLinks from '../../common/PublicLinks';
//import Banner from '../../assets/landingBanner.png'

const Landing2 = () => {

    const navigate = useNavigate();

    const goToAuthentication = () => {
        navigate('/auth');
    }

    const goToSrvice = () => {
        navigate('/services');
    }

    const goToStatuscheck = () => {
        navigate('/status-check')
    }

    return (
        <div>
            <PublicLinks />
            <div className='w-full grid px-0 m-0'>
                <div className={`w-full bg-[#0d544c] md:bg-[url('/assets/landingBanner.png')] bg-cover px-6 md:px-12 py-12`}>
                    <div className="w-full space-y-4">
                        <div className='flex justify-center'>
                            <img src={Logo} alt="logo" width='120px' /> 
                        </div>
                        <div className="text-md md:text-2xl break-normal font-semibold leading-tight text-white text-center uppercase">
                            Local Government E-Services Solution
                        </div>
                        <div className="text-xl md:text-4xl break-normal font-extrabold leading-tight text-white text-center uppercase">
                            LGA PORTAL
                        </div>
                    </div>  
                </div>
                <div className='w-full'>
                    <div className='w-full justify-center pb-12'>
                        <div className='w-full flex justify-center text-2xl font-bold pt-6 mt-12 border-[#0d544c]'>
                            <span className='py-3 uppercase'>What you can do</span>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='w-[50px] border-b-4 border-[#0d544c]'></div>
                        </div>
                        <div className='w-full md:flex md:justify-center space-x-0 md:space-x-8 px-6 space-y-12 md:space-y-0  my-12 md:mb-0'>
                            <div className='w-full md:w-1/4 mb-6 bg-[#f4f7f4] rounded-md p-8'>
                                <h1 className='text-2xl mb-4 font-semibold text-center text-gray-800'>Request for a Service</h1>
                                <p className='text-gray-500 mb-6 text-center'>You can apply for any of the e-services available on this platform ranging from Birth Certificate, Marriage Registration, Local Government Identification etc. </p>
                                <div className='w-full flex justify-center'>
                                    <button
                                        className='w-[150px] py-3 bg-[#0d544c] rounded-md text-white font-medium shadow-xl'
                                        onClick={() => goToSrvice()}
                                    >
                                        Click here
                                    </button>
                                </div>
                            </div>

                            <div className='w-full md:w-1/4 h-min mb-6 bg-[#f4f7f4] rounded-md p-8'>
                                <h1 className='text-2xl mb-4 font-semibold text-center text-gray-800'>Manage your Requests</h1>
                                <p className='text-gray-500 mb-6 text-center'>You can register and login to your account to manage your applications, payments, invoices, certificates etc. as well as track your requests real-time </p>
                                <div className='w-full flex justify-center'>
                                    <button
                                        className='w-[150px] py-3 bg-[#e5c55b] rounded-md font-medium shadow-xl'
                                        onClick={() => goToAuthentication()}
                                    >
                                        Click here
                                    </button>
                                </div>
                            </div>

                            <div className='w-full md:w-1/4 h-min mb-6 bg-[#f4f7f4] rounded-md p-8'>
                                <h1 className='text-2xl mb-4 font-semibold text-center text-gray-800'>Check your Request Status</h1>
                                <p className='text-gray-500 mb-6 text-center'>You can check the status of your application or request using the unique Request ID sent to your email on completion of your application or request. </p>
                                <div className='w-full flex justify-center'>
                                    <button
                                        className='w-[150px] py-3 bg-[#0d544c] rounded-md text-white font-medium shadow-xl'
                                        onClick={() =>  goToStatuscheck()}
                                    >
                                        Click here
                                    </button>
                                </div>
                            </div>
                                
                        </div>
                        
                    </div>

                    <div className='w-full justify-center bg-[#f4f7f4] mt-12 py-12'>
                        <div className='w-full flex justify-center text-2xl font-bold pt-6 border-[#0d544c]'>
                            <span className='py-3 uppercase'>What you can apply for</span>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='w-[50px] border-b-4 border-[#0d544c]'></div>
                        </div>

                        <div className='w-full flex justify-center my-16'>
                            <div className='w-full md:w-2/3 flex flex-wrap px-4 md:px-0'>
                                <div className='w-[45%] md:w-[31%] mx-auto md:flex justify-center md:space-x-6 md:items-center mb-6 bg-white rounded-md py-6 px-4 space-y-2 md:space-y-0'>
                                    <div className="flex justify-center"><img src={birth} alt='birth' width="60px" /></div>
                                    <div className="text-md text-center text-gray-800 font-semibold">Birth Certificate</div>
                                </div>

                                <div className='w-[45%] md:w-[31%] mx-auto md:flex justify-center md:space-x-6 md:items-center mb-6 bg-white rounded-md py-6 px-4 space-y-2 md:space-y-0'>
                                    <div className="flex justify-center"><img src={death} alt='death certificate' width="60px" /></div>
                                    <div className="text-md text-center text-gray-800 font-semibold">Death Certificate</div>
                                </div>

                                <div className='w-[45%] md:w-[31%] mx-auto md:flex justify-center md:space-x-6 md:items-center mb-6 bg-white rounded-md py-6 px-4 space-y-2 md:space-y-0'>
                                    <div className="flex justify-center"><img src={lgID} alt='lg ID' width="60px" /></div>
                                    <div className="text-md text-center text-gray-800 font-semibold">Local Government ID</div>
                                </div>

                                <div className='w-[45%] md:w-[31%] mx-auto md:flex justify-center md:space-x-6 md:items-center mb-6 bg-white rounded-md py-6 px-4 space-y-2 md:space-y-0'>
                                    <div className="flex justify-center"><img src={club} alt='club reg' width="60px" /></div>
                                    <div className="text-md text-center text-gray-800 font-semibold">Club/Assoc. Registration</div>
                                </div>

                                <div className='w-[45%] md:w-[31%] mx-auto md:flex justify-center md:space-x-6 md:items-center mb-6 bg-white rounded-md py-6 px-4 space-y-2 md:space-y-0'>
                                    <div className="flex justify-center"><img src={waste} alt='waste mgmt' width="60px" /></div>
                                    <div className="text-md text-center text-gray-800 font-semibold">Waste management fees</div>
                                </div>

                                <div className='w-[45%] md:w-[31%] mx-auto md:flex justify-center md:space-x-6 md:items-center mb-6 bg-white rounded-md py-6 px-4 space-y-2 md:space-y-0'>
                                    <div className="flex justify-center"><img src={streetReg} alt='street reg' width="60px" /></div>
                                    <div className="text-md text-center text-gray-800 font-semibold">Street registration</div>
                                </div>
                                    
                            </div>
                        </div>
                                            
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Landing2
