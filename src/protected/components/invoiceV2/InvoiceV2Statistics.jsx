import React from 'react';
import { AiOutlineFileText, AiOutlineEdit, AiOutlineCheckCircle, AiOutlineDollarCircle, AiOutlineClockCircle, AiOutlineWarning, AiOutlineCalendar } from 'react-icons/ai';

const InvoiceV2Statistics = ({ statistics, loading }) => {
    if (loading || !statistics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Invoices',
            value: statistics.total_invoices || 0,
            gradient: 'from-blue-500 to-blue-600',
            icon: <AiOutlineFileText size={28} className="text-white" />
        },
        {
            label: 'Draft Invoices',
            value: statistics.draft_invoices || 0,
            gradient: 'from-gray-500 to-gray-600',
            icon: <AiOutlineEdit size={28} className="text-white" />
        },
        {
            label: 'Issued Invoices',
            value: statistics.issued_invoices || 0,
            gradient: 'from-yellow-500 to-yellow-600',
            icon: <AiOutlineCalendar size={28} className="text-white" />
        },
        {
            label: 'Paid Invoices',
            value: statistics.paid_invoices || 0,
            gradient: 'from-green-500 to-green-600',
            icon: <AiOutlineCheckCircle size={28} className="text-white" />
        },
        {
            label: 'Overdue Invoices',
            value: statistics.overdue_invoices || 0,
            gradient: 'from-red-500 to-red-600',
            icon: <AiOutlineWarning size={28} className="text-white" />
        },
        {
            label: 'Total Revenue',
            value: `₦${Number(statistics.total_revenue || 0).toLocaleString()}`,
            gradient: 'from-emerald-500 to-emerald-600',
            icon: <AiOutlineDollarCircle size={28} className="text-white" />
        },
        {
            label: 'Pending Revenue',
            value: `₦${Number(statistics.pending_revenue || 0).toLocaleString()}`,
            gradient: 'from-orange-500 to-orange-600',
            icon: <AiOutlineClockCircle size={28} className="text-white" />
        },
        {
            label: 'Today\'s Invoices',
            value: statistics.today_invoices || 0,
            gradient: 'from-purple-500 to-purple-600',
            icon: <AiOutlineFileText size={28} className="text-white" />
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 animate-slideIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                        </div>
                        <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InvoiceV2Statistics;
