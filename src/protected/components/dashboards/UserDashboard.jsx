import React from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { HiOutlinePlus } from 'react-icons/hi';
import { RiErrorWarningLine } from 'react-icons/ri';
import { AiFillCloseCircle, AiOutlineClose } from 'react-icons/ai';
import { MdIncompleteCircle, MdOutlineHourglassTop } from 'react-icons/md';


const UserDashboard = ({ username, goToApplications}) => {

    return (
        <div className='w-full'>
            <div className='w-full flex justify-end my-4'>
                <button className='w-max md:w-[220px] flex justify-between items-center px-6 py-4 rounded-md bg-[#0d544c] text-white'>
                    <HiOutlinePlus size={20} />
                    <span className='hidden md:block'>Application Request</span>
                </button>
            </div>
            <div className='w-full md:w-max my-4 p-6 bg-white rounded-md'>
                <div className='flex justify-between mt-4 mb-2'>
                    <span className='text-xl font-bold text-gray-700'>Hello, {username}</span>
                </div>
                <div className='mb-4'>
                    <span className='text-gray-500'>Welcome to Anambra State Government E-services</span>
                </div>
            </div>
            <div className='w-full md:flex justify-between rounded md border border-orange-300 bg-[#fff8eb] p-3 space-y-3 md:space-y-0'>
                <div className='md:flex md:space-x-3 space-y-3 md:space-y-0 items-center'>
                    <div className="bg-orange-100 p-2 rounded-full w-max"><RiErrorWarningLine size={25} className='text-orange-300' /></div>
                    <span className='text-gray-800'>You have 3 pending applications</span>
                </div>
                <div className='flex space-x-5 items-center'>
                    <div 
                        className='border border-gray-300 bg-white rounded-full px-3 py-1 text-sm cursor-pointer'
                        onClick={() => goToApplications()}
                    >
                        View applications
                    </div>
                    <AiOutlineClose size={15} className='hidden md:block cursor-pointer' />
                </div>
            </div>
            <div className='w-full mt-8'>
                <div className='text-lg text-gray-700 font-semibold'>Application status</div>
                <div className='w-full my-4 md:flex md:flex-wrap md:justify-between'>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-green-100 rounded-sm p-2 text-green-500'><BsFillCheckCircleFill size={30} /></div>
                        <h1 className='text-md text-green-700 font-semibold my-2'>Processed</h1>
                        <h1 className='text-2xl text-green-700 font-bold'>10</h1>
                    </div>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-orange-100 rounded-sm p-2 text-orange-500'><MdOutlineHourglassTop size={30} /></div>
                        <h1 className='text-md text-orange-500 font-semibold my-2'>Pending</h1>
                        <h1 className='text-2xl text-orange-500 font-bold'>2</h1>
                    </div>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-blue-100 rounded-sm p-2 text-blue-500'><MdIncompleteCircle size={30} /></div>
                        <h1 className='text-md text-blue-500 font-semibold my-2'>Incomplete</h1>
                        <h1 className='text-2xl text-blue-500 font-bold'>10</h1>
                    </div>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-red-100 rounded-sm p-2 text-red-500'><AiFillCloseCircle size={30} /></div>
                        <h1 className='text-md text-red-500 font-semibold my-2'>Rejected</h1>
                        <h1 className='text-2xl text-red-500 font-bold'>10</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
