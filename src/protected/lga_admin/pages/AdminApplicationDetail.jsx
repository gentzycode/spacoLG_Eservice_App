// src/protected/lga_admin/pages/AdminApplicationDetail.jsx
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAdminApplicationByID } from '../../../apis/adminActions';
import { MdKeyboardBackspace } from 'react-icons/md';
import AppStepsTab from '../../../common/AppStepsTab';
import ApplicantInfo from '../components/ApplicantInfo';

const AdminApplicationDetail = () => {
    const { token, logout, record } = useContext(AuthContext);
    const loctn = useLocation();
    const navigate = useNavigate();

    const [appdetail, setAppdetail] = useState(null);
    const [steps, setSteps] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const id = loctn?.state?.appid;
    const currentStep = appdetail?.data?.current_step;
    const serviceName = appdetail?.data?.eservice?.name;

    useEffect(() => {
        if (error?.message === 'Token has expired') {
            logout();
        }
    }, [error, logout]);

    useEffect(() => {
        if (id && token) {
            getAdminApplicationByID(token, id, setAppdetail, setSteps, setError, setFetching);
        } else {
            setError({ message: 'Invalid application ID or missing token' });
        }
    }, [id, token, record]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
            <div className="w-full flex justify-end my-4">
                <button
                    className="flex justify-center items-center space-x-2 rounded-md py-2 px-6 bg-[#3B78BD] hover:bg-[#F0B652] text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                    onClick={() => navigate('/applications')}
                >
                    <MdKeyboardBackspace size={22} />
                    <span>Back to Applications</span>
                </button>
            </div>
            {error && (
                <div className="text-center py-6 text-red-600 dark:text-red-400">
                    {error.message || 'Failed to load application details.'}
                </div>
            )}
            {fetching ? (
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
            ) : (
                <div className="w-full my-12 py-4">
                    {steps && steps.length > 0 ? (
                        <Fragment>
                            <ApplicantInfo appinfo={appdetail} user={appdetail?.data?.user} />
                            <AppStepsTab
                                steps={steps}
                                fetching={fetching}
                                current_step={currentStep}
                                serviceName={serviceName}
                                currentStep={currentStep}
                                steps_completed={appdetail?.steps_completed}
                                purpose_id={id}
                                admin_notes={appdetail?.data?.admin_notes}
                                authorizations={appdetail?.data?.authorizations}
                                authorizers={appdetail?.data?.authorizers}
                            />
                        </Fragment>
                    ) : (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">
                            No application steps available.
                        </div>
                    )}
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

export default AdminApplicationDetail;