import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaClock, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PaymentStatusPoller = ({ paymentReference, transactionReference, onClose }) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('checking'); // checking, paid, pending, failed
    const [transactionData, setTransactionData] = useState(null);
    const [checkCount, setCheckCount] = useState(0);
    const [countdown, setCountdown] = useState(5);
    const intervalRef = useRef(null);
    const countdownRef = useRef(null);

    const MAX_CHECKS = 60; // Maximum 60 checks (5 minutes if polling every 5 seconds)
    const POLL_INTERVAL = 5000; // 5 seconds

    useEffect(() => {
        // Start polling immediately
        checkPaymentStatus();

        // Set up interval for polling
        intervalRef.current = setInterval(() => {
            checkPaymentStatus();
        }, POLL_INTERVAL);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, []);

    // Success countdown effect
    useEffect(() => {
        if (status === 'paid' && countdown > 0) {
            countdownRef.current = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (status === 'paid' && countdown === 0) {
            navigate('/payment/verify?paymentReference=' + paymentReference);
        }

        return () => {
            if (countdownRef.current) {
                clearTimeout(countdownRef.current);
            }
        };
    }, [status, countdown, navigate, paymentReference]);

    const checkPaymentStatus = async () => {
        try {
            setCheckCount(prev => prev + 1);

            // Get auth token from localStorage
            const userData = localStorage.getItem('isLoggedIn');
            let token = null;
            if (userData) {
                try {
                    const { access_token } = JSON.parse(userData);
                    token = access_token;
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }

            // Use transactionReference for verification
            const refToCheck = transactionReference || paymentReference;
            const response = await axios.get(
                `http://lga-backend.test/api/monnify/verify/${refToCheck}`,
                {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }
            );

            if (response.data.status === 'success') {
                const paymentStatus = response.data.data?.paymentStatus;

                if (paymentStatus === 'PAID') {
                    setStatus('paid');
                    setTransactionData(response.data.data);
                    toast.success('Payment confirmed!');

                    // Stop polling
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                } else if (paymentStatus === 'PENDING') {
                    setStatus('pending');

                    // Stop polling after max checks
                    if (checkCount >= MAX_CHECKS) {
                        setStatus('timeout');
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                    }
                } else {
                    setStatus('failed');
                    setTransactionData(response.data.data);

                    // Stop polling
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            } else {
                // If verification fails but not max checks yet, keep trying
                if (checkCount >= MAX_CHECKS) {
                    setStatus('failed');
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            }
        } catch (error) {
            console.error('Payment verification error:', error);

            // Only show as failed after max checks
            if (checkCount >= MAX_CHECKS) {
                setStatus('failed');
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            }
        }
    };

    const handleManualCheck = () => {
        setCheckCount(0);
        setStatus('checking');
        checkPaymentStatus();

        // Restart interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            checkPaymentStatus();
        }, POLL_INTERVAL);
    };

    const handleClose = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
                {/* Close Button */}
                {status !== 'paid' && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <FaTimes className="text-2xl" />
                    </button>
                )}

                <div className="p-8">
                    {/* Checking Status */}
                    {status === 'checking' && (
                        <div className="text-center">
                            <FaSpinner className="animate-spin text-blue-600 text-6xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Checking Payment Status
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Please wait while we verify your payment...
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                    Check {checkCount} of {MAX_CHECKS}
                                </p>
                                <div className="mt-2 w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(checkCount / MAX_CHECKS) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pending Status */}
                    {status === 'pending' && (
                        <div className="text-center">
                            <FaClock className="text-yellow-500 text-6xl mx-auto mb-4 animate-pulse" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Payment Pending
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                We haven't received your payment yet. This may take a few minutes.
                            </p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    Automatically checking every {POLL_INTERVAL / 1000} seconds...
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                                    Check {checkCount} of {MAX_CHECKS}
                                </p>
                            </div>
                            <button
                                onClick={handleManualCheck}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-3">
                                Check Status Now
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                                Close
                            </button>
                        </div>
                    )}

                    {/* Paid Status */}
                    {status === 'paid' && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-bounce">
                                <FaCheckCircle className="text-green-500 text-5xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Payment Confirmed!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Your payment has been successfully verified.
                            </p>
                            {transactionData && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 text-left">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ₦{Number(transactionData.amountPaid || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                                            <span className="font-mono text-xs text-gray-900 dark:text-white">
                                                {paymentReference}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                <p className="text-blue-800 dark:text-blue-300 font-semibold">
                                    Redirecting to receipt in {countdown} seconds...
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/payment/verify?paymentReference=' + paymentReference)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                                View Receipt Now
                            </button>
                        </div>
                    )}

                    {/* Failed Status */}
                    {status === 'failed' && (
                        <div className="text-center">
                            <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Payment Not Found
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                We couldn't verify your payment. Please try again or contact support.
                            </p>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    If you've made the payment, please wait a few minutes and check again.
                                </p>
                            </div>
                            <button
                                onClick={handleManualCheck}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-3">
                                Check Again
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                                Close
                            </button>
                        </div>
                    )}

                    {/* Timeout Status */}
                    {status === 'timeout' && (
                        <div className="text-center">
                            <FaClock className="text-orange-500 text-6xl mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Still Waiting...
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Payment verification is taking longer than expected.
                            </p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                                <p className="text-sm text-orange-700 dark:text-orange-400">
                                    You can close this window and check back later, or contact support if you've completed the payment.
                                </p>
                            </div>
                            <button
                                onClick={handleManualCheck}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-3">
                                Check Again
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusPoller;
