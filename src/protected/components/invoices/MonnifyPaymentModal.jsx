// src/protected/components/invoices/MonnifyPaymentModal.jsx
import React, { useState, useEffect } from 'react';
import { initializeMonnifyPayment, initializeMonnifyOfflinePayment, verifyMonnifyTransaction, generateMonnifyUSSD, getMonnifyUSSDBanks } from '../../../apis/authActions';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaCreditCard, FaUniversity, FaMobileAlt, FaCopy, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const MonnifyPaymentModal = ({ token, invoice, customerInfo, onClose, onPaymentSuccess }) => {
    const [paymentMode, setPaymentMode] = useState('online'); // 'online' | 'offline' | 'ussd'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Offline payment state
    const [offlinePaymentDetails, setOfflinePaymentDetails] = useState(null);
    const [ussdBanks, setUssdBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [ussdCode, setUssdCode] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (paymentMode === 'ussd') {
            fetchUSSDBanks();
        }
    }, [paymentMode]);

    const fetchUSSDBanks = async () => {
        try {
            const response = await getMonnifyUSSDBanks(token);
            if (response.status === 'success') {
                setUssdBanks(response.data);
            }
        } catch (err) {
            setError('Failed to fetch USSD banks');
        }
    };

    const handleOnlinePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                amount: invoice.amount,
                customer_name: customerInfo.name || invoice.customer_name,
                customer_email: customerInfo.email || invoice.customer_email,
                customer_phone: customerInfo.phone || '',
                description: `Payment for invoice ${invoice.reference_number}`,
                invoice_id: invoice.id
            };

            const response = await initializeMonnifyPayment(token, payload);

            if (response.status === 'success') {
                // Redirect to Monnify checkout
                window.location.href = response.data.checkoutUrl;
            } else {
                setError(response.message || 'Failed to initialize payment');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize payment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOfflinePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                amount: invoice.amount,
                customer_name: customerInfo.name || invoice.customer_name,
                customer_email: customerInfo.email || invoice.customer_email,
                description: `Payment for invoice ${invoice.reference_number}`,
                invoice_id: invoice.id
            };

            const response = await initializeMonnifyOfflinePayment(token, payload);

            if (response.status === 'success') {
                setOfflinePaymentDetails(response.data);
                setSuccess('Bank transfer details generated successfully!');
            } else {
                setError(response.message || 'Failed to generate offline payment');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate offline payment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUSSDGeneration = async () => {
        if (!selectedBank) {
            setError('Please select a bank');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!offlinePaymentDetails) {
                // First initialize offline payment
                await handleOfflinePayment();
            }

            const payload = {
                payment_reference: offlinePaymentDetails.paymentReference,
                bank_code: selectedBank.bankCode
            };

            const response = await generateMonnifyUSSD(token, payload);

            if (response.status === 'success') {
                setUssdCode(response.data.ussdCode);
                setSuccess('USSD code generated successfully!');
            } else {
                setError(response.message || 'Failed to generate USSD code');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate USSD code');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                            <span className="text-3xl">🔷</span>
                            <span>Monnify Payment</span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Invoice: {invoice.reference_number}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-red-600 hover:text-red-700 font-bold text-lg transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Amount Display */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                        {formatAmount(invoice.amount)}
                    </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded flex items-start space-x-3">
                        <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-red-700 dark:text-red-400">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded flex items-start space-x-3">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-green-700 dark:text-green-400">{success}</span>
                    </div>
                )}

                {/* Payment Mode Selection */}
                {!offlinePaymentDetails && (
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Select Payment Method
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Online Payment */}
                            <button
                                onClick={() => setPaymentMode('online')}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    paymentMode === 'online'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                }`}
                            >
                                <FaCreditCard className={`mx-auto mb-2 text-2xl ${
                                    paymentMode === 'online' ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Card Payment
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Pay with Card
                                </p>
                            </button>

                            {/* Bank Transfer */}
                            <button
                                onClick={() => setPaymentMode('offline')}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    paymentMode === 'offline'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                }`}
                            >
                                <FaUniversity className={`mx-auto mb-2 text-2xl ${
                                    paymentMode === 'offline' ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Bank Transfer
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Transfer to account
                                </p>
                            </button>

                            {/* USSD */}
                            <button
                                onClick={() => setPaymentMode('ussd')}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    paymentMode === 'ussd'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                }`}
                            >
                                <FaMobileAlt className={`mx-auto mb-2 text-2xl ${
                                    paymentMode === 'ussd' ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    USSD Code
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Dial USSD code
                                </p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment Content */}
                {!offlinePaymentDetails && paymentMode === 'online' && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                You will be redirected to Monnify secure checkout page to complete your payment.
                            </p>
                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
                                <li>Pay with your debit/credit card</li>
                                <li>Secure 3D authentication</li>
                                <li>Instant payment confirmation</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleOnlinePayment}
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <AiOutlineLoading className="animate-spin" />
                                    <span>Initializing...</span>
                                </>
                            ) : (
                                <>
                                    <FaCreditCard />
                                    <span>Proceed to Checkout</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {!offlinePaymentDetails && paymentMode === 'offline' && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                A dedicated account number will be generated for this transaction.
                            </p>
                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
                                <li>Transfer the exact amount to the provided account</li>
                                <li>Payment is confirmed automatically</li>
                                <li>Account expires after payment or 24 hours</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleOfflinePayment}
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <AiOutlineLoading className="animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <FaUniversity />
                                    <span>Generate Account Number</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {!offlinePaymentDetails && paymentMode === 'ussd' && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Select your bank to generate a USSD code.
                            </p>
                        </div>

                        {ussdBanks.length > 0 ? (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Select Bank
                                    </label>
                                    <select
                                        value={selectedBank?.bankCode || ''}
                                        onChange={(e) => {
                                            const bank = ussdBanks.find(b => b.bankCode === e.target.value);
                                            setSelectedBank(bank);
                                        }}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Choose a bank...</option>
                                        {ussdBanks.map(bank => (
                                            <option key={bank.bankCode} value={bank.bankCode}>
                                                {bank.bankName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleUSSDGeneration}
                                    disabled={isLoading || !selectedBank}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <AiOutlineLoading className="animate-spin" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaMobileAlt />
                                            <span>Generate USSD Code</span>
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className="flex justify-center py-4">
                                <AiOutlineLoading className="animate-spin text-blue-500 text-2xl" />
                            </div>
                        )}
                    </div>
                )}

                {/* Offline Payment Details Display */}
                {offlinePaymentDetails && !ussdCode && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm font-semibold text-green-800 dark:text-green-400 mb-4">
                                Transfer Details Generated Successfully
                            </p>

                            <div className="space-y-3">
                                {/* Account Number */}
                                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Account Number</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                                            {offlinePaymentDetails.accountNumber}
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(offlinePaymentDetails.accountNumber, 'account')}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                            title="Copy account number"
                                        >
                                            {copied === 'account' ? (
                                                <FaCheckCircle className="text-green-500" />
                                            ) : (
                                                <FaCopy className="text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Bank Name */}
                                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Bank Name</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {offlinePaymentDetails.bankName}
                                    </p>
                                </div>

                                {/* Account Name */}
                                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Account Name</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {offlinePaymentDetails.accountName}
                                    </p>
                                </div>

                                {/* Amount */}
                                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Amount to Transfer</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatAmount(offlinePaymentDetails.amount)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                                <p className="text-xs text-yellow-800 dark:text-yellow-400">
                                    <strong>Important:</strong> Transfer the exact amount shown above. Payment will be confirmed automatically.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}

                {/* USSD Code Display */}
                {ussdCode && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                            <p className="text-sm font-semibold text-purple-800 dark:text-purple-400 mb-4">
                                USSD Code Generated Successfully
                            </p>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Dial this code on your phone</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-400 font-mono">
                                        {ussdCode}
                                    </p>
                                    <button
                                        onClick={() => copyToClipboard(ussdCode, 'ussd')}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Copy USSD code"
                                    >
                                        {copied === 'ussd' ? (
                                            <FaCheckCircle className="text-green-500" />
                                        ) : (
                                            <FaCopy className="text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p><strong>Bank:</strong> {selectedBank?.bankName}</p>
                                <p><strong>Amount:</strong> {formatAmount(invoice.amount)}</p>
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-blue-800 dark:text-blue-400">
                                    <strong>Instructions:</strong> Dial the USSD code on your registered phone number and follow the prompts to complete the payment.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}

                {/* Cancel Button (only show if no details generated) */}
                {!offlinePaymentDetails && !ussdCode && (
                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default MonnifyPaymentModal;
