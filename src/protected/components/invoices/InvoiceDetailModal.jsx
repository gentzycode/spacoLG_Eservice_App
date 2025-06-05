import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { formatDate } from '../../../apis/functions';
import { getEnabledPaymentGateways, payInvoiceByReference } from '../../../apis/authActions';
import logo from '../../../assets/logo-bayelsa.png';
import PaymentReceiptModal from './PaymentReceiptModal';
import { Spinner } from '../../../common/Spinner';

const InvoiceDetailModal = ({ invoice, token, agentId, onClose, onPaymentSuccess }) => {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [tokenValue, setTokenValue] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const printRef = useRef();

    useEffect(() => {
        console.log('AuthContext user:', user); // Debug user object
        const fetchPaymentGateways = async () => {
            setIsLoading(true);
            try {
                await getEnabledPaymentGateways(token, setGateways, setError, setIsLoading);
            } catch (err) {
                setError('Failed to fetch payment gateways. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPaymentGateways();
    }, [token]);

    const handlePayInvoice = async () => {
        const validGateways = gateways.map(g => g.gateway_name);
        if (!selectedGateway && !tokenValue) {
            setError('Please select a payment method or enter a token.');
            return;
        }
        if (selectedGateway && !validGateways.includes(selectedGateway)) {
            setError('Invalid payment gateway selected.');
            return;
        }
        if (selectedGateway === 'Token' && !tokenValue) {
            setError('Please enter a valid token.');
            return;
        }
        if (!user) {
            setError('You must be logged in to process a payment.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const payload = { reference_number: invoice.invoice_ref };
            if (selectedGateway === 'Token') {
                payload.token = tokenValue;
            } else if (selectedGateway) {
                payload.payment_gateway = selectedGateway;
            }

            const response = await payInvoiceByReference(token, payload);
            if (response.status === 'error') {
                if (response.message === 'Insufficient wallet balance') {
                    setError('Insufficient wallet balance. Please top up your wallet and try again.');
                } else if (response.message === 'Agent not authenticated') {
                    setError('E-Wallet payments require agent authentication. Please log in as an agent.');
                } else if (response.message === 'Invoice has already been paid') {
                    setError('This invoice has already been paid.');
                } else {
                    setError(response.message || 'Failed to process payment.');
                }
            } else if (response.payment_url) {
                window.location.href = response.payment_url;
            } else {
                const successMessage = selectedGateway === 'Cash'
                    ? 'Cash payment recorded successfully. Please remit the amount to the office.'
                    : selectedGateway === 'E-Wallet'
                    ? 'Paid successfully via E-Wallet.'
                    : selectedGateway === 'Token'
                    ? 'Paid successfully using Token.'
                    : `Paid successfully via ${selectedGateway}.`;
                setSuccessMessage(successMessage);
                const updatedPaymentData = {
                    reference_number: invoice.invoice_ref,
                    amount: invoice.amount,
                    payment_method: response.invoice.payment_option_used || selectedGateway,
                    payer_name: invoice.payer_name || 'N/A',
                    payee_name: response.invoice.payee_name || 'N/A',
                    paid_at: response.invoice.paid_at || new Date().toISOString(),
                    status: response.invoice.status || 'paid',
                    purpose: invoice.purpose || 'N/A',
                    description: invoice.description || 'N/A',
                    validity_period_days: invoice.validity_period_days || null,
                    expires_at: invoice.expires_at || null,
                    payment_type: invoice.payment_type || 'N/A',
                    is_expired: invoice.is_expired || false,
                    payee_id: response.invoice.payee_id || user.id,
                    payee_type: response.invoice.payee_type || 'agent', // Default to 'agent' for E-Wallet
                };
                setPaymentData(updatedPaymentData);
                setTimeout(() => {
                    onPaymentSuccess();
                    setIsReceiptModalOpen(true);
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while processing the payment.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        setIsProcessing(true);
        const printWindow = window.open('', '', 'height=600,width=800');
        const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');
        const generateRandomNumber = () => Math.floor(Math.random() * 1000000);
        const randomNumber = generateRandomNumber();
        const watermarkText = `AUTHENTIC ${randomNumber}`;

        const printContent = `
            <div style="position: relative; border: 2px solid #000; border-radius: 8px; padding: 20px; margin: 10px;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.1; font-size: 60px; color: #000; pointer-events: none;">
                    ${watermarkText}
                </div>
                <div style="text-align: center; margin-bottom: 10px;">
                    <img src="${window.location.origin + logo}" alt="Logo" style="width: 50px; height: auto;" />
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td><strong>Reference Number:</strong></td><td>${invoice.invoice_ref || 'N/A'}</td></tr>
                    <tr><td><strong>Amount:</strong></td><td>₦${Number(invoice.amount || 0).toLocaleString()}</td></tr>
                    <tr><td><strong>Status:</strong></td><td>${invoice.status || 'N/A'}</td></tr>
                    <tr><td><strong>Created At:</strong></td><td>${invoice.date ? formatDate(invoice.date) : 'N/A'}</td></tr>
                    <tr><td><strong>Purpose:</strong></td><td>${invoice.purpose || 'N/A'}</td></tr>
                    <tr><td><strong>Description:</strong></td><td>${invoice.description || 'N/A'}</td></tr>
                    ${invoice.status === 'paid' && invoice.payment_method ? `<tr><td><strong>Payment Method:</strong></td><td>${invoice.payment_method}</td></tr>` : ''}
                    ${invoice.payer_name ? `<tr><td><strong>Payer:</strong></td><td>${invoice.payer_name}</td></tr>` : ''}
                    ${invoice.payee_name ? `<tr><td><strong>Processed By:</strong></td><td>${invoice.payee_name}</td></tr>` : ''}
                    ${invoice.expires_at ? `<tr><td><strong>Expiry Date:</strong></td><td>${formatDate(invoice.expires_at)}</td></tr>` : ''}
                </table>
            </div>
        `;

        printWindow.document.write(`
            <html><head><title>Invoice</title><style>body { font-family: Arial, sans-serif; margin: 0; } table { width: 100%; } td { padding: 5px; }</style></head><body>${printContent}</body></html>
        `);
        printWindow.document.close();
        printWindow.print();
        setIsProcessing(false);
    };

    const handleCloseReceiptModal = () => {
        setIsReceiptModalOpen(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto relative animate-fadeIn">
                <div ref={printRef} className="mb-6">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] text-center mb-4">Invoice Details</h2>
                    <table className="w-full mb-6 border-collapse">
                        <tbody>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Reference Number:</td>
                                <td className="py-2 px-4">{invoice.invoice_ref || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Amount:</td>
                                <td className="py-2 px-4">₦{Number(invoice.amount || 0).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Status:</td>
                                <td className="py-2 px-4">{invoice.status || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Purpose:</td>
                                <td className="py-2 px-4">{invoice.purpose || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Description:</td>
                                <td className="py-2 px-4">{invoice.description || 'N/A'}</td>
                            </tr>
                            {invoice.status === 'paid' && invoice.payment_method && (
                                <tr className="border-b">
                                    <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Payment Method:</td>
                                    <td className="py-2 px-4">{invoice.payment_method}</td>
                                </tr>
                            )}
                            {invoice.payer_name && (
                                <tr className="border-b">
                                    <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Payer:</td>
                                    <td className="py-2 px-4">{invoice.payer_name}</td>
                                </tr>
                            )}
                            {invoice.payee_name && (
                                <tr className="border-b">
                                    <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Processed By:</td>
                                    <td className="py-2 px-4">{invoice.payee_name}</td>
                                </tr>
                            )}
                            {invoice.date && (
                                <tr className="border-b">
                                    <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Created At:</td>
                                    <td className="py-2 px-4">{formatDate(invoice.date)}</td>
                                </tr>
                            )}
                            {invoice.expires_at && (
                                <tr className="border-b">
                                    <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Expiry Date:</td>
                                    <td className="py-2 px-4">{formatDate(invoice.expires_at)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {invoice.status === 'unpaid' ? (
                    <div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Payment Method</label>
                            {isLoading ? (
                                <div className="text-center text-gray-600 dark:text-gray-300">Loading payment methods...</div>
                            ) : gateways.length === 0 ? (
                                <div className="text-center text-gray-600 dark:text-gray-300">No payment gateways available</div>
                            ) : (
                                <div className="flex flex-wrap justify-center gap-4">
                                    {gateways.map((gateway) => (
                                        <button
                                            key={gateway.id}
                                            onClick={() => setSelectedGateway(gateway.gateway_name)}
                                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                                selectedGateway === gateway.gateway_name
                                                    ? 'bg-[#3B78BD] dark:bg-[#F0B652] text-white shadow-lg'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                        >
                                            {gateway.gateway_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedGateway === 'Token' && (
                            <div className="mb-6">
                                <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Token</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                                    value={tokenValue}
                                    onChange={(e) => setTokenValue(e.target.value)}
                                    placeholder="Enter Token"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
                                {successMessage}
                            </div>
                        )}

                        {selectedGateway && (
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={onClose}
                                    className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-6 rounded transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayInvoice}
                                    disabled={isLoading || (selectedGateway === 'Token' && !tokenValue) || !user}
                                    className={`bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-6 rounded transition-all duration-300 ${
                                        isLoading || (selectedGateway === 'Token' && !tokenValue) || !user ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isLoading ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : paymentData ? (
                    <div className="p-4 flex justify-end space-x-4">
                        <button
                            onClick={() => setIsReceiptModalOpen(true)}
                            className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-6 rounded transition-all duration-300"
                        >
                            Print Receipt
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-6 rounded transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="p-4 flex justify-end space-x-4">
                        <button
                            onClick={() => {
                                setIsProcessing(true);
                                const receiptData = {
                                    reference_number: invoice.invoice_ref,
                                    amount: invoice.amount,
                                    payment_method: invoice.payment_method || 'N/A',
                                    payer_name: invoice.payer_name || 'N/A',
                                    payee_name: invoice.payee_name || 'N/A',
                                    paid_at: invoice.date || new Date().toISOString(),
                                    status: invoice.status || 'paid',
                                    purpose: invoice.purpose || 'N/A',
                                    description: invoice.description || 'N/A',
                                    validity_period_days: invoice.validity_period_days || null,
                                    expires_at: invoice.expires_at || null,
                                    payment_type: invoice.payment_type || 'N/A',
                                    is_expired: invoice.is_expired || false,
                                    payee_id: invoice.payee_id || user?.id || null,
                                    payee_type: invoice.payee_type || 'agent', // Default to 'agent' for E-Wallet
                                };
                                setPaymentData(receiptData);
                                setIsReceiptModalOpen(true);
                                setIsProcessing(false);
                            }}
                            className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-6 rounded transition-all duration-300"
                        >
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-6 rounded transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                )}

                {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
                        <Spinner />
                    </div>
                )}
                <button onClick={onClose} className="absolute top-2 right-2 text-red-600 font-bold text-lg">×</button>
                {isReceiptModalOpen && paymentData && (
                    <PaymentReceiptModal
                        paymentData={paymentData}
                        onClose={handleCloseReceiptModal}
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
        </div>
    );
};

export default InvoiceDetailModal;