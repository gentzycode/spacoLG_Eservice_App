import React, { useState, useContext } from 'react';
import { FaMoneyBillWave, FaTimes, FaCreditCard, FaUniversity, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { initializeMonnifyPayment, verifyMonnifyTransaction, initializeTranzaktPayment } from '../../apis/authActions';

const DailyTicketPaymentModal = ({
    ticket,
    paymentMethods,
    onClose,
    onPaymentSuccess,
    markTicketAsPaid
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

        // For offline payments (Cash/POS), just mark as paid
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

            if (ticket.bulk) {
                // Handle bulk payment
                let successCount = 0;
                let failedCount = 0;

                for (const t of ticket.tickets) {
                    try {
                        await markTicketAsPaid(t.id, {
                            payment_reference: `${reference}-${t.id}`
                        });
                        successCount++;
                    } catch (error) {
                        console.error(`Failed to mark ticket ${t.id} as paid:`, error);
                        failedCount++;
                    }
                }

                if (successCount > 0) {
                    toast.success(`Payment recorded for ${successCount} ticket(s) via ${selectedMethod.gateway_name}`);
                }
                if (failedCount > 0) {
                    toast.error(`Failed to record payment for ${failedCount} ticket(s)`);
                }
            } else {
                // Handle single ticket payment
                await markTicketAsPaid(ticket.id, {
                    payment_reference: reference
                });
                toast.success(`Payment recorded successfully via ${selectedMethod.gateway_name}`);
            }

            onPaymentSuccess();
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error('Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = (method, methodName) => {
        const amount = ticket.bulk ? ticket.totalAmount : parseFloat(ticket.amount);

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
        const ticketNumber = ticket.bulk
            ? ticket.tickets.map(t => t.ticket_number).join(',')
            : ticket.ticket_number;

        const handler = window.PaystackPop.setup({
            key: method.public_key,
            email: 'customer@yenagoalga.gov.ng', // You can collect this from user if needed
            amount: amount * 100, // Convert to kobo
            currency: 'NGN',
            ref: `TICKET-${ticketNumber}-${Date.now()}`,
            callback: async function(response) {
                setLoading(true);
                try {
                    const paymentRef = response.reference;

                    if (ticket.bulk) {
                        for (const t of ticket.tickets) {
                            await markTicketAsPaid(t.id, {
                                payment_reference: `${paymentRef}-${t.id}`
                            });
                        }
                        toast.success(`Payment successful for ${ticket.count} tickets!`);
                    } else {
                        await markTicketAsPaid(ticket.id, {
                            payment_reference: paymentRef
                        });
                        toast.success('Payment successful!');
                    }

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
            const ticketNumbers = ticket.bulk
                ? ticket.tickets.map(t => t.ticket_number).join(', ')
                : ticket.ticket_number;

            const payload = {
                amount: amount,
                customer_name: user.name || user.username || 'Customer',
                customer_email: user.email || 'customer@yenagoalga.gov.ng',
                customer_phone: user.phone || '',
                description: ticket.bulk
                    ? `Payment for ${ticket.count} daily tickets (${ticketNumbers})`
                    : `Payment for daily ticket ${ticketNumbers}`,
                metadata: {
                    ticket_type: 'daily_ticket',
                    is_bulk: ticket.bulk || false,
                    ticket_count: ticket.bulk ? ticket.count : 1,
                    ticket_numbers: ticketNumbers,
                    ticket_ids: ticket.bulk
                        ? ticket.tickets.map(t => t.id).join(',')
                        : ticket.id.toString()
                }
            };

            const response = await initializeMonnifyPayment(token, payload);

            if (response.status === 'success' && response.data?.checkoutUrl) {
                // Store transaction details in sessionStorage for verification on return
                sessionStorage.setItem('monnify_pending_payment', JSON.stringify({
                    transactionReference: response.data.transactionReference,
                    paymentReference: response.data.paymentReference,
                    ticket: ticket
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
            const ticketNumbers = ticket.bulk
                ? ticket.tickets.map(t => t.ticket_number).join(', ')
                : ticket.ticket_number;

            const payload = {
                amount: amount,
                customer_name: user.name || user.username || 'Customer',
                customer_email: user.email || 'customer@yenagoalga.gov.ng',
                customer_phone: user.phone || '',
                description: ticket.bulk
                    ? `Payment for ${ticket.count} daily tickets (${ticketNumbers})`
                    : `Payment for daily ticket ${ticketNumbers}`,
                metadata: {
                    ticket_type: 'daily_ticket',
                    is_bulk: ticket.bulk || false,
                    ticket_count: ticket.bulk ? ticket.count : 1,
                    ticket_numbers: ticketNumbers,
                    ticket_ids: ticket.bulk
                        ? ticket.tickets.map(t => t.id).join(',')
                        : ticket.id.toString()
                }
            };

            const response = await initializeTranzaktPayment(token, payload);

            if (response.status === 'success' && response.data?.payment_url) {
                // Store transaction details in sessionStorage for verification on return
                sessionStorage.setItem('tranzakt_pending_payment', JSON.stringify({
                    invoiceId: response.data.invoice_id,
                    transactionReference: response.data.transaction_reference,
                    ticket: ticket
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

                    {/* Ticket Summary */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            {ticket.bulk ? 'Bulk Tickets Created Successfully' : 'Ticket Created Successfully'}
                        </h3>
                        <div className="space-y-1 text-sm">
                            {ticket.bulk ? (
                                <>
                                    <p className="text-blue-800 dark:text-blue-200">
                                        <span className="font-medium">Tickets Issued:</span> {ticket.count}
                                    </p>
                                    <p className="text-blue-800 dark:text-blue-200">
                                        <span className="font-medium">Total Amount:</span> ₦{parseFloat(ticket.totalAmount).toLocaleString()}
                                    </p>
                                    <p className="text-blue-800 dark:text-blue-200">
                                        <span className="font-medium">Category:</span> {ticket.tickets[0]?.category?.replace('_', ' ')}
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                        Ticket Numbers: {ticket.tickets.map(t => t.ticket_number).join(', ')}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-blue-800 dark:text-blue-200">
                                        <span className="font-medium">Ticket #:</span> {ticket.ticket_number}
                                    </p>
                                    <p className="text-blue-800 dark:text-blue-200">
                                        <span className="font-medium">Amount:</span> ₦{parseFloat(ticket.amount).toLocaleString()}
                                    </p>
                                    <p className="text-blue-800 dark:text-blue-200">
                                        <span className="font-medium">Category:</span> {ticket.category?.replace('_', ' ')}
                                    </p>
                                </>
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
                                toast.info('Tickets saved. Payment can be made later.');
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

export default DailyTicketPaymentModal;
