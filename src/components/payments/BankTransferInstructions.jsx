import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCopy, FaCheckCircle, FaUniversity, FaClock, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PaymentStatusPoller from './PaymentStatusPoller';

const BankTransferInstructions = ({ paymentData, amount, description, onBack }) => {
    const navigate = useNavigate();
    const [copiedField, setCopiedField] = useState(null);
    const [showStatusPoller, setShowStatusPoller] = useState(false);

    // Copy to clipboard function
    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(fieldName);
            toast.success(`${fieldName} copied to clipboard!`);
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    // Calculate expiry time (24 hours from now)
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
                    <FaArrowLeft className="mr-2" />
                    Change Payment Method
                </button>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                            <FaUniversity className="text-blue-500 text-4xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Bank Transfer Payment
                        </h1>
                        <p className="text-blue-100">
                            Transfer to the account below to complete your payment
                        </p>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        {/* Amount to Pay */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase mb-2">
                                Amount to Pay
                            </p>
                            <p className="text-4xl font-bold text-blue-900 dark:text-blue-300">
                                ₦{Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                                {description}
                            </p>
                        </div>

                        {/* Account Details */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Transfer to this account
                            </h2>

                            <div className="space-y-4">
                                {/* Bank Name */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Bank Name
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {paymentData.bankName || 'Providus Bank'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(paymentData.bankName || 'Providus Bank', 'Bank Name')}
                                            className="ml-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                                            {copiedField === 'Bank Name' ? (
                                                <FaCheckCircle className="text-green-500 text-xl" />
                                            ) : (
                                                <FaCopy className="text-gray-500 dark:text-gray-400 text-xl" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Account Number */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Account Number
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">
                                                {paymentData.accountNumber}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(paymentData.accountNumber, 'Account Number')}
                                            className="ml-4 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                                            {copiedField === 'Account Number' ? (
                                                <FaCheckCircle className="text-xl" />
                                            ) : (
                                                <FaCopy className="text-xl" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Account Name */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Account Name
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {paymentData.accountName || 'Monnify MFB'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(paymentData.accountName || 'Monnify MFB', 'Account Name')}
                                            className="ml-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                                            {copiedField === 'Account Name' ? (
                                                <FaCheckCircle className="text-green-500 text-xl" />
                                            ) : (
                                                <FaCopy className="text-gray-500 dark:text-gray-400 text-xl" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Reference */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Payment Reference
                                            </p>
                                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                                                {paymentData.paymentReference}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(paymentData.paymentReference, 'Reference')}
                                            className="ml-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                                            {copiedField === 'Reference' ? (
                                                <FaCheckCircle className="text-green-500 text-xl" />
                                            ) : (
                                                <FaCopy className="text-gray-500 dark:text-gray-400 text-xl" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex">
                                <FaInfoCircle className="text-yellow-600 dark:text-yellow-400 text-xl mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2">
                                        Important Instructions:
                                    </p>
                                    <ul className="text-yellow-700 dark:text-yellow-400 text-sm space-y-1 ml-4 list-disc">
                                        <li>Transfer exactly <strong>₦{Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</strong> to the account above</li>
                                        <li>This account is valid for <strong>24 hours only</strong></li>
                                        <li>Payment will be confirmed automatically after transfer</li>
                                        <li>Do not share this account number with anyone else</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Expiry Timer */}
                        <div className="flex items-center justify-center text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <FaClock className="text-gray-500 dark:text-gray-400 mr-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Account expires: <strong className="text-gray-900 dark:text-white">
                                    {expiryTime.toLocaleString('en-NG', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </strong>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowStatusPoller(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center">
                                <FaCheckCircle className="mr-2" />
                                I've Made the Payment
                            </button>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                                I'll Pay Later
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                Need help? Contact us at{' '}
                                <a href="mailto:support@yenagoalga.gov.ng" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    support@yenagoalga.gov.ng
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Status Poller Modal */}
                {showStatusPoller && (
                    <PaymentStatusPoller
                        paymentReference={paymentData.paymentReference}
                        transactionReference={paymentData.transactionReference}
                        onClose={() => setShowStatusPoller(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default BankTransferInstructions;
