import React from 'react';
import { format } from 'date-fns';

const RecentInvoices = ({ invoices, loading, error }) => {
    if (loading) return <div className="text-center py-4 text-gray-700 dark:text-gray-300">Loading recent invoices...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
    if (invoices.length === 0) return <div className="text-gray-600 dark:text-gray-400 text-center py-4">No recent invoices found.</div>;

    return (
        <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Invoices</h3>
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-3 border-b">Ref</th>
                        <th className="p-3 border-b">Payer</th>
                        <th className="p-3 border-b">Amount</th>
                        <th className="p-3 border-b">Date</th>
                        <th className="p-3 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="p-3">{invoice.invoice_ref}</td>
                            <td className="p-3">{invoice.payer_name}</td>
                            <td className="p-3">₦{Number(invoice.amount).toLocaleString()}</td>
                            <td className="p-3">{format(new Date(invoice.date), 'dd/MM/yyyy')}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {invoice.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentInvoices;