import { AiOutlineQuestion } from 'react-icons/ai'
import { forgotPassword } from '../../../apis/noAuthActions';
import { useState } from 'react';
import ButtonLoader from '../../../common/ButtonLoader';


const ForgotPassword = ({ handleChildUpdate }) => {

    const [username_or_email, setUsername_or_email] = useState();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    
    const handleReset = (e) => {
        e.preventDefault();

        const data = {
            username_or_email
        }

        forgotPassword(data, setSuccess, setError, setSending);
    }

    return (

        <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                <AiOutlineQuestion size={40} />
                <h1 className='text-4xl'>Forgot Password</h1>
            </div>
            {success !== null && <p className='text-green-700'>{success?.message}. <span className='cursor-pointer font-bold' onClick={() => handleChildUpdate('reset-password')}>Click here to Reset your Password</span></p>}
            {error !== null && <p className='text-red-500'>{error?.message}</p>}
            <form onSubmit={handleReset} className='w-full mt-6 mb-6 space-y-8'>
                <input 
                    type='email' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Enter you email'
                    onChange={(e) => setUsername_or_email(e.target.value)}
                    required
                />

                <div className=''>
                    {sending ? 
                        <button className='w-full flex justify-center p-3 mt-16 rounded-2xl bg-green-800 hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-8 rounded-2xl bg-green-800 hover:bg-green-700 text-white'>
                            Send Reset Link
                        </button>
                    }
                    <div className='flex justify-end py-1'>
                        <span 
                            className='cursor-pointer text-blue-600'
                            onClick={() => handleChildUpdate('login')}
                        >
                                Go to Login
                        </span>
                    </div>
                </div>
                
            </form>
        </div>
    )
}

export default ForgotPassword
