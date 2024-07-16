import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const DefaultLayout = () => {
    const [navOpen, setNavOpen] = useState(false);

    const toggleSidebar = () => {
        setNavOpen(!navOpen);
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar toggleSidebar={toggleSidebar} navOpen={navOpen} />
            <div className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#ecf6ec] ${navOpen ? 'ml-0' : 'md:ml-[230px]'} transition-all duration-300 ease-in-out`}>
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-grow p-4 2xl:px-10">
                    <div className="max-w-screen-2xl mx-auto">
                        <Outlet />
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default DefaultLayout;
