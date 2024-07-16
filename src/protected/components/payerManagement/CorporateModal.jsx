import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineCopy, AiOutlineEdit } from 'react-icons/ai';

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
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (corporate) {
            setFormData({
                company_name: corporate.company_name || '',
                registration_number: corporate.registration_number || '',
                address: corporate.address || '',
                contact_person: corporate.contact_person || '',
                email: corporate.email || '',
                phone_number: corporate.phone_number || '',
                receive_sms: corporate.receive_sms || false,
                receive_email: corporate.receive_email || false
            });
        } else {
            setIsEditing(true); // Enable editing for new corporate
        }
    }, [corporate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await onSave(corporate ? corporate.id : null, formData);
            onClose();  // Close modal on successful save
        } catch (err) {
            console.error('Error submitting form data:', err.response.data);  // Log error response
            setErrors(err.response.data.errors || {});  // Capture and set errors from the response
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Reference copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-full transform transition-all duration-300 scale-100 hover:scale-105 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {isEditing ? (corporate ? 'Edit Corporate' : 'Add Corporate') : 'View Corporate'}
                    </h2>
                    <div className="flex space-x-2">
                        {corporate && !isEditing && (
                            <button
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                onClick={toggleEdit}
                            >
                                <AiOutlineEdit size={24} />
                            </button>
                        )}
                        <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={onClose}>
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                </div>
                {errors.message && <div className="text-red-500 mb-4 text-center">{errors.message}</div>}
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
                                readOnly={!isEditing}
                                required
                            />
                            {errors.company_name && <div className="text-red-500">{errors.company_name[0]}</div>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Registration Number</label>
                            <input
                                type="text"
                                name="registration_number"
                                value={formData.registration_number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                readOnly={!isEditing}
                                required
                            />
                            {errors.registration_number && <div className="text-red-500">{errors.registration_number[0]}</div>}
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
                                readOnly={!isEditing}
                                required
                            />
                            {errors.address && <div className="text-red-500">{errors.address[0]}</div>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Contact Person</label>
                            <input
                                type="text"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                readOnly={!isEditing}
                                required
                            />
                            {errors.contact_person && <div className="text-red-500">{errors.contact_person[0]}</div>}
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
                                readOnly={!isEditing}
                                required
                            />
                            {errors.email && <div className="text-red-500">{errors.email[0]}</div>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                readOnly={!isEditing}
                                required
                            />
                            {errors.phone_number && <div className="text-red-500">{errors.phone_number[0]}</div>}
                        </div>
                    </div>
                    {corporate && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Corporate Reference</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="corporate_ref"
                                    value={corporate.corporate_ref}
                                    className="w-full p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                    readOnly
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all duration-300"
                                    onClick={() => handleCopy(corporate.corporate_ref)}
                                >
                                    <AiOutlineCopy size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="receive_sms"
                                checked={formData.receive_sms}
                                onChange={handleChange}
                                className="form-checkbox"
                                disabled={!isEditing}
                            />
                            <span className="ml-2 text-gray-700">Receive SMS</span>
                        </label>
                        {errors.receive_sms && <div className="text-red-500">{errors.receive_sms[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="receive_email"
                                checked={formData.receive_email}
                                onChange={handleChange}
                                className="form-checkbox"
                                disabled={!isEditing}
                            />
                            <span className="ml-2 text-gray-700">Receive Email</span>
                        </label>
                        {errors.receive_email && <div className="text-red-500">{errors.receive_email[0]}</div>}
                    </div>
                    {isEditing && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={`px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CorporateModal;
