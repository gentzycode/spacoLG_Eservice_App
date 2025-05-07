import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GrFormPreviousLink } from 'react-icons/gr';
import { getPublicApplicationStatus } from '../../../apis/noAuthActions';
import ButtonLoader from '../../../common/ButtonLoader';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const StatusCheckComponent = () => {
    const loc = useLocation();
    const [refno, setRefno] = useState();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showinfo, setShowinfo] = useState(false);

    const toggleInfo = () => {
        setShowinfo(!showinfo);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        getPublicApplicationStatus(refno, setSuccess, setError, setLoading);
    };

    return (
        <div className="w-full col-span-1 mt-16 my-0 md:my-8 flex justify-center px-4 md:px-0 animate-slideIn">
            <div className={`w-full ${loc.pathname === '/status-check' ? 'md:w-2/3' : ''}`}>
                {loc.pathname === '/status-check' ? (
                    <div className="mt-8">
                        <Link to="/" className="group">
                            <div className="flex items-center space-x-2">
                                <div className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md group-hover:shadow-lg transition-all">
                                    <GrFormPreviousLink size={24} className="text-[#3B78BD] dark:text-[#F0B652]" />
                                </div>
                                <span className="text-[#3B78BD] dark:text-[#F0B652] font-medium group-hover:underline">
                                    Back to Home
                                </span>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="mt-2">
                        <div className="bg-white dark:bg-gray-700 rounded-full p-2 w-max cursor-pointer">
                            <GrFormPreviousLink size={24} className="text-[#3B78BD] dark:text-[#F0B652]" />
                        </div>
                    </div>
                )}
                <div className="w-full">
                    {loc.pathname === '/status-check' && (
                        <h1 className="mt-10 text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
                            Check Application Status
                        </h1>
                    )}
                    {error !== null && <p className="text-red-500 dark:text-red-400 mt-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="w-full my-8 flex">
                            <input
                                type="text"
                                placeholder="Enter application reference"
                                className="w-full p-4 rounded-l-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B78BD] transition-all"
                                required
                                onChange={(e) => setRefno(e.target.value)}
                            />
                            {loading ? (
                                <button
                                    className="flex justify-center rounded-r-md w-[150px] py-4 text-white bg-[#3B78BD] hover:bg-[#F0B652] transition-all duration-300"
                                >
                                    <ButtonLoader />
                                </button>
                            ) : (
                                <button
                                    className="rounded-r-md w-[150px] py-4 text-white bg-[#3B78BD] hover:bg-[#F0B652] transition-all duration-300"
                                >
                                    Check
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="w-full">
                        {success !== null && (
                            <div className="my-4 space-y-6">
                                <div className="w-full flex space-x-3 items-center">
                                    <span className="text-gray-600 dark:text-gray-300 font-semibold">Status:</span>
                                    <span
                                        className={`uppercase ${
                                            success?.status?.step?.flag === 'D_CERT'
                                                ? 'text-[#F0B652]'
                                                : 'text-[#3B78BD]'
                                        } font-semibold`}
                                    >
                                        {success?.status?.step?.step_name}
                                    </span>
                                </div>

                                <div className="w-full h-3 rounded-full border border-gray-400 dark:border-gray-600 overflow-hidden">
                                    {success?.status?.step?.flag === 'D_CERT' ? (
                                        <div className="w-full h-full bg-[#F0B652] rounded-full animate-progress"></div>
                                    ) : (
                                        <div
                                            className={`${
                                                success?.status?.order_no < 5 ? 'w-[30%]' : 'w-[70%]'
                                            } h-full bg-[#3B78BD] rounded-full animate-progress`}
                                        ></div>
                                    )}
                                </div>

                                <div className="w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
                                    <div className="my-2 flex space-x-2">
                                        <span className="font-bold text-gray-600 dark:text-gray-300">LGA:</span>
                                        <span className="text-gray-600 dark:text-gray-300">{success?.local_government?.name}</span>
                                    </div>
                                    <div className="my-2 flex space-x-2">
                                        <span className="font-bold text-gray-600 dark:text-gray-300">Application:</span>
                                        <span className="text-gray-600 dark:text-gray-300">{success?.eservice?.name}</span>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <span
                                        className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer hover:underline"
                                        onClick={() => toggleInfo()}
                                    >
                                        Click to preview the application detail
                                    </span>
                                </div>

                                {showinfo && (
                                    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 p-6 text-gray-600 dark:text-gray-300 shadow-md">
                                        <h1 className="flex justify-between items-center uppercase font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-700 dark:text-gray-300">Application Request Preview</span>
                                            <span
                                                className="cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 transition-colors"
                                                onClick={() => toggleInfo()}
                                            >
                                                <AiOutlineCloseCircle size={20} />
                                            </span>
                                        </h1>
                                        {success?.form_submission !== null ? (
                                            Object.keys(JSON.parse(success?.form_submission?.data)).map((key, i) => {
                                                return key !== 'user_id' && (
                                                    <div key={i} className="flex space-x-3 py-2">
                                                        <span className="font-semibold capitalize">
                                                            {key.replace('_', ' ').replace('_', ' ')}:
                                                        </span>
                                                        <span>
                                                            {JSON.parse(success?.form_submission?.data)[key] === 'on'
                                                                ? 'Yes'
                                                                : JSON.parse(success?.form_submission?.data)[key]}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-gray-700 dark:text-gray-400">
                                                No detail found on this application because registration form has not been completed
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes progress {
                    from { width: 0; }
                    to { width: inherit; }
                }
                .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
                .animate-progress { animation: progress 1s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default StatusCheckComponent;