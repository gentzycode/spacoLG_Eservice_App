import React from 'react';
import { format } from 'date-fns';

const ViewAssessmentModal = ({ assessment, onClose }) => {
    if (!assessment) return null;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            under_review: 'bg-orange-100 text-orange-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            invoice_generated: 'bg-purple-100 text-purple-800',
            paid: 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatAppData = (data) => {
        if (!data || typeof data !== 'object') return [];
        return Object.entries(data).map(([key, value]) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            value: String(value)
        }));
    };

    const appData = formatAppData(assessment.application_data);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assessment Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {/* Basic Info */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Assessment Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="text-xs text-gray-500">Assessment Number</label>
                                    <p className="font-semibold text-blue-600">{assessment.assessment_number}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Status</label>
                                    <div><span className={`px-2 py-1 text-xs rounded ${getStatusColor(assessment.status)}`}>{assessment.status}</span></div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Template</label>
                                    <p>{assessment.template?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Revenue Head</label>
                                    <p>{assessment.revenue_head?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Applicant Info */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Applicant Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="text-xs text-gray-500">Name</label>
                                    <p className="font-medium">{assessment.applicant_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Phone</label>
                                    <p>{assessment.applicant_phone}</p>
                                </div>
                                {assessment.applicant_email && (
                                    <div>
                                        <label className="text-xs text-gray-500">Email</label>
                                        <p>{assessment.applicant_email}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Application Data */}
                        {appData.length > 0 && (
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Application Data</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {appData.map((item, i) => (
                                        <div key={i}>
                                            <label className="text-xs text-gray-500">{item.label}</label>
                                            <p>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        {/* Financial Summary */}
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-600">Calculated Amount</label>
                                    <p className="text-2xl font-bold text-green-600">₦{Number(assessment.calculated_amount || 0).toLocaleString()}</p>
                                </div>
                                {assessment.approved_amount && (
                                    <div className="pt-3 border-t border-green-200">
                                        <label className="text-xs text-gray-600">Approved Amount</label>
                                        <p className="text-2xl font-bold text-blue-600">₦{Number(assessment.approved_amount).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Workflow */}
                        {(assessment.reviewed_at || assessment.approved_at) && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                                <h3 className="font-semibold mb-3">Workflow</h3>
                                {assessment.reviewed_at && (
                                    <div className="mb-2">
                                        <label className="text-xs text-gray-500">Reviewed</label>
                                        <p className="text-xs">{format(new Date(assessment.reviewed_at), 'dd MMM yyyy, HH:mm')}</p>
                                    </div>
                                )}
                                {assessment.approved_at && (
                                    <div>
                                        <label className="text-xs text-gray-500">Approved</label>
                                        <p className="text-xs">{format(new Date(assessment.approved_at), 'dd MMM yyyy, HH:mm')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewAssessmentModal;
