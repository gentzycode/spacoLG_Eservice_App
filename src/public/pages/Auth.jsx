import { useEffect, useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import AuthLoader from '../../common/AuthLoader';
import AuthBanner from '../../common/AuthBanner';
import VerifyEmail from '../components/auth/VerifyEmail';
import { Link, useNavigate } from 'react-router-dom';
import { GrFormPreviousLink } from 'react-icons/gr';
import PublicLinks from '../../common/PublicLinks';
import { FaSun, FaMoon } from 'react-icons/fa';

const Auth = () => {
    const navigate = useNavigate();
    const [curraction, setCurraction] = useState('login');
    const [loading, setLoading] = useState(false);

    const handleChildUpdate = (val) => {
        setLoading(true);
        setCurraction(val);
        setTimeout(() => setLoading(false), 1000);
    };

    let child;
    if (curraction === 'register') {
        child = <Register handleChildUpdate={handleChildUpdate} />;
    } else if (curraction === 'forgot-password') {
        child = <ForgotPassword handleChildUpdate={handleChildUpdate} />;
    } else if (curraction === 'reset-password') {
        child = <ResetPassword handleChildUpdate={handleChildUpdate} />;
    } else if (curraction === 'verify-email') {
        child = <VerifyEmail handleChildUpdate={handleChildUpdate} />;
    } else {
        child = <Login handleChildUpdate={handleChildUpdate} />;
    }

    useEffect(() => {
        localStorage.getItem('isLoggedIn') && navigate('/dashboard');
    }, []);

    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    return (
        <div className="dark:bg-gray-800">
            <PublicLinks />
            <div className="w-full md:h-screen grid md:grid-cols-2 px-0 m-0">
                <AuthBanner />
                <div className="w-full col-span-1 mt-12 md:mt-0 md:my-8 flex justify-center items-center px-4 md:px-0">
                    <div className='w-full md:w-2/3'>
                        <div className='mt-6 md:mt-0'>
                            <Link to='/' className='mt-4'>
                                <div className='bg-gray-100 dark:bg-gray-700 rounded-full p-1 w-max'>
                                    <GrFormPreviousLink size={30} />
                                </div>
                            </Link>
                        </div>
                        {loading ? <AuthLoader /> : child}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-4 right-4">
                <button
                    className="w-[50px] h-[50px] flex items-center justify-center bg-[#0d544c] rounded-full text-white font-medium shadow-xl transition duration-300 ease-in-out hover:bg-[#0a3a34]"
                    onClick={toggleDarkMode}
                >
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>
            </div>
        </div>
    );
};

export default Auth;
