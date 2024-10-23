import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import { getUnpaidInvoices, getPaidInvoicesByAgent, getInvoiceById } from '../../../apis/authActions';
import { AiOutlineEye, AiOutlinePrinter } from 'react-icons/ai';
import InvoiceDetailModal from './InvoiceDetailModal';
import logo from '../../../assets/ansg_logo.png';  // Import the logo

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

    const handlePrint = async (id) => {
        try {
            const invoice = await getInvoiceById(token, id);
            const printWindow = window.open('', '', 'height=500,width=300');
            printWindow.document.write('<html><head><title>Invoice</title>');
            printWindow.document.write(`
                <style>
                    @media print { 
                        body { 
                            font-size: 12px; 
                            margin: 0; 
                            padding: 0; 
                            font-family: Arial, sans-serif;
                        } 
                        table { 
                            width: 100%; 
                            border-collapse: collapse;
                        } 
                        th, td { 
                            text-align: left; 
                            padding: 4px;
                        } 
                        .logo {
                            text-align: left;
                            margin-bottom: 10px;
                        }
                        .content {
                            margin-top: 10px;
                        }
                        img {
                            width: 50px; 
                            height: auto;
                        }
                        .no-border {
                            border: none;
                        }
                    }
                </style>
            `);
            printWindow.document.write('</head><body>');
            // Include the logo and left align it
            printWindow.document.write(`
                <div class="logo">
                    <img src="${window.location.origin + logo}" alt="Logo" />
                </div>
            `);
            printWindow.document.write('<h3>Invoice Details</h3>');
            printWindow.document.write(`
                <table class="content">
                    <tr><td><strong>Reference Number:</strong></td><td>${invoice.reference_number}</td></tr>
                    <tr><td><strong>Payer ID:</strong></td><td>${invoice.payer_id}</td></tr>
                    <tr><td><strong>Payer Type:</strong></td><td>${invoice.payer_type}</td></tr>
                    <tr><td><strong>Purpose:</strong></td><td>${invoice.purpose}</td></tr>
                    <tr><td><strong>Description:</strong></td><td>${invoice.description}</td></tr>
                    <tr><td><strong>Amount:</strong></td><td>₦${Number(invoice.amount).toLocaleString()}</td></tr>
                    <tr><td><strong>Payment Option Used:</strong></td><td>${invoice.payment_option_used}</td></tr>
                    <tr><td><strong>Status:</strong></td><td>${invoice.status}</td></tr>
                    <tr><td><strong>Paid At:</strong></td><td>${invoice.paid_at ? formatDate(invoice.paid_at) : 'N/A'}</td></tr>
                    <tr><td><strong>Created At:</strong></td><td>${formatDate(invoice.created_at)}</td></tr>
                    <tr><td><strong>Updated At:</strong></td><td>${formatDate(invoice.updated_at)}</td></tr>
                </table>
            `);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        } catch (err) {
            setError('Failed to fetch invoice for printing');
        }
    };    

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null); // Clear the selected invoice
    };

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
            selector: (row) => row.reference_number.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Purpose",
            selector: (row) => row.purpose.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Description",
            selector: (row) => row.description,
            sortable: true,
            wrap: true,
        },
        {
            name: "Amount",
            selector: (row) => `₦${Number(row.amount).toLocaleString()}`.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Payment Option Used",
            selector: (row) => row.payment_option_used,
            sortable: true,
            wrap: true,
        },
        {
            name: "Status",
            selector: (row) => row.status.toUpperCase(),
            sortable: true,
            wrap: true,
        },
        {
            name: "Paid At",
            selector: (row) => row.paid_at ? formatDate(row.paid_at) : 'N/A',
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
            wrap: true,
        },
        {
            name: "Actions",
            button: true,
            cell: (row) => (
                <div className="flex space-x-2">
                    <AiOutlineEye
                        className="text-green-600 cursor-pointer"
                        onClick={() => handleView(row.id)}
                    />
                    <AiOutlinePrinter
                        className="text-blue-600 cursor-pointer"
                        onClick={() => handlePrint(row.id)}
                    />
                </div>
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
            <h2 className="text-2xl font-bold mb-4 text-[#0d544c]">Invoice History</h2>
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
