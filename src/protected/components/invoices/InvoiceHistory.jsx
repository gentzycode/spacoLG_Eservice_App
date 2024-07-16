import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import { getUnpaidInvoices, getPaidInvoicesByAgent, getInvoiceById } from '../../../apis/authActions';
import { AiOutlineEye } from 'react-icons/ai';
import InvoiceDetailModal from './InvoiceDetailModal';

const InvoiceHistory = ({ token, agentId }) => {
    const [unpaidInvoices, setUnpaidInvoices] = useState([]);
    const [paidInvoices, setPaidInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, [token, agentId]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            await getUnpaidInvoices(token, setUnpaidInvoices, setError, setLoading);
            await getPaidInvoicesByAgent(token, agentId, setPaidInvoices, setError, setLoading);
        } catch (err) {
            setError('Failed to fetch invoices');
        } finally {
            setLoading(false);
        }
    };

    const filteredUnpaid = useMemo(() => {
        return (unpaidInvoices || []).filter(
            item => item.reference_number && item.reference_number.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, unpaidInvoices]);

    const filteredPaid = useMemo(() => {
        return (paidInvoices || []).filter(
            item => item.reference_number && item.reference_number.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [filterText, paidInvoices]);

    const columns = [
        {
            name: "No.",
            selector: (row, index) => index + 1,
            sortable: false,
            width: '50px',
            wrap: true,
        },
        {
            name: "Reference Number",
            selector: (row) => row.reference_number,
            sortable: true,
            wrap: true,
        },
        {
            name: "Amount",
            selector: (row) => `₦${Number(row.amount).toLocaleString()}`,
            sortable: true,
            wrap: true,
        },
        {
            name: "Purpose",
            selector: (row) => row.purpose,
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
            name: "Created At",
            selector: (row) => formatDate(row.created_at),
            sortable: true,
            wrap: true,
        },
        {
            name: "Updated At",
            selector: (row) => formatDate(row.updated_at),
            sortable: true,
            wrap: true,
        },
        {
            name: "View",
            button: true,
            cell: (row) => (
                <AiOutlineEye className="text-green-600 cursor-pointer" onClick={() => handleView(row.id)} />
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
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                backgroundColor: '#fff',
                '&:hover': {
                    backgroundColor: '#e2e8f0',
                },
            },
        },
        headCells: {
            style: {
                fontSize: '15px',
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

    const handleView = async (id) => {
        setIsFetching(true);
        try {
            const invoice = await getInvoiceById(token, id);
            setSelectedInvoice(invoice);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to fetch invoice details');
        } finally {
            setIsFetching(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null); // Clear the selected invoice
    };

    return (
        <div className="mt-8 container">
            <h2 className="text-xl font-bold mb-4">Invoice History</h2>
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search by Reference Number..."
                    className="form-control w-1/3"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Unpaid Invoices</h3>
                {loading ? (
                    <div>Loading unpaid invoices...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : unpaidInvoices.length === 0 ? (
                    <div>No unpaid invoices found.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredUnpaid}
                        pagination
                        customStyles={customStyles}
                    />
                )}
            </div>
            <div>
                <h3 className="text-lg font-bold mb-4">Paid Invoices</h3>
                {loading ? (
                    <div>Loading paid invoices...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : paidInvoices.length === 0 ? (
                    <div>No paid invoices found.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredPaid}
                        pagination
                        customStyles={customStyles}
                    />
                )}
            </div>
            {isModalOpen && selectedInvoice && (
                <InvoiceDetailModal
                    token={token}
                    agentId={agentId}
                    invoice={selectedInvoice}
                    onClose={handleCloseModal}
                    onPaymentSuccess={fetchInvoices}
                    isFetching={isFetching}
                />
            )}
        </div>
    );
};

export default InvoiceHistory;
