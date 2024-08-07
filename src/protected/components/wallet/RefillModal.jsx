import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { initiateWalletRefill } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';

const RefillModal = ({ paymentGateways, closeModal, agentId, onSuccess }) => {
    const { token } = useContext(AuthContext);
    const [selectedGateway, setSelectedGateway] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            amount: parseFloat(amount),
            payment_gateway: selectedGateway,
            payment_type: 'credit_card',
        };
        try {
            const response = await initiateWalletRefill(token, agentId, payload);
            setLoading(false);

            if (selectedGateway === 'Cash') {
                setSuccessMessage(response.message);
            } else {
                window.open(response.payment_url, '_blank');
                closeModal();
            }
        } catch (err) {
            setError('Failed to initiate refill. Please try another payment option');
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (successMessage) {
            onSuccess(); // Trigger success callback to refresh the page
        } else {
            closeModal(); // Just close the modal
        }
    };

    useEffect(() => {
        console.log("PaymentGateways prop in RefillModal:", paymentGateways);
    }, [paymentGateways]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Refill Wallet</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={handleClose}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {successMessage ? (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount to refill"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">Select Payment Gateway</label>
                            <div className="flex space-x-4 flex-wrap justify-center">
                                {paymentGateways && paymentGateways.length > 0 ? (
                                    paymentGateways.map((gateway) => (
                                        <img
                                            key={gateway.id}
                                            src={gateway.logo_url}
                                            alt={gateway.gateway_name}
                                            className={`cursor-pointer p-2 rounded-lg border transition-transform duration-200 ${
                                                selectedGateway === gateway.gateway_name ? 'border-green-600 transform scale-110 shadow-green-glow' : 'border-gray-300'
                                            }`}
                                            onClick={() => setSelectedGateway(gateway.gateway_name)}
                                            style={{ width: 'auto', height: 80 }}
                                        />
                                    ))
                                ) : (
                                    <p>No payment gateways available</p>
                                )}
                            </div>
                        </div>
                        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200"
                                onClick={handleSubmit}
                                disabled={loading || !selectedGateway}
                            >
                                {loading ? 'Processing...' : 'Refill'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RefillModal;
