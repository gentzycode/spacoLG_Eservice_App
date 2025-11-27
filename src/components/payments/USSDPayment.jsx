import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../apis/apiClient';
import { FaCopy, FaCheckCircle, FaMobileAlt, FaArrowLeft, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PaymentStatusPoller from './PaymentStatusPoller';

const USSDPayment = ({ paymentData, amount, description, onBack }) => {
    const navigate = useNavigate();
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [ussdCode, setUssdCode] = useState(null);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [generatingCode, setGeneratingCode] = useState(false);
    const [copiedUSSD, setCopiedUSSD] = useState(false);
    const [showStatusPoller, setShowStatusPoller] = useState(false);

    // Fetch supported banks on mount
    useEffect(() => {
        fetchSupportedBanks();
    }, []);

    const fetchSupportedBanks = async () => {
        try {
            setLoadingBanks(true);
            const response = await apiClient.get('/monnify/ussd/banks');

            if (response.data.status === 'success') {
                setBanks(response.data.data || []);
            } else {
                toast.error('Failed to load banks');
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
            toast.error('Failed to load supported banks');
        } finally {
            setLoadingBanks(false);
        }
    };

    const handleBankSelect = async (bank) => {
        setSelectedBank(bank);
        await generateUSSDCode(bank.bankCode);
    };

    const generateUSSDCode = async (bankCode) => {
        try {
            setGeneratingCode(true);
            const response = await apiClient.post('/monnify/ussd/generate', {
                payment_reference: paymentData.paymentReference,
                bank_code: bankCode,
            });

            if (response.data.status === 'success') {
                setUssdCode(response.data.data);
                toast.success('USSD code generated successfully!');
            } else {
                toast.error('Failed to generate USSD code');
            }
        } catch (error) {
            console.error('Error generating USSD:', error);
            toast.error('Failed to generate USSD code');
        } finally {
            setGeneratingCode(false);
        }
    };

    const copyUSSDCode = () => {
        if (ussdCode?.ussdString) {
            navigator.clipboard.writeText(ussdCode.ussdString).then(() => {
                setCopiedUSSD(true);
                toast.success('USSD code copied to clipboard!');
                setTimeout(() => setCopiedUSSD(false), 2000);
            }).catch(() => {
                toast.error('Failed to copy USSD code');
            });
        }
    };

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
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                            <FaMobileAlt className="text-green-500 text-4xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            USSD Payment
                        </h1>
                        <p className="text-green-100">
                            Dial a code on your phone to pay instantly
                        </p>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        {/* Amount to Pay */}
                        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                            <p className="text-sm text-green-600 dark:text-green-400 font-semibold uppercase mb-2">
                                Amount to Pay
                            </p>
                            <p className="text-4xl font-bold text-green-900 dark:text-green-300">
                                ₦{Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                {description}
                            </p>
                        </div>

                        {/* Step 1: Select Bank */}
                        {!ussdCode && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Step 1: Select Your Bank
                                </h2>

                                {loadingBanks ? (
                                    <div className="text-center py-8">
                                        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">Loading banks...</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {banks.map((bank) => (
                                            <button
                                                key={bank.bankCode}
                                                onClick={() => handleBankSelect(bank)}
                                                disabled={generatingCode}
                                                className={`p-4 rounded-lg border-2 transition text-left ${
                                                    selectedBank?.bankCode === bank.bankCode
                                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {bank.bankName}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {bank.bankCode}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {generatingCode && (
                                    <div className="mt-4 text-center">
                                        <FaSpinner className="animate-spin text-2xl text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Generating USSD code...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Dial USSD Code */}
                        {ussdCode && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Step 2: Dial This Code
                                </h2>

                                {/* USSD Code Display */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            Your {ussdCode.bankName} USSD Code
                                        </p>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 border-2 border-green-500">
                                            <p className="text-3xl md:text-5xl font-mono font-bold text-green-600 dark:text-green-400 tracking-wider">
                                                {ussdCode.ussdString}
                                            </p>
                                        </div>
                                        <button
                                            onClick={copyUSSDCode}
                                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center justify-center mx-auto">
                                            {copiedUSSD ? (
                                                <>
                                                    <FaCheckCircle className="mr-2" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <FaCopy className="mr-2" />
                                                    Copy Code
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                    <div className="flex">
                                        <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-xl mr-3 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
                                                How to Pay:
                                            </p>
                                            <ol className="text-blue-700 dark:text-blue-400 text-sm space-y-2 ml-4 list-decimal">
                                                <li>Dial the USSD code on your phone: <strong>{ussdCode.ussdString}</strong></li>
                                                <li>Enter your bank PIN to authorize the payment</li>
                                                <li>You'll receive a confirmation SMS from your bank</li>
                                                <li>Click "I've Made the Payment" below to verify</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Bank Button */}
                                <button
                                    onClick={() => {
                                        setUssdCode(null);
                                        setSelectedBank(null);
                                    }}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    ← Change Bank
                                </button>
                            </div>
                        )}

                        {/* Payment Reference */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Payment Reference
                            </p>
                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                                {paymentData.paymentReference}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowStatusPoller(true)}
                                disabled={!ussdCode}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
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

export default USSDPayment;
