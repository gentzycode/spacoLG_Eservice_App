import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { createIndividual, updateIndividual, checkEmailExists, checkMobileExists } from '../../../apis/authActions';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import Confetti from 'react-confetti';
import QRCode from 'qrcode.react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddIndividualModal = ({ closeModal, individual = null, viewMode = false, onSave }) => {
    const { token, user } = useContext(AuthContext);
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
    const [loading, setLoading] = useState(false);
    const [individualData, setIndividualData] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isEditable, setIsEditable] = useState(!viewMode);
    const [emailExists, setEmailExists] = useState(false);
    const [mobileExists, setMobileExists] = useState(false);

    useEffect(() => {
        if (individual) {
            setFormData(individual);
            setIsEditable(!viewMode);
        }
    }, [individual, viewMode]);

    useEffect(() => {
        const isValid = formData.first_name && formData.last_name && formData.gender && formData.address && formData.email && !emailExists && !mobileExists;
        setIsFormValid(isValid);
    }, [formData, emailExists, mobileExists]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'email' && value !== individual?.email) {
            const exists = await checkEmailExists(value);
            setEmailExists(exists);
            if (exists) {
                toast.error('Email already exists. Please use another one.');
            }
        } else if (name === 'mobile_number' && value !== individual?.mobile_number) {
            const exists = await checkMobileExists(value);
            setMobileExists(exists);
            if (exists) {
                toast.error('Mobile number already exists. Please use another one.');
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setShowConfetti(false);

        try {
            const payload = { ...formData, created_by_id: user.id };
            if (individual) {
                // Update individual
                const response = await updateIndividual(token, individual.id, payload);
                setIndividualData(response);
                if (response) {
                    toast.success('Individual updated successfully!');
                }
            } else {
                // Create new individual
                const response = await createIndividual(token, payload);
                setIndividualData(response);
                if (response) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                    toast.success('Individual created successfully!');
                }
            }
            onSave();
        } catch (err) {
            console.error("Error creating/updating individual:", err);
            toast.error('Failed to save individual.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="modal-container max-w-2xl w-full p-8 rounded-lg shadow-xl transform transition-all duration-300 scale-100 hover:scale-105 bg-white overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-green-700 to-green-500 p-4 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">{individual ? 'Individual Details' : 'Add New Individual'}</h2>
                    <div className="flex space-x-4">
                        {viewMode && (
                            <AiOutlineEdit
                                size={24}
                                className="cursor-pointer text-white"
                                onClick={() => setIsEditable(true)}
                            />
                        )}
                        <button className="text-white" onClick={closeModal}>
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                </div>
                <div className="form-container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                readOnly={!isEditable}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">Middle Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                readOnly={!isEditable}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                readOnly={!isEditable}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={!isEditable}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                readOnly={!isEditable}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                readOnly={!isEditable}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                readOnly={!isEditable}
                                required
                            />
                            {emailExists && <p className="text-red-500 mt-2">Email already exists. Please use another one.</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">Mobile Number</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                readOnly={!isEditable}
                            />
                            {mobileExists && <p className="text-red-500 mt-2">Mobile number already exists. Please use another one.</p>}
                        </div>
                    </div>
                    {individualData && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                            <h3>Individual saved successfully!</h3>
                            <p><strong>Name:</strong> {individualData.first_name} {individualData.last_name}</p>
                            <p><strong>Email:</strong> {individualData.email}</p>
                            <p><strong>Reference:</strong> {individualData.individual_ref}</p>
                            <QRCode value={JSON.stringify({
                                name: `${individualData.first_name} ${individualData.last_name}`,
                                reference: individualData.individual_ref,
                                email: individualData.email
                            })} />
                        </div>
                    )}
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                        {isEditable && (
                            <button
                                className={`px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200 ${!isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleSubmit}
                                disabled={!isFormValid || loading}
                            >
                                {loading ? 'Submitting...' : individual ? 'Update Info' : 'Add Individual'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddIndividualModal;
