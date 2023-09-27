import React, { useState } from 'react'
import AuthBanner from '../../common/AuthBanner'
import { Link, useLocation } from 'react-router-dom'
import { GrFormPreviousLink } from 'react-icons/gr'
import ProceedNotify from '../components/service/ProceedNotify'
import Register from '../components/auth/Register'
import ForgotPassword from '../components/auth/ForgotPassword'
import ResetPassword from '../components/auth/ResetPassword'
import VerifyEmail from '../components/auth/VerifyEmail'
import AuthLoader from '../../common/AuthLoader'
import Login from '../components/auth/Login'
import ProfileUpdate from '../components/service/ProfileUpdate'
import DashboardButton from '../../common/DashboardButton'

const Sevice = () => {

    const s_location = useLocation();
    const servObj = s_location.state?.serviceObject;

    const [curraction, setCurraction] = useState('');
    const [loading, setLoading] = useState(false);

    const [authObject, setAuthObject] = useState(null);
    const [response, setResponse] = useState();

    const isLoggedin = localStorage.getItem('isLoggedIn');

    let child;

    const handleChildUpdate = (val) => {
        setLoading(true);
        setCurraction(val);
        setTimeout(() => setLoading(false), 1000);
    }

    if(curraction === 'login'){
        child = <Login handleChildUpdate={handleChildUpdate} setResponse={setResponse} />
    }
    else if(curraction === 'register'){
        child = <Register handleChildUpdate={handleChildUpdate} setResponse={setResponse} />
    }
    else if(curraction === 'forgot-password'){
        child = <ForgotPassword handleChildUpdate={handleChildUpdate} />
    }
    else if(curraction === 'reset-password'){
        child = <ResetPassword handleChildUpdate={handleChildUpdate} />
    }
    else if(curraction === 'verify-email'){
        child = <VerifyEmail handleChildUpdate={handleChildUpdate} response={response} />
    }
    else{
        child = <ProceedNotify  handleChildUpdate={handleChildUpdate} />
    }

    return (
        <div className="w-full md:h-screen grid md:grid-cols-2 px-0 m-0">
            <AuthBanner />
            <div className="w-full col-span-1 my-0 md:my-8 flex justify-center px-4 md:px-0">
                <div className='w-full md:w-2/3'>
                    <div className='mt-2'>
                        <Link to='/services' className='mt-4'>
                            <GrFormPreviousLink size={30} />
                        </Link>
                    </div>
                    {localStorage.getItem('isLoggedIn') && 
                        <DashboardButton />
                    }
                    <div className='mt-0 md:mt-8 pb-3 border-b border-gray-100'>
                        <p className='text-md my-2 text-gray-500'>{servObj?.localgovernments?.name}</p>
                        <h1 className='text-xl md:text-4xl font-extralight'>   
                            {servObj?.eservice?.name}
                        </h1>
                    </div>
                    <div className='mt-0'>
                        {
                            isLoggedin ? 
                                <ProfileUpdate /> :  
                                (
                                    loading ? <AuthLoader /> : child
                                )
                        } 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sevice
