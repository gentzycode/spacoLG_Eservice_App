import React, { useEffect, useState } from 'react'
import { HiDocumentText, HiUserGroup } from 'react-icons/hi'
import { FaComments, FaUserAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { AiFillHome } from 'react-icons/ai'
import { RiWalletFill } from 'react-icons/ri'
import { BiSolidDoughnutChart, BiSolidUser } from 'react-icons/bi'
import { useContext } from 'react'
import { setUserLinks } from '../apis/functions'
import { BsHouses } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { FaFileCircleCheck } from 'react-icons/fa6'

const NavDB = () => {

    const locatn = useLocation();
    const { user } = useContext(AuthContext);
    const [navlinks, setNavlinks] = useState(null);

    const publicUser = [
        {
            id: 1,
            title: "Home",
            url: "/dashboard",
            icon: <AiFillHome size={17} />
        },
        {
            id: 2,
            title: "Applications",
            url: "/application",
            icon: <HiDocumentText size={17} />
        },
        {
            id: 3,
            title: "Payments",
            url: "/payments",
            icon: <RiWalletFill size={17} />
        },
        {
            id: 4,
            title: "Support",
            url: "#",
            icon: <FaUserAlt size={17} />
        },
    ]

    const staff = [
        {
            id: 1,
            title: "Home",
            url: "/dashboard",
            icon: <AiFillHome size={17} />
        },
        {
            id: 2,
            title: "Applications",
            url: "/applications",
            icon: <HiDocumentText size={17} />
        },
        {
            id: 3,
            title: "Users",
            url: "/users",
            icon: <HiUserGroup size={17} />
        },
        {
            id: 4,
            title: "Authorizers",
            url: "/authorizers",
            icon: <FaFileCircleCheck size={17} />
        },
    ]

    const superAdmin = [
        {
            id: 1,
            title: "Home",
            url: "/dashboard",
            icon: <AiFillHome size={17} />
        },
        {
            id: 2,
            title: "Users",
            url: "/users",
            icon: <HiUserGroup size={17} />
        },
        {
            id: 3,
            title: "Tariffs",
            url: "#",
            icon: <RiWalletFill size={17} />
        },
        {
            id: 4,
            title: "LGAs Staff",
            url: "/lgas-staff",
            icon: <BsHouses size={17} />
        },
        {
            id: 5,
            title: "Authorizers",
            url: "/authorizers",
            icon: <FaFileCircleCheck size={17} />
        },
    ]



    useEffect(() => {
        setUserLinks(user?.role, publicUser, staff, superAdmin, setNavlinks);
    }, [])

    return (
        <ul className='w-full space-y-2'>
            {
                navlinks !== null && navlinks.map(nav => {
                    return (
                        <li key={nav.id} className={`${locatn.pathname === nav.url || locatn.pathname.includes(nav.url.replace("/",'')) ? 'bg-[#2b7d54] text-gray-100 font-semibold' : 'text-gray-300'} px-3 py-2 rounded-md `}>
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
