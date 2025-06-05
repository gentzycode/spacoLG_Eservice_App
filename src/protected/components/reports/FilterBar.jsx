// src/protected/components/reports/FilterBar.jsx
import React from 'react';

const FilterBar = ({ filter, setFilter }) => {
    const handleDateChange = (e) => {
        setFilter({ ...filter, dateRange: e.target.value });
    };

    const handleTypeChange = (e) => {
        setFilter({ ...filter, type: e.target.value });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6 animate-fadeIn">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Date Range
                </label>
                <input
                    type="date"
                    value={filter.dateRange || ''}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200"
                />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Report Type
                </label>
                <select
                    value={filter.type || ''}
                    onChange={handleTypeChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200"
                >
                    <option value="">All</option>
                    <option value="wallet">Wallet Transactions</option>
                    <option value="invoice">Invoice Statistics</option>
                </select>
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

export default FilterBar;