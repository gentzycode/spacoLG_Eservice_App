// src/protected/components/invoices/PayInvoiceModal.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { payInvoiceById, payInvoiceByReference } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';

const PayInvoiceModal = ({ closeModal }) => {
    const { token } = useContext(AuthContext);
    const [paymentMethod, setPaymentMethod] = useState('Token');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);

    const handleSubmitById = async () => {
        setLoading(true);
        const payload = {
            payment_gateway: paymentMethod,
        };
        try {
            await payInvoiceById(token, id, payload, setInvoiceData, setError, setLoading);
        } catch (err) {
            setError('Failed to pay invoice');
        }
    };

    const handleSubmitByReference = async () => {
        setLoading(true);
        const payload = {
            reference_number: referenceNumber,
            payment_gateway: paymentMethod,
        };
        try {
            await payInvoiceByReference(token, payload, setInvoiceData, setError, setLoading);
        } catch (err) {
            setError('Failed to pay invoice');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Pay Invoice</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Payment Method</label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="Token">Token</option>
                        <option value="Paystack">Paystack</option>
                        <option value="Interswitch">Interswitch</option>
                        <option value="Remita">Remita</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Invoice ID</label>
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Enter Invoice ID"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Reference Number</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Enter Reference Number"
                    />
                </div>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                {invoiceData && (
                    <div className="text-green-500 mb-4 text-center">
                        Invoice paid successfully: ID {invoiceData.id}
                    </div>
                )}
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                    <button
                        className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200"
                        onClick={handleSubmitById}
                        disabled={loading || !id}
                    >
                        {loading ? 'Processing...' : 'Pay by ID'}
                    </button>
                    <button
                        className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200"
                        onClick={handleSubmitByReference}
                        disabled={loading || !referenceNumber}
                    >
                        {loading ? 'Processing...' : 'Pay by Reference'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayInvoiceModal;
