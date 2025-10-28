// src/protected/components/reports/TokenTransactionsTable.jsx
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';

const TokenTransactionsTable = ({ data = [], loading, error }) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check for dark mode
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        // Set up observer for dark mode changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (startDate || endDate) {
            const filtered = data.filter((item) => {
                const itemDate = new Date(item.updated_at);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;
                return (!start || itemDate >= start) && (!end || itemDate <= end);
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [startDate, endDate, data]);

    const columns = [
        {
            name: 'Token',
            selector: (row) => row.token || 'N/A',
            sortable: true,
        },
        {
            name: 'Amount Used',
            selector: (row) => `₦${Number(row.amount_used || 0).toLocaleString()}`,
            sortable: true,
        },
        {
            name: 'Identifier',
            selector: (row) => row.identifier || 'N/A',
            sortable: true,
        },
        {
            name: 'Identifier Value',
            selector: (row) => row.identifier_value || 'N/A',
            sortable: true,
        },
        {
            name: 'E-Service Name',
            selector: (row) => row.eservice_name || 'N/A',
            sortable: true,
        },
        {
            name: 'E-Service Value',
            selector: (row) => `₦${Number(row.eservice_value || 0).toLocaleString()}`,
            sortable: true,
        },
        {
            name: 'E-Service Category',
            selector: (row) => row.eservice_category || 'N/A',
            sortable: true,
        },
        {
            name: 'Updated At',
            selector: (row) => (row.updated_at ? formatDate(row.updated_at) : 'N/A'),
            sortable: true,
        },
    ];

    const customStyles = {
        table: {
            style: {
                borderRadius: '10px',
                overflow: 'hidden',
                border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            },
        },
        headRow: {
            style: {
                background: 'linear-gradient(to right, #3B78BD, #F0B652)',
                borderBottom: isDarkMode ? '2px solid #4b5563' : '2px solid #d1d5db',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#fff',
            },
        },
        headCells: { style: { padding: '14px 16px' } },
        rows: {
            style: {
                fontSize: '15px',
                fontWeight: 500,
                color: isDarkMode ? '#e5e7eb' : '#111827',
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                '&:hover': {
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                    cursor: 'pointer'
                },
                transition: 'all 0.3s ease',
            },
            stripedStyle: {
                backgroundColor: isDarkMode ? '#111827' : '#f9fafb'
            },
        },
        cells: {
            style: {
                padding: '12px 16px',
                borderRight: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                '&:last-of-type': { borderRight: 'none' },
            },
        },
        pagination: {
            style: {
                padding: '16px',
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                borderTop: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                fontSize: '14px',
                color: isDarkMode ? '#e5e7eb' : '#374151',
            },
            pageButtonsStyle: {
                borderRadius: '6px',
                backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                color: isDarkMode ? '#e5e7eb' : '#374151',
                padding: '6px 12px',
                margin: '0 4px',
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: '#3B78BD',
                    color: '#fff',
                    borderColor: '#3B78BD'
                },
                '&:disabled': {
                    backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb',
                    color: isDarkMode ? '#6b7280' : '#9ca3af'
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fadeIn">
            <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652] mb-4">Token Transactions</h3>
            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
                <div className="flex-1">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200"
                    />
                </div>
            </div>
            {loading ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-300">Loading...</div>
            ) : error ? (
                <div className="text-center py-6 text-red-600 dark:text-red-400">{error}</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationTotalRows={filteredData.length}
                    paginationPerPage={rowsPerPage}
                    paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                    onChangeRowsPerPage={(newPerPage) => {
                        setRowsPerPage(newPerPage);
                        setCurrentPage(1);
                    }}
                    onChangePage={(page) => setCurrentPage(page)}
                    customStyles={customStyles}
                    highlightOnHover
                    striped
                    dense
                    noDataComponent={
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">
                            No records found.
                        </div>
                    }
                />
            )}
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

export default TokenTransactionsTable;