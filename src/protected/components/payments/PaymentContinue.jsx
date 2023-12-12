import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import ButtonLoader from '../../../common/ButtonLoader'

const PaymentContinue = ({ updateStep, updating }) => {
    return (
        <div>
            <div className='fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity'></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex mt-16 md:mt-0 md:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <div className='w-full md:w-[500px] bg-white border border-gray-400 dark:text-gray-700 rounded-md px-6 py-1'>
                        <div className='py-4'>
                            <div className='w-full justify-center my-3 px-4'>
                                <div className='flex justify-center'>
                                    <FaCheckCircle size={50} className='text-green-500' />
                                </div>
                                <div className='w-full flex justify-center items-center text-center text-xl font-bold text-gray-700 p-1 mt-1'>
                                    <span>Payment Successful</span>
                                </div>
                                <div className='w-full flex justify-center items-center text-center text-gray-500 p-2 mb-2'>
                                    <span>Your payment has been verifired and payment status for this application request has been updated</span>
                                </div>
                                {
                                    updating ? 
                                        <button className='w-full flex justify-center py-3 rounded-md bg-[#0d544c] hover:bg-green-950 text-white'>
                                            <ButtonLoader />
                                        </button>
                                        :
                                        <button 
                                            className='w-full py-3 rounded-md bg-[#0d544c] hover:bg-green-950 text-white'
                                            onClick={() => updateStep()}
                                        >
                                            Continue
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentContinue
