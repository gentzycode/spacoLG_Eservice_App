// src/protected/pages/ApplicationDetail.jsx
import React, { useContext, useEffect, useState } from 'react';
import { GrFormPreviousLink } from 'react-icons/gr';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getApplicationByID, getLagById } from '../../apis/authActions';
import AppStepsTab from '../../common/AppStepsTab';

const ApplicationDetail = () => {
    const { token, logout, record } = useContext(AuthContext);
    const loctn = useLocation();
    const navigate = useNavigate();

    const [appdetail, setAppdetail] = useState(null);
    const [steps, setSteps] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [lga, setLga] = useState(null);
    const [lgaLoading, setLgaLoading] = useState(false);
    const id = loctn?.state?.appid;
    const currentStep = loctn?.state?.currentStep;
    const serviceName = appdetail?.data?.eservice?.name;

    useEffect(() => {
        if (error?.message === 'Token has expired') {
            logout();
        }
    }, [error, logout]);

    useEffect(() => {
        if (id && token) {
            getApplicationByID(token, id, setAppdetail, setSteps, setError, setFetching);
        } else {
            setError({ message: 'Invalid application ID or missing token' });
        }
    }, [id, token]);

    useEffect(() => {
        if (appdetail?.data?.local_government_id && token) {
            getLagById(token, appdetail.data.local_government_id, setLga, setLgaLoading);
        }
    }, [appdetail, token]);

    useEffect(() => {
        setTimeout(() => setFetching(false), 1000);
    }, [record]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
            <div className="w-full my-4">
                <button
                    className="bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-full p-2 transition-all duration-300 shadow-lg transform hover:scale-105"
                    onClick={() => navigate('/application')}
                >
                    <GrFormPreviousLink size={24} />
                </button>
            </div>
            {error && (
                <div className="text-center py-6 text-red-600 dark:text-red-400">
                    {error.message || 'Failed to load application details.'}
                </div>
            )}
            {(fetching || lgaLoading) && (
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
            )}
            {steps !== null && !fetching && !lgaLoading && (
                <div className="w-full rounded-lg bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-6 my-6 text-white animate-fadeIn">
                    <div className="my-2 flex space-x-2">
                        <span className="font-bold">LGA:</span>
                        <span>{lga?.name || 'N/A'}</span>
                    </div>
                    <div className="my-2 flex space-x-2">
                        <span className="font-bold">Application:</span>
                        <span>{serviceName || 'N/A'}</span>
                    </div>
                </div>
            )}
            <div className="w-full py-4">
                {steps !== null && steps.length > 0 && !fetching ? (
                    <AppStepsTab
                        steps={steps}
                        fetching={fetching}
                        current_step={appdetail?.data?.current_step}
                        serviceName={serviceName}
                        currentStep={currentStep}
                        steps_completed={appdetail?.steps_completed}
                        purpose_id={id}
                        admin_notes={appdetail?.data?.admin_notes}
                        app_lga_id={appdetail?.data?.local_government_id}
                    />
                ) : (
                    !fetching && (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">
                            No application steps available.
                        </div>
                    )
                )}
            </div>
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

export default ApplicationDetail;