// src/protected/lga_admin/components/ApplicantInfo.jsx
import React from 'react';

const ApplicantInfo = ({ appinfo, user }) => {
    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md mb-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-4">Applicant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Username</span>
                    <span className="text-gray-700">{user?.username || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-gray-700">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Mobile</span>
                    <span className="text-gray-700">{user?.mobile || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Full Name</span>
                    <span className="text-gray-700">
                        {user?.personal_information ? (
                            `${user.personal_information.first_name} ${user.personal_information.last_name}`
                        ) : (
                            <i className="text-orange-600">No Profile Information</i>
                        )}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">E-Service</span>
                    <span className="text-gray-700">{appinfo?.data?.eservice?.name || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">LGA</span>
                    <span className="text-gray-700">{appinfo?.data?.local_government?.name || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Application ID</span>
                    <span className="text-gray-700">{appinfo?.data?.ref_no || 'N/A'}</span>
                </div>
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

export default ApplicantInfo;