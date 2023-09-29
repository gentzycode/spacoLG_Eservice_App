import React, { useContext } from 'react'
import { AiFillBell } from 'react-icons/ai'
import { RxHamburgerMenu } from 'react-icons/rx'
import { FaUserCircle } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'

const Header = ({ toggleSidebar }) => {

    const { logout } = useContext(AuthContext);

    return (
        <header className='sticky w-full top-0 z-40 bg-gray-100'>
            <div className='flex flex-grow items-center justify-between p-4 md:px-3 2xl:px-11'>
                <RxHamburgerMenu size={30} className='text-gray-600 cursor-pointer' onClick={toggleSidebar} />
                <div className='flex  items-center space-x-6'>
                    <AiFillBell size={25} className='cursor-pointer' />
                    <FaUserCircle size={30} className='cursor-pointer text-gray-400' />
                    <button 
                        className='pt-1.5 pb-2 px-4 rounded-md bg-red-800 text-white'
                        onClick={() => logout()}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
