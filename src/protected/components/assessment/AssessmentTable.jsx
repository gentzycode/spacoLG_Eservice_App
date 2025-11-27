import React from 'react';
import { format } from 'date-fns';

const AssessmentTable = ({ assessments, loading, error, onView, onReview, onApprove, onReject, onGenerateInvoice, onDelete }) => {
    if (loading) return <div className="text-center py-8"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B78BD]"></div><p className="mt-2 text-gray-600 dark:text-gray-400">Loading assessments...</p></div>;
    if (error) return <div className="text-center py-8"><p className="text-red-500">{error}</p></div>;
    if (!assessments || assessments.length === 0) return <div className="text-center py-8"><p className="text-gray-600 dark:text-gray-400">No assessments found.</p></div>;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            under_review: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            invoice_generated: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Assessment #</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Applicant</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Template</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Calculated</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Approved</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Status</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Date</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assessments.map((assessment) => (
                        <tr key={assessment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="p-3 font-medium text-blue-600 dark:text-blue-400">{assessment.assessment_number}</td>
                            <td className="p-3"><div><p className="font-medium text-gray-800 dark:text-white">{assessment.applicant_name}</p>{assessment.applicant_phone && <p className="text-xs text-gray-500 dark:text-gray-400">{assessment.applicant_phone}</p>}</div></td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">{assessment.template?.name || 'N/A'}</td>
                            <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">₦{Number(assessment.calculated_amount || 0).toLocaleString()}</td>
                            <td className="p-3 font-semibold text-green-600 dark:text-green-400">₦{Number(assessment.approved_amount || 0).toLocaleString()}</td>
                            <td className="p-3"><span className={`px-2 py-1 text-xs rounded ${getStatusColor(assessment.status)}`}>{assessment.status}</span></td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">{assessment.assessment_date ? format(new Date(assessment.assessment_date), 'dd/MM/yyyy') : 'N/A'}</td>
                            <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                    <button onClick={() => onView(assessment)} className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded" title="View">View</button>
                                    {assessment.status === 'pending' && <button onClick={() => onReview(assessment)} className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded">Review</button>}
                                    {(assessment.status === 'under_review' || assessment.status === 'pending') && <button onClick={() => onApprove(assessment)} className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded">Approve</button>}
                                    {(assessment.status === 'under_review' || assessment.status === 'pending') && <button onClick={() => onReject(assessment)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">Reject</button>}
                                    {assessment.status === 'approved' && !assessment.invoice_id && <button onClick={() => onGenerateInvoice(assessment)} className="px-2 py-1 bg-[#3B78BD] hover:bg-[#F0B652] text-white text-xs rounded">Gen Invoice</button>}
                                    {(assessment.status === 'pending' || assessment.status === 'rejected') && <button onClick={() => onDelete(assessment)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">Delete</button>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssessmentTable;
