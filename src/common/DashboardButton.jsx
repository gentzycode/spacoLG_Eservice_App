import React, { useContext } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const DashboardButton = () => {

    const { logout } = useContext(AuthContext)
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/dashboard');
        location.reload();
    }

    return (
        <div className='flex justify-end fixed top-4 right-0 z-10'>
            <div className='grid space-y-1'>
                <button 
                    className='p-3 bg-green-950 text-white border-y border-l border-white rounded-l-xl shadow-md'
                    onClick={goToDashboard}
                >
                    Dashboard
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
