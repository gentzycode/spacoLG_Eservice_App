import React, { useContext } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { AuthContext } from '../context/AuthContext'

const DashboardButton = () => {

    const { logout } = useContext(AuthContext)

    return (
        <div className='flex justify-end fixed top-4 right-0 z-10'>
            <div className='grid space-y-1'>
                <button className='py-3 px-6 bg-green-950 text-white border-y border-l border-white rounded-l-xl shadow-md'>
                    Go to Dashboard
                </button>
                <div className='flex justify-end py-3 px-4 bg-transparent text-red-800'>
                    <AiOutlineLogout 
                        size={30} 
                        className='bg-white cursor-pointer rounded-full' 
                        onClick={(e) => logout()}
                    />
                </div>
            </div>
            
        </div>
    )
}

export default DashboardButton
