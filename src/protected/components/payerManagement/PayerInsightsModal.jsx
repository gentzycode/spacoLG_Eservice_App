import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { AuthContext } from '../../../context/AuthContext';
import { apiRequest } from '../../../apis/authActions';
import PayInvoiceModal from '../invoices/PayInvoiceModal';
import PaymentReceiptModal from '../invoices/PaymentReceiptModal';

const PayerInsightsModal = ({ payer, closeModal }) => {
    const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedInvoiceRef, setSelectedInvoiceRef] = useState(null);
    const [selectedPaymentData, setSelectedPaymentData] = useState(null);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setLoading(false);
            return;
        }

        const fetchInsights = async (page = 1) => {
            setLoading(true);
            setError(null);
            try {
                const referenceNumber = payer.individual_ref || payer.corporate_ref;
                const response = await apiRequest({
                    method: 'get',
                    url: `payers/${referenceNumber}/invoices`,
                    token,
                    params: {
                        page,
                        per_page: itemsPerPage,
                    },
                    setError,
                    setLoading,
                });

                if (response.status !== 'success') {
                    throw new Error(response.message || 'Failed to fetch payer insights');
                }

                const { invoices } = response;
                setPaymentHistory(invoices.data);
                setTotalPages(invoices.last_page);
                setCurrentPage(invoices.current_page - 1);
            } catch (err) {
                const errorMessage = err.message.includes('Invalid payer data')
                    ? 'Unable to retrieve payer information. Please check the payer details and try again.'
                    : err.message || 'Failed to fetch payer insights';
                setError(errorMessage);
                console.error('Error fetching payer insights:', err);
            }
        };

        fetchInsights(1);
    }, [payer, token]);

    const handlePageClick = ({ selected }) => {
        const newPage = selected + 1;
        fetchInsights(newPage);
    };

    const handlePayClick = (invoiceRef) => {
        setSelectedInvoiceRef(invoiceRef);
        setShowPayModal(true);
    };

    const handlePrintReceiptClick = (payment) => {
        const paymentData = {
            reference_number: payment.invoice_ref || 'N/A',
            amount: payment.amount || 0,
            payment_method: payment.payment_method || 'N/A',
            payer_name: payer.first_name || payer.company_name || 'N/A',
            paid_at: payment.date || new Date().toISOString(),
            status: payment.status || 'Completed',
            purpose: payment.purpose || 'N/A',
            description: payment.description || `Payment for invoice ${payment.invoice_ref}`,
            validity_period_days: payment.validity_period_days || null,
            expires_at: payment.expires_at || null,
            payment_type: payment.payment_type || 'N/A',
            is_expired: payment.is_expired || false,
        };
        setSelectedPaymentData(paymentData);
        setShowReceiptModal(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-40 p-4">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 hover:scale-105">
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Payer Insights: {payer.first_name || payer.company_name}</h2>
                        <button
                            className="text-white hover:text-gray-200 transition-colors duration-200"
                            onClick={(e) => { e.stopPropagation(); closeModal(); }}
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-2">Payment History</h3>
                            {loading ? (
                                <div className="flex justify-center py-6">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F0B652]"></div>
                                </div>
                            ) : paymentHistory.length === 0 ? (
                                <p className="text-gray-600">No payment history available.</p>
                            ) : (
                                <>
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead className="sticky top-0 bg-gray-100">
                                                <tr>
                                                    <th className="p-2 border border-gray-200">Invoice Ref</th>
                                                    <th className="p-2 border border-gray-200">Amount</th>
                                                    <th className="p-2 border border-gray-200">Date</th>
                                                    <th className="p-2 border border-gray-200">Status</th>
                                                    <th className="p-2 border border-gray-200">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paymentHistory.map((payment, index) => (
                                                    <tr key={payment.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-[#ecf6ec]'}>
                                                        <td className="p-2 border border-gray-200">{payment.invoice_ref}</td>
                                                        <td className="p-2 border border-gray-200">₦{payment.amount.toLocaleString()}</td>
                                                        <td className="p-2 border border-gray-200">{payment.date}</td>
                                                        <td className="p-2 border border-gray-200">{payment.status}</td>
                                                        <td className="p-2 border border-gray-200">
                                                            {payment.status === 'unpaid' ? (
                                                                <button
                                                                    className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-1 px-3 rounded transition-all duration-300 text-sm"
                                                                    onClick={() => handlePayClick(payment.invoice_ref)}
                                                                >
                                                                    Pay
                                                                </button>
                                                            ) : payment.status === 'paid' ? (
                                                                <button
                                                                    className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-1 px-3 rounded transition-all duration-300 text-sm"
                                                                    onClick={() => handlePrintReceiptClick(payment)}
                                                                >
                                                                    Print Receipt
                                                                </button>
                                                            ) : null}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {totalPages > 1 && (
                                        <ReactPaginate
                                            previousLabel={'Previous'}
                                            nextLabel={'Next'}
                                            breakLabel={'...'}
                                            breakClassName={'break-me'}
                                            pageCount={totalPages}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination flex justify-center mt-4 space-x-2'}
                                            pageClassName={'mx-1'}
                                            pageLinkClassName={'px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#F0B652] text-gray-700 hover:text-white transition-all duration-300'}
                                            previousClassName={'mx-1'}
                                            previousLinkClassName={'px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#F0B652] text-gray-700 hover:text-white transition-all duration-300'}
                                            nextClassName={'mx-1'}
                                            nextLinkClassName={'px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#F0B652] text-gray-700 hover:text-white transition-all duration-300'}
                                            activeClassName={'bg-[#F0B652] text-white'}
                                            forcePage={currentPage}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showPayModal && (
                <PayInvoiceModal
                    closeModal={() => setShowPayModal(false)}
                    referenceNumber={selectedInvoiceRef}
                />
            )}

            {showReceiptModal && selectedPaymentData && (
                <PaymentReceiptModal
                    paymentData={selectedPaymentData}
                    onClose={() => setShowReceiptModal(false)}
                />
            )}
        </>
    );
};

export default PayerInsightsModal;