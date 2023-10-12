import React, { Fragment } from 'react'
import Logo from '../assets/ansg_logo.png'
import { AiOutlineClose } from 'react-icons/ai'
import NavDB from './NavDB'

const Sidebar = ({ toggleSidebar, navOpen }) => {
    return (
        <Fragment>
            <div 
                className={navOpen ? 'fixed inset-0 z-50 mt-0 bg-black bg-opacity-50 transition-opacity md:hidden' : ''}
                onClick={toggleSidebar}
            ></div>
            <div className={`absolute left-0 top-0 z-50 ${navOpen ? 'block w-[230px]' : 'hidden'} md:block md:w-[230px] h-screen bg-[#0d544c] overflow-y-hidden duration-300 ease-linear`}>
                <div className='flex justify-end my-6 md:hidden px-6'>
                    <AiOutlineClose size={25} className='text-gray-300 cursor-pointer' onClick={toggleSidebar} />
                </div>
                <div className='w-full flex justify-start px-6 mt-8 mb-8'>
                    <div className='rounded-full shadow-2xl'>
                        <img src={Logo} alt='logo' width='60px' />
                    </div>
                </div>
                <div className='w-full px-3'>
                    <div className='w-full border-b-2 border-[#669d97] mb-3 opacity-40'></div>
                </div>
                <div className='w-full flex justify-start px-3'>
                    <NavDB />
                </div>
            </div>
        </Fragment>
        
    )
}

export default Sidebar
