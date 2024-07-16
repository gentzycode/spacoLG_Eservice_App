// src/protected/components/invoices/GenerateInvoiceModal.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { generateInvoice } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';

const GenerateInvoiceModal = ({ closeModal }) => {
    const { token } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [eserviceId, setEserviceId] = useState('');
    const [purpose, setPurpose] = useState('');
    const [description, setDescription] = useState('');
    const [payerType, setPayerType] = useState('agent');
    const [payerId, setPayerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            amount: parseFloat(amount),
            eservice_id: eserviceId ? parseInt(eserviceId) : null,
            purpose,
            description,
            payer_type: payerType,
            payer_id: parseInt(payerId)
        };
        try {
            await generateInvoice(token, payload, setInvoiceData, setError, setLoading);
        } catch (err) {
            setError('Failed to generate invoice');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Generate Invoice</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">E-Service ID</label>
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={eserviceId}
                        onChange={(e) => setEserviceId(e.target.value)}
                        placeholder="Enter E-Service ID (optional)"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Purpose</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Enter purpose"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Description</label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description (optional)"
                    ></textarea>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Payer Type</label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={payerType}
                        onChange={(e) => setPayerType(e.target.value)}
                    >
                        <option value="individual">Individual</option>
                        <option value="corporate">Corporate</option>
                        <option value="agent">Agent</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Payer ID</label>
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={payerId}
                        onChange={(e) => setPayerId(e.target.value)}
                        placeholder="Enter Payer ID"
                    />
                </div>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                {invoiceData && (
                    <div className="text-green-500 mb-4 text-center">
                        Invoice generated successfully: Reference Number {invoiceData.reference_number}
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
                        onClick={handleSubmit}
                        disabled={loading || !amount || !purpose || !payerId}
                    >
                        {loading ? 'Processing...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateInvoiceModal;
