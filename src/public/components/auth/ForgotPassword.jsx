import { AiOutlineQuestion } from 'react-icons/ai'
import { forgotPassword } from '../../../apis/noAuthActions';
import { useState } from 'react';
import ButtonLoader from '../../../common/ButtonLoader';
import { ToastContainer, toast } from 'react-toastify';


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

    if(success !== null){
        toast.success(success?.message);
        setTimeout(() => handleChildUpdate('reset-password'), 3000);
    }

    if(error !== null){
        toast.error(error?.message);
        setError(null);
    }

    return (

        <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                <h1 className='text-2xl'>Forgot Password</h1>
                <AiOutlineQuestion size={25} />
            </div>
            <ToastContainer />
            <form onSubmit={handleReset} className='w-full mt-6 mb-6 space-y-8'>
                <div>
                    <div className='text-gray-500 mb-1'>Email</div>
                    <input 
                        type='email' 
                        className='w-full p-3 border border-gray-400 bg-transparent rounded-md'
                        onChange={(e) => setUsername_or_email(e.target.value)}
                        required
                    />
                </div>

                <div className=''>
                    {sending ? 
                        <button className='w-full flex justify-center p-3 mt-4 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-2 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            Send Reset Link
                        </button>
                    }
                    <div className='flex justify-end py-1 mt-1'>
                        <span 
                            className='cursor-pointer text-gray-500'
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
