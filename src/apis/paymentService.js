import { adminApiClient } from './apiClient';

/**
 * Initialize payment for an invoice through a payment gateway
 * @param {number} invoiceId - The invoice ID
 * @param {string} gateway - Payment gateway (monnify, tranzakt, paystack)
 * @param {string|null} redirectUrl - Optional callback URL
 * @returns {Promise<Object>} Payment initialization response
 */
export const initializeInvoicePayment = async (invoiceId, gateway, redirectUrl = null) => {
    try {
        const response = await adminApiClient.post(
            `invoice-manager/invoices/${invoiceId}/initialize-payment`,
            {
                payment_gateway: gateway,
                redirect_url: redirectUrl || `${window.location.origin}/invoice-v2-manager`
            }
        );

        return response.data;
    } catch (error) {
        console.error('Payment initialization error:', error);
        throw error;
    }
};

/**
 * Save pending payment information to session storage
 * @param {Object} paymentInfo - Payment information to store
 */
export const savePendingPayment = (paymentInfo) => {
    try {
        sessionStorage.setItem('pending_payment', JSON.stringify(paymentInfo));
    } catch (error) {
        console.error('Error saving pending payment:', error);
    }
};

/**
 * Get pending payment information from session storage
 * @returns {Object|null} Pending payment info or null
 */
export const getPendingPayment = () => {
    try {
        const data = sessionStorage.getItem('pending_payment');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting pending payment:', error);
        return null;
    }
};

/**
 * Clear pending payment from session storage
 */
export const clearPendingPayment = () => {
    try {
        sessionStorage.removeItem('pending_payment');
    } catch (error) {
        console.error('Error clearing pending payment:', error);
    }
};

/**
 * Check if URL has payment callback parameters
 * @returns {Object|null} Callback info or null
 */
export const checkPaymentCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for Tranzakt callback
    if (urlParams.get('tranzakt_callback') === '1') {
        return {
            gateway: 'tranzakt',
            type: 'tranzakt_callback'
        };
    }

    // Check for Monnify callback
    const status = urlParams.get('status');
    const transactionReference = urlParams.get('transactionReference');
    if (status && transactionReference) {
        return {
            gateway: 'monnify',
            type: 'monnify_callback',
            status,
            transactionReference
        };
    }

    return null;
};

/**
 * Clean callback parameters from URL
 */
export const cleanCallbackUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('tranzakt_callback');
    url.searchParams.delete('status');
    url.searchParams.delete('transactionReference');
    url.searchParams.delete('paymentReference');
    window.history.replaceState({}, '', url.pathname + url.search);
};
