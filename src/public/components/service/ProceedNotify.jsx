import React from 'react'

const ProceedNotify = ({ handleChildUpdate }) => {

    return (
        <div>
            <div className='my-8'>
                <h1 className='text-2xl font-extralight'>Login to your Account to Continue ?</h1>
                <p className='text-sm text-gray-400 mb-4'>Access to more features to manage your requests</p>
                <button
                    className='w-[150px] py-2.5 bg-green-800 rounded-3xl text-white hover:bg-green-950 hover:text-white'
                    onClick={() => handleChildUpdate('login')}
                >
                    Click here
                </button>
            </div>

            <div className='w-2/3 md:w-1/2 flex justify-center border-t border-green-700 mt-20 mb-12'>
                <div className='px-2 mt-[-20px] md:mt-[-25px] text-2xl md:text-4xl text-green-800 font-extralight bg-white'>OR</div>
            </div>   
                

            <div className='mb-8'>
                <h1 className='text-2xl font-extralight mb-4'>Proceed with Request ?</h1>
                <button
                    className='w-[150px] py-2 border-2 border-green-800 rounded-3xl text-green-800 hover:bg-border-950 hover:text-green-950 font-medium'
                    onClick={() => handleChildUpdate('register')}
                >
                    Click here
                </button>
            </div>
        </div>
    )
}

export default ProceedNotify
