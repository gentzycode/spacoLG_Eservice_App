import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className='w-full flex justify-center mt-12 p-6 bg-white text-[#0d544c] border-t border-gray-200'>
            <span className='text-center'>&copy; {currentYear} Local Government E-Services Portal. All rights reserved.</span>
        </div>
    );
};

export default Footer;
