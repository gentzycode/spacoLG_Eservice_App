import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineClose, AiOutlineCopy, AiOutlineEdit } from 'react-icons/ai';
import { AuthContext } from '../../../context/AuthContext';

const IndividualModal = ({ individual, onClose, onSave }) => {
    const { user } = useContext(AuthContext); // Get the logged-in user from the AuthContext
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        address: '',
        email: '',
        mobile_number: '', // Include mobile number field
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (individual) {
            setFormData({
                first_name: individual.first_name || '',
                middle_name: individual.middle_name || '',
                last_name: individual.last_name || '',
                gender: individual.gender || '',
                date_of_birth: individual.date_of_birth || '',
                address: individual.address || '',
                email: individual.email || '',
                mobile_number: individual.mobile_number || '',
            });
        } else {
            setIsEditing(true); // Enable editing for new individual
        }
    }, [individual]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
    
        const payload = {
            ...formData,
            created_by_id: user.id, // Ensure the ID of the logged-in user is included
        };
    
        console.log("Submitting payload:", payload); // Log the payload to verify its content
    
        try {
            await onSave(individual ? individual.id : null, payload);
            onClose();  // Close modal on successful save
        } catch (err) {
            console.error('Error response:', err.response?.data); // Log error response for debugging
            setErrors(err.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };    
    
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Reference copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-height-full transform transition-all duration-300 scale-100 hover:scale-105 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {isEditing ? (individual ? 'Edit Individual' : 'Add Individual') : 'View Individual'}
                    </h2>
                    <div className="flex space-x-2">
                        {individual && !isEditing && (
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
                            <label className="block text-gray-700 font-bold mb-2">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                            {errors.first_name && <div className="text-red-500">{errors.first_name[0]}</div>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Middle Name</label>
                            <input
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                            {errors.last_name && <div className="text-red-500">{errors.last_name[0]}</div>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <div className="text-red-500">{errors.gender[0]}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                required
                            />
                            {errors.date_of_birth && <div className="text-red-500">{errors.date_of_birth[0]}</div>}
                        </div>
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
                            {errors.address && <div className="text-red-500">{errors.address[0]}</div>}
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
                            {errors.email && <div className="text-red-500">{errors.email[0]}</div>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                            />
                            {errors.mobile_number && <div className="text-red-500">{errors.mobile_number[0]}</div>}
                        </div>
                    </div>
                    {individual && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Individual Reference</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="individual_ref"
                                    value={individual.individual_ref}
                                    className="w-full p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                    readOnly
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all duration-300"
                                    onClick={() => handleCopy(individual.individual_ref)}
                                >
                                    <AiOutlineCopy size={24} />
                                </button>
                            </div>
                        </div>
                    )}
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

export default IndividualModal;
