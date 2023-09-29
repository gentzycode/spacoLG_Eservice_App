import React from 'react'

const ServiceForm = () => {

    return (
        <div className='w-full'>
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                <HiUser size={25} />
                <h1 className='text-2xl md:text-2xl'>Provide Request Information</h1>
            </div>
            <div className='w-full grid grid-cols-2'>
                <div className='col-span-1 p-1 bg-green-500'></div>
                <div className='col-span-1 p-1 bg-green-500'></div>
            </div>
        </div>
    )
}

export default ServiceForm
