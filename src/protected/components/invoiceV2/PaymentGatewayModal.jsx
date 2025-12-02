import React, { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { initializeInvoicePayment, savePendingPayment } from '../../../apis/paymentService';
import { toast } from 'react-toastify';
import './PaymentGatewayModal.css';

const PaymentGatewayModal = ({ invoice, onClose }) => {
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [loading, setLoading] = useState(false);

    const gateways = [
        {
            id: 'monnify',
            name: 'Monnify',
            description: 'Pay with cards, bank transfer, or USSD',
            color: '#5865f2',
            logo: '/assets/monnify-logo.png',
            available: true
        },
        {
            id: 'tranzakt',
            name: 'Tranzakt',
            description: 'Secure payment through Tranzakt',
            color: '#00a86b',
            logo: '/assets/tranzakt-logo.png',
            available: true
        },
        {
            id: 'paystack',
            name: 'Paystack',
            description: 'Pay with Paystack (Coming Soon)',
            color: '#00c3f7',
            logo: '/assets/paystack-logo.png',
            available: false
        }
    ];

    const handlePayment = async () => {
        if (!selectedGateway) {
            toast.error('Please select a payment gateway');
            return;
        }

        const gateway = gateways.find(g => g.id === selectedGateway);
        if (!gateway?.available) {
            toast.error('This payment gateway is not yet available');
            return;
        }

        setLoading(true);

        try {
            const response = await initializeInvoicePayment(
                invoice.id,
                selectedGateway,
                `${window.location.origin}/invoice-v2-manager`
            );

            if (response.status === 'success') {
                // Save payment info for callback handling
                savePendingPayment({
                    invoice_id: invoice.id,
                    invoice_number: invoice.invoice_number,
                    transaction_reference: response.data.transaction_reference,
                    gateway: selectedGateway,
                    amount: response.data.amount,
                    initiated_at: new Date().toISOString()
                });

                // Redirect to payment gateway
                window.location.href = response.data.payment_url;
            } else {
                toast.error(response.message || 'Payment initialization failed');
                setLoading(false);
            }
        } catch (error) {
            console.error('Payment error:', error);
            const errorMessage = error.response?.data?.message ||
                                error.message ||
                                'Failed to initialize payment. Please try again.';
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="payment-gateway-modal-overlay" onClick={onClose}>
            <div className="payment-gateway-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="payment-modal-header">
                    <div>
                        <h2>Select Payment Method</h2>
                        <p className="payment-modal-subtitle">
                            Choose how you'd like to pay for this invoice
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="payment-modal-close"
                        disabled={loading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Invoice Info */}
                <div className="payment-invoice-info">
                    <div className="payment-info-row">
                        <span className="payment-info-label">Invoice Number:</span>
                        <span className="payment-info-value">{invoice.invoice_number}</span>
                    </div>
                    <div className="payment-info-row">
                        <span className="payment-info-label">Amount to Pay:</span>
                        <span className="payment-info-value payment-amount">
                            {formatAmount(invoice.balance || invoice.total_amount)}
                        </span>
                    </div>
                    {invoice.payer_name && (
                        <div className="payment-info-row">
                            <span className="payment-info-label">Payer:</span>
                            <span className="payment-info-value">{invoice.payer_name}</span>
                        </div>
                    )}
                </div>

                {/* Gateway Options */}
                <div className="payment-gateway-options">
                    <h3 className="gateway-options-title">Payment Gateways</h3>
                    <div className="gateway-cards">
                        {gateways.map((gateway) => (
                            <div
                                key={gateway.id}
                                className={`gateway-card ${
                                    selectedGateway === gateway.id ? 'selected' : ''
                                } ${!gateway.available ? 'disabled' : ''}`}
                                onClick={() => gateway.available && setSelectedGateway(gateway.id)}
                                style={{
                                    '--gateway-color': gateway.color
                                }}
                            >
                                <div className="gateway-card-header">
                                    <div className="gateway-radio">
                                        <input
                                            type="radio"
                                            name="gateway"
                                            checked={selectedGateway === gateway.id}
                                            onChange={() => gateway.available && setSelectedGateway(gateway.id)}
                                            disabled={!gateway.available}
                                        />
                                    </div>
                                    <div className="gateway-info">
                                        <h4 className="gateway-name">{gateway.name}</h4>
                                        <p className="gateway-description">{gateway.description}</p>
                                    </div>
                                </div>
                                <div className="gateway-icon" style={{ backgroundColor: gateway.color }}>
                                    <CreditCard size={24} color="white" />
                                </div>
                                {!gateway.available && (
                                    <div className="gateway-badge">Coming Soon</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="payment-modal-actions">
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePayment}
                        className="btn-primary"
                        disabled={!selectedGateway || loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="spinner" size={18} />
                                Processing...
                            </>
                        ) : (
                            <>
                                Proceed to Payment
                            </>
                        )}
                    </button>
                </div>

                {/* Security Notice */}
                <div className="payment-security-notice">
                    <div className="security-icon">🔒</div>
                    <p>Your payment is secured with 256-bit SSL encryption</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentGatewayModal;
