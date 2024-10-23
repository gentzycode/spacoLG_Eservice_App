import React, { useEffect, useState, useRef } from 'react';
import { formatDate } from '../../../apis/functions';
import { getEnabledPaymentGateways2, payInvoiceById, getUserWallet } from '../../../apis/authActions';
import logo from '../../../assets/ansg_logo.png';
import { AiOutlineLoading } from 'react-icons/ai';

const InvoiceDetailModal = ({ invoice, token, agentId, onClose, onPaymentSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [tokenValue, setTokenValue] = useState('');
    const [error, setError] = useState(null);
    const [walletChecked, setWalletChecked] = useState(false);
    const printRef = useRef();

    useEffect(() => {
        if (invoice.status === 'unpaid') {
            fetchPaymentGateways();
        }
    }, [invoice.status]);

    const fetchPaymentGateways = async () => {
        setIsLoading(true);
        try {
            await getEnabledPaymentGateways2(token, (data) => {
                setGateways(data);
            }, setError, setIsLoading);
        } catch (err) {
            setError('Failed to fetch payment gateways');
            console.error('Error fetching payment gateways:', err);
        }
    };

    const fetchWalletBalance = async () => {
        setIsLoading(true);
        try {
            const walletData = await getUserWallet(token, agentId, setError, setIsLoading);
            setWalletBalance(walletData.wallet.balance);
        } catch (err) {
            setError('Failed to fetch wallet balance');
            console.error('Error fetching wallet balance:', err);
        }
    };

    const handlePayWithToken = async () => {
        setIsLoading(true);
        try {
            const payload = { token: tokenValue };
            await payInvoiceById(token, invoice.id, payload, () => {}, (err) => {
                if (err.status === 'error' && err.message.errors) {
                    const errors = err.message.errors;
                    if (errors.includes('The token field is required.')) {
                        setError('Please enter a token to proceed with this payment method.');
                    } else {
                        setError('Validation error: ' + errors.join(', '));
                    }
                } else {
                    setError('Failed to pay invoice with token');
                }
            }, setIsLoading);
            onPaymentSuccess();
            alert('Invoice paid successfully');
            onClose();
        } catch (err) {
            setError('Failed to pay invoice with token');
            console.error('Error paying invoice with token:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayWithWallet = async () => {
        setIsLoading(true);
        try {
            const payload = { value: invoice.amount };
            await payInvoiceById(token, invoice.id, payload, () => {}, setError, setIsLoading);
            onPaymentSuccess();
            alert('Invoice paid successfully');
            onClose();
        } catch (err) {
            setError('Failed to pay invoice with wallet');
            console.error('Error paying invoice with wallet:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=500,width=300');
        printWindow.document.write('<html><head><title>Invoice</title>');
        printWindow.document.write('<style>@media print { body { margin: 0; font-size: 12px; } table { width: 100%; } th, td { text-align: left; padding: 5px; } img { width: 100px; height: auto; } }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-auto relative">
                <div ref={printRef} className="mb-6">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Invoice Details</h2>
                    <table className="w-full mb-6 border-collapse">
                        <tbody>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Reference Number:</td>
                                <td className="py-2 px-4">{invoice.reference_number}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Payer ID:</td>
                                <td className="py-2 px-4">{invoice.payer_id}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Payer Type:</td>
                                <td className="py-2 px-4">{invoice.payer_type}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Purpose:</td>
                                <td className="py-2 px-4">{invoice.purpose}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Description:</td>
                                <td className="py-2 px-4">{invoice.description}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Amount:</td>
                                <td className="py-2 px-4">₦{Number(invoice.amount).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Payment Option Used:</td>
                                <td className="py-2 px-4">{invoice.payment_option_used}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Status:</td>
                                <td className="py-2 px-4">{invoice.status}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Paid At:</td>
                                <td className="py-2 px-4">{invoice.paid_at ? formatDate(invoice.paid_at) : 'N/A'}</td>
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
                </div>
                {invoice.status === 'paid' ? (
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handlePrint}
                            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-all duration-300"
                        >
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">Payment Method</label>
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
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red-600 font-bold text-lg"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;
