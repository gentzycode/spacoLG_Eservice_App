import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    checkPaymentCallback,
    getPendingPayment,
    clearPendingPayment,
    cleanCallbackUrl
} from '../../../apis/paymentService';

const PaymentCallbackHandler = ({ onPaymentComplete }) => {
    useEffect(() => {
        const handleCallback = async () => {
            const callback = checkPaymentCallback();

            if (!callback) {
                return; // No callback detected
            }

            const pendingPayment = getPendingPayment();

            if (!pendingPayment) {
                console.warn('Payment callback detected but no pending payment found');
                cleanCallbackUrl();
                return;
            }

            try {
                switch (callback.gateway) {
                    case 'tranzakt':
                        handleTranzaktCallback(pendingPayment);
                        break;

                    case 'monnify':
                        handleMonnifyCallback(callback, pendingPayment);
                        break;

                    case 'paystack':
                        handlePaystackCallback(callback, pendingPayment);
                        break;

                    default:
                        console.warn('Unknown payment gateway:', callback.gateway);
                }
            } catch (error) {
                console.error('Error handling payment callback:', error);
                toast.error('Error processing payment callback');
            } finally {
                // Clean up
                clearPendingPayment();
                cleanCallbackUrl();
            }
        };

        handleCallback();
    }, []); // Run once on mount

    const handleTranzaktCallback = (pendingPayment) => {
        console.log('Tranzakt payment callback detected', pendingPayment);

        toast.success(
            `Payment processed! Refreshing invoice ${pendingPayment.invoice_number}...`,
            {
                position: 'top-right',
                autoClose: 3000
            }
        );

        // Notify parent component to refresh invoice data
        if (onPaymentComplete && pendingPayment.invoice_id) {
            setTimeout(() => {
                onPaymentComplete(pendingPayment.invoice_id);
            }, 500);
        }
    };

    const handleMonnifyCallback = (callback, pendingPayment) => {
        console.log('Monnify payment callback detected', { callback, pendingPayment });

        if (callback.status === 'SUCCESS') {
            toast.success(
                `Payment successful! Invoice ${pendingPayment.invoice_number} has been updated.`,
                {
                    position: 'top-right',
                    autoClose: 3000
                }
            );

            // Notify parent component to refresh invoice data
            if (onPaymentComplete && pendingPayment.invoice_id) {
                setTimeout(() => {
                    onPaymentComplete(pendingPayment.invoice_id);
                }, 500);
            }
        } else if (callback.status === 'FAILED') {
            toast.error('Payment failed. Please try again.', {
                position: 'top-right',
                autoClose: 5000
            });
        } else {
            toast.warning(`Payment status: ${callback.status}`, {
                position: 'top-right',
                autoClose: 4000
            });
        }
    };

    const handlePaystackCallback = (callback, pendingPayment) => {
        console.log('Paystack payment callback detected', { callback, pendingPayment });

        // Paystack redirects with trxref and reference in URL
        if (callback.reference) {
            toast.success(
                `Payment processed! Verifying invoice ${pendingPayment.invoice_number}...`,
                {
                    position: 'top-right',
                    autoClose: 3000
                }
            );

            // Notify parent component to refresh invoice data
            if (onPaymentComplete && pendingPayment.invoice_id) {
                setTimeout(() => {
                    onPaymentComplete(pendingPayment.invoice_id);
                }, 500);
            }
        } else {
            toast.warning('Payment callback received but reference is missing.', {
                position: 'top-right',
                autoClose: 4000
            });
        }
    };

    // This component doesn't render anything
    return null;
};

export default PaymentCallbackHandler;
