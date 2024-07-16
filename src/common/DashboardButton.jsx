import React, { useContext } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardButton = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate('/dashboard');
        location.reload();
    };

    return (
        <div className='flex justify-end fixed top-4 right-4 z-10'>
            <div className='grid space-y-1'>
                <button 
                    className='px-4 py-2 bg-yellow-400 text-gray-900 border-y border-l border-gray-900 rounded-l-xl shadow-md hover:bg-yellow-500 transition duration-300'
                    onClick={goToDashboard}
                >
                    Dashboard
                </button>
                <div className='flex justify-end py-3 px-4 bg-transparent text-red-800'>
                    <AiOutlineLogout 
                        size={30} 
                        className='bg-gray-900 cursor-pointer rounded-full hover:bg-red-100 transition duration-300' 
                        onClick={(e) => logout()}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardButton;
