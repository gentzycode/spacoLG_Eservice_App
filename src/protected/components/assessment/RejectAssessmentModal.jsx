import React, { useState } from 'react';
import { rejectAssessment } from '../../../apis/invoiceAssessmentActions';
import { toast } from 'react-toastify';
const RejectAssessmentModal = ({ assessment, onClose, onSuccess, token }) => {
    const [submitting, setSubmitting] = useState(false);
    const [reason, setReason] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await rejectAssessment(token, assessment.id, reason, null, setSubmitting);
            toast.success('Assessment rejected');
            onSuccess();
        } catch (err) {
            toast.error(err.message || 'Failed to reject');
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Reject Assessment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4"><label className="block text-sm font-medium mb-1">Rejection Reason *</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="4" className="w-full px-3 py-2 border rounded-md" required></textarea></div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-md">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 bg-red-500 text-white rounded-md">{submitting ? 'Rejecting...' : 'Reject'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RejectAssessmentModal;
