import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { formatDate } from '../../../apis/functions';
import { getUnpaidInvoices, getPaidInvoicesByAgent, getInvoiceById } from '../../../apis/authActions';
import { AiOutlineEye, AiOutlinePrinter } from 'react-icons/ai';
import InvoiceDetailModal from './InvoiceDetailModal';
import logo from '../../../assets/logo-bayelsa.png';

const InvoiceHistory = ({ token, agentId }) => {
    const [unpaidInvoices, setUnpaidInvoices] = useState([]);
    const [paidInvoices, setPaidInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedUnpaid, setSelectedUnpaid] = useState([]);
    const [selectedPaid, setSelectedPaid] = useState([]);

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
        const trimmedFilter = filterText.trim().toLowerCase();
        return (unpaidInvoices || []).filter(item => {
            const refNumber = item.reference_number ? item.reference_number.trim().toLowerCase() : '';
            return refNumber.includes(trimmedFilter);
        });
    }, [filterText, unpaidInvoices]);

    const filteredPaid = useMemo(() => {
        const trimmedFilter = filterText.trim().toLowerCase();
        return (paidInvoices || []).filter(item => {
            const refNumber = item.reference_number ? item.reference_number.trim().toLowerCase() : '';
            return refNumber.includes(trimmedFilter);
        });
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

    const handlePrint = async (ids) => {
        const invoicesToPrint = ids.map(id => {
            const invoice = [...unpaidInvoices, ...paidInvoices].find(i => i.id === id);
            return invoice || {};
        }).filter(i => i.id);

        const printWindow = window.open('', '', 'height=600,width=800');
        const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');
        const generateRandomNumber = () => Math.floor(Math.random() * 1000000);
        const randomNumber = generateRandomNumber();
        const watermarkText = `AUTHENTIC ${randomNumber}`;

        const printContent = invoicesToPrint.map(invoice => `
            <div style="display: inline-block; width: 30%; position: relative; border: 2px solid #000; border-radius: 8px; padding: 20px; margin: 10px;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.1; font-size: 60px; color: #000; pointer-events: none;">
                    ${watermarkText}
                </div>
                <div>
                    <p style="margin: 5px 0;"><strong>Ref Number:</strong> ${invoice.reference_number}</p>
                    <p style="margin: 5px 0;"><strong>Amount:</strong> ₦${Number(invoice.amount).toLocaleString()}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> ${invoice.status}</p>
                    <p style="margin: 5px 0;"><strong>Created:</strong> ${formatDate(invoice.created_at)}</p>
                </div>
            </div>
        `).join('');

        printWindow.document.write(`
            <html><head><title>Print Invoices</title><style>body { font-family: Arial, sans-serif; }</style></head><body>${printContent}</body></html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleSelectUnpaid = (id) => {
        setSelectedUnpaid(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAllUnpaid = (isSelected) => {
        if (isSelected) setSelectedUnpaid(filteredUnpaid.map(i => i.id));
        else setSelectedUnpaid([]);
    };

    const handleSelectPaid = (id) => {
        setSelectedPaid(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAllPaid = (isSelected) => {
        if (isSelected) setSelectedPaid(filteredPaid.map(i => i.id));
        else setSelectedPaid([]);
    };

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectedUnpaid.length === filteredUnpaid.length && filteredUnpaid.length > 0}
                    onChange={e => handleSelectAllUnpaid(e.target.checked)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            selector: row => (
                <input
                    type="checkbox"
                    checked={selectedUnpaid.includes(row.id)}
                    onChange={() => handleSelectUnpaid(row.id)}
                    className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                />
            ),
            width: '60px',
            center: true,
        },
        { name: "No.", selector: (row, index) => index + 1, width: '50px', center: true },
        { name: "Reference Number", selector: row => row.reference_number.toUpperCase(), sortable: true },
        { name: "Purpose", selector: row => row.purpose.toUpperCase(), sortable: true },
        { name: "Description", selector: row => row.description, sortable: true },
        { name: "Amount", selector: row => `₦${Number(row.amount).toLocaleString()}`, sortable: true },
        { name: "Payment Option Used", selector: row => row.payment_option_used, sortable: true },
        { name: "Status", selector: row => row.status.toUpperCase(), sortable: true },
        { name: "Paid At", selector: row => row.paid_at ? formatDate(row.paid_at) : 'N/A', sortable: true },
        {
            name: "Actions",
            button: true,
            cell: row => (
                <div className="flex space-x-2">
                    <AiOutlineEye
                        className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer"
                        onClick={() => handleView(row.id)}
                    />
                    <AiOutlinePrinter
                        className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer"
                        onClick={() => handlePrint([row.id])}
                    />
                </div>
            ),
        },
    ];

    const customStyles = {
        table: { style: { borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } },
        headRow: { style: { background: 'linear-gradient(to right, #3B78BD, #F0B652)', borderBottom: '2px solid #d1d5db', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#fff' } },
        headCells: { style: { padding: '14px 16px' } },
        rows: { style: { fontSize: '15px', fontWeight: 500, color: '#111827', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f3f4f6', cursor: 'pointer' }, transition: 'all 0.3s ease' }, stripedStyle: { backgroundColor: '#f9fafb' } },
        cells: { style: { padding: '12px 16px', borderRight: '1px solid #e5e7eb', '&:last-of-type': { borderRight: 'none' } } },
        pagination: { style: { padding: '16px', backgroundColor: '#fff', borderTop: '1px solid #e5e7eb', fontSize: '14px', color: '#374151' }, pageButtonsStyle: { borderRadius: '6px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', padding: '6px 12px', margin: '0 4px', transition: 'all 0.3s ease', '&:hover': { backgroundColor: '#3B78BD', color: '#fff', borderColor: '#3B78BD' }, '&:disabled': { backgroundColor: '#e5e7eb', color: '#9ca3af' } } },
    };

    return (
        <div className="mt-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Invoice History</h2>
            <div className="mb-6 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search by Reference Number..."
                    className="w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value.trim())}
                />
                {(selectedUnpaid.length > 0 || selectedPaid.length > 0) && (
                    <button
                        onClick={() => handlePrint([...selectedUnpaid, ...selectedPaid])}
                        className="bg-[#3B78BD] dark:bg-[#F0B652] text-white py-2 px-6 rounded-lg hover:bg-[#F0B652] dark:hover:bg-[#3B78BD] transition-all duration-300 shadow-md"
                    >
                        Print Selected
                    </button>
                )}
            </div>
            <div className="mb-8">
                <h3 className="text-lg font-bold text-[#3B78BD] dark:text-[#F0B652] mb-4">Unpaid Invoices</h3>
                {loading ? (
                    <div className="flex justify-center my-5">
                        <svg className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                        </svg>
                    </div>
                ) : error ? (
                    <div className="text-center py-6 text-[#f06752] dark:text-red-400">{error}</div>
                ) : unpaidInvoices.length === 0 ? (
                    <div className="text-center py-6 text-gray-600 dark:text-gray-300">No unpaid invoices found.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredUnpaid}
                        customStyles={customStyles}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 30, 50, 100, filteredUnpaid.length]}
                        highlightOnHover
                        striped
                        dense
                        noDataComponent={<div className="text-center py-6 text-gray-600 dark:text-gray-300">No matching records found.</div>}
                    />
                )}
            </div>
            <div>
                <h3 className="text-lg font-bold text-[#3B78BD] dark:text-[#F0B652] mb-4">Paid Invoices</h3>
                {loading ? (
                    <div className="flex justify-center my-5">
                        <svg className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                        </svg>
                    </div>
                ) : error ? (
                    <div className="text-center py-6 text-[#f06752] dark:text-red-400">{error}</div>
                ) : paidInvoices.length === 0 ? (
                    <div className="text-center py-6 text-gray-600 dark:text-gray-300">No paid invoices found.</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredPaid}
                        customStyles={customStyles}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 30, 50, 100, filteredPaid.length]}
                        highlightOnHover
                        striped
                        dense
                        noDataComponent={<div className="text-center py-6 text-gray-600 dark:text-gray-300">No matching records found.</div>}
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

    function handleCloseModal() {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    }
};

export default InvoiceHistory;