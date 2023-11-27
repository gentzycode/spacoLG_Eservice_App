import React from 'react'

const DeleteModal = ({ deleting }) => {
    return (
        <div>
            <div className='fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity'></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex mt-16 md:mt-0 md:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <div className='w-full md:w-[600px] bg-white border border-gray-400 dark:text-gray-700 rounded-md px-6 py-1'>
                        <div className='py-4'>
                            <span className='text-lg text-red-600 italic'>deleting...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
