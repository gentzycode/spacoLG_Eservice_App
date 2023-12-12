import { useState } from 'react'
import { MdOutlineLockReset } from 'react-icons/md'
import ButtonLoader from '../../../common/ButtonLoader';
import { resetPassword } from '../../../apis/noAuthActions';
import { ToastContainer, toast } from 'react-toastify';


const ResetPassword = ({ handleChildUpdate }) => {
    
    const [otp, setOtp] = useState();
    const [mobile, setMobile] = useState();
    const [new_password, setNew_password] = useState();
    const [new_password_confirmation, setNew_password_confirmation] = useState();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [resetting, setResetting] = useState(false);

    const handleReset = (e) => {
        e.preventDefault();

        const data = {
            otp, mobile, new_password, new_password_confirmation
        }

        resetPassword(data, setSuccess, setError, setResetting);
    }

    if(success !== null){
        toast.success(success?.message);
        setTimeout(() => handleChildUpdate('login'), 3000);
        //handleChildUpdate('login');
    }

    if(error !== null){
        toast.error(error?.message?.errors ? error?.message?.errors : error?.message);
        setError(null);
    }



    return (
        <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                <MdOutlineLockReset size={25} />
                <h1 className='text-2xl'>Reset Password</h1>
            </div>
            <ToastContainer />
            <form onSubmit={handleReset} className='w-full mb-6 space-y-6'>
                <div>
                    <div className='text-gray-500 mb-1'>OTP</div>
                    <input 
                        type='text' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <div className='text-gray-500 mb-1'>Mobile</div>
                    <input 
                        type='text' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <div className='text-gray-500 mb-1'>Password</div>
                    <input 
                        type='password' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setNew_password(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <div className='text-gray-500 mb-1'>Confirm Password</div>
                    <input 
                        type='password' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setNew_password_confirmation(e.target.value)}
                        required
                    />
                </div>

                <div className=''>
                    {resetting ? 
                        <button className='w-full flex justify-center p-3 mt-8 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-4 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            Reset
                        </button>
                    }
                    <div className='flex justify-end py-1'>
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

export default ResetPassword
