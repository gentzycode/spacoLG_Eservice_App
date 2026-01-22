import React, { useState, useEffect, useContext } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { initializeInvoicePayment, savePendingPayment } from '../../../apis/paymentService';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import './PaymentGatewayModal.css';

const PaymentGatewayModal = ({ invoice, onClose }) => {
    const { token } = useContext(AuthContext);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gateways, setGateways] = useState([]);
    const [fetchingGateways, setFetchingGateways] = useState(true);

    // Gateway color mapping (can be customized)
    const gatewayColors = {
        'monnify': '#5865f2',
        'tranzakt': '#00a86b',
        'paystack': '#00c3f7',
        'flutterwave': '#F5A623',
        'interswitch': '#D0021B',
        'remita': '#0B4D2C',
        'default': '#4A5568'
    };

    // Gateway descriptions
    const gatewayDescriptions = {
        'monnify': 'Pay with cards, bank transfer, or USSD',
        'tranzakt': 'Secure payment through Tranzakt',
        'paystack': 'Pay with Paystack - Cards, Bank Transfer & More',
        'flutterwave': 'Pay with Flutterwave',
        'interswitch': 'Pay with Interswitch',
        'remita': 'Pay with Remita',
        'e-wallet': 'Pay from your wallet balance',
        'default': 'Secure online payment'
    };

    // Fetch enabled payment gateways from backend
    useEffect(() => {
        const fetchEnabledGateways = async () => {
            try {
                setFetchingGateways(true);
                const response = await fetch(
                    `${import.meta.env.VITE_ADMIN_BASE_URL}/paymentgateways/enabled`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const data = await response.json();

                if (data.status === 'success' && data.data) {
                    // Map backend gateways to frontend format
                    const mappedGateways = data.data
                        .filter(gw => {
                            // Filter out e-wallet and other non-online payment gateways
                            const slug = gw.slug?.toLowerCase() || gw.gateway_name?.toLowerCase() || '';
                            return !['e-wallet', 'cash', 'token'].includes(slug);
                        })
                        .map(gw => {
                            const slug = gw.slug?.toLowerCase() || gw.gateway_name?.toLowerCase() || '';
                            return {
                                id: slug,
                                name: gw.gateway_name,
                                description: gatewayDescriptions[slug] || gatewayDescriptions.default,
                                color: gatewayColors[slug] || gatewayColors.default,
                                logo: gw.logo_url || '/assets/payment-icon.png',
                                available: true
                            };
                        });

                    setGateways(mappedGateways);

                    if (mappedGateways.length === 0) {
                        toast.warning('No online payment gateways are currently enabled. Please contact support.');
                    }
                } else {
                    toast.error('Failed to load payment gateways');
                }
            } catch (error) {
                console.error('Error fetching payment gateways:', error);
                toast.error('Failed to load payment gateways');
            } finally {
                setFetchingGateways(false);
            }
        };

        fetchEnabledGateways();
    }, [token]);

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

            // Enhanced error handling
            let errorMessage = 'Failed to initialize payment. Please try again.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;

                // Special handling for configuration errors
                if (errorMessage.includes('not fully configured')) {
                    errorMessage = `${selectedGateway.toUpperCase()} is not fully configured. Please contact support or try a different payment method.`;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 8000
            });
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

                    {fetchingGateways ? (
                        <div className="gateway-loading">
                            <Loader2 className="spinner" size={32} />
                            <p>Loading payment options...</p>
                        </div>
                    ) : gateways.length === 0 ? (
                        <div className="gateway-empty">
                            <p>No online payment gateways are currently available.</p>
                            <p className="gateway-empty-subtitle">Please contact support or try manual payment.</p>
                        </div>
                    ) : (
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
                    )}
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
