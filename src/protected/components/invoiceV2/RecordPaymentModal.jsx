import React, { useState } from 'react';
import { recordInvoiceV2Payment } from '../../../apis/invoiceAssessmentActions';
import { toast } from 'react-toastify';

const RecordPaymentModal = ({ invoice, onClose, onSuccess, token }) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        payment_method: 'cash',
        payment_reference: '',
        payment_date: new Date().toISOString().split('T')[0],
        gateway_transaction_id: '',
        notes: '',
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const amount = Number(formData.amount);
        const balance = Number(invoice.balance);

        if (amount <= 0) {
            toast.error('Payment amount must be greater than 0');
            return;
        }

        if (amount > balance) {
            toast.error(`Payment amount cannot exceed balance of ₦${balance.toLocaleString()}`);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const response = await recordInvoiceV2Payment(token, invoice.id, formData, setError, setSubmitting);

            toast.success(`Payment recorded successfully. Receipt: ${response.payment.receipt_number}`);
            onSuccess();
        } catch (err) {
            toast.error(err.message || 'Failed to record payment');
        } finally {
            setSubmitting(false);
        }
    };

    const calculateNewBalance = () => {
        const amount = Number(formData.amount) || 0;
        const currentBalance = Number(invoice.balance) || 0;
        return Math.max(0, currentBalance - amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
                <div className="border-b p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Record Payment
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Invoice: {invoice.invoice_number}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Current Balance */}
                    <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                                <p className="text-2xl font-bold text-red-600">
                                    ₦{Number(invoice.balance).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">New Balance</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₦{calculateNewBalance().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Payment Amount (₦) *
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => handleChange('amount', e.target.value)}
                                max={invoice.balance}
                                min="0.01"
                                step="0.01"
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Payment Method *
                            </label>
                            <select
                                value={formData.payment_method}
                                onChange={(e) => handleChange('payment_method', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="monnify">Monnify</option>
                                <option value="paystack">Paystack</option>
                                <option value="tranzakt">Tranzakt</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Payment Date *
                            </label>
                            <input
                                type="date"
                                value={formData.payment_date}
                                onChange={(e) => handleChange('payment_date', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Payment Reference
                            </label>
                            <input
                                type="text"
                                value={formData.payment_reference}
                                onChange={(e) => handleChange('payment_reference', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    {['monnify', 'paystack', 'tranzakt'].includes(formData.payment_method) && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Gateway Transaction ID
                            </label>
                            <input
                                type="text"
                                value={formData.gateway_transaction_id}
                                onChange={(e) => handleChange('gateway_transaction_id', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md disabled:opacity-50"
                        >
                            {submitting ? 'Recording...' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordPaymentModal;
