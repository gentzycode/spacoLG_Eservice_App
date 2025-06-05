import React, { useState, useEffect } from 'react';
import { getEnabledPaymentGateways, payInvoiceById, payInvoiceByReference } from '../../../apis/authActions';

const PayInvoiceModal = ({ invoice, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        payment_method: '',
        token: '',
        reference_number: invoice?.invoice_ref || '',
    });
    const [paymentGateways, setPaymentGateways] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGateways = async () => {
            try {
                await getEnabledPaymentGateways(
                    localStorage.getItem('token'),
                    setPaymentGateways,
                    setError,
                    setLoading
                );
            } catch (err) {
                setError('Failed to load payment gateways');
            }
        };
        fetchGateways();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = {};
            if (formData.payment_method === 'Token') {
                data.token = formData.token;
            } else {
                data.payment_gateway = formData.payment_method;
            }
            const response = invoice
                ? await payInvoiceById(
                      localStorage.getItem('token'),
                      invoice.id,
                      data,
                      () => onSuccess(),
                      (err) => setError(err.message || 'Failed to process payment'),
                      setLoading
                  )
                : await payInvoiceByReference(localStorage.getItem('token'), {
                      reference_number: formData.reference_number,
                      ...data,
                  });
            if (response.payment_url) {
                window.location.href = response.payment_url;
            } else {
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError(err.message || 'Failed to process payment');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Pay Invoice</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {!invoice && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Reference Number</label>
                            <input
                                type="text"
                                name="reference_number"
                                value={formData.reference_number}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                        <select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            <option value="">Select Payment Method</option>
                            {paymentGateways.map((gateway) => (
                                <option key={gateway} value={gateway}>{gateway}</option>
                            ))}
                        </select>
                    </div>
                    {formData.payment_method === 'Token' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Token</label>
                            <input
                                type="text"
                                name="token"
                                value={formData.token}
                                onChange={handleChange}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652] disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Pay'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PayInvoiceModal;