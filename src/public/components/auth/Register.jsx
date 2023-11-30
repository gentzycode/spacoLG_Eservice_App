import { useContext, useState } from 'react';
import { GiArchiveRegister } from 'react-icons/gi'
import { useLocation } from 'react-router-dom';
import ButtonLoader from '../../../common/ButtonLoader';
import { signUp } from '../../../apis/noAuthActions';
import { AuthContext } from '../../../context/AuthContext';
import { formatError } from '../../../apis/functions';

const Register = ( { handleChildUpdate } ) => {

    const locatn = useLocation();
    const { storeAuthObject, tempUserid } = useContext(AuthContext);

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [mobile, setMobile] = useState();
    const [password_hash, setPassword_hash] = useState();
    const [password_hash_confirmation, setPassword_hash_confirmation] = useState();
    const [registering, setRegistering] = useState(false);

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleRegister = (e) => {
        e.preventDefault();
        setError(null);

        if(username.length < 6) {
            setError('The username must be at least 6 characters!');
        }
        else {
            const data = {
                username,
                email,
                mobile,
                password_hash,
                password_hash_confirmation
            }
            console.log(data);

            signUp(data, setSuccess, setError, setRegistering)
        }
    }


    if(success && success?.status === 'success'){
        storeAuthObject({
            username,
            password : password_hash
        });

        tempUserid(success?.data?.id);
        handleChildUpdate('verify-email');
    }

    return (
        <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                {locatn.pathname !== '/service' && <GiArchiveRegister size={25} />}
                <h1 className='text-gray-500'>{locatn.pathname === '/service' ? 'Please provide your information to continue the application process' : <span className='text-2xl'>Register</span>}</h1>
            </div>

            { error !== null && <span className='text-red-500 my-2'>{formatError(error)}</span>}

            <form onSubmit={handleRegister} className='w-full mt-0 mb-6 space-y-3'>
                <div>
                    <div className='text-gray-500 mb-1'>Username</div>
                    <input 
                        type='text' 
                        className='w-full p-3 rounded-md border border-gray-300 bg-transparent'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <div className='text-gray-500 mb-1'>Phone number</div>
                    <input 
                        type='number' 
                        className='w-full p-3 rounded-md border border-gray-300 bg-transparent'
                        onChange={(e) => setMobile(e.target.value)}
                    />
                </div>
                <div>
                    <div className='text-gray-500 mb-1'>Email</div>
                    <input 
                        type='email' 
                        className='w-full p-3 rounded-md border border-gray-300 bg-transparent'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <div className='text-gray-500 mb-1'>Password</div>
                    <input 
                        type='password' 
                        className='w-full p-3 rounded-md border border-gray-300 bg-transparent'
                        onChange={(e) => setPassword_hash(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <div className='text-gray-500 mb-1'>Confirm Password</div>
                    <input 
                        type='password' 
                        className='w-full p-3 rounded-md border border-gray-300 bg-transparent'
                        onChange={(e) => setPassword_hash_confirmation(e.target.value)}
                        required
                    />
                </div>
                

                <div className=''>
                    {registering ? 
                        <button className='w-full flex justify-center p-3 mt-5 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-2 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            Register
                        </button>
                    }
                    <div className='flex justify-start py-1 mt-2'>
                        <span 
                            className='cursor-pointer text-gray-700'
                            onClick={() => handleChildUpdate('login')}
                        >
                                Already have an account? <span className='text-orange-500'>Sign in</span>
                        </span>
                    </div>
                </div>
                
            </form>
        </div>
    )
}

export default Register
