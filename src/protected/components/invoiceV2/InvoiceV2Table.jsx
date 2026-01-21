import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const InvoiceV2Table = ({
    invoices,
    loading,
    error,
    onView,
    onEdit,
    onRecordPayment,
    onPayOnline,
    onApprove,
    onCancel,
    onDelete,
}) => {
    // Check if Record Payment button should be shown (from system settings)
    const [showRecordPayment, setShowRecordPayment] = useState(true);

    useEffect(() => {
        // Get setting from localStorage
        const paymentSettings = localStorage.getItem('paymentSettings');
        if (paymentSettings) {
            try {
                const settings = JSON.parse(paymentSettings);
                setShowRecordPayment(settings.show_record_payment_button !== false);
            } catch (e) {
                setShowRecordPayment(true); // Default to true
            }
        }
    }, []);
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B78BD]"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading invoices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!invoices || invoices.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No invoices found.</p>
            </div>
        );
    }

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            issued: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            partially_paid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const getPaymentStatusColor = (paymentStatus) => {
        const colors = {
            unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            partially_paid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        };
        return colors[paymentStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Invoice #</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Payer</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Paid</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Balance</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Due Date</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr
                            key={invoice.id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                        >
                            <td className="px-6 py-4 font-semibold text-[#0d544c] dark:text-[#3B78BD]">
                                {invoice.invoice_number}
                            </td>
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {invoice.payer_name || 'N/A'}
                                    </p>
                                    {invoice.payer_phone && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{invoice.payer_phone}</p>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                    {invoice.payer_type || 'N/A'}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                ₦{Number(invoice.total_amount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                                ₦{Number(invoice.amount_paid || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 font-semibold text-red-600 dark:text-red-400">
                                ₦{Number(invoice.balance || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                    {invoice.status || 'N/A'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(invoice.payment_status)}`}>
                                    {invoice.payment_status || 'N/A'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                {invoice.due_date ? (
                                    <span className={new Date(invoice.due_date) < new Date() && invoice.status !== 'paid' ? 'text-red-600 dark:text-red-400 font-bold' : 'font-medium'}>
                                        {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
                                    </span>
                                ) : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {/* View Button - Always available */}
                                    <button
                                        onClick={() => onView(invoice)}
                                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                                        title="View Details"
                                    >
                                        View
                                    </button>

                                    {/* Edit Button - Only for draft invoices */}
                                    {invoice.status === 'draft' && onEdit && (
                                        <button
                                            onClick={() => onEdit(invoice)}
                                            className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                                            title="Edit Invoice"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {/* Approve Button - Only for draft invoices (invoices are auto-approved on creation, so this is mainly for legacy) */}
                                    {invoice.status === 'draft' && !invoice.approved_at && onApprove && (
                                        <button
                                            onClick={() => onApprove(invoice)}
                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                                            title="Approve Invoice"
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {/* Pay Online Button - For unpaid/partially paid invoices */}
                                    {invoice.payment_status !== 'paid' && invoice.status !== 'cancelled' && onPayOnline && (
                                        <button
                                            onClick={() => onPayOnline(invoice)}
                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                                            title="Pay Online via Gateway"
                                        >
                                            Pay Online
                                        </button>
                                    )}

                                    {/* Record Payment Button - For unpaid/partially paid invoices (controlled by system settings) */}
                                    {showRecordPayment && invoice.payment_status !== 'paid' && invoice.status !== 'cancelled' && onRecordPayment && (
                                        <button
                                            onClick={() => onRecordPayment(invoice)}
                                            className="px-3 py-1.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:shadow-lg text-white text-xs font-semibold rounded-lg transition-all duration-200"
                                            title="Record Offline Payment"
                                        >
                                            Record Payment
                                        </button>
                                    )}

                                    {/* Cancel Button - For non-paid, non-cancelled invoices */}
                                    {invoice.payment_status !== 'paid' && invoice.status !== 'cancelled' && onCancel && (
                                        <button
                                            onClick={() => onCancel(invoice)}
                                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                                            title="Cancel Invoice"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    {/* Delete Button - Only for draft/cancelled invoices */}
                                    {(invoice.status === 'draft' || invoice.status === 'cancelled') && invoice.payment_status !== 'paid' && onDelete && (
                                        <button
                                            onClick={() => onDelete(invoice)}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
                                            title="Delete Invoice"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceV2Table;
