import React, { Fragment, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { MdClear } from 'react-icons/md';
import { getInitServiceData, submitApplication } from '../../../apis/authActions';
import InitLoader from '../../../common/InitLoader';
import RequestForm from './RequestForm';
import { GrFormPreviousLink } from 'react-icons/gr';
import ManagePayments from '../payments/ManagePayments';
import { useNavigate } from 'react-router-dom';

const NewServiceApplication = ({ serviceObject }) => {

    const { token, user, updateServiceObject } = useContext(AuthContext);

    const navigate = useNavigate();

    const [initSteps, setInitSteps] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymodal, setPaymodal] = useState(false);
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const clearRequest = () => {
        updateServiceObject(null);
    }

    console.log(initSteps);

    const initiateApplication  = () => {
        const data = {
            local_government_id: serviceObject?.local_government_id,
            eservices_id: serviceObject?.eservice?.id
        }
        submitApplication(token, data, setSuccess, setError, setSubmitting)
    }


    if(success !== null){
        //clearRequest();
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


    useEffect(() => {
        getInitServiceData(token, serviceObject?.eservice?.id, setInitSteps, setError, setLoading);
    }, [])

    return (
        <div className="w-full">
            <div className='w-full'>
                <div className='w-full flex justify-between my-2'>
                    <div 
                        className='bg-[#cce2d6] mt-4 rounded-full p-1 w-max cursor-pointer'
                        onClick={clearRequest}
                    >
                        <GrFormPreviousLink size={30} />
                    </div>
                    <button 
                        className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] text-white'
                        onClick={clearRequest}
                    >
                        <MdClear size={18} />
                        <span>Clear Request</span>
                    </button>
                </div>
                <div className='w-full rounded-md bg-[#d7e88f] px-6 py-4 my-6 md:max-w-max text-gray-700'>
                    <div className='my-1 flex space-x-2'>
                        <span className='font-bold'>LGA :</span>
                        <span>{serviceObject?.localgovernments?.name}</span>
                    </div>
                    <div className='my-1 flex space-x-2'>
                        <span className='font-bold'>Application :</span>
                        <span>{serviceObject?.eservice?.name}</span>
                    </div>
                </div>
                {
                    initSteps === null ? <InitLoader /> : 
                        <div className='grid grid-cols-6 md:grid-cols-4'>
                            <div className='col-span-1 pr-2 py-2 bg-white rounded-l-lg'>
                            {
                                initSteps.map(istep => {
                                    return <div 
                                        key={istep?.id} 
                                        className={`w-full flex justify-between pl-6 py-4 ${istep?.order_no !== 1 && 'border-b'} border-gray-100 ${ istep?.order_no === 1 ? 'text-[#0d544c] hover:text-green-600 font-bold cursor-pointer' : 'hover:font-medium text-gray-600 hover:text-gray-900' } items-center`}
                                    >
                                        <span className={`md:hidden rounded-full ${ istep?.order_no === 1 ? 'bg-[#0d544c] text-white' : 'text-[#0d544c] border-[#0d544c]'} px-2`}>
                                            {istep?.order_no}
                                        </span>
                                        {istep?.order_no === 1 ? <span className='hidden md:block'>{istep?.step?.step_name}</span> : <span className='hidden md:block'><i className='text-gray-300'>{istep?.step?.step_name}</i></span> }
                                    </div>
                                })
                            }
                            </div>
                            <div className='col-span-5 md:col-span-3 pl-2'>
                                <div className='w-full bg-white rounded-r-lg p-4'>
                                    {
                                        initSteps[0]?.step?.flag === 'PAYMENT_REQUIRED' && 
                                            (
                                                submitting ? 
                                                <div 
                                                    className='w-full p-4 bg-green-100 text-green-800 cursor-pointer'
                                                >
                                                    <i>loading payment window...</i>
                                                </div> 
                                                :
                                                <div 
                                                    className='w-full p-4 bg-green-100 text-green-800 cursor-pointer'
                                                    onClick={initiateApplication}
                                                >
                                                    Payment for application form is required for this E-service. Click here to proceed with payment.
                                                </div> 
                                               
                                            )
                                    }
                                    {
                                        initSteps[0]?.step?.flag === 'ADD_INFO' &&
                                            <RequestForm 
                                                action_id={initSteps[0]?.action_id} 
                                                eservice_id={serviceObject?.eservice?.id}  
                                                lg_id={serviceObject?.local_government_id}
                                            />
                                    }
                                    
                                </div>
                            </div>
                        </div>
                }
                
            </div>
        </div>
    )
}

export default NewServiceApplication
