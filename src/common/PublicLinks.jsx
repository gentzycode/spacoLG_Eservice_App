import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo-bayelsa.png';

const PublicLinks = () => {
    const loc = useLocation();
    const navigate = useNavigate();
    const url = loc.pathname;

    const reloadPage = () => {
        url === '/auth' ? window.location.reload() : navigate('/auth');
    };

    const getLinkClass = (path) => {
        const isActive = url === path;
        const baseClass = 'px-3 py-2 rounded-md transition-colors';
        if (isActive) {
            return `${baseClass} bg-[#3B78BD] text-white font-medium`;
        }
        return `${baseClass} hover:bg-gray-100 dark:hover:bg-gray-700`;
    };

    return (
        <div className={`fixed inset-0 z-20 mt-0 h-12 flex justify-between items-center py-6 pl-4 pr-6 ${url === '/' ? 'text-white' : 'text-[#0d544c] dark:text-white'}`}>
            <div className='pt-4'>
                <span className={`${url === '/' && 'hidden'} md:hidden`}>
                    <img src={Logo} alt="logo" width="50px" />
                </span>
            </div>
            <div className='flex justify-end items-center space-x-2'>
                <Link to='/fee-schedule' className={getLinkClass('/fee-schedule')}>
                    Fee Schedule
                </Link>
                <Link to='https://lg.anambrastate.gov.ng/about' className={`px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}>
                    FAQ
                </Link>
                <div className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={reloadPage}>
                    Login
                </div>
            </div>
        </div>
    );
};

export default PublicLinks;
