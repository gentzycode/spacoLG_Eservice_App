// src/protected/components/invoices/WalletTokenPaymentModal.jsx
import React, { useEffect, useState } from 'react';
import { getEnabledPaymentGateways, payInvoiceById, getUserWallet } from '../../../apis/authActions';
import { AiOutlineLoading } from 'react-icons/ai';

const WalletTokenPaymentModal = ({ token, agentId, invoice, onClose, onPaymentSuccess }) => {
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [tokenValue, setTokenValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [walletChecked, setWalletChecked] = useState(false);

    useEffect(() => {
        fetchPaymentGateways();
    }, []);

    const fetchPaymentGateways = async () => {
        setIsLoading(true);
        try {
            const response = await getEnabledPaymentGateways(token);
            const filteredGateways = response.data.filter(gateway => gateway.gateway_name === 'E-Wallet' || gateway.gateway_name === 'Token');
            setGateways(filteredGateways);
        } catch (err) {
            setError('Failed to fetch payment gateways');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWalletBalance = async () => {
        setIsLoading(true);
        try {
            await getUserWallet(token, agentId, setWalletBalance, setError, setIsLoading);
        } catch (err) {
            setError('Failed to fetch wallet balance');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayWithToken = async () => {
        setIsLoading(true);
        try {
            const payload = { token: tokenValue };
            await payInvoiceById(token, invoice.id, payload);
            onPaymentSuccess();
        } catch (err) {
            setError('Failed to pay invoice with token');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayWithWallet = async () => {
        setIsLoading(true);
        try {
            const payload = { value: invoice.amount };
            await payInvoiceById(token, invoice.id, payload);
            onPaymentSuccess();
        } catch (err) {
            setError('Failed to pay invoice with wallet');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Select Payment Method</h2>
                    <button onClick={onClose} className="text-red-600 font-bold text-lg">Close</button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <AiOutlineLoading className="loader" />
                        <span className="ml-4 text-lg font-semibold">Loading...</span>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center space-x-8 mb-6">
                            {gateways.map((gateway) => (
                                <div
                                    key={gateway.id}
                                    onClick={() => {
                                        setSelectedGateway(gateway.gateway_name);
                                        if (gateway.gateway_name === 'E-Wallet') fetchWalletBalance();
                                    }}
                                    className={`cursor-pointer p-4 rounded-lg ${selectedGateway === gateway.gateway_name ? 'shadow-green-glow' : ''}`}
                                >
                                    <img src={gateway.logo_url} alt={gateway.gateway_name} className="h-16" />
                                </div>
                            ))}
                        </div>
                        {selectedGateway === 'Token' && (
                            <div className="mb-6">
                                <label htmlFor="token" className="block text-gray-700 font-bold mb-2">Token</label>
                                <input
                                    type="text"
                                    id="token"
                                    value={tokenValue}
                                    onChange={(e) => setTokenValue(e.target.value)}
                                    className="form-control w-full"
                                    placeholder="Enter Token"
                                />
                            </div>
                        )}
                        {selectedGateway === 'E-Wallet' && (
                            <div className="mb-6">
                                <p className="mb-2">Wallet Balance: ₦{walletBalance.toLocaleString()}</p>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={walletChecked}
                                        onChange={(e) => setWalletChecked(e.target.checked)}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">Are you sure you wish to pay for this invoice with reference {invoice.reference_number} with funds from your wallet? This cannot be undone.</span>
                                </label>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={selectedGateway === 'Token' ? handlePayWithToken : handlePayWithWallet}
                                className={`bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-all duration-300 ${isLoading || (!tokenValue && selectedGateway === 'Token') || (selectedGateway === 'E-Wallet' && !walletChecked) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || (!tokenValue && selectedGateway === 'Token') || (selectedGateway === 'E-Wallet' && !walletChecked)}
                            >
                                {isLoading ? 'Processing...' : 'Pay'}
                            </button>
                        </div>
                        {error && (
                            <div className="text-red-500 mt-4 text-center">{error}</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default WalletTokenPaymentModal;
