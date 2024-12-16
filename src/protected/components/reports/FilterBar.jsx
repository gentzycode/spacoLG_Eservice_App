import React from 'react';

const FilterBar = ({ filter, setFilter }) => {
    const handleDateChange = (e) => {
        setFilter({ ...filter, dateRange: e.target.value });
    };

    const handleTypeChange = (e) => {
        setFilter({ ...filter, type: e.target.value });
    };

    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <label className="block text-gray-700">Date Range</label>
                <input
                    type="date"
                    value={filter.dateRange || ''}
                    onChange={handleDateChange}
                    className="border rounded p-2"
                />
            </div>
            <div>
                <label className="block text-gray-700">Report Type</label>
                <select
                    value={filter.type || ''}
                    onChange={handleTypeChange}
                    className="border rounded p-2"
                >
                    <option value="">All</option>
                    <option value="wallet">Wallet Transactions</option>
                    <option value="invoice">Invoice Statistics</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
