import React from 'react'
import { BsClockHistory } from 'react-icons/bs'
import StatusCheckComponent from '../components/status-check/StatusCheckComponent'

const ApplicationStatus = () => {
    return (
        <div className='w-full'>
            <h1 className='mt-4 flex space-x-2 items-center text-xl md:text-3xl font-extralight'>
                <BsClockHistory size={30} className='text-gray-600' />
                <span className='text-gray-600'>Application Status</span>
            </h1>

            <div className='w-full my-12'>
                <StatusCheckComponent />
            </div>
        </div>
    )
}

export default ApplicationStatus