import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className='w-full flex justify-center mt-12 p-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300'>
            <span className='text-center'>&copy; {currentYear} Yenagoa Local Government E-Services Portal. All rights reserved.</span>
        </div>
    );
};

export default Footer;
