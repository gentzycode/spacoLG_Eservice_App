import React, { useState } from 'react';
import { deleteInvoice } from '../../../apis/authActions';

const DeleteInvoiceModal = ({ invoice, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await deleteInvoice(
                localStorage.getItem('token'),
                invoice.id,
                setError,
                setLoading
            );
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to delete invoice');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Delete Invoice</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Are you sure you want to delete invoice <strong>{invoice.invoice_ref}</strong>? This action cannot be undone.
                </p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteInvoiceModal;