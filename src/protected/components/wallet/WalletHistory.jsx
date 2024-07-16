// src/protected/components/wallet/WalletHistory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import GatewayResponseModal from './GatewayResponseModal';
import { getWalletHistory } from '../../../apis/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const WalletHistory = ({ token, agentId }) => {
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [columnsVisible, setColumnsVisible] = useState({
        paymentType: false,
        paymentMethod: false,
        updatedAt: false,
    });
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getWalletHistory(token, agentId, setHistory, setError, setLoading);
            } catch (err) {
                setError('Failed to fetch wallet refill history');
                setLoading(false);
            }
        };
        fetchData();
    }, [token, agentId]);

    const filteredItems = useMemo(() => {
        return history.filter(
            item => item.transaction_reference && item.transaction_reference.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, history]);

    const columns = [
        {
            name: "No.",
            selector: (row, index) => index + 1,
            sortable: false,
            width: '50px',
            wrap: true,
        },
        {
            name: "Amount",
            selector: (row) => `₦${Number(row.amount).toLocaleString()}`,
            sortable: true,
            wrap: true,
        },
        {
            name: "Payment Method",
            selector: (row) => row.payment_method,
            sortable: true,
            omit: !columnsVisible.paymentMethod,
            wrap: true,
        },
        {
            name: "Payment Type",
            selector: (row) => row.payment_type,
            sortable: true,
            omit: !columnsVisible.paymentType,
            wrap: true,
        },
        {
            name: "Payment Gateway",
            selector: (row) => row.payment_gateway,
            sortable: true,
            wrap: true,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            wrap: true,
        },
        {
            name: "Transaction Reference",
            selector: (row) => row.transaction_reference,
            sortable: true,
            wrap: true,
        },
        {
            name: "Created At",
            selector: (row) => formatDate(row.created_at),
            sortable: true,
            wrap: true,
        },
        {
            name: "Updated At",
            selector: (row) => formatDate(row.updated_at),
            sortable: true,
            omit: !columnsVisible.updatedAt,
            wrap: true,
        },
        {
            name: "Gateway Response",
            button: true,
            cell: (row) => (
                <button className="btn btn-icon" onClick={() => setSelectedResponse(row.payment_gateway_response)}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
            ),
        },
    ];

    const customStyles = {
        header: {
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#4a5568',
                color: '#fff',
                borderRadius: '10px 10px 0 0',
            },
        },
        rows: {
            style: {
                fontSize: '16px',
                backgroundColor: '#f8f9fa',
                '&:hover': {
                    backgroundColor: '#e2e8f0',
                    cursor: 'pointer',
                },
            },
        },
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#4a5568',
                color: '#fff',
                border: '0.5px solid #e2e8f0',
            },
        },
        cells: {
            style: {
                padding: '15px',
                border: '0.5px solid #e2e8f0',
            },
        },
    };

    return (
        <div className="mt-8 container">
            <h2 className="text-2xl font-bold mb-4 text-[#0d544c]">Wallet Refill History</h2>
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Toggle Columns</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={columnsVisible.paymentType} onChange={() => setColumnsVisible({...columnsVisible, paymentType: !columnsVisible.paymentType})} />
                            <span>Payment Type</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={columnsVisible.paymentMethod} onChange={() => setColumnsVisible({...columnsVisible, paymentMethod: !columnsVisible.paymentMethod})} />
                            <span>Payment Method</span>
                        </label>
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
                    <div>Checking for wallet refill history...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : history.length === 0 ? (
                    <div>No wallet refill history found.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        pagination
                        customStyles={customStyles}
                    />
                )}
            </div>
            {selectedResponse && (
                <GatewayResponseModal
                    response={selectedResponse}
                    closeModal={() => setSelectedResponse(null)}
                />
            )}
        </div>
    );
};

export default WalletHistory;
