import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const DefaultLayout = () => {
    const [navOpen, setNavOpen] = useState(false); // Mobile menu open/close
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar collapsed/expanded

    // Mobile sidebar overlay toggle
    const toggleSidebar = () => {
        setNavOpen(!navOpen);
    };

    // Unified hamburger toggle: mobile opens overlay, desktop collapses sidebar
    const handleHamburgerClick = () => {
        if (window.innerWidth < 768) {
            // Mobile: toggle overlay
            setNavOpen(!navOpen);
        } else {
            // Desktop: toggle collapse
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    return (
        <div className="flex min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 font-poppins transition-colors duration-500">
            <Sidebar
                toggleSidebar={toggleSidebar}
                navOpen={navOpen}
                collapsed={sidebarCollapsed}
            />
            <div className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
                navOpen ? 'ml-0' : sidebarCollapsed ? 'md:ml-[70px]' : 'md:ml-[230px]'
            }`}>
                <Header toggleSidebar={handleHamburgerClick} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 2xl:p-10">
                    <div className="max-w-screen-2xl mx-auto">
                        <Outlet />
                    </div>
                </main>
                <Footer />
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DefaultLayout;