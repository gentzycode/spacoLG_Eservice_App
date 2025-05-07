import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import TokenUsageHistoryModal from './TokenUsageHistoryModal';
import { getUserTokens } from '../../../apis/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../../assets/ansg_logo.png';

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

const TokensHistory = ({ token, agentId }) => {
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [selectedToken, setSelectedToken] = useState(null);
    const [columnsVisible, setColumnsVisible] = useState({ updatedAt: false });
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUserTokens(token, agentId, setTokens, setError, setLoading);
            } catch (err) {
                setError('Failed to fetch tokens history');
                setLoading(false);
            }
        };
        if (token && agentId) {
            fetchData();
        }
    }, [token, agentId]);

    const filteredItems = useMemo(() => {
        return tokens.filter(
            item => item.token && item.token.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, tokens]);

    const columns = useMemo(() => [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectedTokens.length === filteredItems.length && filteredItems.length > 0}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={selectedTokens.includes(row.id)}
                    onChange={() => handleSelectToken(row.id)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            width: '60px',
            center: true,
        },
        {
            name: "No.",
            selector: (row, index) => index + 1,
            width: '60px',
            center: true,
            cell: (row, index) => <span className="text-gray-800 dark:text-gray-200">{index + 1}</span>,
        },
        {
            name: "Token",
            selector: (row) => row.token.toUpperCase(),
            sortable: true,
            wrap: true,
            cell: (row) => <span className="text-gray-800 dark:text-gray-200">{row.token.toUpperCase()}</span>,
        },
        {
            name: "Value",
            selector: (row) => `₦${Number(row.value).toLocaleString()}`.toUpperCase(),
            sortable: true,
            wrap: true,
            cell: (row) => <span className="text-gray-800 dark:text-gray-200">{`₦${Number(row.value).toLocaleString()}`.toUpperCase()}</span>,
        },
        {
            name: "Current Value",
            selector: (row) => `₦${Number(row.current_value).toLocaleString()}`.toUpperCase(),
            sortable: true,
            wrap: true,
            cell: (row) => <span className="text-gray-800 dark:text-gray-200">{`₦${Number(row.current_value).toLocaleString()}`.toUpperCase()}</span>,
        },
        {
            name: "Used Value",
            selector: (row) => `₦${Number(row.used_value).toLocaleString()}`.toUpperCase(),
            sortable: true,
            wrap: true,
            cell: (row) => <span className="text-gray-800 dark:text-gray-200">{`₦${Number(row.used_value).toLocaleString()}`.toUpperCase()}</span>,
        },
        {
            name: "Created At",
            selector: (row) => formatDate(row.created_at).toUpperCase(),
            sortable: true,
            wrap: true,
            cell: (row) => <span className="text-gray-600 dark:text-gray-400">{formatDate(row.created_at).toUpperCase()}</span>,
        },
        {
            name: "Updated At",
            selector: (row) => formatDate(row.updated_at).toUpperCase(),
            sortable: true,
            omit: !columnsVisible.updatedAt,
            wrap: true,
            cell: (row) => <span className="text-gray-600 dark:text-gray-400">{formatDate(row.updated_at).toUpperCase()}</span>,
        },
        {
            name: "Token Usage",
            button: true,
            cell: (row) => (
                <button
                    className="text-[#3B78BD] dark:text-[#F0B652] hover:text-[#F0B652] dark:hover:text-[#3B78BD] transition-colors duration-200"
                    onClick={() => setSelectedToken(row.id)}
                >
                    <FontAwesomeIcon icon={faEye} />
                </button>
            ),
            width: '56px',
        },
    ], [columnsVisible, selectedTokens, filteredItems]);

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

    const handleSelectToken = (id) => {
        setSelectedTokens(prev =>
            prev.includes(id) ? prev.filter(tokenId => tokenId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedTokens(filteredItems.map(item => item.id));
        } else {
            setSelectedTokens([]);
        }
    };

    const handlePrint = () => {
        if (selectedTokens.length === 0) return;
    
        const printWindow = window.open('', '', 'height=600,width=800');
        const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');
    
        const getExpiryDate = (dateString) => {
            const date = new Date(dateString);
            date.setMonth(date.getMonth() + 1);
            date.setDate(0);
            return formatDate(date.toISOString());
        };
    
        const generateRandomNumber = () => Math.floor(Math.random() * 1000000);
        const randomNumber = generateRandomNumber();
    
        const watermarkText = `AUTHENTIC ${randomNumber}`;
    
        const printContent = selectedTokens
            .map(tokenId => tokens.find(token => token.id === tokenId))
            .filter(token => token)
            .map(token => `
                <div style="display: inline-block; width: 30%; position: relative; border: 2px solid #000; border-radius: 8px; padding: 20px; margin: 10px;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.1; font-size: 60px; color: #000; pointer-events: none;">
                        ${watermarkText}
                    </div>
                    <div style="display: flex; align-items: center;">
                        <img src="${Logo}" style="width: 60px; height: auto; margin-right: 20px;" />
                        <div>
                            <p style="margin: 5px 0;"><strong>Agent ID:</strong> ${token.agent_id}</p>
                            <p style="margin: 5px 0;"><strong>Token:</strong> ${token.token}</p>
                            <p style="margin: 5px 0;"><strong>Value:</strong> ₦${Number(token.value).toLocaleString()}</p>
                            <p style="margin: 5px 0;"><strong>Created At:</strong> ${formatDate(token.created_at)}</p>
                            <p style="margin: 5px 0;"><strong>Expiry Date:</strong> ${getExpiryDate(token.created_at)}</p>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <strong>To:</strong> _______________
                    </div>
                </div>
            `).join('');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Tokens</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h2 { margin: 0; }
                    p { margin: 0; }
                    img { display: block; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #555; }
                </style>
            </head>
            <body>
                ${printContent}
                <div class="footer">
                    <p>For verification of this token, visit the LGA E-Services Portal.</p>
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
                    <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Tokens History</h2>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div>
                            <span className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">Toggle Columns:</span>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-[#3B78BD] dark:hover:text-[#F0B652] transition-colors duration-200">
                                    <input
                                        type="checkbox"
                                        checked={columnsVisible.updatedAt}
                                        onChange={() => setColumnsVisible({ ...columnsVisible, updatedAt: !columnsVisible.updatedAt })}
                                        className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                                    />
                                    <span>Updated At</span>
                                </label>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                                type="text"
                                className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                                placeholder="Search by Token…"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center my-5">
                            <svg className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                            </svg>
                        </div>
                    ) : error ? (
                        <div className="text-center py-6 text-[#f06752] dark:text-red-400">{error}</div>
                    ) : tokens.length === 0 ? (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">No tokens found.</div>
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
                            {selectedTokens.length > 0 && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handlePrint}
                                        className="bg-[#3B78BD] dark:bg-[#F0B652] text-white py-2 px-6 rounded-lg hover:bg-[#F0B652] dark:hover:bg-[#3B78BD] transition-all duration-300 shadow-md"
                                    >
                                        Print Selected Tokens
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {selectedToken && (
                <TokenUsageHistoryModal
                    tokenId={selectedToken}
                    closeModal={() => setSelectedToken(null)}
                />
            )}
        </div>
    );
};

export default TokensHistory;