import React from 'react'
import { HiDocumentText } from 'react-icons/hi'
import { FaComments, FaUserAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AiFillHome } from 'react-icons/ai'
import { RiWalletFill } from 'react-icons/ri'
import { BiSolidDoughnutChart, BiSolidUser } from 'react-icons/bi'
import { useContext } from 'react'

const NavDB = () => {

    const locatn = useLocation();
    //const { logout } = useContext(AuthContext);

    /**const handleLogout = () => {
        logout();
        location.reload();
    }*/

    const adminlinks = [
        {
            id: 1,
            title: "Home",
            url: "/dashboard",
            icon: <AiFillHome size={17} />
        },
        {
            id: 2,
            title: "Application Status",
            url: "#",
            icon: <BiSolidDoughnutChart size={17} />
        },
        {
            id: 3,
            title: "Applications",
            url: "/application",
            icon: <HiDocumentText size={17} />
        },
        {
            id: 4,
            title: "Wallet",
            url: "#",
            icon: <RiWalletFill size={17} />
        },
        {
            id: 5,
            title: "Profile",
            url: "#",
            icon: <BiSolidUser size={17} />
        },
        {
            id: 6,
            title: "FAQ",
            url: "#",
            icon: <FaComments size={17} />
        },
        {
            id: 7,
            title: "Support",
            url: "#",
            icon: <FaUserAlt size={17} />
        },
    ]

    return (
        <ul className='w-full space-y-2'>
            {
                adminlinks !== null && adminlinks.map(nav => {
                    return (
                        <li key={nav.id} className={`${locatn.pathname === nav.url ? 'bg-[#2b7d54] text-gray-100 font-semibold' : 'text-gray-300'} px-3 py-2 rounded-md `}>
                            <Link to={nav.url} key={nav.id} className='flex justify-start items-center space-x-3 my-1'>
                                {nav.icon}
                                <span>{nav.title}</span>
                            </Link>
                        </li>
                    )
                })
            }

            {/**<div className='w-full py-1 border-b border-green-900 flex justify-start px-3'><span className='text-gray-500 text-xs mt-2'></span></div>
            
            <li className={`px-3 py-2 text-gray-100`}>
                <div 
                    className='flex justify-start items-center space-x-3 my-1 cursor-pointer'
                    onClick={() => handleLogout()}
                >
                    <AiOutlineLogout size={15} />
                    <span>Logout</span>
                </div>
        </li>*/}
        </ul>
    )
}

export default NavDB
