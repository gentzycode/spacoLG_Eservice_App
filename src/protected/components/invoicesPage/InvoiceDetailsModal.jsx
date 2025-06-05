import React from 'react';
import { format } from 'date-fns';

const InvoiceDetailsModal = ({ invoice, onClose }) => {
    // Ensure safe access to invoice data with fallbacks
    const safeInvoice = {
        invoice_ref: invoice.invoice_ref || 'N/A',
        payer_name: invoice.payer_name || 'N/A',
        payee_name: invoice.payee_name || 'N/A',
        amount: invoice.amount || 0,
        date: invoice.date ? format(new Date(invoice.date), 'dd/MM/yyyy') : 'N/A',
        status: invoice.status || 'N/A',
        purpose: invoice.purpose || 'N/A',
        description: invoice.description || 'N/A',
        payment_method: invoice.payment_method || 'N/A',
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Invoice Details</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Reference Number:</span>
                        <span>{safeInvoice.invoice_ref}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Payer Name:</span>
                        <span>{safeInvoice.payer_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Payee Name:</span>
                        <span>{safeInvoice.payee_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span>
                        <span>₦{Number(safeInvoice.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                        <span>{safeInvoice.date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                        <span>{safeInvoice.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Purpose:</span>
                        <span>{safeInvoice.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                        <span>{safeInvoice.description}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Payment Method:</span>
                        <span>{safeInvoice.payment_method}</span>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsModal;