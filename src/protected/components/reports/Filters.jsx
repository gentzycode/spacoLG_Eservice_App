import React from 'react';

const Filters = ({ filters, onFilterChange, onApplyFilters }) => {
    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">Filter Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-gray-600 text-sm">Date Range</label>
                    <input
                        type="date"
                        name="dateRange"
                        value={filters.dateRange}
                        onChange={onFilterChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 text-sm">Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={onFilterChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">All</option>
                        <option value="wallet">Wallet</option>
                        <option value="tokens">Tokens</option>
                        <option value="invoices">Invoices</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onApplyFilters}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
