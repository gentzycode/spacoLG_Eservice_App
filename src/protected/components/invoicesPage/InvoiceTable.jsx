import React from 'react';
import { format } from 'date-fns';

const InvoiceTable = ({ invoices, loading, error, onPay, onPrint, onEdit, onDelete, onView }) => {
    if (loading) return <div className="text-center py-4 text-gray-700 dark:text-gray-300">Loading invoices...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
    if (invoices.length === 0) return <div className="text-gray-600 dark:text-gray-400 text-center py-4">No invoices found.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-3 border-b">Ref</th>
                        <th className="p-3 border-b">Payer</th>
                        <th className="p-3 border-b">Amount</th>
                        <th className="p-3 border-b">Date</th>
                        <th className="p-3 border-b">Status</th>
                        <th className="p-3 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="p-3">{invoice.invoice_ref || 'N/A'}</td>
                            <td className="p-3">{invoice.payer_name || 'N/A'}</td>
                            <td className="p-3">₦{Number(invoice.amount || 0).toLocaleString()}</td>
                            <td className="p-3">{invoice.date ? format(new Date(invoice.date), 'dd/MM/yyyy') : 'N/A'}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded ${
                                        invoice.status === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {invoice.status || 'N/A'}
                                </span>
                            </td>
                            <td className="p-3 flex space-x-2">
                                {invoice.status !== 'paid' && (
                                    <button
                                        className="px-2 py-1 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652]"
                                        onClick={() => onPay(invoice)}
                                    >
                                        Pay
                                    </button>
                                )}
                                {invoice.status === 'paid' && (
                                    <button
                                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        onClick={() => onPrint(invoice)}
                                    >
                                        Print
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        onClick={() => onEdit(invoice)}
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => onDelete(invoice)}
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                                    onClick={() => onView(invoice)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;