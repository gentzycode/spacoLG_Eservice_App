// src/protected/components/application/ApplicationsTable.jsx
import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';

const ApplicationsTable = ({ columns, appdata }) => {
    const [filterText, setFilterText] = useState('');

    const filteredData = useMemo(() => {
        const trimmedFilter = filterText.trim().toLowerCase();
        return appdata.filter((item) => {
            const refNo = item.ref_no ? item.ref_no.toLowerCase() : '';
            const serviceName = item.eservice?.name ? item.eservice.name.toLowerCase() : '';
            return refNo.includes(trimmedFilter) || serviceName.includes(trimmedFilter);
        });
    }, [filterText, appdata]);

    const customStyles = {
        table: {
            style: {
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
        },
        headRow: {
            style: {
                background: 'linear-gradient(to right, #3B78BD, #F0B652)',
                borderBottom: '2px solid #d1d5db',
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
                color: '#111827',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                '&:hover': { backgroundColor: '#f3f4f6', cursor: 'pointer' },
                transition: 'all 0.3s ease',
            },
            stripedStyle: { backgroundColor: '#f9fafb' },
        },
        cells: {
            style: {
                padding: '12px 16px',
                borderRight: '1px solid #e5e7eb',
                '&:last-of-type': { borderRight: 'none' },
            },
        },
        pagination: {
            style: {
                padding: '16px',
                backgroundColor: '#fff',
                borderTop: '1px solid #e5e7eb',
                fontSize: '14px',
                color: '#374151',
            },
            pageButtonsStyle: {
                borderRadius: '6px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                color: '#374151',
                padding: '6px 12px',
                margin: '0 4px',
                transition: 'all 0.3s ease',
                '&:hover': { backgroundColor: '#3B78BD', color: '#fff', borderColor: '#3B78BD' },
                '&:disabled': { backgroundColor: '#e5e7eb', color: '#9ca3af' },
            },
        },
    };

    return (
        <div className="mb-8 animate-fadeIn">
            <div className="mb-6 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search by Reference No. or E-service..."
                    className="w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value.trim())}
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30, 50, 100, filteredData.length]}
                highlightOnHover
                striped
                dense
                noDataComponent={
                    <div className="text-center py-6 text-gray-600 dark:text-gray-300">
                        No matching records found.
                    </div>
                }
            />
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

export default ApplicationsTable;