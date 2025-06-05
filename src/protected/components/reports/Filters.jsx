// src/protected/components/reports/Filters.jsx
import React from 'react';

const Filters = ({ filters, onFilterChange, onApplyFilters }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fadeIn">
            <h2 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652] mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Date Range
                    </label>
                    <input
                        type="date"
                        name="dateRange"
                        value={filters.dateRange}
                        onChange={onFilterChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={onFilterChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200"
                    >
                        <option value="">All</option>
                        <option value="wallet">Wallet</option>
                        <option value="tokens">Tokens</option>
                        <option value="invoices">Invoices</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        className="w-full px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={onApplyFilters}
                    >
                        Apply Filters
                    </button>
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

export default Filters;