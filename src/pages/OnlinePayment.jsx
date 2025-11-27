import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../apis/apiClient';
import { toast } from 'react-toastify';
import { FaUniversity, FaMobileAlt, FaArrowLeft } from 'react-icons/fa';
import BankTransferInstructions from '../components/payments/BankTransferInstructions';
import USSDPayment from '../components/payments/USSDPayment';

const OnlinePayment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get payment details from location state (passed from previous page)
    const { amount, description, invoiceId, customerName, customerEmail, customerPhone } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState(null); // 'bank_transfer' or 'ussd'
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);

    // Initialize offline payment
    const initializePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.post('/monnify/initialize-offline', {
                amount: amount,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                description: description,
                invoice_id: invoiceId,
            });

            if (response.data.status === 'success') {
                setPaymentData(response.data.data);
                toast.success('Payment initialized successfully!');
            } else {
                setError(response.data.message || 'Failed to initialize payment');
                toast.error('Failed to initialize payment');
            }
        } catch (err) {
            console.error('Payment initialization error:', err);
            setError(err.response?.data?.message || 'An error occurred while initializing payment');
            toast.error('Failed to initialize payment');
        } finally {
            setLoading(false);
        }
    };

    // Handle payment method selection
    const handleMethodSelect = async (method) => {
        setPaymentMethod(method);

        // Initialize payment when method is selected
        if (!paymentData) {
            await initializePayment();
        }
    };

    // Handle back button
    const handleBack = () => {
        if (paymentData) {
            // Confirm before leaving if payment is initialized
            if (window.confirm('Are you sure you want to cancel this payment?')) {
                navigate(-1);
            }
        } else {
            navigate(-1);
        }
    };

    // Validate that required data is present
    if (!amount || !customerName || !customerEmail) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Invalid Payment Request
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Missing required payment information. Please go back and try again.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // If payment method is selected and payment is initialized, show the appropriate component
    if (paymentMethod && paymentData) {
        if (paymentMethod === 'bank_transfer') {
            return (
                <BankTransferInstructions
                    paymentData={paymentData}
                    amount={amount}
                    description={description}
                    onBack={() => setPaymentMethod(null)}
                />
            );
        } else if (paymentMethod === 'ussd') {
            return (
                <USSDPayment
                    paymentData={paymentData}
                    amount={amount}
                    description={description}
                    onBack={() => setPaymentMethod(null)}
                />
            );
        }
    }

    // Payment method selection screen
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
                        <FaArrowLeft className="mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Choose Payment Method
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Select how you would like to pay
                    </p>
                </div>

                {/* Payment Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Payment Summary
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <span className="font-bold text-gray-900 dark:text-white text-xl">
                                ₦{Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Description:</span>
                            <span className="text-gray-900 dark:text-white">{description}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                            <span className="text-gray-900 dark:text-white">{customerName}</span>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
                        <p className="text-red-800 dark:text-red-300">{error}</p>
                    </div>
                )}

                {/* Payment Method Options */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Bank Transfer Option */}
                    <button
                        onClick={() => handleMethodSelect('bank_transfer')}
                        disabled={loading}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition duration-200 text-left border-2 border-transparent hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <FaUniversity className="text-3xl text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Bank Transfer
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Get account details to transfer from your bank app or internet banking
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Instant account generation
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Works with all Nigerian banks
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Automatic confirmation
                            </li>
                        </ul>
                    </button>

                    {/* USSD Option */}
                    <button
                        onClick={() => handleMethodSelect('ussd')}
                        disabled={loading}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition duration-200 text-left border-2 border-transparent hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <FaMobileAlt className="text-3xl text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            USSD Payment
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Dial a code on your phone to pay instantly from your bank account
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                No internet required
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Quick and convenient
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Instant payment
                            </li>
                        </ul>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm mx-4">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-900 dark:text-white font-semibold">
                                    Initializing payment...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        Need Help?
                    </h3>
                    <p className="text-blue-800 dark:text-blue-400 text-sm mb-3">
                        If you encounter any issues with payment, please contact our support team.
                    </p>
                    <a
                        href="mailto:support@yenagoalga.gov.ng"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">
                        support@yenagoalga.gov.ng
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OnlinePayment;
