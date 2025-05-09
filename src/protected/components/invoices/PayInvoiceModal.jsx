import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { getEnabledPaymentGateways, payInvoiceByReference } from '../../../apis/authActions';
import PaymentReceiptModal from '../invoices/PaymentReceiptModal';

const PayInvoiceModal = ({ closeModal, referenceNumber }) => {
    const { token } = useContext(AuthContext);
    const [referenceNumberState, setReferenceNumber] = useState(referenceNumber || '');
    const [tokenValue, setTokenValue] = useState('');
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [gateways, setGateways] = useState([]);
    const [walletChecked, setWalletChecked] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
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
            setError('Failed to fetch payment gateways');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayInvoice = async () => {
        if (!referenceNumberState) {
            setError('Please enter a valid invoice reference number.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = { reference_number: referenceNumberState };
            if (selectedGateway === 'Token') {
                if (!tokenValue) {
                    setError('Please enter a valid token.');
                    setIsLoading(false);
                    return;
                }
                payload.token = tokenValue;
            } else if (selectedGateway) {
                payload.payment_gateway = selectedGateway;
            } else {
                setError('Please select a payment method.');
                setIsLoading(false);
                return;
            }

            const response = await payInvoiceByReference(token, payload);

            if (response.status === 'error') {
                if (response.message === 'Insufficient wallet balance') {
                    setError('Insufficient wallet balance. Please top up your wallet and try again.');
                } else if (response.message === 'E-Wallet payments are only available for agents') {
                    setError('E-Wallet payments are only available for agent invoices. Please select another payment method.');
                } else {
                    setError(response.message);
                }
            } else if (response.payment_url && typeof response.payment_url === 'string' && response.payment_url.trim() !== '') {
                window.location.href = response.payment_url;
            } else {
                setSuccess(selectedGateway === 'E-Wallet'
                    ? 'Paid successfully via E-Wallet'
                    : selectedGateway === 'Token'
                    ? 'Paid successfully using Token'
                    : selectedGateway === 'Cash'
                    ? 'Paid successfully with Cash'
                    : `Paid successfully via ${selectedGateway}`);
                setPaymentData({
                    reference_number: response.invoice.reference_number,
                    amount: response.invoice.amount || 0,
                    payment_method: response.invoice.payment_option_used || selectedGateway,
                    payer_name: response.invoice.payer_name || 'N/A',
                    paid_at: response.invoice.paid_at || new Date().toISOString(),
                    status: response.invoice.status || 'Completed',
                    purpose: response.invoice.purpose || 'N/A',
                    description: response.invoice.description || 'N/A',
                });
                setShowReceipt(true);
            }
        } catch (err) {
            setError(err.message || 'Failed to pay invoice');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (typeof closeModal === 'function') {
            closeModal();
        } else {
            console.warn('closeModal is not a function. Modal cannot be closed.');
        }
    };

    return (
        <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '50' }}>
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105 relative">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'linear-gradient(90deg, #3B78BD, #F0B652)', padding: '10px', borderRadius: '8px 8px 0 0', color: 'white' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Pay Invoice</h2>
                    <button style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={handleClose}>
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
                    <div className="flex justify-center space-x-8 mb-6">
                        {isLoading ? (
                            <div className="text-gray-600 dark:text-gray-300">Loading payment methods...</div>
                        ) : gateways.length === 0 ? (
                            <div className="text-gray-600 dark:text-gray-300">No payment gateways available</div>
                        ) : (
                            gateways.map((gateway) => (
                                <div
                                    key={gateway.id}
                                    onClick={() => setSelectedGateway(gateway.gateway_name)}
                                    className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${selectedGateway === gateway.gateway_name ? 'border-2 border-[#3B78BD] dark:border-[#F0B652] shadow-lg' : 'border-2 border-transparent'}`}
                                >
                                    <img src={gateway.logo_url} alt={gateway.gateway_name} style={{ height: '50px', width: 'auto' }} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="mb-6">
                    <label className="flex items-center text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={walletChecked}
                            onChange={(e) => setWalletChecked(e.target.checked)}
                            className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-2">
                            {selectedGateway
                                ? `Confirm to pay the invoice using ${selectedGateway}`
                                : 'Confirm to pay the invoice with the provided details'}
                        </span>
                    </label>
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
                        className={`px-5 py-3 bg-[#3B78BD] text-white rounded-lg transition-all duration-200 hover:bg-[#F0B652] ${isLoading || !referenceNumberState || !walletChecked || (selectedGateway === 'Token' && !tokenValue) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePayInvoice}
                        disabled={isLoading || !referenceNumberState || !walletChecked || (selectedGateway === 'Token' && !tokenValue)}
                    >
                        {isLoading ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
                {showReceipt && paymentData && (
                    <PaymentReceiptModal
                        paymentData={paymentData}
                        onClose={() => {
                            setShowReceipt(false);
                            handleClose();
                        }}
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

export default PayInvoiceModal;