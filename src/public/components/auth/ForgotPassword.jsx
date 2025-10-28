import { AiOutlineQuestion } from 'react-icons/ai';
import { forgotPassword } from '../../../apis/noAuthActions';
import { useState, useEffect } from 'react';
import ButtonLoader from '../../../common/ButtonLoader';
import toast, { toastMessages } from '../../../utils/toast';

const ForgotPassword = ({ handleChildUpdate }) => {
    const [username_or_email, setUsername_or_email] = useState();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);

    const handleReset = (e) => {
        e.preventDefault();

        if (!username_or_email) {
            toast.warning('Please enter your email address');
            return;
        }

        const data = {
            username_or_email
        };

        forgotPassword(data, setSuccess, setError, setSending);
    };

    useEffect(() => {
        if (success !== null) {
            toast.success(success?.message || toastMessages.auth.passwordResetSent);
            setTimeout(() => {
                handleChildUpdate('reset-password');
            }, 3000);
        }
    }, [success]);

    useEffect(() => {
        if (error !== null) {
            toast.error(error?.message || toastMessages.auth.passwordResetError);
            setError(null);
        }
    }, [error]);

    return (
        <div className="w-full">
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
                        <button className='w-full flex justify-center p-3 mt-6 rounded-md bg-[#F0B652] hover:bg-[#3B78BD] text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-2 rounded-md bg-[#F0B652] hover:bg-[#3B78BD] text-white'>
                            Send Reset Link
                        </button>
                    }
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;