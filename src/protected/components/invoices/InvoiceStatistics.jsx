import React from 'react';

const InvoiceStatistics = ({ statistics }) => {
    return (
        <div className="mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">My Invoices Summaries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-[#3B78BD]/20 to-[#F0B652]/20 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652]">Total Invoices</h3>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{statistics.total_invoices || 0}</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-[#3B78BD]/20 to-[#F0B652]/20 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652]">Total Unpaid</h3>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{statistics.total_unpaid_invoices || 0}</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-[#3B78BD]/20 to-[#F0B652]/20 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652]">Total Paid</h3>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{statistics.total_paid_invoices || 0}</p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-r from-[#3B78BD]/20 to-[#F0B652]/20 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652]">Total Paid Value</h3>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">₦{Number(statistics.total_paid_value || 0).toLocaleString()}</p>
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default InvoiceStatistics;