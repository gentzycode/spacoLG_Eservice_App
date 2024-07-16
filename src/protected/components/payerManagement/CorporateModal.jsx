import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const CorporateModal = ({ corporate, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        registration_number: '',
        address: '',
        contact_person: '',
        email: '',
        phone_number: '',
        receive_sms: false,
        receive_email: false
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (corporate) {
            setFormData({
                company_name: corporate.company_name,
                registration_number: corporate.registration_number,
                address: corporate.address,
                contact_person: corporate.contact_person,
                email: corporate.email,
                phone_number: corporate.phone_number,
                receive_sms: corporate.receive_sms,
                receive_email: corporate.receive_email
            });
        }
    }, [corporate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(corporate ? corporate.id : null, formData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-full transform transition-all duration-300 scale-100 hover:scale-105 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{corporate ? 'Edit Corporate' : 'Add Corporate'}</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={onClose}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Company Name</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Registration Number</label>
                            <input
                                type="text"
                                name="registration_number"
                                value={formData.registration_number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Contact Person</label>
                            <input
                                type="text"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="receive_sms"
                                checked={formData.receive_sms}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2 text-gray-700">Receive SMS</span>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="receive_email"
                                checked={formData.receive_email}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2 text-gray-700">Receive Email</span>
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CorporateModal;
