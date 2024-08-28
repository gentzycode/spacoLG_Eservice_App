import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { createCorporate, updateCorporate, checkEmailExists, checkMobileExists, checkRegistrationNumberExists } from '../../../apis/authActions';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import Confetti from 'react-confetti';
import QRCode from 'qrcode.react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CorporateModal = ({ closeModal, corporate, viewMode = false, onSave }) => {
    const { token, user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        company_name: corporate?.company_name || '',
        registration_number: corporate?.registration_number || '',
        address: corporate?.address || '',
        contact_person: corporate?.contact_person || '',
        email: corporate?.email || '',
        phone_number: corporate?.phone_number || '',
        receive_sms: corporate?.receive_sms || false,
        receive_email: corporate?.receive_email || false,
    });
    const [loading, setLoading] = useState(false);
    const [corporateData, setCorporateData] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [mobileExists, setMobileExists] = useState(false);
    const [registrationNumberExists, setRegistrationNumberExists] = useState(false);
    const [isEditable, setIsEditable] = useState(!viewMode);

    useEffect(() => {
        const isValid = formData.company_name && formData.registration_number && formData.address && formData.contact_person && formData.email && !emailExists && !mobileExists && !registrationNumberExists;
        setIsFormValid(isValid);
    }, [formData, emailExists, mobileExists, registrationNumberExists]);

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        if (name === 'email') {
            try {
                const exists = await checkEmailExists(value);
                setEmailExists(exists);
                if (exists) {
                    toast.error('Email already exists. Please use another one.');
                }
            } catch (error) {
                console.error('Error during email validation:', error);
            }
        } else if (name === 'phone_number') {
            try {
                const exists = await checkMobileExists(value);
                setMobileExists(exists);
                if (exists) {
                    toast.error('Phone number already exists. Please use another one.');
                }
            } catch (error) {
                console.error('Error during phone number validation:', error);
            }
        } else if (name === 'registration_number') {
            try {
                const exists = await checkRegistrationNumberExists(value);
                setRegistrationNumberExists(exists);
                if (exists) {
                    toast.error('Registration number already exists. Please use another one.');
                }
            } catch (error) {
                console.error('Error during registration number validation:', error);
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setShowConfetti(false);

        try {
            const payload = {
                ...formData,
                created_by_id: user.id,
            };

            let response;
            if (corporate) {
                response = await updateCorporate(token, corporate.id, payload);
            } else {
                response = await createCorporate(token, payload);
            }

            setCorporateData(response);
            if (response) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                toast.success('Corporate saved successfully!');
                if (onSave) onSave();
                closeModal();
            }
        } catch (err) {
            console.error("Error saving corporate:", err);
            if (err.response && err.response.status === 422) {
                const errorMessages = err.response.data.errors;
                Object.keys(errorMessages).forEach((key) => {
                    toast.error(errorMessages[key].join(', '));
                });
            } else {
                toast.error('Failed to save corporate.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="modal-container max-w-2xl w-full p-8 rounded-lg shadow-xl transform transition-all duration-300 scale-100 hover:scale-105 bg-white overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-700 to-blue-500 p-4 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">{corporate ? 'Corporate Details' : 'Add New Corporate'}</h2>
                    <div className="flex items-center space-x-2">
                        {viewMode && (
                            <button className="text-white" onClick={() => setIsEditable(true)}>
                                <AiOutlineEdit size={24} />
                            </button>
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
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Registration Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                name="registration_number"
                                value={formData.registration_number}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                            {registrationNumberExists && <p className="text-red-500 mt-2">Registration number already exists. Please use another one.</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Contact Person <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                            {emailExists && <p className="text-red-500 mt-2">Email already exists. Please use another one.</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                                disabled={!isEditable}
                            />
                            {mobileExists && <p className="text-red-500 mt-2">Phone number already exists. Please use another one.</p>}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-700">Receive Notifications</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    name="receive_sms"
                                    checked={formData.receive_sms}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                                <span className="ml-2 text-gray-700">Receive SMS</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    name="receive_email"
                                    checked={formData.receive_email}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                                <span className="ml-2 text-gray-700">Receive Email</span>
                            </label>
                        </div>
                    </div>
                    {corporateData && (
                        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
                            <h3>Corporate saved successfully!</h3>
                            <p><strong>Name:</strong> {corporateData.company_name}</p>
                            <p><strong>Email:</strong> {corporateData.email}</p>
                            <p><strong>Reference:</strong> {corporateData.corporate_ref}</p>
                            <QRCode value={JSON.stringify({
                                name: `${corporateData.company_name}`,
                                reference: corporateData.corporate_ref,
                                email: corporateData.email
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
                                className={`px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-all duration-200 ${!isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleSubmit}
                                disabled={!isFormValid || loading}
                            >
                                {loading ? 'Submitting...' : 'Save Corporate'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorporateModal;
