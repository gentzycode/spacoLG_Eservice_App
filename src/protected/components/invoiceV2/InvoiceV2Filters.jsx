import React from 'react';

const InvoiceV2Filters = ({ filters, onFilterChange }) => {
    const handleChange = (field, value) => {
        onFilterChange({ [field]: value });
    };

    const handleReset = () => {
        onFilterChange({
            status: '',
            payment_status: '',
            payer_phone: '',
            start_date: '',
            end_date: '',
            search: '',
        });
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        placeholder="Invoice number, payer..."
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="issued">Issued</option>
                        <option value="paid">Paid</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Payment Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Status
                    </label>
                    <select
                        value={filters.payment_status}
                        onChange={(e) => handleChange('payment_status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Payment Statuses</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>

                {/* Payer Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payer Phone
                    </label>
                    <input
                        type="text"
                        value={filters.payer_phone}
                        onChange={(e) => handleChange('payer_phone', e.target.value)}
                        placeholder="080..."
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={(e) => handleChange('start_date', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => handleChange('end_date', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                {/* Per Page */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Per Page
                    </label>
                    <select
                        value={filters.per_page}
                        onChange={(e) => handleChange('per_page', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleReset}
                        className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceV2Filters;
