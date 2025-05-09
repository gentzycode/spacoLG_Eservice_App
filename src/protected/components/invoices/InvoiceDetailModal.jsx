import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { formatDate } from '../../../apis/functions';
import { getEnabledPaymentGateways, payInvoiceByReference } from '../../../apis/authActions';
import logo from '../../../assets/logo-bayelsa.png';

const InvoiceDetailModal = ({ invoice, token, agentId, onClose, onPaymentSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [tokenValue, setTokenValue] = useState('');
    const printRef = useRef();

    // Fetch payment gateways on mount
    useEffect(() => {
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
        fetchPaymentGateways();
    }, [token]);

    const handlePayInvoice = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const payload = { reference_number: invoice.reference_number };
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
                } else if (response.message === 'E-Wallet payments are only available for agent invoices') {
                    setError('E-Wallet payments are only available for agent invoices. Please select another payment method.');
                } else {
                    setError(response.message);
                }
            } else if (response.payment_url) {
                window.location.href = response.payment_url;
            } else {
                const successMsg = selectedGateway === 'E-Wallet'
                    ? 'Paid successfully via E-Wallet'
                    : selectedGateway === 'Token'
                    ? 'Paid successfully using Token'
                    : selectedGateway === 'Cash'
                    ? 'Paid successfully with Cash'
                    : `Paid successfully via ${selectedGateway}`;
                setSuccessMessage(successMsg);
                setTimeout(() => {
                    onPaymentSuccess();
                    onClose();
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'Failed to pay invoice');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
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
                    <tr><td><strong>Reference Number:</strong></td><td>${invoice.reference_number}</td></tr>
                    <tr><td><strong>Amount:</strong></td><td>₦${Number(invoice.amount).toLocaleString()}</td></tr>
                    <tr><td><strong>Status:</strong></td><td>${invoice.status}</td></tr>
                    <tr><td><strong>Created At:</strong></td><td>${formatDate(invoice.created_at)}</td></tr>
                </table>
            </div>
        `;

        printWindow.document.write(`
            <html><head><title>Invoice</title><style>body { font-family: Arial, sans-serif; margin: 0; } table { width: 100%; } td { padding: 5px; }</style></head><body>${printContent}</body></html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '50' }}>
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
                                <td className="py-2 px-4">{invoice.reference_number}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Amount:</td>
                                <td className="py-2 px-4">₦{Number(invoice.amount).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Status:</td>
                                <td className="py-2 px-4">{invoice.status}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {invoice.status === 'unpaid' ? (
                    <div>
                        {/* Payment Method Selection */}
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

                        {/* Token Input Field (if Token is selected) */}
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

                        {/* Error and Success Messages */}
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

                        {/* Pay Button */}
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
                                    disabled={isLoading || (selectedGateway === 'Token' && !tokenValue)}
                                    className={`bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-6 rounded transition-all duration-300 ${
                                        isLoading || (selectedGateway === 'Token' && !tokenValue) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isLoading ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-end space-x-4">
                        <button onClick={handlePrint} className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-6 rounded transition-all duration-300">Print</button>
                        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-6 rounded transition-all duration-300">Close</button>
                    </div>
                )}

                <button onClick={onClose} className="absolute top-2 right-2 text-red-600 font-bold text-lg">×</button>
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