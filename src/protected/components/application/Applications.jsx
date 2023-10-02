import React from 'react'
import { useState } from 'react'
import { AiOutlineEdit, AiOutlineUnorderedList } from 'react-icons/ai'
import Application from './Application';
import ServicesForm from '../../../public/components/service/ServicesForm';

const Applications = () => {

    const [showform, setShowform] = useState(false);

    const toggleShowform = () => {
        setShowform(!showform);
    }

    return (
        <div className='w-full'>
            <div className='w-full flex justify-end my-2'>
                <button 
                    className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] text-white'
                    onClick={() => toggleShowform()}
                >
                    {showform ? <AiOutlineUnorderedList size={18} /> : <AiOutlineEdit size={18} />}
                    {showform ? <span>Your Applications</span> : <span>Apply for Service</span>}
                </button>
            </div>

            <div className='w-full'>
                {
                    showform ? <ServicesForm /> : <Application />
                }
            </div>
        </div>
    )
}

export default Applications
