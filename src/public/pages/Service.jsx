import React, { useContext, useEffect, useState } from 'react';
import BannerImage from '../../assets/landingBanner.png';
import Logo from '../../assets/logo-bayelsa.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GrFormPreviousLink } from 'react-icons/gr';
import ProceedNotify from '../components/service/ProceedNotify';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import VerifyEmail from '../components/auth/VerifyEmail';
import AuthLoader from '../../common/AuthLoader';
import Login from '../components/auth/Login';
import ProfileUpdate from '../components/service/ProfileUpdate';
import DashboardButton from '../../common/DashboardButton';
import { AuthContext } from '../../context/AuthContext';
import PublicLinks from '../../common/PublicLinks';

const Service = () => {
    const s_location = useLocation();
    const servObj = s_location.state?.serviceObject;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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
    };

    if (curraction === 'login') {
        child = <Login handleChildUpdate={handleChildUpdate} setResponse={setResponse} />;
    } else if (curraction === 'register') {
        child = <Register handleChildUpdate={handleChildUpdate} setResponse={setResponse} />;
    } else if (curraction === 'forgot-password') {
        child = <ForgotPassword handleChildUpdate={handleChildUpdate} />;
    } else if (curraction === 'reset-password') {
        child = <ResetPassword handleChildUpdate={handleChildUpdate} />;
    } else if (curraction === 'verify-email') {
        child = <VerifyEmail handleChildUpdate={handleChildUpdate} response={response} />;
    } else {
        child = <ProceedNotify handleChildUpdate={handleChildUpdate} />;
    }

    useEffect(() => {
        localStorage.setItem('selectedService', JSON.stringify(servObj));
    }, []);

    useEffect(() => {
        localStorage.getItem('isLoggedIn') && navigate('/dashboard');
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-poppins transition-colors duration-500">
            <PublicLinks />
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 w-full">
                {/* Left Section with Banner Background */}
                <div className="hidden lg:flex relative bg-cover bg-center" style={{ backgroundImage: `url(${BannerImage})` }}>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full h-full">
                        <img 
                            src={Logo} 
                            alt="Yenagoa LG Logo" 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-8 animate-fadeIn" 
                        />
                        <h1 className="text-4xl font-bold text-white mb-4 text-center animate-fadeIn">
                            Yenagoa <span className="text-[#F0B652]">E-Services</span>
                        </h1>
                        <p className="text-xl text-gray-100 max-w-md text-center animate-fadeIn">
                            Modern digital solutions for all local government services
                        </p>
                    </div>
                </div>
                <div className="w-full col-span-1 mt-16 my-0 md:my-8 flex justify-center px-4 md:px-0 animate-slideIn">
                    <div className="w-full md:w-2/3 px-2 md:px-0">
                        <div className="mt-8">
                            <Link to="/" className="group">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md group-hover:shadow-lg transition-all">
                                        <GrFormPreviousLink size={24} className="text-[#3B78BD] dark:text-[#F0B652]" />
                                    </div>
                                    <span className="text-[#3B78BD] dark:text-[#F0B652] font-medium group-hover:underline">
                                        Back to Home
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="mt-12 p-6 bg-yellow-100 dark:bg-yellow-200/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 rounded-xl shadow-md">
                            <p className="text-lg mb-1">
                                <span className="mr-1 font-bold">LGA:</span> {servObj?.localgovernments?.name}
                            </p>
                            <h1 className="text-lg">
                                <span className="mr-1 font-bold">Service Request:</span> {servObj?.eservice?.name}
                            </h1>
                        </div>
                        <div className="mt-6">
                            {isLoggedin ? (
                                navigate('/application', {
                                    state: {
                                        servObj: servObj
                                    }
                                })
                            ) : (
                                loading ? <AuthLoader /> : child
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
                .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Service;