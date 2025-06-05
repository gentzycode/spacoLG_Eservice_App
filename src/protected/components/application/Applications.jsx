// src/protected/components/application/Applications.jsx
import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineUnorderedList } from 'react-icons/ai';
import Application from './Application';
import ServicesForm from '../../../public/components/service/ServicesForm';

const Applications = () => {
    const [showForm, setShowForm] = useState(false);

    const toggleShowForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="mt-8 animate-fadeIn">
            <div className="w-full flex justify-end my-4 space-x-4">
                <button
                    className="w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#3B78BD] hover:bg-[#F0B652] text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                    onClick={toggleShowForm}
                >
                    {showForm ? <AiOutlineUnorderedList size={18} /> : <AiOutlineEdit size={18} />}
                    <span>{showForm ? 'My Applications' : 'Apply for Service'}</span>
                </button>
            </div>
            <div className="w-full">
                {showForm ? <ServicesForm toggleShowform={toggleShowForm} /> : <Application />}
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Applications;