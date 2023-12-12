import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { getServiceFormdata, submitApplication } from "../../../apis/authActions";
import OptionsList from "../../../common/OptionsList";
import ButtonLoader from "../../../common/ButtonLoader";
import InitLoader from "../../../common/InitLoader";
import { useNavigate } from "react-router-dom";


const RequestForm = ({ action_id, eservice_id, lg_id }) => {

    console.log(action_id);
    console.log(lg_id);

    const navigate = useNavigate();
    const { token, user, updateServiceObject, logout } = useContext(AuthContext);


    const [formdata, setFormdata] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fmdata, setFmdata] = useState({});
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const clearRequest = () => {
        updateServiceObject(null);
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
            local_government_id: lg_id,
            eservices_id: eservice_id,
            formmetadata_id: action_id,
            data :JSON.stringify(fmdata),
        }

        console.log(data);

        submitApplication(token, data, setSuccess, setError, setSubmitting)
    }

    if(success !== null){
        console.log(success);
        clearRequest();
        //navigate('/application');
        navigate(
            '/application-detail',
            {
                state : { 
                    appid : success?.application?.id, 
                    currentStep : success?.next_step?.step?.flag
                }
            }
        )
    }

    if(error !== null && error?.message === 'Token has expired'){
        logout();
    }

    useEffect(() => {
        getServiceFormdata(token, action_id, setFormdata , setError, setLoading)
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
                {error && <span className="text-red-500">{error?.message}</span>}

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between flex-wrap bg-white rounded-md p-6">
                        {loading ? <InitLoader /> : (formdata !== null ? (
                            formdata.map((field, index) => {
                                return <div key={index} className="w-full md:w-[48%] my-3">
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
                                                className={`${field?.type === 'checkbox' ? 'w-10 h-10' : 'w-full'} px-3 py-2 border border-gray-500 rounded-md my-2`}
                                                required={(field?.required && field?.required === true) && 'required'}
                                                name={field?.name}
                                                onChange={(e) => setValue(e)}
                                            />                                    
                                    }
                                    
                                </div> 
                            })
                        ) : <div className="text-xl text-red-600">NO FORM DATA FOUND</div>)}
                        {formdata !== null && <div className="w-full">
                            {
                                submitting ? 
                                    <button className='w-full md:w-[48%] flex justify-center py-3 my-2 rounded-md bg-[#0d544c] hover:bg-[#1c413e] text-white'>
                                        <ButtonLoader />
                                    </button> : 
                                    <button 
                                        className="w-full md:w-[48%] py-3 my-2 rounded-md bg-[#0d544c] hover:bg-[#1c413e] text-white"
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
