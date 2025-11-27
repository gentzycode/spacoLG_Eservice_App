import React from 'react';
import { AiOutlineFileText, AiOutlineClockCircle, AiOutlineSearch, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineDollarCircle, AiOutlineCalendar } from 'react-icons/ai';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const AssessmentStatistics = ({ statistics, loading }) => {
    if (loading || !statistics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Assessments',
            value: statistics.total_assessments || 0,
            gradient: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
            icon: <AiOutlineFileText size={40} className="opacity-80" />
        },
        {
            label: 'Pending',
            value: statistics.pending_assessments || 0,
            gradient: 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700',
            icon: <AiOutlineClockCircle size={40} className="opacity-80" />
        },
        {
            label: 'Under Review',
            value: statistics.under_review_assessments || 0,
            gradient: 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
            icon: <AiOutlineSearch size={40} className="opacity-80" />
        },
        {
            label: 'Approved',
            value: statistics.approved_assessments || 0,
            gradient: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
            icon: <AiOutlineCheckCircle size={40} className="opacity-80" />
        },
        {
            label: 'Rejected',
            value: statistics.rejected_assessments || 0,
            gradient: 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
            icon: <AiOutlineCloseCircle size={40} className="opacity-80" />
        },
        {
            label: 'Invoice Generated',
            value: statistics.invoice_generated || 0,
            gradient: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
            icon: <FaFileInvoiceDollar size={40} className="opacity-80" />
        },
        {
            label: 'Total Assessed Value',
            value: `₦${Number(statistics.total_assessed_value || 0).toLocaleString()}`,
            gradient: 'from-green-500 to-green-700 dark:from-green-600 dark:to-green-800',
            icon: <AiOutlineDollarCircle size={40} className="opacity-80" />
        },
        {
            label: 'Today\'s Assessments',
            value: statistics.today_assessments || 0,
            gradient: 'from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700',
            icon: <AiOutlineCalendar size={40} className="opacity-80" />
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-lg shadow-lg text-white hover:shadow-xl transition-shadow`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                        </div>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AssessmentStatistics;
