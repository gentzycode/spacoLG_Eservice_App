import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../apis/functions';
import { getEnabledPaymentGateways, payInvoiceById, getUserWallet } from '../../../apis/authActions';
import logo from '../../../assets/abia512_512logo.png';
import { AiOutlineLoading } from 'react-icons/ai';
import './InvoiceDetailModal.css'; // Import the CSS file

const InvoiceDetailModal = ({ invoice, token, agentId, onClose, onPaymentSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [tokenValue, setTokenValue] = useState('');
    const [error, setError] = useState(null);
    const [walletChecked, setWalletChecked] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (invoice.status === 'unpaid') {
            fetchPaymentGateways();
        }
    }, [invoice.status]);

    const fetchPaymentGateways = async () => {
        setIsLoading(true);
        try {
            await getEnabledPaymentGateways(token, (data) => {
                setGateways(data);
            }, setError, setIsLoading);
        } catch (err) {
            setError('Failed to fetch payment gateways');
            console.error('Error fetching payment gateways:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWalletBalance = async () => {
        setIsLoading(true);
        try {
            await getUserWallet(token, agentId, (data) => {
                setWalletBalance(data.balance);
            }, setError, setIsLoading);
        } catch (err) {
            setError('Failed to fetch wallet balance');
            console.error('Error fetching wallet balance:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayWithToken = async () => {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        try {
            const payload = { token: tokenValue };
            const response = await payInvoiceById(token, invoice.id, payload);
            if (response.status === 'error' && response.message === 'Insufficient token balance') {
                setError('Insufficient token balance');
            } else {
                setSuccessMessage('Invoice paid successfully');
                setTimeout(() => {
                    onPaymentSuccess();
                    onClose();
                }, 3000); // Show success message for 3 seconds before closing the modal
            }
        } catch (err) {
            setError('Failed to pay invoice with token');
            console.error('Error paying invoice with token:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayWithWallet = async () => {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        try {
            const payload = { value: invoice.amount };
            const response = await payInvoiceById(token, invoice.id, payload);
            if (response.status === 'error') {
                setError(response.message);
            } else {
                setSuccessMessage('Invoice paid successfully');
                setTimeout(() => {
                    onPaymentSuccess();
                    onClose();
                }, 3000); // Show success message for 3 seconds before closing the modal
            }
        } catch (err) {
            setError('Failed to pay invoice with wallet');
            console.error('Error paying invoice with wallet:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayWithCash = async () => {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        try {
            const payload = { payment_gateway: 'Cash' };
            const response = await payInvoiceById(token, invoice.id, payload);
            if (response.status === 'error') {
                setError(response.message);
            } else {
                setSuccessMessage('Invoice paid successfully. We have recorded that you have collected cash from the client and will remit the same to the office.');
                setTimeout(() => {
                    onPaymentSuccess();
                    onClose();
                }, 3000); // Show success message for 3 seconds before closing the modal
            }
        } catch (err) {
            setError('Failed to pay invoice with cash');
            console.error('Error paying invoice with cash:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = () => {
        if (selectedGateway === 'Token') {
            handlePayWithToken();
        } else if (selectedGateway === 'E-Wallet') {
            handlePayWithWallet();
        } else if (selectedGateway === 'Cash') {
            handlePayWithCash();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="modal-container bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <img src={logo} alt="Logo" className="h-16" />
                    <button onClick={onClose} className="text-red-600 font-bold text-lg">Close</button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <AiOutlineLoading className="loader" />
                        <span className="ml-4 text-lg font-semibold">Loading...</span>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-gray-700">Invoice Details</h2>
                        <table className="w-full mb-6 border-collapse">
                            <tbody>
                                <tr className="border-b">
                                    <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Reference Number:</td>
                                    <td className="py-2 px-4">{invoice.reference_number}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Amount:</td>
                                    <td className="py-2 px-4">₦{Number(invoice.amount).toLocaleString()}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Purpose:</td>
                                    <td className="py-2 px-4">{invoice.purpose}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Status:</td>
                                    <td className="py-2 px-4">{invoice.status}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Created At:</td>
                                    <td className="py-2 px-4">{formatDate(invoice.created_at)}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Updated At:</td>
                                    <td className="py-2 px-4">{formatDate(invoice.updated_at)}</td>
                                </tr>
                            </tbody>
                        </table>
                        {invoice.status === 'unpaid' && (
                            <>
                                <div className="flex justify-center space-x-8 mb-6">
                                    {gateways.length === 0 ? (
                                        <div>No payment gateways available</div>
                                    ) : (
                                        gateways.map((gateway) => (
                                            <div
                                                key={gateway.id}
                                                onClick={() => {
                                                    setSelectedGateway(gateway.gateway_name);
                                                    if (gateway.gateway_name === 'E-Wallet') fetchWalletBalance();
                                                }}
                                                className={`cursor-pointer p-4 rounded-lg ${selectedGateway === gateway.gateway_name ? 'shadow-green-glow' : ''}`}
                                            >
                                                <img src={gateway.logo_url} alt={gateway.gateway_name} style={{ height: '50px', width: 'auto' }} />
                                            </div>
                                        ))
                                    )}
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
                                        <p className="mb-2">Wallet Balance: ₦{Number(walletBalance).toLocaleString()}</p>
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
                                        onClick={handlePayment}
                                        className={`bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-all duration-300 ${isLoading || (!tokenValue && selectedGateway === 'Token') || (selectedGateway === 'E-Wallet' && !walletChecked) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isLoading || (!tokenValue && selectedGateway === 'Token') || (selectedGateway === 'E-Wallet' && !walletChecked)}
                                    >
                                        {isLoading ? 'Processing...' : 'Pay'}
                                    </button>
                                </div>
                                {error && (
                                    <div className="text-red-500 mt-4 text-center">{error}</div>
                                )}
                                {successMessage && (
                                    <div className="text-green-500 mt-4 text-center">{successMessage}</div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default InvoiceDetailModal;
