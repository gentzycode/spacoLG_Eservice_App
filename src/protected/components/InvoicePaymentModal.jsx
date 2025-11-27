import React, { useState, useContext } from 'react';
import { FaMoneyBillWave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { recordInvoiceV2Payment } from '../../apis/invoiceAssessmentActions';
import { initializeMonnifyPayment, initializeTranzaktPayment } from '../../apis/authActions';

const InvoicePaymentModal = ({
    invoice,
    paymentMethods,
    onClose,
    onPaymentSuccess
}) => {
    const { token, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    // Determine if payment method is offline (Cash/POS) or online (Paystack/Monnify/etc)
    const isOfflineMethod = (methodName) => {
        const offlineMethods = ['cash', 'pos', 'bank_transfer', 'bank transfer'];
        return offlineMethods.includes(methodName.toLowerCase());
    };

    const handlePaymentMethodSelect = async (method) => {
        const methodName = method.gateway_name.toLowerCase().replace(/\s+/g, '_');
        setSelectedMethod(method);

        // For offline payments (Cash/POS), just record payment
        if (isOfflineMethod(method.gateway_name)) {
            handleOfflinePayment(methodName);
        } else {
            // For online payments, initialize gateway
            handleOnlinePayment(method, methodName);
        }
    };

    const handleOfflinePayment = async (methodName) => {
        setLoading(true);
        try {
            const reference = `${methodName.toUpperCase()}-${Date.now()}`;
            const totalAmount = parseFloat(invoice.total_amount || invoice.amount);

            await recordInvoiceV2Payment(token, invoice.id, {
                amount: totalAmount,
                payment_method: selectedMethod.gateway_name,
                payment_reference: reference,
                payment_date: new Date().toISOString().split('T')[0],
                notes: `Paid via ${selectedMethod.gateway_name}`
            }, null, () => {});

            toast.success(`Payment of ₦${totalAmount.toLocaleString()} recorded successfully via ${selectedMethod.gateway_name}`);
            onPaymentSuccess();
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error('Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = (method, methodName) => {
        const amount = parseFloat(invoice.total_amount || invoice.amount);

        if (method.gateway_name.toLowerCase() === 'paystack') {
            initiatePaystackPayment(amount, method);
        } else if (method.gateway_name.toLowerCase() === 'monnify') {
            initiateMonnifyPayment(amount, method);
        } else if (method.gateway_name.toLowerCase() === 'tranzakt') {
            initiateTranzaktPayment(amount, method);
        } else {
            toast.info(`${method.gateway_name} payment integration coming soon. For now, please use offline payment methods.`);
        }
    };

    const initiatePaystackPayment = (amount, method) => {
        if (!window.PaystackPop) {
            toast.error('Paystack SDK not loaded. Please refresh the page.');
            return;
        }

        setLoading(true);
        const handler = window.PaystackPop.setup({
            key: method.public_key,
            email: invoice.payer_email || user.email || 'customer@yenagoalga.gov.ng',
            amount: amount * 100, // Convert to kobo
            currency: 'NGN',
            ref: `INVOICE-${invoice.invoice_number}-${Date.now()}`,
            callback: async function(response) {
                setLoading(true);
                try {
                    const paymentRef = response.reference;

                    await recordInvoiceV2Payment(token, invoice.id, {
                        amount: amount,
                        payment_method: 'Paystack',
                        payment_reference: paymentRef,
                        payment_date: new Date().toISOString().split('T')[0],
                        notes: 'Paid via Paystack'
                    }, null, () => {});

                    toast.success('Payment successful!');
                    onPaymentSuccess();
                } catch (error) {
                    toast.error('Payment verification failed');
                } finally {
                    setLoading(false);
                }
            },
            onClose: function() {
                toast.info('Payment cancelled');
                setLoading(false);
            },
        });

        handler.openIframe();
    };

    const initiateMonnifyPayment = async (amount, method) => {
        if (!token || !user) {
            toast.error('Authentication required. Please log in.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                amount: amount,
                customer_name: invoice.payer_name || user.name || user.username || 'Customer',
                customer_email: invoice.payer_email || user.email || 'customer@yenagoalga.gov.ng',
                customer_phone: invoice.payer_phone || user.phone || '',
                description: `Payment for invoice ${invoice.invoice_number}`,
                metadata: {
                    invoice_type: 'invoice_v2',
                    invoice_id: invoice.id.toString(),
                    invoice_number: invoice.invoice_number
                }
            };

            const response = await initializeMonnifyPayment(token, payload);

            if (response.status === 'success' && response.data?.checkoutUrl) {
                // Store transaction details in sessionStorage for verification on return
                sessionStorage.setItem('monnify_pending_payment', JSON.stringify({
                    transactionReference: response.data.transactionReference,
                    paymentReference: response.data.paymentReference,
                    invoice: invoice
                }));

                // Redirect to Monnify checkout page
                window.location.href = response.data.checkoutUrl;
            } else {
                toast.error(response.message || 'Failed to initialize Monnify payment');
                setLoading(false);
            }
        } catch (error) {
            console.error('Monnify payment error:', error);
            toast.error('Failed to initialize Monnify payment. Please try again.');
            setLoading(false);
        }
    };

    const initiateTranzaktPayment = async (amount, method) => {
        if (!token || !user) {
            toast.error('Authentication required. Please log in.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                amount: amount,
                customer_name: invoice.payer_name || user.name || user.username || 'Customer',
                customer_email: invoice.payer_email || user.email || 'customer@yenagoalga.gov.ng',
                customer_phone: invoice.payer_phone || user.phone || '',
                description: `Payment for invoice ${invoice.invoice_number}`,
                metadata: {
                    invoice_type: 'invoice_v2',
                    invoice_id: invoice.id.toString(),
                    invoice_number: invoice.invoice_number
                }
            };

            const response = await initializeTranzaktPayment(token, payload);

            if (response.status === 'success' && response.data?.payment_url) {
                // Store transaction details in sessionStorage for verification on return
                sessionStorage.setItem('tranzakt_pending_payment', JSON.stringify({
                    invoiceId: response.data.invoice_id,
                    transactionReference: response.data.transaction_reference,
                    invoice: invoice
                }));

                // Redirect to Tranzakt payment page
                window.location.href = response.data.payment_url;
            } else {
                toast.error(response.message || 'Failed to initialize Tranzakt payment');
                setLoading(false);
            }
        } catch (error) {
            console.error('Tranzakt payment error:', error);
            toast.error('Failed to initialize Tranzakt payment. Please try again.');
            setLoading(false);
        }
    };

    const colors = [
        { border: 'border-green-500', text: 'text-green-500', bg: 'hover:bg-green-50 dark:hover:bg-green-900/20' },
        { border: 'border-blue-500', text: 'text-blue-500', bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20' },
        { border: 'border-purple-500', text: 'text-purple-500', bg: 'hover:bg-purple-50 dark:hover:bg-purple-900/20' },
        { border: 'border-orange-500', text: 'text-orange-500', bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20' },
    ];

    const totalAmount = parseFloat(invoice.total_amount || invoice.amount || 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-500" />
                            Payment Options
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            disabled={loading}
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Invoice Summary */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Invoice Generated Successfully
                        </h3>
                        <div className="space-y-1 text-sm">
                            <p className="text-blue-800 dark:text-blue-200">
                                <span className="font-medium">Invoice #:</span> {invoice.invoice_number}
                            </p>
                            <p className="text-blue-800 dark:text-blue-200">
                                <span className="font-medium">Payer:</span> {invoice.payer_name}
                            </p>
                            <p className="text-blue-800 dark:text-blue-200">
                                <span className="font-medium">Amount:</span> ₦{totalAmount.toLocaleString()}
                            </p>
                            {invoice.title && (
                                <p className="text-blue-800 dark:text-blue-200">
                                    <span className="font-medium">Description:</span> {invoice.title}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Select Payment Method
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Choose how you want to process this payment. Cash/POS will be recorded immediately, while online methods will open the payment gateway.
                        </p>

                        {/* Payment Methods Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((method, index) => {
                                const color = colors[index % colors.length];
                                const isOffline = isOfflineMethod(method.gateway_name);

                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => handlePaymentMethodSelect(method)}
                                        disabled={loading}
                                        className={`p-4 border-2 ${color.border} rounded-lg ${color.bg} transition-colors group disabled:opacity-50 relative`}
                                    >
                                        <div className="text-center">
                                            {method.logo_url ? (
                                                <img src={method.logo_url} alt={method.gateway_name} className="h-12 mx-auto mb-2" />
                                            ) : (
                                                <FaMoneyBillWave className={`text-3xl ${color.text} mx-auto mb-2`} />
                                            )}
                                            <span className="font-semibold text-gray-900 dark:text-white block">{method.gateway_name}</span>
                                            {isOffline && (
                                                <span className="text-xs text-gray-500 mt-1 block">Instant</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pay Later Button */}
                    <div className="border-t dark:border-gray-700 pt-4">
                        <button
                            onClick={() => {
                                toast.info('Invoice saved. Payment can be made later.');
                                onClose();
                            }}
                            disabled={loading}
                            className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50"
                        >
                            Pay Later
                        </button>
                    </div>

                    {loading && (
                        <div className="mt-4 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Processing payment...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoicePaymentModal;
