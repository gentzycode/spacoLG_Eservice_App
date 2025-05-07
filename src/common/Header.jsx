import React, { useContext, useState, useEffect } from 'react';
import { AiOutlineBell } from 'react-icons/ai';
import { RxHamburgerMenu } from 'react-icons/rx';
import { MdOutlineLogout } from 'react-icons/md';
import { FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const locatn = useLocation();
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const pageTitle = locatn.pathname.replace('/', '').replace('-', ' ') || 'Dashboard';

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
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
            <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
                <div className="flex items-center space-x-4">
                    <RxHamburgerMenu
                        size={28}
                        className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer"
                        onClick={toggleSidebar}
                    />
                    <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] capitalize hidden md:block">
                        {pageTitle}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full cursor-pointer">
                        <AiOutlineBell size={24} className="text-[#3B78BD] dark:text-[#F0B652]" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="grid text-end">
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{user?.email}</span>
                        </div>
                        <FaUserCircle size={32} className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer" />
                    </div>
                    <button
                        className="flex items-center space-x-2 px-4 py-2 bg-[#f06752] text-white rounded-lg shadow-md hover:bg-[#F0B652] hover:text-gray-900 transition-all duration-300"
                        onClick={logout}
                    >
                        <MdOutlineLogout size={20} />
                        <span>Logout</span>
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-[#3B78BD] dark:bg-[#F0B652] text-white rounded-full shadow-md hover:shadow-lg transition-all"
                        onClick={toggleDarkMode}
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;