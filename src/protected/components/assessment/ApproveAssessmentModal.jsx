import React, { useState } from 'react';
import { approveAssessment } from '../../../apis/invoiceAssessmentActions';
import { toast } from 'react-toastify';
const ApproveAssessmentModal = ({ assessment, onClose, onSuccess, token }) => {
    const [submitting, setSubmitting] = useState(false);
    const [approvedAmount, setApprovedAmount] = useState(assessment.calculated_amount);
    const [notes, setNotes] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await approveAssessment(token, assessment.id, { approved_amount: approvedAmount, approval_notes: notes }, null, setSubmitting);
            toast.success('Assessment approved');
            onSuccess();
        } catch (err) {
            toast.error(err.message || 'Failed to approve');
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Approve Assessment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4"><label className="block text-sm font-medium mb-1">Approved Amount (₦)</label><input type="number" value={approvedAmount} onChange={(e) => setApprovedAmount(e.target.value)} step="0.01" className="w-full px-3 py-2 border rounded-md" required /></div>
                    <div className="mb-4"><label className="block text-sm font-medium mb-1">Approval Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="w-full px-3 py-2 border rounded-md"></textarea></div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-md">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 bg-green-500 text-white rounded-md">{submitting ? 'Approving...' : 'Approve'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ApproveAssessmentModal;
