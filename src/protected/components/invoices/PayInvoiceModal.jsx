import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getEnabledPaymentGateways, payInvoiceByReference } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';

const PayInvoiceModal = ({ closeModal }) => {
    const { token } = useContext(AuthContext);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gateways, setGateways] = useState([]);
    const [walletChecked, setWalletChecked] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchPaymentGateways();
    }, []);

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
        setIsLoading(true);
        setError(null);
        try {
            const payload = { reference_number: referenceNumber };
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
                setError(response.message);
            } else if (response.payment_url) {
                window.location.href = response.payment_url;
            } else {
                setSuccessMessage('Invoice paid successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (err) {
            setError('Failed to pay invoice');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">Pay Invoice</h2>
                    <button className="text-white hover:text-gray-200 transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Invoice Reference Number</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Enter Invoice Reference Number"
                    />
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
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Payment Method</label>
                    <div className="flex justify-center space-x-8 mb-6">
                        {gateways.length === 0 ? (
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
                        <span className="ml-2">Confirm to pay the invoice with the provided details</span>
                    </label>
                </div>
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
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                    <button
                        className={`px-5 py-3 bg-[#3B78BD] text-white rounded-lg transition-all duration-200 hover:bg-[#F0B652] ${isLoading || !referenceNumber || !walletChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePayInvoice}
                        disabled={isLoading || !referenceNumber || !walletChecked}
                    >
                        {isLoading ? 'Processing...' : 'Pay Invoice'}
                    </button>
                </div>
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
    );
};

export default PayInvoiceModal;