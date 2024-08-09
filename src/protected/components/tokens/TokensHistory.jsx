import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import TokenUsageHistoryModal from './TokenUsageHistoryModal';
import { getUserTokens } from '../../../apis/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../../assets/ansg_logo.png'; // Import your logo

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
        fetchData();
    }, [token, agentId]);

    const filteredItems = useMemo(() => {
        return tokens.filter(
            item => item.token && item.token.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, tokens]);

    const columns = [
        {
            name: <input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} />,
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={selectedTokens.includes(row.id)}
                    onChange={() => handleSelectToken(row.id)}
                />
            ),
            width: '60px',
            center: true,
        },
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
            date.setDate(0); // Set to the last day of the month
            return formatDate(date.toISOString());
        };
    
        // Generate a random number for watermark
        const generateRandomNumber = () => Math.floor(Math.random() * 1000000);
        const randomNumber = generateRandomNumber();
    
        const watermarkText = `AUTHENTIC ${randomNumber}`;
    
        const printContent = selectedTokens
            .map(tokenId => tokens.find(token => token.id === tokenId))
            .filter(token => token)
            .map(token => `
                <div style="display: inline-block; width: 30%; position: relative; border: 2px solid #000; border-radius: 8px; padding: 20px; margin: 10px;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; font-size: 60px; color: #000; pointer-events: none;">
                        ${watermarkText}
                    </div>
                    <div style="display: flex; align-items: center;">
                        <img src="${Logo}" style="width: 60px; height: auto; margin-right: 20px;" />
                       <p style="margin: 5px 0;"> ${token.agent_id}</p>
                        <div>
                            <p style="margin: 5px 0;"><strong>Token:</strong> <strong>${token.token}</strong></p>
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
                    <>
                        <DataTable
                            columns={columns}
                            data={filteredItems}
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200, filteredItems.length]}
                            customStyles={customStyles}
                        />
                        {selectedTokens.length > 0 && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handlePrint}
                                    className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-all duration-300"
                                >
                                    Print Selected Tokens
                                </button>
                            </div>
                        )}
                    </>
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
