// src/protected/components/application/Application.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { deleteApplication, userApplications } from '../../../apis/authActions';
import ApplicationsTable from './ApplicationsTable';
import { formatDate, statusColor } from '../../../apis/functions';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';
import { MdOutlineFileDownload } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Application = () => {
    const { token, logout, updateServiceObject } = useContext(AuthContext);
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(null);
    const [selectedApplications, setSelectedApplications] = useState([]);

    useEffect(() => {
        userApplications(token, setApplications, setError, setFetching);
        updateServiceObject(null);
        localStorage.removeItem('selectedService');
    }, [token, updateServiceObject]);

    const getApplicationDetail = (appid, currentStep) => {
        navigate('/application-detail', { state: { appid, currentStep } });
    };

    const handleDelete = (appid) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            deleteApplication(token, appid, setSuccess, setError, () => {});
        }
    };

    const handleSelect = (id) => {
        setSelectedApplications((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedApplications(applications.map((app) => app.id));
        } else {
            setSelectedApplications([]);
        }
    };

    if (error) {
        if (error?.message === 'Token has expired') {
            logout();
        }
        toast.error(error?.message);
        setError(null);
    }

    if (success) {
        toast.success(success?.message);
        setSuccess(null);
        userApplications(token, setApplications, setError, setFetching);
    }

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectedApplications.length === applications.length && applications.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={selectedApplications.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            width: '60px',
            center: true,
        },
        {
            name: 'Reference No.',
            selector: (row) => row?.ref_no?.toUpperCase() || 'N/A',
            sortable: true,
        },
        {
            name: 'E-service',
            selector: (row) => row?.eservice?.name?.toUpperCase() || 'N/A',
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row?.current_step?.step?.step_name || 'N/A',
            sortable: true,
            cell: (row) => (
                <div className={statusColor(row?.current_step?.step?.flag)}>
                    {row?.current_step?.step?.step_name?.toUpperCase() || 'N/A'}
                </div>
            ),
        },
        {
            name: 'Date Applied',
            selector: (row) => row?.created_at,
            sortable: true,
            cell: (row) => formatDate(row?.created_at) || 'N/A',
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <div className="flex space-x-2">
                    {row?.current_step?.step?.flag === 'D_CERT' ? (
                        <MdOutlineFileDownload
                            className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer"
                            size={18}
                            onClick={() => getApplicationDetail(row?.id, row?.eservice?.step?.flag)}
                        />
                    ) : (
                        <FiEdit
                            className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer"
                            size={18}
                            onClick={() => getApplicationDetail(row?.id, row?.eservice?.step?.flag)}
                        />
                    )}
                    {row?.current_step?.step?.flag !== 'P_CERT' && row?.current_step?.step?.flag !== 'D_CERT' && (
                        <HiOutlineTrash
                            className="text-red-600 cursor-pointer"
                            size={18}
                            onClick={() => handleDelete(row?.id)}
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="mt-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">My Applications</h2>
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
            ) : error ? (
                <div className="text-center py-6 text-[#f06752] dark:text-red-400">{error}</div>
            ) : applications.length === 0 ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-300">
                    No applications found.
                </div>
            ) : (
                <ApplicationsTable columns={columns} appdata={applications} />
            )}
            <ToastContainer />
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

export default Application;