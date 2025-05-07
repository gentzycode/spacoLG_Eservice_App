import React, { Fragment } from 'react';
import Logo from '../assets/logo-bayelsa.png';
import BannerImage from '../assets/landingBanner.png';
import { AiOutlineClose } from 'react-icons/ai';
import NavDB from './NavDB';

const Sidebar = ({ toggleSidebar, navOpen }) => {
    return (
        <Fragment>
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
                    navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleSidebar}
            ></div>
            <div
                className={`fixed left-0 top-0 z-50 w-[230px] h-screen overflow-y-auto transition-transform duration-300 ease-in-out font-poppins ${
                    navOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                {/* Full-Height Banner Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${BannerImage})` }}
                ></div>
                <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>

                {/* Content Over Banner */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Close Icon for Mobile */}
                    <div className="flex justify-end p-4 md:hidden">
                        <AiOutlineClose
                            size={28}
                            className="text-white dark:text-[#F0B652] cursor-pointer hover:text-[#F0B652] transition-colors"
                            onClick={toggleSidebar}
                        />
                    </div>

                    {/* Logo and Title Section */}
                    <div className="w-full flex flex-col items-center px-6 mt-4 mb-8">
                        <div className="rounded-full border-4 border-white dark:border-gray-600 shadow-xl animate-fadeIn">
                            <img src={Logo} alt="Yenagoa LG Logo" className="w-16 h-16 rounded-full" />
                        </div>
                        <h1 className="text-lg font-bold text-white mt-4 animate-fadeIn">
                            Yenagoa <span className="text-[#F0B652]">E-Services</span>
                        </h1>
                    </div>

                    {/* Divider */}
                    <div className="w-full px-6">
                        <div className="w-full border-b-2 border-[#F0B652]/40 mb-6"></div>
                    </div>

                    {/* Navigation */}
                    <div className="w-full px-3 flex-grow">
                        <NavDB />
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