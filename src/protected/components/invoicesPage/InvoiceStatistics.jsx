import React from 'react';

const InvoiceStatistics = ({ statistics, loading, error }) => {
    if (loading) return <div className="text-center py-4 text-gray-700 dark:text-gray-300">Loading statistics...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
    if (!statistics) return null;

    const safeStats = {
        total_invoices: statistics.total_invoices || 0,
        paid_invoices: statistics.paid_invoices || 0,
        unpaid_invoices: statistics.unpaid_invoices || 0,
        total_amount: statistics.total_amount || 0,
        paid_amount: statistics.paid_amount || 0,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Invoices</h3>
                <p className="text-2xl font-bold text-[#3B78BD]">{safeStats.total_invoices}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Paid Invoices</h3>
                <p className="text-2xl font-bold text-green-500">{safeStats.paid_invoices}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Unpaid Invoices</h3>
                <p className="text-2xl font-bold text-red-500">{safeStats.unpaid_invoices}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Total Amount</h3>
                <p className="text-2xl font-bold text-[#3B78BD]">₦{Number(safeStats.total_amount).toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Paid Amount</h3>
                <p className="text-2xl font-bold text-green-500">₦{Number(safeStats.paid_amount).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default InvoiceStatistics;