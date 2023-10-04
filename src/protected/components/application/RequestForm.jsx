import { useContext, useEffect, useState } from "react"
import { MdClear } from "react-icons/md"
import { AuthContext } from "../../../context/AuthContext"
import { getServiceFormdata, submitApplication } from "../../../apis/authActions";
import AuthLoader from '../../../common/AuthLoader'
import OptionsList from "../../../common/OptionsList";
import ButtonLoader from "../../../common/ButtonLoader";
//import { useNavigate } from "react-router-dom"


const RequestForm = ({ serviceObject }) => {

    //const navigate = useNavigate();
    const { token, user, updateServiceObject } = useContext(AuthContext);

    const [formdata, setFormdata] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fmdata, setFmdata] = useState({});
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    //console.log(formdata)

    const clearRequest = () => {
        updateServiceObject(null);
        //navigate('/application');
    }

    const setValue = (e) => {

        const {name, value} = e.target;

        setFmdata({
            ...fmdata,
            [name] : value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            formmetadata_id: formdata?.id,
            data :JSON.stringify(fmdata),
        }

        console.log(data);

        submitApplication(token, data, setSuccess, setError, setSubmitting)
    }

    useEffect(() => {
        getServiceFormdata(token, serviceObject?.eservice?.name, setFormdata , setError, setLoading)
    }, [])

    useEffect(() => {
        setFmdata({
            ...fmdata,
            user_id : user?.id
        })
    }, [])


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
                {/**<div className='mt-5'>
                    <h1 className='text-2xl font-extralight'>E-Service form appears here!</h1>
                </div>*/}
                {error && <span className="text-red-500">{error?.message}</span>}

                <form onSubmit={handleSubmit}>
                    <div className="mt-5 flex justify-between flex-wrap bg-white rounded-md p-6">
                        {loading ? <AuthLoader /> : (formdata !== null && (
                            JSON.parse(formdata.metadata).fields.map((field, index) => {
                                return <div key={index} className="w-full md:w-[48%] lg:w-[32%] my-3">
                                    <div className="w-full flex text-sm text-gray-500">
                                        {field?.type !== 'hidden' && field?.label}
                                        {(field?.required && field?.required === true) && <div className="ml-2 text-red-500 font-bold">*</div>}
                                    </div>
                                    {
                                        field?.type === 'dropdown' ?
                                            <select
                                                className="w-full px-3 py-2.5 border border-gray-500 rounded-md my-2 bg-transparent"
                                                required={(field?.required && field?.required === true) && 'required'}
                                                name={field?.name}
                                                onChange={(e) => setValue(e)}
                                            >
                                                <option value=''></option>
                                                <OptionsList source={field?.source} />
                                            </select>
                                            :
                                            <input 
                                                type={field?.type}
                                                className={`w-full ${field?.type === 'checkbox' && 'w-10 h-10'} px-3 py-2 border border-gray-500 rounded-md my-2`}
                                                required={(field?.required && field?.required === true) && 'required'}
                                                name={field?.name}
                                                onChange={(e) => setValue(e)}
                                            />                                    
                                    }
                                    
                                </div> 
                            })
                        ))}
                        {formdata !== null && <div className="w-full">
                            {
                                submitting ? 
                                    <button className='w-full md:w-[48%] lg:w-[32%] flex justify-center py-3 my-2 rounded-md bg-[#0d544c] hover:bg-[#1c413e] text-white'>
                                        <ButtonLoader />
                                    </button> : 
                                    <button 
                                        className="w-full md:w-[48%] lg:w-[32%] py-3 my-2 rounded-md bg-[#0d544c] hover:bg-[#1c413e] text-white"
                                    >
                                        Submit
                                    </button>
                            }
                            
                        </div>}
                        
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default RequestForm
