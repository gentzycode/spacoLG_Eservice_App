import React from 'react';

const InvoiceStatistics = ({ statistics }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">My Invoices Summaries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Invoices</h3>
                    <p className="text-2xl font-bold">{statistics.total_invoices}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Unpaid</h3>
                    <p className="text-2xl font-bold">{statistics.total_unpaid_invoices}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Paid</h3>
                    <p className="text-2xl font-bold">{statistics.total_paid_invoices}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Total Paid Value</h3>
                    <p className="text-2xl font-bold">₦{Number(statistics.total_paid_value).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceStatistics;
