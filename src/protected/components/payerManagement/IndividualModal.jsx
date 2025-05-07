import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { AiOutlineClose, AiOutlineCopy, AiOutlineEdit } from 'react-icons/ai';

const IndividualModal = ({ individual, closeModal, onSave, viewMode }) => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        address: '',
        email: '',
        mobile_number: '',
    });
    const [errors, setErrors] = useState({ message: '', fields: {} });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [similarPayers, setSimilarPayers] = useState([]);

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
            checkForSimilarPayers();
        } else {
            setIsEditing(true);
            setFormData({
                first_name: '',
                middle_name: '',
                last_name: '',
                gender: '',
                date_of_birth: '',
                address: '',
                email: '',
                mobile_number: '',
            });
        }
    }, [individual]);

    const checkForSimilarPayers = () => {
        const mockSimilarPayers = [];
        if (individual?.email === 'john.doe@example.com') {
            mockSimilarPayers.push({ id: 999, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' });
        }
        setSimilarPayers(mockSimilarPayers);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = { message: '', fields: {} };
        if (!formData.first_name) newErrors.fields.first_name = 'First name is required';
        if (!formData.last_name) newErrors.fields.last_name = 'Last name is required';
        if (!formData.gender) newErrors.fields.gender = 'Gender is required';
        if (!formData.date_of_birth) newErrors.fields.date_of_birth = 'Date of birth is required';
        if (!formData.address) newErrors.fields.address = 'Address is required';
        if (!formData.email) newErrors.fields.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.fields.email = 'Email is invalid';
        if (formData.mobile_number && !/^\d{10,15}$/.test(formData.mobile_number)) {
            newErrors.fields.mobile_number = 'Mobile number must be 10-15 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors.fields).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({ message: '', fields: {} });

        const payload = {
            ...formData,
            created_by_id: user?.id,
        };

        try {
            console.log('Saving individual:', payload);
            await onSave(individual ? individual.id : null, payload);
            closeModal();
        } catch (err) {
            console.error('Error saving individual:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save individual';
            setErrors({ message: errorMessage, fields: err.response?.data?.errors || {} });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Reference copied to clipboard');
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100 hover:scale-105 overflow-auto">
                <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 rounded-t-lg">
                    <h2 className="text-3xl font-bold text-white">
                        {isEditing ? (individual ? 'Edit Individual' : 'Add Individual') : 'View Individual'}
                    </h2>
                    <div className="flex space-x-2">
                        {individual && !isEditing && (
                            <button
                                className="text-white hover:text-gray-200 transition-colors duration-200"
                                onClick={(e) => { e.stopPropagation(); toggleEdit(); }}
                            >
                                <AiOutlineEdit size={24} />
                            </button>
                        )}
                        <button
                            className="text-white hover:text-gray-200 transition-colors duration-200"
                            onClick={(e) => { e.stopPropagation(); closeModal(); }}
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                </div>

                {similarPayers.length > 0 && (
                    <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
                        <h3 className="font-bold">Potential Duplicates Found</h3>
                        <ul>
                            {similarPayers.map(payer => (
                                <li key={payer.id}>
                                    {payer.first_name} {payer.last_name} ({payer.email})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {errors.message && <div className="text-red-500 mb-4 text-center">{errors.message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                                required
                            />
                            {errors.fields.first_name && <div className="text-red-500">{errors.fields.first_name}</div>}
                        </div>
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Middle Name</label>
                            <input
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                                required
                            />
                            {errors.fields.last_name && <div className="text-red-500">{errors.fields.last_name}</div>}
                        </div>
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.fields.gender && <div className="text-red-500">{errors.fields.gender}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                                required
                            />
                            {errors.fields.date_of_birth && <div className="text-red-500">{errors.fields.date_of_birth}</div>}
                        </div>
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                                required
                            />
                            {errors.fields.address && <div className="text-red-500">{errors.fields.address}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                                required
                            />
                            {errors.fields.email && <div className="text-red-500">{errors.fields.email}</div>}
                        </div>
                        <div>
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                disabled={!isEditing}
                            />
                            {errors.fields.mobile_number && <div className="text-red-500">{errors.fields.mobile_number}</div>}
                        </div>
                    </div>
                    {individual && (
                        <div className="mb-4">
                            <label className="block text-[#3B78BD] dark:text-[#F0B652] font-bold mb-2">Individual Reference</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="individual_ref"
                                    value={individual.individual_ref}
                                    className="w-full p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                    readOnly
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-[#3B78BD] text-white rounded-r-lg hover:bg-[#F0B652] transition-all duration-300"
                                    onClick={(e) => { e.stopPropagation(); handleCopy(individual.individual_ref); }}
                                >
                                    <AiOutlineCopy size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                    {isEditing && (
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                                onClick={(e) => { e.stopPropagation(); closeModal(); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-5 py-3 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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