import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../apis/baseUrl'; 
import { AuthContext } from '../../../context/AuthContext';
import { getEserviceItems, generateInvoice } from '../../../apis/authActions'; 
import { AiOutlineClose } from 'react-icons/ai';
import Confetti from 'react-confetti'; 
import Select from 'react-select'; 

const GenerateInvoiceModal = ({ closeModal, defaultCategory, defaultReferenceNumber }) => {
    const { token } = useContext(AuthContext);
    const [category, setCategory] = useState(defaultCategory || { value: 'individual', label: 'Individual' });
    const [referenceNumber, setReferenceNumber] = useState(defaultReferenceNumber || '');
    const [eserviceItemId, setEserviceItemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [payerInfo, setPayerInfo] = useState(null);
    const [eserviceItems, setEserviceItems] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const fetchEserviceItems = async () => {
            setLoading(true);
            try {
                const items = await getEserviceItems(token);
                setEserviceItems(items);
            } catch (err) {
                setError('Failed to fetch eService items.');
            }
            setLoading(false);
        };
        fetchEserviceItems();
    }, [token]);

    useEffect(() => {
        if (referenceNumber) {
            fetchPayerInfo();
        }
    }, [referenceNumber]);

    const fetchPayerInfo = async () => {
        setLoading(true);
        try {
            const endpoint = category.value === 'individual'
                ? `/individuals/reference/${referenceNumber}`
                : `/corporates/reference/${referenceNumber}`;
            const response = await axios.get(endpoint, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setPayerInfo(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch payer information');
            setPayerInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            category: category.value,
            reference_number: referenceNumber,
            eservice_item_id: parseInt(eserviceItemId.value)
        };
        try {
            await generateInvoice(token, payload, setInvoiceData, setError, setLoading);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000); // Confetti for 3 seconds
        } catch (err) {
            setError('Failed to generate invoice');
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: '#10B981',
            '&:hover': { borderColor: '#10B981' },
            boxShadow: 'none'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#10B981' : state.isFocused ? '#D1FAE5' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
                backgroundColor: '#D1FAE5',
                color: 'black'
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#10B981',
        })
    };

    return (
        <div style={modalOverlayStyle}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="modal-container bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105 relative">
                <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>Generate Invoice</h2>
                    <button style={closeButtonStyle} onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Category</label>
                    <Select
                        styles={customStyles}
                        className="w-full"
                        value={category}
                        onChange={(selectedOption) => {
                            setCategory(selectedOption);
                            setReferenceNumber('');
                            setPayerInfo(null);
                        }}
                        options={[
                            { value: 'individual', label: 'Individual' },
                            { value: 'corporate', label: 'Corporate' }
                        ]}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Reference Number</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder={`Please provide this ${category.label}'s reference number`}
                    />
                </div>
                {payerInfo && (
                    <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
                        {category.value === 'individual' ? (
                            <>
                                <p><strong>Name:</strong> {payerInfo.first_name} {payerInfo.middle_name} {payerInfo.last_name}</p>
                                <p><strong>Address:</strong> {payerInfo.address}</p>
                                <p><strong>Mobile:</strong> {payerInfo.mobile_number}</p>
                            </>
                        ) : (
                            <>
                                <p><strong>Company:</strong> {payerInfo.company_name}</p>
                                <p><strong>Contact:</strong> {payerInfo.contact_person}</p>
                                <p><strong>Phone:</strong> {payerInfo.phone_number}</p>
                            </>
                        )}
                    </div>
                )}
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">E-Service Item</label>
                    <Select
                        styles={customStyles}
                        className="w-full"
                        value={eserviceItemId}
                        onChange={(selectedOption) => setEserviceItemId(selectedOption)}
                        options={eserviceItems.map(item => ({
                            value: item.id,
                            label: `${item.name} - ₦${Number(item.value).toLocaleString()} (${item.category})`
                        }))}
                    />
                </div>
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                {invoiceData && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                        <p>Invoice generated successfully!</p>
                        <p><strong>Amount:</strong> {invoiceData.invoice.amount}</p>
                        <p><strong>Purpose:</strong> {invoiceData.invoice.purpose}</p>
                        <p><strong>Description:</strong> {invoiceData.invoice.description}</p>
                        <p><strong>Reference Number:</strong> {invoiceData.invoice.reference_number} (Use this to pay for the invoice)</p>
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
                        disabled={loading || !referenceNumber || !eserviceItemId}
                    >
                        {loading ? 'Processing...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '50',
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    background: 'linear-gradient(90deg, rgba(13, 84, 76, 1) 0%, rgba(72, 187, 120, 1) 100%)',
    padding: '10px',
    borderRadius: '8px 8px 0 0',
    color: 'white',
};

const modalTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
};

const closeButtonStyle = {
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
};

export default GenerateInvoiceModal;
