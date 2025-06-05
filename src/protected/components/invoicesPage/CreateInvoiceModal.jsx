import React, { useState, useEffect } from 'react';
import { generateInvoice, getEserviceItems, getIdentifiers } from '../../../apis/authActions';

const CreateInvoiceModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        eservice_item_id: '',
        identifier_id: '',
        reference_number: '',
        amount: '',
        purpose: '',
        description: '',
    });
    const [eserviceItems, setEserviceItems] = useState([]);
    const [identifiers, setIdentifiers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [items, ids] = await Promise.all([
                    getEserviceItems(localStorage.getItem('token')),
                    getIdentifiers(localStorage.getItem('token')),
                ]);
                setEserviceItems(items);
                setIdentifiers(ids);
            } catch (err) {
                setError('Failed to load form data');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await generateInvoice(
                localStorage.getItem('token'),
                formData,
                () => onSuccess(),
                setError,
                setLoading
            );
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create invoice');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Create Invoice</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Service Item</label>
                        <select
                            name="eservice_item_id"
                            value={formData.eservice_item_id}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            <option value="">Select Service Item</option>
                            {eserviceItems.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Identifier</label>
                        <select
                            name="identifier_id"
                            value={formData.identifier_id}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            required
                        >
                            <option value="">Select Identifier</option>
                            {identifiers.map((id) => (
                                <option key={id.id} value={id.id}>{id.name}</option>
                            ))}
                        </select>
                    </div>
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
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Purpose</label>
                        <input
                            type="text"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
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
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateInvoiceModal;