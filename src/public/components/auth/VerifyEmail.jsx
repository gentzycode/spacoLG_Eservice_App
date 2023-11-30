import { useContext, useState } from "react";
import ButtonLoader from "../../../common/ButtonLoader";
import { signIn, verifyEmailCode } from "../../../apis/noAuthActions";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Envelope from "../../../assets/refresh_data.png"
import CountdownTimer from "../../../common/CountdownTimer";


const VerifyEmail = ({ handleChildUpdate }) => {

    const { authObject, userid } = useContext(AuthContext);
    const navigate = useNavigate();

    const [verification_code, setVerification_code] = useState();
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loggingin, setLoggingin] = useState(false);
    const [error, setError] = useState(null);

    const handleVerify = (e) => {
        e.preventDefault();

        const data = {
            user_id : userid,
            verification_code
        }

        verifyEmailCode(data, setVerified, setError, setVerifying);
    }


    if(verified !== null){

        if(authObject !== null){
            const data = {
                username : authObject?.username,
                password : authObject?.password
            }
    
            signIn(data, setSuccess, setError, setLoggingin);
            setVerified(null);
        }
        else{
            handleChildUpdate('login')
        }
    }


    if(success !== null){
        localStorage.setItem('isLoggedIn', JSON.stringify(success));
        setSuccess(null);
        //location.reload();
        navigate('/application')
    }

    return (
        <div className="w-full">
            <div className="mt-12">
                <img src={Envelope} alt="envelope" />
            </div>
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 border-gray-300 mt-6">
                <h1 className='text-xl font-bold'>Check your email</h1>
            </div>
            <p className="py-2 text-gray-400 my-2">A verification code has been sent to your email. Please enter the code in the field below and proceed</p>
            {error !== null && <p className="py-2 text-red-600 my-2">{error}</p>}
            <form onSubmit={handleVerify} className='w-full mt-6 mb-6 space-y-8'>
                <input 
                    type='text' 
                    className='w-full p-3 border border-gray-400 bg-transparent rounded-md'
                    placeholder='Enter Code'
                    onChange={(e) => setVerification_code(e.target.value)}
                    required
                />
                <CountdownTimer />
                <div className=''>
                    {verifying ? 
                        <button className='w-full flex justify-center p-3 mt-2 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-0 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            Proceed
                        </button>
                    }
                    <div className='flex justify-end py-1 mt-1'>
                        <span 
                            className='cursor-pointer text-orange-500'
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

export default VerifyEmail
