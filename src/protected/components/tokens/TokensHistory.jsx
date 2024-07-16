import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import TokenUsageHistoryModal from './TokenUsageHistoryModal';
import { getUserTokens } from '../../../apis/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';

const TokensHistory = ({ token, agentId }) => {
    const [selectedToken, setSelectedToken] = useState(null);
    const [columnsVisible, setColumnsVisible] = useState({
        updatedAt: false,
    });
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
        fetchData();
    }, [token, agentId]);

    const filteredItems = useMemo(() => {
        return tokens.filter(
            item => item.token && item.token.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, tokens]);

    const columns = [
        {
            name: "No.",
            selector: (row, index) => index + 1,
            sortable: false,
            width: '50px',
            wrap: true,
        },
        {
            name: "Token",
            selector: (row) => row.token.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Value",
            selector: (row) => `₦${Number(row.value).toLocaleString()}`.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Current Value",
            selector: (row) => `₦${Number(row.current_value).toLocaleString()}`.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Used Value",
            selector: (row) => `₦${Number(row.used_value).toLocaleString()}`.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Created At",
            selector: (row) => formatDate(row.created_at).toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Updated At",
            selector: (row) => formatDate(row.updated_at).toUpperCase(),
            sortable: true,
            omit: !columnsVisible.updatedAt,
            wrap: true,
        },
        {
            name: "Token Usage",
            button: true,
            cell: (row) => (
                <button className="btn btn-icon" onClick={() => setSelectedToken(row.id)}>
                    <i className="fas fa-eye"></i>
                </button>
            ),
        },
    ];

    const customStyles = {
        header: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#4a5568',
                color: '#fff',
                borderRadius: '10px 10px 0 0',
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                backgroundColor: '#f8f9fa',
                '&:nth-of-type(odd)': {
                    backgroundColor: '#ecf6ec',
                },
                '&:hover': {
                    backgroundColor: '#e2e8f0',
                    cursor: 'pointer',
                },
                border: '1px solid #e2e8f0',
            },
        },
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#4a5568',
                color: '#fff',
                border: '1px solid #e2e8f0',
            },
        },
        cells: {
            style: {
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #e2e8f0',
            },
        },
    };

    return (
        <div className="mt-8 container">
            <h2 className="text-2xl font-bold mb-4 text-[#0d544c]">Tokens History</h2>
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Toggle Columns</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={columnsVisible.updatedAt} onChange={() => setColumnsVisible({...columnsVisible, updatedAt: !columnsVisible.updatedAt})} />
                            <span>Updated At</span>
                        </label>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control w-25"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>
            <div className="table-responsive">
                {loading ? (
                    <div>Loading token history...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : tokens.length === 0 ? (
                    <div>No tokens found.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        pagination
                        customStyles={customStyles}
                    />
                )}
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
