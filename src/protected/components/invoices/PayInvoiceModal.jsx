import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { getEnabledPaymentGateways, payInvoiceByReference } from '../../../apis/authActions';
import PaymentReceiptModal from '../invoices/PaymentReceiptModal';

const PayInvoiceModal = ({ closeModal, referenceNumber }) => {
    const { token, user } = useContext(AuthContext);
    const [referenceNumberState, setReferenceNumber] = useState(referenceNumber || '');
    const [tokenValue, setTokenValue] = useState('');
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [gateways, setGateways] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        console.log('AuthContext user:', user); // Debug user object
        fetchPaymentGateways();
        if (referenceNumber) {
            setReferenceNumber(referenceNumber);
        }
    }, [referenceNumber]);

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

    const handlePayInvoice = async () => {
        if (!referenceNumberState) {
            setError('Please enter a valid invoice reference number.');
            return;
        }

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
        setSuccess(null);

        try {
            const payload = { reference_number: referenceNumberState };
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
            } else if (response.payment_url && typeof response.payment_url === 'string' && response.payment_url.trim() !== '') {
                window.location.href = response.payment_url;
            } else {
                const successMessage = selectedGateway === 'Cash'
                    ? 'Cash payment recorded successfully. Please remit the amount to the office.'
                    : selectedGateway === 'E-Wallet'
                    ? 'Paid successfully via E-Wallet.'
                    : selectedGateway === 'Token'
                    ? 'Paid successfully using Token.'
                    : `Paid successfully via ${selectedGateway}.`;
                setSuccess(successMessage);
                setPaymentData({
                    reference_number: response.invoice.reference_number,
                    amount: response.invoice.amount || 0,
                    payment_method: response.invoice.payment_option_used || selectedGateway,
                    payer_name: response.invoice.payer_name || 'N/A',
                    payee_name: response.invoice.payee_name || 'N/A',
                    paid_at: response.invoice.paid_at || new Date().toISOString(),
                    status: response.invoice.status || 'paid',
                    purpose: response.invoice.purpose || 'N/A',
                    description: response.invoice.description || 'N/A',
                    validity_period_days: response.invoice.validity_period_days || null,
                    expires_at: response.invoice.expires_at || null,
                    payment_type: response.invoice.payment_type || 'N/A',
                    is_expired: response.invoice.is_expired || false,
                    payee_id: response.invoice.payee_id || user.id,
                    payee_type: response.invoice.payee_type || 'agent', // Default to 'agent' for E-Wallet
                });
                setShowReceipt(true);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while processing the payment.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (typeof closeModal === 'function') {
            closeModal();
        } else {
            console.warn('closeModal is not a function.');
        }
    };

    const handleReceiptClose = () => {
        setShowReceipt(false);
        handleClose();
    };

    if (showReceipt && paymentData) {
        return (
            <PaymentReceiptModal
                paymentData={paymentData}
                onClose={handleReceiptClose}
            />
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105 relative">
                <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 rounded-t-lg text-white">
                    <h2 className="text-xl font-bold">Pay Invoice</h2>
                    <button onClick={handleClose} className="text-white hover:text-gray-200">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Invoice Reference Number</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                        value={referenceNumberState}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Enter Invoice Reference Number"
                    />
                </div>
                {selectedGateway === 'Token' && (
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Token</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                            value={tokenValue}
                            onChange={(e) => setTokenValue(e.target.value)}
                            placeholder="Enter Token"
                        />
                    </div>
                )}
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Payment Method</label>
                    <div className="flex flex-wrap justify-center gap-4">
                        {isLoading ? (
                            <div className="text-gray-600 dark:text-gray-300">Loading payment methods...</div>
                        ) : gateways.length === 0 ? (
                            <div className="text-gray-600 dark:text-gray-300">No payment gateways available</div>
                        ) : (
                            gateways.map((gateway) => (
                                <button
                                    key={gateway.id}
                                    onClick={() => setSelectedGateway(gateway.gateway_name)}
                                    className={`p-4 rounded-lg transition-all duration-300 ${selectedGateway === gateway.gateway_name ? 'border-2 border-[#3B78BD] dark:border-[#F0B652] shadow-lg' : 'border-2 border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={gateway.logo_url} alt={gateway.gateway_name} className="h-12 w-auto" />
                                </button>
                            ))
                        )}
                    </div>
                </div>
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
                {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">{success}</div>}
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <button
                        className={`px-5 py-3 bg-[#3B78BD] text-white rounded-lg transition-all duration-200 hover:bg-[#F0B652] ${isLoading || !referenceNumberState || (!selectedGateway && !tokenValue) || !user ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePayInvoice}
                        disabled={isLoading || !referenceNumberState || (!selectedGateway && !tokenValue) || !user}
                    >
                        {isLoading ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
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

export default PayInvoiceModal;