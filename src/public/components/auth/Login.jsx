import { useContext, useState } from 'react'
import { RiShieldKeyholeLine } from 'react-icons/ri'
import ButtonLoader from '../../../common/ButtonLoader';
import { signIn } from '../../../apis/noAuthActions';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ handleChildUpdate }) => {

    const locatn = useLocation();

    const navigate = useNavigate();

    const { tempUserid } = useContext(AuthContext);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [loggingin, setLoggingin] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();

        const data = {
            username, password
        }

        signIn(data, setSuccess, setError, setLoggingin);
    }


    if(success !== null){
        localStorage.setItem('isLoggedIn', JSON.stringify(success));
        locatn.pathname === '/service' ? navigate('/application') : navigate('/dashboard');
        location.reload();
    }

    if(error && error?.user_id){
        tempUserid(error?.user_id);
        handleChildUpdate('verify-email');
    }

    if(error && error?.message){
        toast.error(error?.message);
        setError(null);
    }


    return (
        <div className="w-full border-gray-300">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                {locatn.pathname !== '/service' && <RiShieldKeyholeLine size={25} />}
                {locatn.pathname !== '/service' && <h1 className='text-2xl'>Login</h1>}
            </div>
            <ToastContainer />
            { (error && error?.user_id) && <p className='text-[#0d544c] cursor-pointer' onClick={() => handleChildUpdate('verify-email')}>Click here to verify your email.</p>}
            <form onSubmit={handleLogin} className='w-full mt-0 mb-6 space-y-4'>
                <div>
                    <div className='text-gray-500 mb-1'>Username or email</div>
                    <input 
                        type='text' 
                        className='w-full p-3 border border-gray-400 bg-transparent rounded-md'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <div className='text-gray-500 mb-1'>Password</div>
                    <input 
                        type='password' 
                        className='w-full p-3 border border-gray-400 bg-transparent rounded-md'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className=''>
                    {loggingin ? 
                        <button className='w-full flex justify-center p-3 mt-6 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-2 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            Login
                        </button>
                    }
                    <div className='flex justify-between items-center py-2'>
                        <div 
                            className='cursor-pointer text-gray-700'
                            onClick={() => handleChildUpdate('register')}
                        >
                                Don't have an account? <span className='text-orange-500'>Create one</span>
                        </div>
                        <div className='flex justify-end py-1'>
                            <span 
                                className='cursor-pointer text-gray-500'
                                onClick={() => handleChildUpdate('forgot-password')}
                            >
                                Forgot Password?
                            </span>
                        </div>
                        
                    </div>
                </div>
                
            </form>
        </div>
    )
}

export default Login
