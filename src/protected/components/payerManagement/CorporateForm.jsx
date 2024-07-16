import React, { useState, useEffect } from 'react';
import { createCorporate, updateCorporate } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import './CorporateModal.css';

const CorporateModal = ({ closeModal, isEditing, currentPayer, token, refreshPayers }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        registration_number: '',
        address: '',
        contact_person: '',
        email: '',
        phone_number: '',
        receive_sms: false,
        receive_email: false,
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditing && currentPayer) {
            setFormData(currentPayer);
        }
    }, [isEditing, currentPayer]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            if (isEditing) {
                await updateCorporate(token, currentPayer.id, formData);
            } else {
                await createCorporate(token, formData);
            }
            refreshPayers();
            closeModal();
        } catch (err) {
            setError('Failed to save corporate');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="text-2xl font-bold">{isEditing ? 'Edit Corporate' : 'Add Corporate'}</h2>
                    <button onClick={closeModal} className="modal-close-btn">
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Registration Number</label>
                        <input
                            type="text"
                            name="registration_number"
                            value={formData.registration_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Person</label>
                        <input
                            type="text"
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="receive_sms"
                                checked={formData.receive_sms}
                                onChange={handleChange}
                            />
                            Receive SMS
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="receive_email"
                                checked={formData.receive_email}
                                onChange={handleChange}
                            />
                            Receive Email
                        </label>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CorporateModal;
