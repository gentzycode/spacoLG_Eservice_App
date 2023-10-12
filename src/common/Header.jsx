import React, { useContext } from 'react'
import { AiOutlineBell } from 'react-icons/ai'
import { RxHamburgerMenu } from 'react-icons/rx'
import { MdOutlineLogout } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'

const Header = ({ toggleSidebar }) => {

    const { logout } = useContext(AuthContext);

    return (
        <header className='sticky w-full top-0 z-40 bg-white'>
            <div className='flex flex-grow items-center justify-between p-4 md:px-3 2xl:px-11'>
                <RxHamburgerMenu size={30} className='text-gray-600 cursor-pointer' onClick={toggleSidebar} />
                <div className='flex  items-center space-x-8'>
                    <div className='bg-gray-100 p-2 rounded-full'>   
                        <AiOutlineBell size={25} className='cursor-pointer' />
                    </div>
                    {/**<FaUserCircle size={30} className='cursor-pointer text-gray-400' />*/}
                    <button 
                        className='flex justify-between items-center space-x-2 pt-1.5 pb-2 px-4 rounded-full border border-red-500 text-red-500'
                        onClick={() => logout()}
                    >
                        <MdOutlineLogout size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
