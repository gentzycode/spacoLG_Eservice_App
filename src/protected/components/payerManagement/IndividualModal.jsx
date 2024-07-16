import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const IndividualModal = ({ individual, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        address: '',
        email: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (individual) {
            setFormData({
                first_name: individual.first_name,
                middle_name: individual.middle_name,
                last_name: individual.last_name,
                gender: individual.gender,
                date_of_birth: individual.date_of_birth,
                address: individual.address,
                email: individual.email
            });
        }
    }, [individual]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(individual ? individual.id : null, formData);
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
                    <h2 className="text-2xl font-bold text-gray-800">{individual ? 'Edit Individual' : 'Add Individual'}</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={onClose}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
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
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
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
                        </div>
                    </div>
                    <div className="mb-4">
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

export default IndividualModal;
