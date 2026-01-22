import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { getPendingPayment, clearPendingPayment } from '../../../apis/paymentService';
import { AuthContext } from '../../../context/AuthContext';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';

const PendingPaymentChecker = ({ onVerificationComplete }) => {
    const { token } = useContext(AuthContext);
    const [pendingPayment, setPendingPayment] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        // Check for pending payment on mount
        const checkPending = async () => {
            const pending = getPendingPayment();
            if (pending) {
                // Check if payment was initiated more than 1 minute ago
                const initiatedAt = new Date(pending.initiated_at);
                const now = new Date();
                const diffMinutes = (now - initiatedAt) / (1000 * 60);

                if (diffMinutes > 1) {
                    // Payment likely completed - auto-verify
                    setPendingPayment(pending);
                    setShowPrompt(true);

                    // Automatically verify payment after showing prompt
                    setTimeout(() => {
                        autoVerifyPayment(pending);
                    }, 1000);
                }
            }
        };

        // Check immediately
        checkPending();

        // Check periodically
        const interval = setInterval(checkPending, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const autoVerifyPayment = async (payment) => {
        setVerifying(true);
        toast.info('Verifying your payment...', {
            position: 'top-right',
            autoClose: 2000
        });

        try {
            // Call the backend to verify payment status
            const response = await fetch(
                `${import.meta.env.VITE_ADMIN_BASE_URL}/invoice-manager/invoices/${payment.invoice_id}/verify-payment`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        transaction_reference: payment.transaction_reference,
                        gateway: payment.gateway
                    })
                }
            );

            const data = await response.json();

            if (data.status === 'success' && data.payment_verified) {
                toast.success('✅ Payment verified successfully! Invoice has been updated.', {
                    position: 'top-right',
                    autoClose: 5000
                });
                clearPendingPayment();
                setShowPrompt(false);
                if (onVerificationComplete) {
                    onVerificationComplete(payment.invoice_id);
                }
            } else if (data.status === 'pending') {
                toast.warning('⏳ Payment is still processing. We\'ll keep checking...', {
                    position: 'top-right',
                    autoClose: 5000
                });
                setVerifying(false);
            } else {
                toast.info('Payment not yet confirmed. Click "Verify Payment" to check again.', {
                    position: 'top-right',
                    autoClose: 5000
                });
                setVerifying(false);
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            toast.warning('Unable to auto-verify. Please click "Verify Payment" to check manually.', {
                position: 'top-right',
                autoClose: 5000
            });
            setVerifying(false);
        }
    };

    const handleVerifyPayment = async () => {
        setVerifying(true);
        try {
            // Call the backend to verify payment status
            const response = await fetch(
                `${import.meta.env.VITE_ADMIN_BASE_URL}/invoice-manager/invoices/${pendingPayment.invoice_id}/verify-payment`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        transaction_reference: pendingPayment.transaction_reference,
                        gateway: pendingPayment.gateway
                    })
                }
            );

            const data = await response.json();

            if (data.status === 'success' && data.payment_verified) {
                toast.success('Payment verified successfully! Invoice has been updated.', {
                    position: 'top-right',
                    autoClose: 3000
                });
                clearPendingPayment();
                setShowPrompt(false);
                if (onVerificationComplete) {
                    onVerificationComplete(pendingPayment.invoice_id);
                }
            } else if (data.status === 'pending') {
                toast.warning('Payment is still processing. Please check back in a few minutes.', {
                    position: 'top-right',
                    autoClose: 5000
                });
            } else {
                toast.error('Payment verification failed. Please contact support if payment was deducted.', {
                    position: 'top-right',
                    autoClose: 8000
                });
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Failed to verify payment. Please try again.', {
                position: 'top-right',
                autoClose: 5000
            });
        } finally {
            setVerifying(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't clear pending payment yet - user might want to verify later
    };

    const handleClearPending = () => {
        clearPendingPayment();
        setShowPrompt(false);
        toast.info('Pending payment cleared. You can initiate a new payment if needed.');
    };

    if (!showPrompt || !pendingPayment) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-amber-500 dark:border-amber-600 max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FaExclamationTriangle className="text-white" size={20} />
                        <h3 className="text-white font-bold text-lg">Pending Payment Detected</h3>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-white hover:bg-white/20 rounded-lg p-1 transition-all"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        We noticed you have a pending payment for:
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Invoice:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {pendingPayment.invoice_number}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                ₦{parseFloat(pendingPayment.amount).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Gateway:</span>
                            <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                {pendingPayment.gateway}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        If you completed the payment, click "Verify Payment" to update the invoice status.
                    </p>
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-2">
                    <button
                        onClick={handleVerifyPayment}
                        disabled={verifying}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {verifying ? (
                            <>
                                <AiOutlineReload className="animate-spin" size={18} />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <>
                                <FaCheckCircle size={18} />
                                <span>Verify Payment</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleClearPending}
                        className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                    >
                        I didn't complete the payment
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PendingPaymentChecker;
