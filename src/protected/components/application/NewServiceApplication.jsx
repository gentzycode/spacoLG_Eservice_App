// src/protected/components/application/NewServiceApplication.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { MdClear } from 'react-icons/md';
import { GrFormPreviousLink } from 'react-icons/gr';
import { getInitServiceData, submitApplication } from '../../../apis/authActions';
import { useNavigate } from 'react-router-dom';

const NewServiceApplication = ({ serviceObject }) => {
    const { token, updateServiceObject } = useContext(AuthContext);
    const navigate = useNavigate();

    const [initSteps, setInitSteps] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getInitServiceData(token, serviceObject?.eservice?.id, setInitSteps, setError, setLoading);
    }, [token, serviceObject]);

    const clearRequest = () => {
        updateServiceObject(null);
        navigate('/application');
    };

    const initiateApplication = () => {
        const data = {
            local_government_id: serviceObject?.local_government_id,
            eservices_id: serviceObject?.eservice?.id,
        };
        submitApplication(token, data, setSuccess, setError, setSubmitting);
    };

    if (success) {
        navigate('/application-detail', {
            state: {
                appid: success?.application?.id,
                currentStep: success?.next_step?.step?.flag,
            },
        });
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
            {error && <div className="text-center py-4 text-red-600">{error}</div>}
            <div className="w-full flex justify-between my-4">
                <button
                    className="bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-full p-2 transition-all duration-300 shadow-lg transform hover:scale-105"
                    onClick={clearRequest}
                >
                    <GrFormPreviousLink size={24} />
                </button>
                <button
                    className="w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#3B78BD] hover:bg-[#F0B652] text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                    onClick={clearRequest}
                >
                    <MdClear size={18} />
                    <span>Clear Request</span>
                </button>
            </div>
            <div className="w-full rounded-lg bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-6 my-6 text-white">
                <div className="my-2 flex space-x-2">
                    <span className="font-bold">LGA:</span>
                    <span>{serviceObject?.localgovernments?.name || 'N/A'}</span>
                </div>
                <div className="my-2 flex space-x-2">
                    <span className="font-bold">Application:</span>
                    <span>{serviceObject?.eservice?.name || 'N/A'}</span>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center my-5">
                    <svg
                        className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h-8z"
                        ></path>
                    </svg>
                </div>
            ) : initSteps ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-l-lg p-4 shadow-md">
                        {initSteps.map((istep) => (
                            <div
                                key={istep?.id}
                                className={`w-full flex justify-between py-4 ${
                                    istep?.order_no !== 1 && 'border-b'
                                } border-gray-100 ${
                                    istep?.order_no === 1
                                        ? 'text-[#3B78BD] font-bold cursor-pointer'
                                        : 'text-gray-600 hover:text-gray-900'
                                } items-center`}
                            >
                                <span
                                    className={`md:hidden rounded-full ${
                                        istep?.order_no === 1
                                            ? 'bg-[#3B78BD] text-white'
                                            : 'text-[#3B78BD] border-[#3B78BD]'
                                    } px-2`}
                                >
                                    {istep?.order_no}
                                </span>
                                <span className="hidden md:block">
                                    {istep?.order_no === 1 ? (
                                        istep?.step?.step_name
                                    ) : (
                                        <i className="text-gray-300">{istep?.step?.step_name}</i>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="md:col-span-3 bg-white rounded-r-lg p-6 shadow-md">
                        {initSteps[0]?.step?.flag === 'PAYMENT_REQUIRED' && (
                            <div
                                className={`w-full p-4 bg-green-100 text-green-800 cursor-pointer rounded-lg ${
                                    submitting ? 'opacity-50' : ''
                                }`}
                                onClick={!submitting ? initiateApplication : undefined}
                            >
                                {submitting ? (
                                    <i>Loading payment window...</i>
                                ) : (
                                    'Payment for application form is required for this E-service. Click here to proceed with payment.'
                                )}
                            </div>
                        )}
                        {initSteps[0]?.step?.flag === 'ADD_INFO' && (
                            <div
                                className={`w-full p-4 bg-green-100 text-green-800 cursor-pointer rounded-lg ${
                                    submitting ? 'opacity-50' : ''
                                }`}
                                onClick={!submitting ? initiateApplication : undefined}
                            >
                                {submitting ? (
                                    <i>Loading form window...</i>
                                ) : (
                                    'Information for this E-service is required. Click here to proceed with filling the required information form.'
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-6 text-gray-600 dark:text-gray-300">
                    No steps available for this service.
                </div>
            )}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default NewServiceApplication;