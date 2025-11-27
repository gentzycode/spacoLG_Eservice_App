import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimesCircle, FaSpinner } from 'react-icons/fa';

const PaymentVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentReference = searchParams.get('paymentReference');

    // Set initial status to 'redirecting' - we're just going to redirect to Daily Tickets
    const [status, setStatus] = useState('redirecting');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!paymentReference) {
            setStatus('error');
            setErrorMessage('Invalid payment reference. No reference provided.');
            return;
        }

        // Redirect to Daily Tickets page where verification happens instantly
        // The Daily Tickets page has checkMonnifyCallback() that verifies payment from sessionStorage
        const timer = setTimeout(() => {
            navigate('/daily-tickets');
        }, 1500); // Short delay to show message

        return () => clearTimeout(timer);
    }, [paymentReference, navigate]);

    // Redirecting State (new - simpler approach)
    if (status === 'redirecting') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-blue-600 text-6xl mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Processing Payment
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Redirecting you to your dashboard...
                        </p>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                                Reference: {paymentReference}
                            </p>
                        </div>

                        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-blue-800 dark:text-blue-300 text-sm">
                                <strong>Tip:</strong> Your payment will be verified automatically on the next page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error State (only for missing payment reference)
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                            <FaTimesCircle className="text-red-500 text-4xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Payment Error</h1>
                        <p className="text-red-100">{errorMessage || 'An error occurred'}</p>
                    </div>

                    {/* Error Details */}
                    <div className="px-6 py-6 space-y-4">
                        {/* Troubleshooting */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
                                What to do:
                            </p>
                            <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-2 ml-4 list-disc">
                                <li>Go back to Daily Tickets page</li>
                                <li>Check your payment status there</li>
                                <li>Contact support if you need help</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            <button
                                onClick={() => navigate('/daily-tickets')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                                Go to Daily Tickets
                            </button>

                            <a
                                href="mailto:support@yenagoalga.gov.ng?subject=Payment%20Error"
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentVerification;
