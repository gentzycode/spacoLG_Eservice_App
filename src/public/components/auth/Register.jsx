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

        const data = {
            username,
            email,
            mobile,
            password_hash,
            password_hash_confirmation
        }
        console.log(data);

        signUp(data, setSuccess, setError, setRegistering);
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
                <GiArchiveRegister size={25} />
                <h1 className='text-2xl md:text-2xl'>{locatn.pathname === '/service' ? 'Provide your Information' : 'Register'}</h1>
            </div>

            { error !== null && <span className='text-red-500 my-2'>{formatError(error)}</span>}

            <form onSubmit={handleRegister} className='w-full mt-0 mb-6 space-y-8'>
                <input 
                    type='text' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Username'
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input 
                    type='number' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Mobile (2348012345678)'
                    onChange={(e) => setMobile(e.target.value)}
                />
                <input 
                    type='email' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type='password' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Password'
                    onChange={(e) => setPassword_hash(e.target.value)}
                    required
                />
                <input 
                    type='password' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Confirm Password'
                    onChange={(e) => setPassword_hash_confirmation(e.target.value)}
                    required
                />

                <div className=''>
                    {registering ? 
                        <button className='w-full flex justify-center p-3 mt-16 rounded-2xl bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-8 rounded-2xl bg-[#0d544c] hover:bg-green-700 text-white'>
                            Register
                        </button>
                    }
                    <div className='flex justify-end py-1'>
                        <span 
                            className='cursor-pointer text-gray-500'
                            onClick={() => handleChildUpdate('login')}
                        >
                                Already have an account? Login
                        </span>
                    </div>
                </div>
                
            </form>
        </div>
    )
}

export default Register
