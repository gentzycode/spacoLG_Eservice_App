import React, { useState, useEffect } from 'react';
import { getInvoiceV2ById } from '../../../apis/invoiceAssessmentActions';
import { format } from 'date-fns';
import InvoicePrintModal from './InvoicePrintModal';
import { FaPrint } from 'react-icons/fa';

const ViewInvoiceV2Modal = ({ invoice, onClose, token }) => {
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);

    useEffect(() => {
        fetchInvoiceDetails();
    }, [invoice.id]);

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);
            const response = await getInvoiceV2ById(token, invoice.id, setError, () => {});
            setInvoiceDetails(response.invoice);
        } catch (err) {
            console.error('Error fetching invoice details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800',
            issued: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
            partially_paid: 'bg-yellow-100 text-yellow-800',
            overdue: 'bg-red-100 text-red-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B78BD] mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading invoice details...</p>
                </div>
            </div>
        );
    }

    if (error || !invoiceDetails) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                    <p className="text-red-500 mb-4">{error || 'Failed to load invoice details'}</p>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Invoice Details
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {invoiceDetails.invoice_number}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6">
                    {/* Status Badges */}
                    <div className="flex space-x-2 mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(invoiceDetails.status)}`}>
                            {invoiceDetails.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(invoiceDetails.payment_status)}`}>
                            {invoiceDetails.payment_status}
                        </span>
                    </div>

                    {/* Invoice Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Invoice Information</h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Title:</span> {invoiceDetails.title}</div>
                                <div><span className="font-medium">Description:</span> {invoiceDetails.description || 'N/A'}</div>
                                <div><span className="font-medium">Issue Date:</span> {invoiceDetails.issue_date ? format(new Date(invoiceDetails.issue_date), 'dd/MM/yyyy') : 'N/A'}</div>
                                <div><span className="font-medium">Due Date:</span> {invoiceDetails.due_date ? format(new Date(invoiceDetails.due_date), 'dd/MM/yyyy') : 'N/A'}</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Payer Information</h3>
                            <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Name:</span> {invoiceDetails.payer_name}</div>
                                <div><span className="font-medium">Type:</span> {invoiceDetails.payer_type}</div>
                                <div><span className="font-medium">Phone:</span> {invoiceDetails.payer_phone || 'N/A'}</div>
                                <div><span className="font-medium">Email:</span> {invoiceDetails.payer_email || 'N/A'}</div>
                                <div><span className="font-medium">Address:</span> {invoiceDetails.payer_address || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Line Items</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="p-2 text-left">Description</th>
                                        <th className="p-2 text-left">Revenue Head</th>
                                        <th className="p-2 text-right">Qty</th>
                                        <th className="p-2 text-right">Unit Price</th>
                                        <th className="p-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceDetails.items && invoiceDetails.items.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">{item.description}</td>
                                            <td className="p-2">{item.revenue_head?.name || 'N/A'}</td>
                                            <td className="p-2 text-right">{item.quantity}</td>
                                            <td className="p-2 text-right">₦{Number(item.unit_price).toLocaleString()}</td>
                                            <td className="p-2 text-right font-semibold">₦{(item.quantity * item.unit_price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-white">
                                    ₦{Number(invoiceDetails.total_amount).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</p>
                                <p className="text-xl font-bold text-green-600">
                                    ₦{Number(invoiceDetails.amount_paid).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                                <p className="text-xl font-bold text-red-600">
                                    ₦{Number(invoiceDetails.balance).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    {invoiceDetails.payments && invoiceDetails.payments.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Payment History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="p-2 text-left">Receipt #</th>
                                            <th className="p-2 text-left">Date</th>
                                            <th className="p-2 text-left">Method</th>
                                            <th className="p-2 text-right">Amount</th>
                                            <th className="p-2 text-left">Reference</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceDetails.payments.map((payment, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2 font-medium text-blue-600">{payment.receipt_number}</td>
                                                <td className="p-2">{payment.payment_date ? format(new Date(payment.payment_date), 'dd/MM/yyyy') : 'N/A'}</td>
                                                <td className="p-2">{payment.payment_method}</td>
                                                <td className="p-2 text-right font-semibold">₦{Number(payment.amount).toLocaleString()}</td>
                                                <td className="p-2">{payment.payment_reference || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {invoiceDetails.notes && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                {invoiceDetails.notes}
                            </p>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="border-t pt-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-medium">Created by:</span> {invoiceDetails.creator?.name || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Created at:</span> {invoiceDetails.created_at ? format(new Date(invoiceDetails.created_at), 'dd/MM/yyyy HH:mm') : 'N/A'}
                            </div>
                            {invoiceDetails.approved_by && (
                                <>
                                    <div>
                                        <span className="font-medium">Approved by:</span> {invoiceDetails.approver?.name || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Approved at:</span> {invoiceDetails.approval_date ? format(new Date(invoiceDetails.approval_date), 'dd/MM/yyyy HH:mm') : 'N/A'}
                                    </div>
                                </>
                            )}
                            {invoiceDetails.paid_at && (
                                <div>
                                    <span className="font-medium">Paid at:</span> {format(new Date(invoiceDetails.paid_at), 'dd/MM/yyyy HH:mm')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowPrintModal(true)}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:shadow-lg text-white rounded-xl transition-all duration-200 flex items-center space-x-2 font-semibold"
                        >
                            <FaPrint />
                            <span>Print Invoice</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoice Print Modal */}
            {showPrintModal && invoiceDetails && (
                <InvoicePrintModal
                    invoice={invoiceDetails}
                    onClose={() => setShowPrintModal(false)}
                />
            )}
        </div>
    );
};

export default ViewInvoiceV2Modal;
