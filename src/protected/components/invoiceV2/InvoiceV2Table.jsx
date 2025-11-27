import React from 'react';
import { format } from 'date-fns';

const InvoiceV2Table = ({
    invoices,
    loading,
    error,
    onView,
    onEdit,
    onRecordPayment,
    onApprove,
    onCancel,
    onDelete,
}) => {
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
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Invoice #</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Payer</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Type</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Amount</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Paid</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Balance</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Status</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Payment</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Due Date</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr
                            key={invoice.id}
                            className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <td className="p-3 font-medium text-blue-600 dark:text-blue-400">
                                {invoice.invoice_number}
                            </td>
                            <td className="p-3">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {invoice.payer_name || 'N/A'}
                                    </p>
                                    {invoice.payer_phone && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.payer_phone}</p>
                                    )}
                                </div>
                            </td>
                            <td className="p-3">
                                <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                    {invoice.payer_type || 'N/A'}
                                </span>
                            </td>
                            <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">
                                ₦{Number(invoice.total_amount || 0).toLocaleString()}
                            </td>
                            <td className="p-3 text-green-600 dark:text-green-400">
                                ₦{Number(invoice.amount_paid || 0).toLocaleString()}
                            </td>
                            <td className="p-3 text-red-600 dark:text-red-400">
                                ₦{Number(invoice.balance || 0).toLocaleString()}
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(invoice.status)}`}>
                                    {invoice.status || 'N/A'}
                                </span>
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs rounded ${getPaymentStatusColor(invoice.payment_status)}`}>
                                    {invoice.payment_status || 'N/A'}
                                </span>
                            </td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">
                                {invoice.due_date ? (
                                    <span className={new Date(invoice.due_date) < new Date() && invoice.status !== 'paid' ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                                        {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
                                    </span>
                                ) : 'N/A'}
                            </td>
                            <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                    {/* View Button - Always available */}
                                    <button
                                        onClick={() => onView(invoice)}
                                        className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                                        title="View Details"
                                    >
                                        View
                                    </button>

                                    {/* Edit Button - Only for draft invoices */}
                                    {invoice.status === 'draft' && onEdit && (
                                        <button
                                            onClick={() => onEdit(invoice)}
                                            className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition-colors"
                                            title="Edit Invoice"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {/* Approve Button - Only for draft invoices */}
                                    {invoice.status === 'draft' && onApprove && (
                                        <button
                                            onClick={() => onApprove(invoice)}
                                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors"
                                            title="Approve Invoice"
                                        >
                                            Approve
                                        </button>
                                    )}

                                    {/* Record Payment Button - For unpaid/partially paid invoices */}
                                    {invoice.payment_status !== 'paid' && invoice.status !== 'cancelled' && onRecordPayment && (
                                        <button
                                            onClick={() => onRecordPayment(invoice)}
                                            className="px-2 py-1 bg-[#3B78BD] hover:bg-[#F0B652] text-white text-xs rounded transition-colors"
                                            title="Record Payment"
                                        >
                                            Pay
                                        </button>
                                    )}

                                    {/* Cancel Button - For non-paid, non-cancelled invoices */}
                                    {invoice.payment_status !== 'paid' && invoice.status !== 'cancelled' && onCancel && (
                                        <button
                                            onClick={() => onCancel(invoice)}
                                            className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded transition-colors"
                                            title="Cancel Invoice"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    {/* Delete Button - Only for draft/cancelled invoices */}
                                    {(invoice.status === 'draft' || invoice.status === 'cancelled') && invoice.payment_status !== 'paid' && onDelete && (
                                        <button
                                            onClick={() => onDelete(invoice)}
                                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
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
