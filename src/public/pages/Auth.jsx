import React, { useEffect, useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import AuthLoader from '../../common/AuthLoader';
import VerifyEmail from '../components/auth/VerifyEmail';
import { Link, useNavigate } from 'react-router-dom';
import { GrFormPreviousLink } from 'react-icons/gr';
import PublicLinks from '../../common/PublicLinks';
import { FaSun, FaMoon } from 'react-icons/fa';
import Logo from '../../assets/logo-bayelsa.png';
import BannerImage from '../../assets/landingBanner.png';

const Auth = () => {
    const navigate = useNavigate();
    const [currentAction, setCurrentAction] = useState('login');
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const handleChildUpdate = (val) => {
        setLoading(true);
        setCurrentAction(val);
        setTimeout(() => setLoading(false), 1000);
    };

    let child;
    if (currentAction === 'register') {
        child = <Register handleChildUpdate={handleChildUpdate} />;
    } else if (currentAction === 'forgot-password') {
        child = <ForgotPassword handleChildUpdate={handleChildUpdate} />;
    } else if (currentAction === 'reset-password') {
        child = <ResetPassword handleChildUpdate={handleChildUpdate} />;
    } else if (currentAction === 'verify-email') {
        child = <VerifyEmail handleChildUpdate={handleChildUpdate} />;
    } else {
        child = <Login handleChildUpdate={handleChildUpdate} />;
    }

    useEffect(() => {
        localStorage.getItem('isLoggedIn') && navigate('/dashboard');
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

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

                {/* Right Section with Auth Form */}
                <div className="flex justify-center items-center p-6 sm:p-12">
                    <div className="w-full max-w-md space-y-6 animate-slideIn">
                        {/* Header with Back Button and Dark Mode Toggle */}
                        <div className="flex items-center justify-between">
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
                            <button
                                onClick={toggleDarkMode}
                                className="w-10 h-10 flex items-center justify-center bg-[#3B78BD] dark:bg-[#F0B652] text-white rounded-full shadow-md hover:shadow-lg transition-all"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                            </button>
                        </div>

                        {/* Auth Form Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-2 capitalize">
                                    {currentAction.replace('-', ' ')}
                                </h2>
                                <div className="w-16 h-1 bg-[#F0B652] mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {currentAction === 'login' && 'Welcome back! Please enter your credentials'}
                                    {currentAction === 'register' && 'Create an account to access all services'}
                                    {currentAction === 'forgot-password' && 'Reset your password with your email'}
                                    {currentAction === 'reset-password' && 'Set your new password'}
                                    {currentAction === 'verify-email' && 'Verify your email address'}
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <AuthLoader />
                                </div>
                            ) : (
                                React.cloneElement(child, {
                                    buttonColor: '#F0B652' // Passing the gold color to all auth components
                                })
                            )}
                        </div>

                        {/* Action Links */}
                        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                            {currentAction === 'login' && (
                                <>
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={() => handleChildUpdate('register')}
                                        className="text-[#3B78BD] dark:text-[#F0B652] font-medium hover:underline"
                                    >
                                        Sign up
                                    </button>
                                    <br />
                                    <button 
                                        onClick={() => handleChildUpdate('forgot-password')}
                                        className="text-[#3B78BD] dark:text-[#F0B652] font-medium hover:underline mt-2"
                                    >
                                        Forgot password?
                                    </button>
                                </>
                            )}
                            {currentAction === 'register' && (
                                <>
                                    Already have an account?{' '}
                                    <button 
                                        onClick={() => handleChildUpdate('login')}
                                        className="text-[#3B78BD] dark:text-[#F0B652] font-medium hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                            {(currentAction === 'forgot-password' || currentAction === 'reset-password' || currentAction === 'verify-email') && (
                                <button 
                                    onClick={() => handleChildUpdate('login')}
                                    className="text-[#3B78BD] dark:text-[#F0B652] font-medium hover:underline"
                                >
                                    Back to login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Auth;