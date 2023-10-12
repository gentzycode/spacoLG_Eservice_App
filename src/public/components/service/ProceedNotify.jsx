import React from 'react'
import { MdArrowForwardIos } from 'react-icons/md'

const ProceedNotify = ({ handleChildUpdate }) => {

    return (
        <div>
            <div className='mt-10 flex justify-between items-center p-4 border border-gray-200 rounded-md'>
                <h1 className='text-lg font-semibold text-gray-600'>Don't have an account?</h1>
                <button
                    className='w-[130px] flex justify-around px-3 py-1.5 bg-[#0d544c] rounded-3xl text-white hover:bg-green-950 hover:text-white items-center text-lg'
                    onClick={() => handleChildUpdate('register')}
                >
                    <span>Proceed</span>
                    <MdArrowForwardIos size={15} />
                </button>
            </div> 

            <div className='mt-4 flex justify-between items-center p-4 border border-gray-200 rounded-md'>
                <div>
                    <h1 className='text-lg font-semibold text-gray-600'>Have an account?</h1>
                    <p className='text-gray-500'>You'll continue where you left off</p>
                </div>
                <button
                    className='w-[130px] flex justify-around px-3 py-1.5 border border-gray-200 rounded-3xl hover:bg-gray-100 text-gray-700 items-center text-lg'
                    onClick={() => handleChildUpdate('login')}
                >
                    <span>Sign in first</span>
                </button>
            </div> 
        </div>
    )
}

export default ProceedNotify
