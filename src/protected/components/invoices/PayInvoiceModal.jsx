import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getEnabledPaymentGateways2, payInvoiceByReference } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';

const PayInvoiceModal = ({ closeModal }) => {
    const { token } = useContext(AuthContext);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
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
            await getEnabledPaymentGateways2(token, (data) => {
                setGateways(data);
            }, setError, setIsLoading);
        } catch (err) {
            setError('Failed to fetch payment gateways');
            console.error('Error fetching payment gateways:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayInvoice = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const payload = {
                reference_number: referenceNumber,
                token: tokenValue,
            };
            const response = await payInvoiceByReference(token, payload);
            if (response.status === 'error' && response.message === 'Insufficient token balance') {
                setError('Insufficient token balance');
            } else {
                setSuccessMessage('Invoice paid successfully');
                setTimeout(() => {
                    window.location.reload(); // Refresh the page after payment
                }, 2000);
            }
        } catch (err) {
            setError('Failed to pay invoice');
            console.error('Error paying invoice:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="modal-container bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Pay Invoice</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Invoice Reference Number</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Enter Invoice Reference Number"
                    />
                </div>
                {selectedGateway === 'Token' && (
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-700">Token</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                            value={tokenValue}
                            onChange={(e) => setTokenValue(e.target.value)}
                            placeholder="Enter Token"
                        />
                    </div>
                )}
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Payment Method</label>
                    <div className="flex justify-center space-x-8 mb-6">
                        {gateways.length === 0 ? (
                            <div>No payment gateways available</div>
                        ) : (
                            gateways.map((gateway) => (
                                <div
                                    key={gateway.id}
                                    onClick={() => setSelectedGateway(gateway.gateway_name)}
                                    className={`cursor-pointer p-4 rounded-lg ${selectedGateway === gateway.gateway_name ? 'shadow-green-glow' : ''}`}
                                >
                                    <img src={gateway.logo_url} alt={gateway.gateway_name} style={{ height: '50px', width: 'auto' }} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={walletChecked}
                            onChange={(e) => setWalletChecked(e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Confirm to pay the invoice with the provided details</span>
                    </label>
                </div>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                {successMessage && (
                    <div className="text-green-500 mb-4 text-center">
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
                        className={`px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200 ${isLoading || !referenceNumber || !walletChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePayInvoice}
                        disabled={isLoading || !referenceNumber || !walletChecked}
                    >
                        {isLoading ? 'Processing...' : 'Pay Invoice'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayInvoiceModal;
