import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { MdClear } from 'react-icons/md';
import { getInitServiceData } from '../../../apis/authActions';
import InitLoader from '../../../common/InitLoader';
import RequestForm from './RequestForm';

const NewServiceApplication = ({ serviceObject }) => {

    const { token, user, updateServiceObject } = useContext(AuthContext);

    const [initSteps, setInitSteps] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const clearRequest = () => {
        updateServiceObject(null);
    }

    useEffect(() => {
        getInitServiceData(token, serviceObject?.eservice?.id, setInitSteps, setError, setLoading);
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
                    
                </div>
                {
                    initSteps === null ? <InitLoader /> : 
                        <div className='grid grid-cols-6 md:grid-cols-4'>
                            <div className='col-span-1 pr-2 py-2 bg-white rounded-l-lg'>
                            {
                                initSteps.map(istep => {
                                    return <div 
                                        key={istep?.id} 
                                        className={`w-full flex justify-between pl-6 py-4 ${initSteps.length !== istep?.id && 'border-b'} border-gray-100 ${ istep?.id === 1 ? 'text-[#0d544c] hover:text-green-600 font-bold cursor-pointer' : 'hover:font-medium text-gray-600 hover:text-gray-900' } items-center`}
                                    >
                                        <span className={`md:hidden rounded-full ${ istep?.id === 1 ? 'bg-[#0d544c] text-white' : 'text-[#0d544c] border-[#0d544c]'} px-2`}>
                                            {istep?.id}
                                        </span>
                                        {istep?.id === 1 ? <span className='hidden md:block'>{istep?.step?.step_name}</span> : <span className='hidden md:block'><i className='text-gray-300'>{istep?.step?.step_name}</i></span> }
                                    </div>
                                })
                            }
                            </div>
                            <div className='col-span-5 md:col-span-3 pl-2'>
                                <div className='w-full bg-white rounded-r-lg p-4'>
                                    <p className='text-sm text-gray-500'>{serviceObject?.localgovernments?.name}</p>
                                    <h1 className='text-2xl py-2 border-b border-gray-200'>{serviceObject?.eservice?.name}</h1>
                                    <RequestForm action_id={initSteps[0]?.step?.action_id} eservice_id={serviceObject?.eservice?.id} />
                                </div>
                            </div>
                        </div>
                }
                
            </div>
        </div>
    )
}

export default NewServiceApplication
