import React from 'react';
import { HiUser } from 'react-icons/hi';

const ServiceForm = () => {
    return (
        <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 dark:text-gray-300 font-extralight py-6 border-gray-300 dark:border-gray-700">
                <HiUser size={25} />
                <h1 className="text-2xl md:text-2xl">Provide Request Information</h1>
            </div>
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-4">
                {/* Placeholder for form content */}
                <p className="text-gray-600 dark:text-gray-400">Form content to be implemented.</p>
            </div>
        </div>
    );
};

export default ServiceForm;