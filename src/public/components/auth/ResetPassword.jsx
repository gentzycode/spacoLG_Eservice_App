import { useState } from 'react'
import { MdOutlineLockReset } from 'react-icons/md'
import ButtonLoader from '../../../common/ButtonLoader';
import { resetPassword } from '../../../apis/noAuthActions';


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
        alert(success?.message);
        setSuccess(null);
        handleChildUpdate('login');
    }


    return (
        <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                <MdOutlineLockReset size={40} />
                <h1 className='text-4xl'>Reset Password</h1>
            </div>
            {error !== null && <span className='text-red-500'>{error?.message?.errors ? error?.message?.errors : error?.message }</span>}
            <form onSubmit={handleReset} className='w-full mt-6 mb-6 space-y-8'>
                <input 
                    type='text' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Enter OTP'
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <input 
                    type='text' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Mobile'
                    onChange={(e) => setMobile(e.target.value)}
                    required
                />
                <input 
                    type='password' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Password'
                    onChange={(e) => setNew_password(e.target.value)}
                    required
                />
                
                <input 
                    type='password' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Confirm Password'
                    onChange={(e) => setNew_password_confirmation(e.target.value)}
                    required
                />

                <div className=''>
                    {resetting ? 
                        <button className='w-full flex justify-center p-3 mt-16 rounded-2xl bg-green-800 hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-8 rounded-2xl bg-green-800 hover:bg-green-700 text-white'>
                            Reset
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

export default ResetPassword
