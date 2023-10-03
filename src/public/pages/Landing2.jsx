import React from 'react'
import Logo from '../../assets/ansg_logo.png'
import { useNavigate } from 'react-router-dom';

const Landing2 = () => {

    const navigate = useNavigate();

    const goToAuthentication = () => {
        navigate('/auth');
    }

    const goToSrvice = () => {
        navigate('/services');
    }

    return (
        <div className='w-full grid px-0 m-0'>
            <div className="w-full bg-[#0d544c] px-6 md:px-12 py-12">
                <div className="w-full space-y-6 md:space-y-8">
                    <div className='flex justify-center'>
                        <img src={Logo} alt="logo" width='120px' /> 
                    </div>
                    <div className="text-xl md:text-4xl break-normal leading-tight font-extralight text-white text-center">
                        Local Government E-Services Solution
                    </div>
                    <div className="text-md md:text-xl flex justify-center text-center break-normal text-white">
                        <p className='w-full md:w-2/3'></p>
                    </div>
                </div>  
            </div>
            <div className='w-full'>
                <div className='w-full justify-center'>
                    <div className='w-full flex justify-center text-4xl font-extralight py-6 mt-6 border-[#0d544c] text-[#0d544c]'>
                        <span className='py-4 border-b border-[#0d544c]'>What you can do</span>
                    </div>
                    <div className='w-full md:flex md:justify-around px-6 space-y-12 md:space-y-0  mt-6 mb-12 md:mb-0'>
                        <div className='w-full md:w-1/4 mb-6'>
                            <h1 className='text-2xl mb-2 font-extralight text-center'>Request for a Service</h1>
                            <p className='text-gray-500 mb-4 text-center'>You can apply for any of the e-services available on this platform ranging from Birth Certificate, Marriage Registration, Local Government Identification etc. </p>
                            <div className='w-full flex justify-center'>
                                <button
                                    className='w-[150px] py-2 border-2 border-[#0d544c] rounded-3xl text-[#0d544c] hover:bg-border-950 hover:text-green-950 font-medium'
                                    onClick={() => goToSrvice()}
                                >
                                    Click here
                                </button>
                            </div>
                        </div>

                        <div className='w-full md:w-1/4 my-6'>
                            <h1 className='text-2xl mb-2 font-extralight text-center'>Manage your Requests</h1>
                            <p className='text-gray-500 mb-4 text-center'>You can register and login to your account to manage your applications, payments, invoices, certificates etc. as well as track your requests real-time </p>
                            <div className='w-full flex justify-center'>
                                <button
                                    className='w-[150px] py-2.5 bg-[#0d544c] rounded-3xl text-white hover:bg-green-950 hover:text-white'
                                    onClick={() => goToAuthentication()}
                                >
                                    Click here
                                </button>
                            </div>
                        </div>
                            
                        <div className='w-full md:w-1/4 my-6'>
                            <h1 className='text-2xl mb-2 font-extralight text-center'>Check your Request Status</h1>
                            <p className='text-gray-500 mb-4 text-center'>You can check the status of your application or request using the unique Request ID sent to you on application completion. </p>
                            <div className='w-full flex justify-center'>
                                <button
                                    className='w-[150px] py-2 border-2 border-[#0d544c] rounded-3xl text-[#0d544c] hover:bg-border-950 hover:text-green-950 font-medium'
                                >
                                    Click here
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Landing2
