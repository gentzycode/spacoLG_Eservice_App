import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getEserviceItems, quickUseToken, getIdentifiers } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Select from 'react-select';

const QuickUseTokenModal = ({ closeModal, agentId }) => {
    const { token } = useContext(AuthContext);
    const [eserviceItems, setEserviceItems] = useState([]);
    const [identifierTypes, setIdentifierTypes] = useState([]);
    const [selectedEservice, setSelectedEservice] = useState(null);
    const [selectedIdentifier, setSelectedIdentifier] = useState(null);
    const [tokenString, setTokenString] = useState('');
    const [identifierValue, setIdentifierValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const items = await getEserviceItems(token);
                setEserviceItems(items);
                const identifiers = await getIdentifiers(token);
                setIdentifierTypes(identifiers);
            } catch (err) {
                setError('Failed to fetch data.');
            }
            setLoading(false);
        };
        fetchData();
    }, [token]);

    const handleQuickUse = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await quickUseToken(token, agentId, {
                token: tokenString,
                eservice_item_id: selectedEservice.value,
                identifier_type: selectedIdentifier ? selectedIdentifier.value : null,
                identifier_value: selectedIdentifier ? identifierValue : null,
            });
            setSuccess(true);
            setLoading(false);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to use token. Check Token Balance';
            setError(errorMsg);
            setLoading(false);
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: '#10B981',
            '&:hover': { borderColor: '#10B981' },
            boxShadow: 'none',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#10B981' : state.isFocused ? '#D1FAE5' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
                backgroundColor: '#D1FAE5',
                color: 'black',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#10B981',
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: 'red',
            '&:hover': {
                color: 'darkred',
            },
        }),
    };

    return (
        <div style={modalOverlayStyle}>
            <div className="modal-container bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>Quick Use Token</h2>
                    <button style={closeButtonStyle} onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Select eService Item</label>
                    <Select
                        styles={customStyles}
                        className="w-full"
                        value={selectedEservice}
                        onChange={(selectedOption) => setSelectedEservice(selectedOption)}
                        options={eserviceItems.map(item => ({
                            value: item.id,
                            label: `${item.name} - ₦${Number(item.value).toLocaleString()} (${item.category})`
                        }))}
                        isClearable
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Select Identifier Type</label>
                    <Select
                        styles={customStyles}
                        className="w-full"
                        value={selectedIdentifier}
                        onChange={(selectedOption) => {
                            setSelectedIdentifier(selectedOption);
                            setIdentifierValue('');
                        }}
                        options={identifierTypes.map(type => ({
                            value: type.id,
                            label: type.title,
                        }))}
                        isClearable
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                        {selectedIdentifier ? `Provide ${selectedIdentifier.label}` : 'Identifier Value'}
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={identifierValue}
                        onChange={(e) => setIdentifierValue(e.target.value)}
                        placeholder={selectedIdentifier ? `Enter ${selectedIdentifier.label}` : 'Enter identifier value'}
                        disabled={!selectedIdentifier}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Token</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 transition-all duration-200"
                        value={tokenString}
                        onChange={(e) => setTokenString(e.target.value)}
                        placeholder="Enter token"
                    />
                </div>
                {error && (
                    <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-600 mb-4">
                        <div className="text-red-700 text-lg font-semibold mb-2 flex items-center">
                            <FaTimesCircle className="mr-2" />
                            Error!
                        </div>
                        <div className="text-gray-700">
                            {error}
                        </div>
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-600 mb-4">
                        <div className="text-green-700 text-lg font-semibold mb-2 flex items-center">
                            <FaCheckCircle className="mr-2" />
                            Transaction processed successfully!
                        </div>
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
                        className={`px-5 py-3 rounded-lg text-white transition-all duration-200 ${loading || !selectedEservice || !tokenString ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-900'}`}
                        onClick={handleQuickUse}
                        disabled={loading || !selectedEservice || !tokenString}
                    >
                        {loading ? 'Processing...' : 'Use Token'}
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

export default QuickUseTokenModal;
