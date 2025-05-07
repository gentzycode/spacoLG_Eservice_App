import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import GatewayResponseModal from './GatewayResponseModal';
import { getWalletHistory } from '../../../apis/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';

// Theme with updated colors to match app's aesthetic
createTheme('gentzy', {
    text: {
        primary: '#111827', // gray-900
        secondary: '#6B7280', // gray-500
    },
    background: {
        default: '#ffffff',
    },
    context: {
        background: '#3B78BD',
        text: '#ffffff',
    },
    divider: {
        default: '#e5e7eb', // gray-200
    },
    action: {
        button: 'rgba(0,0,0,0.54)',
        hover: 'rgba(0,0,0,0.08)',
        disabled: 'rgba(0,0,0,0.12)',
    },
});

// Status Badge Component with Tailwind styling
const StatusBadge = ({ status }) => {
    const styles = {
        SUCCESS: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
        PENDING: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
        FAILED: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    };
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            {status}
        </span>
    );
};

const WalletHistory = ({ token, agentId }) => {
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [columnsVisible, setColumnsVisible] = useState({
        paymentType: false,
        paymentMethod: false,
        updatedAt: false,
    });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            await getWalletHistory(token, agentId, setHistory, setError, setLoading);
        } catch (err) {
            setError('Failed to fetch wallet refill history');
            setLoading(false);
        }
    }, [token, agentId]);

    useEffect(() => {
        if (token && agentId) {
            fetchData();
        }
    }, [fetchData]);

    const filteredItems = useMemo(() =>
        history.filter(({ transaction_reference = '' }) =>
            transaction_reference.toLowerCase().includes(search.toLowerCase())
        ), [search, history]);

    const columns = useMemo(() => [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectedHistory.length === filteredItems.length && filteredItems.length > 0}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={selectedHistory.includes(row.id)}
                    onChange={() => handleSelectHistory(row.id)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            width: '60px',
            center: true,
        },
        {
            name: '#',
            selector: (_row, index) => index + 1,
            width: '60px',
            center: true,
            cell: (row, index) => <span className="text-gray-800 dark:text-gray-200">{index + 1}</span>,
        },
        {
            name: 'Amount (₦)',
            selector: ({ amount }) => Number(amount).toLocaleString(),
            sortable: true,
            right: true,
            cell: (row) => <span className="text-gray-800 dark:text-gray-200">{Number(row.amount).toLocaleString()}</span>,
        },
        {
            name: 'Payment Method',
            selector: ({ payment_method }) => payment_method.toUpperCase(),
            sortable: true,
            omit: !columnsVisible.paymentMethod,
            cell: (row) => <span className="text-gray-600 dark:text-gray-400">{row.payment_method.toUpperCase()}</span>,
        },
        {
            name: 'Payment Type',
            selector: ({ payment_type }) => payment_type.toUpperCase(),
            sortable: true,
            omit: !columnsVisible.paymentType,
            cell: (row) => <span className="text-gray-600 dark:text-gray-400">{row.payment_type.toUpperCase()}</span>,
        },
        {
            name: 'Gateway',
            selector: ({ payment_gateway }) => payment_gateway.toUpperCase(),
            sortable: true,
            cell: (row) => <span className="text-gray-600 dark:text-gray-400">{row.payment_gateway.toUpperCase()}</span>,
        },
        {
            name: 'Status',
            selector: ({ status }) => <StatusBadge status={status.toUpperCase()} />,
            sortable: true,
            center: true,
        },
        {
            name: 'Txn Ref',
            selector: ({ transaction_reference }) => transaction_reference.toUpperCase(),
            sortable: true,
            grow: 2,
            cell: (row) => <span className="text-gray-800 dark:text-gray-200">{row.transaction_reference.toUpperCase()}</span>,
        },
        {
            name: 'Created',
            selector: ({ created_at }) => formatDate(created_at),
            sortable: true,
            cell: (row) => <span className="text-gray-600 dark:text-gray-400">{formatDate(row.created_at)}</span>,
        },
        {
            name: 'Updated',
            selector: ({ updated_at }) => formatDate(updated_at),
            sortable: true,
            omit: !columnsVisible.updatedAt,
            cell: (row) => <span className="text-gray-600 dark:text-gray-400">{formatDate(row.updated_at)}</span>,
        },
        {
            name: '',
            button: true,
            cell: (row) => (
                <button
                    className="text-[#3B78BD] dark:text-[#F0B652] hover:text-[#F0B652] dark:hover:text-[#3B78BD] transition-colors duration-200"
                    onClick={() => setSelectedResponse(row.payment_gateway_response)}
                    title="View Gateway Response"
                >
                    <FontAwesomeIcon icon={faEye} />
                </button>
            ),
            width: '56px',
        },
    ], [columnsVisible, selectedHistory, filteredItems]);

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
        headCells: {
            style: {
                paddingTop: '14px',
                paddingBottom: '14px',
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        rows: {
            style: {
                fontSize: '15px',
                fontWeight: 500,
                color: '#111827',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                '&:hover': {
                    backgroundColor: '#f3f4f6',
                    cursor: 'pointer',
                },
                transition: 'all 0.3s ease',
            },
            stripedStyle: {
                backgroundColor: '#f9fafb',
            },
        },
        cells: {
            style: {
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRight: '1px solid #e5e7eb',
                '&:last-of-type': {
                    borderRight: 'none',
                },
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
                '&:hover': {
                    backgroundColor: '#3B78BD',
                    color: '#fff',
                    borderColor: '#3B78BD',
                },
                '&:disabled': {
                    backgroundColor: '#e5e7eb',
                    color: '#9ca3af',
                },
            },
        },
    };

    const handleSelectHistory = (id) => {
        setSelectedHistory(prev =>
            prev.includes(id) ? prev.filter(historyId => historyId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedHistory(filteredItems.map(item => item.id));
        } else {
            setSelectedHistory([]);
        }
    };

    const handlePrint = () => {
        if (selectedHistory.length === 0) return;

        const printWindow = window.open('', '', 'height=600,width=800');
        const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

        const generateRandomNumber = () => Math.floor(Math.random() * 1000000);
        const randomNumber = generateRandomNumber();

        const watermarkText = `AUTHENTIC ${randomNumber}`;

        const printContent = selectedHistory
            .map(historyId => history.find(item => item.id === historyId))
            .filter(item => item)
            .map(item => `
                <div style="display: inline-block; width: 30%; position: relative; border: 2px solid #000; border-radius: 8px; padding: 20px; margin: 10px;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.1; font-size: 60px; color: #000; pointer-events: none;">
                        ${watermarkText}
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div>
                            <p style="margin: 5px 0;"><strong>Agent ID:</strong> ${agentId}</p>
                            <p style="margin: 5px 0;"><strong>Amount:</strong> ₦${Number(item.amount).toLocaleString()}</p>
                            <p style="margin: 5px 0;"><strong>Payment Gateway:</strong> ${item.payment_gateway.toUpperCase()}</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> ${item.status.toUpperCase()}</p>
                            <p style="margin: 5px 0;"><strong>Transaction Ref:</strong> ${item.transaction_reference.toUpperCase()}</p>
                            <p style="margin: 5px 0;"><strong>Created At:</strong> ${formatDate(item.created_at)}</p>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <strong>From:</strong> _______________
                    </div>
                </div>
            `).join('');

        printWindow.document.write(`
            <html>
            <head>
                <title>Print Wallet History</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    p { margin: 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #555; }
                </style>
            </head>
            <body>
                ${printContent}
                <div class="footer">
                    <p>For verification, visit the LGA E-Services Portal.</p>
                    <p>© 2024 Copyright LGA E-Services Solution.</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                <div className="p-4 sm:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Wallet Refill History</h2>

                    {/* Controls Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div>
                            <span className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">Toggle Columns:</span>
                            <div className="flex flex-wrap gap-4">
                                {['paymentType', 'paymentMethod', 'updatedAt'].map((key) => (
                                    <label key={key} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-[#3B78BD] dark:hover:text-[#F0B652] transition-colors duration-200">
                                        <input
                                            type="checkbox"
                                            checked={columnsVisible[key]}
                                            onChange={() => setColumnsVisible({ ...columnsVisible, [key]: !columnsVisible[key] })}
                                            className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                                        />
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                                type="search"
                                className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                                placeholder="Search Txn Ref…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table Section */}
                    {loading ? (
                        <div className="flex justify-center my-5">
                            <svg className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                            </svg>
                        </div>
                    ) : error ? (
                        <div className="text-center py-6 text-[#f06752] dark:text-red-400">{error}</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">No wallet refill history found.</div>
                    ) : (
                        <>
                            <DataTable
                                columns={columns}
                                data={filteredItems}
                                customStyles={customStyles}
                                theme="gentzy"
                                pagination
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200, filteredItems.length]}
                                highlightOnHover
                                striped
                                dense
                                noDataComponent={<div className="text-center py-6 text-gray-600 dark:text-gray-300">No matching records found.</div>}
                            />
                            {selectedHistory.length > 0 && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handlePrint}
                                        className="bg-[#3B78BD] dark:bg-[#F0B652] text-white py-2 px-6 rounded-lg hover:bg-[#F0B652] dark:hover:bg-[#3B78BD] transition-all duration-300 shadow-md"
                                    >
                                        Print Selected History
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal Section */}
            {selectedResponse && (
                <GatewayResponseModal
                    response={selectedResponse}
                    closeModal={() => setSelectedResponse(null)}
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

export default WalletHistory;