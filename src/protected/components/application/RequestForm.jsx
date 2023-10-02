import { useContext } from "react"
import { MdClear } from "react-icons/md"
import { AuthContext } from "../../../context/AuthContext"
import { useNavigate } from "react-router-dom"


const RequestForm = ({ serviceObject }) => {

    const navigate = useNavigate();
    const { updateServiceObject } = useContext(AuthContext);

    const clearRequest = () => {
        //updateServiceObject(null);
        //navigate('/application');
    }

    return (
        <div className="w-full">
            <div className='w-full'>
                <div className='w-full flex justify-end my-2'>
                    <button 
                        className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] text-white'
                        onClick={clearRequest}
                    >
                        <MdClear size={18} />
                        <span>Clear Request</span>
                    </button>
                </div>
                <div className='pb-3 border-b border-gray-100'>
                    <p className='text-md my-2 text-gray-500'>{serviceObject?.localgovernments?.name}</p>
                    <h1 className='text-xl md:text-2xl font-extralight'>   
                        {serviceObject?.eservice?.name}
                    </h1>
                </div>
                <div className='mt-5'>
                    <h1 className='text-2xl font-extralight'>E-Service form appears here!</h1>
                </div>
            </div>
        </div>
    )
}

export default RequestForm
