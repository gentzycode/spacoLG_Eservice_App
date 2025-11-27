import React from 'react';
import { AiOutlineFileText, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaCalculator, FaListAlt, FaLayerGroup } from 'react-icons/fa';

const TemplateStatistics = ({ statistics, loading }) => {
    if (loading || !statistics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
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
            label: 'Total Templates',
            value: statistics.total_templates || 0,
            gradient: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
            icon: <AiOutlineFileText size={40} className="opacity-80" />
        },
        {
            label: 'Active Templates',
            value: statistics.active_templates || 0,
            gradient: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
            icon: <AiOutlineCheckCircle size={40} className="opacity-80" />
        },
        {
            label: 'Inactive Templates',
            value: statistics.inactive_templates || 0,
            gradient: 'from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700',
            icon: <AiOutlineCloseCircle size={40} className="opacity-80" />
        },
        {
            label: 'Formula Templates',
            value: statistics.formula_templates || 0,
            gradient: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
            icon: <FaCalculator size={40} className="opacity-80" />
        },
        {
            label: 'Criteria Templates',
            value: statistics.criteria_templates || 0,
            gradient: 'from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700',
            icon: <FaListAlt size={40} className="opacity-80" />
        },
        {
            label: 'Tiered Templates',
            value: statistics.tiered_templates || 0,
            gradient: 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
            icon: <FaLayerGroup size={40} className="opacity-80" />
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

export default TemplateStatistics;
