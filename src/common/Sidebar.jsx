import React, { Fragment } from 'react';
import Logo from '../assets/logo-bayelsa.png';
import BannerImage from '../assets/landingBanner.png';
import { AiOutlineClose } from 'react-icons/ai';
import NavDB from './NavDB';

const Sidebar = ({ toggleSidebar, navOpen, collapsed }) => {
    return (
        <Fragment>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
                    navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 z-50 h-screen overflow-y-auto transition-all duration-300 ease-in-out font-poppins ${
                    navOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } ${collapsed ? 'md:w-[70px]' : 'w-[230px]'}`}
            >
                {/* Background Image - covers entire scrollable area */}
                <div
                    className="absolute top-0 left-0 w-full min-h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${BannerImage})` }}
                ></div>

                {/* Dark Overlay - covers entire scrollable area */}
                <div className="absolute top-0 left-0 w-full min-h-full bg-black/60 dark:bg-black/70"></div>

                {/* Content Over Banner */}
                <div className="relative z-10 min-h-screen flex flex-col pb-6">
                    {/* Top Bar with Close Button (Mobile Only) */}
                    <div className="flex justify-end items-center p-4 md:pt-6 md:pb-0">
                        {/* Mobile Close Button */}
                        <AiOutlineClose
                            size={28}
                            className="md:hidden text-white dark:text-[#F0B652] cursor-pointer hover:text-[#F0B652] transition-colors"
                            onClick={toggleSidebar}
                        />
                    </div>

                    {/* Logo and Title Section */}
                    <div className={`w-full flex flex-col items-center mb-8 transition-all duration-300 ${
                        collapsed ? 'md:px-2 md:mt-4' : 'px-6 md:mt-6'
                    }`}>
                        <div className={`rounded-full border-4 border-white dark:border-gray-600 shadow-xl animate-fadeIn transition-all duration-300 overflow-hidden ${
                            collapsed ? 'md:w-10 md:h-10 md:border-2' : 'w-16 h-16'
                        }`}>
                            <img
                                src={Logo}
                                alt="Yenagoa LG Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>

                        {/* Full Title - Hide when collapsed on desktop, always show on mobile */}
                        <h1 className={`text-lg font-bold text-white mt-4 animate-fadeIn text-center transition-opacity duration-300 ${
                            collapsed ? 'md:hidden' : ''
                        }`}>
                            Yenagoa <span className="text-[#F0B652]">E-Services</span>
                        </h1>

                        {/* Abbreviated Title - Show only when collapsed on desktop */}
                        {collapsed && (
                            <h1 className="hidden md:block text-xs font-bold text-[#F0B652] mt-2 animate-fadeIn text-center">
                                YE
                            </h1>
                        )}
                    </div>

                    {/* Divider - Hide when collapsed */}
                    {!collapsed && (
                        <div className="w-full px-6 md:px-6">
                            <div className="w-full border-b-2 border-[#F0B652]/40 mb-6"></div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className={`w-full flex-grow transition-all duration-300 ${
                        collapsed ? 'md:px-1' : 'px-3'
                    }`}>
                        <NavDB collapsed={collapsed} />
                    </div>

                </div>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out forwards;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </Fragment>
    );
};

export default Sidebar;
