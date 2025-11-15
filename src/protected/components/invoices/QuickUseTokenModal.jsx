import React, { useContext, useState, useEffect } from 'react';
import axios from '../../../apis/baseUrl';
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
    const [quantity, setQuantity] = useState(1);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(null);
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

    // Real-time price calculation when item or quantity changes
    useEffect(() => {
        const calculatePrice = async () => {
            if (!selectedEservice) {
                setCalculatedPrice(null);
                setSelectedItemDetails(null);
                return;
            }

            const item = eserviceItems.find(i => i.id === selectedEservice.value);
            if (!item) return;

            setSelectedItemDetails(item);

            // If item doesn't require quantity, use fixed price
            if (!item.requires_quantity) {
                setCalculatedPrice({
                    total_amount: item.value,
                    breakdown: {
                        unit_price: item.value,
                        quantity: 1,
                        subtotal: item.value,
                    },
                    formula_used: `₦${Number(item.value).toLocaleString()}`
                });
                return;
            }

            // For quantity-based items, call backend API
            try {
                const response = await axios.get(
                    `/auth/eservice-items/${item.id}/calculate-price`,
                    {
                        params: { quantity },
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (response.data.status === 'success') {
                    setCalculatedPrice(response.data.data);
                }
            } catch (err) {
                console.error('Price calculation failed:', err);
                // Fallback to simple calculation
                const fallbackAmount = quantity * item.value;
                setCalculatedPrice({
                    total_amount: fallbackAmount,
                    breakdown: {
                        unit_price: item.value,
                        quantity: quantity,
                        subtotal: fallbackAmount,
                    },
                    formula_used: `${quantity} × ₦${Number(item.value).toLocaleString()}`
                });
            }
        };

        calculatePrice();
    }, [selectedEservice, quantity, eserviceItems, token]);

    const handleQuickUse = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const payload = {
                token: tokenString,
                eservice_item_id: selectedEservice.value,
                identifier_type: selectedIdentifier ? selectedIdentifier.value : null,
                identifier_value: selectedIdentifier ? identifierValue : null,
            };

            // Add quantity if item requires it
            if (selectedItemDetails?.requires_quantity) {
                payload.quantity = parseFloat(quantity);
            }

            // Add pricing breakdown for audit trail
            if (calculatedPrice?.breakdown) {
                payload.pricing_breakdown = calculatedPrice.breakdown;
            }

            // Add calculated amount
            if (calculatedPrice?.total_amount) {
                payload.amount = calculatedPrice.total_amount;
            }

            await quickUseToken(token, agentId, payload);
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
                        onChange={(selectedOption) => {
                            setSelectedEservice(selectedOption);
                            setQuantity(1);
                            setCalculatedPrice(null);
                        }}
                        options={eserviceItems.map(item => {
                            let labelText = item.name;

                            if (item.has_variable_pricing && item.pricingRule) {
                                labelText += ` - ${item.pricingRule.description || 'Variable pricing'}`;
                            } else if (item.requires_quantity && item.quantity_unit) {
                                labelText += ` - ₦${Number(item.value).toLocaleString()} per ${item.quantity_unit}`;
                            } else {
                                labelText += ` - ₦${Number(item.value).toLocaleString()} (${item.category})`;
                            }

                            return { value: item.id, label: labelText };
                        })}
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

                {/* Generic quantity input - works for ALL items requiring quantity */}
                {selectedItemDetails?.requires_quantity && (
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-700">
                            {selectedItemDetails.quantity_label || 'Quantity'}
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                step="0.01"
                                min={selectedItemDetails.min_quantity || 0.01}
                                max={selectedItemDetails.max_quantity || undefined}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                placeholder={`Enter ${selectedItemDetails.quantity_unit || 'quantity'}`}
                            />
                            <span className="text-gray-600 font-semibold min-w-[80px]">
                                {selectedItemDetails.quantity_unit || 'units'}
                            </span>
                        </div>
                        {selectedItemDetails.min_quantity && (
                            <p className="mt-1 text-sm text-gray-500">
                                Minimum: {selectedItemDetails.min_quantity} {selectedItemDetails.quantity_unit}
                            </p>
                        )}
                    </div>
                )}

                {/* Price Preview - Shows for ALL items */}
                {calculatedPrice && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-semibold text-gray-700">
                                Calculated Amount:
                            </span>
                            <span className="text-2xl font-bold text-green-700">
                                ₦{Number(calculatedPrice.total_amount).toLocaleString()}
                            </span>
                        </div>

                        {/* Pricing Breakdown */}
                        {calculatedPrice.breakdown && calculatedPrice.breakdown.quantity > 1 && (
                            <div className="mt-3 pt-3 border-t border-green-200 text-sm space-y-1">
                                <div className="flex justify-between text-gray-600">
                                    <span>Unit Price:</span>
                                    <span>₦{Number(calculatedPrice.breakdown.unit_price).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Quantity:</span>
                                    <span>{calculatedPrice.breakdown.quantity} {selectedItemDetails?.quantity_unit}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-gray-700">
                                    <span>Subtotal:</span>
                                    <span>₦{Number(calculatedPrice.breakdown.subtotal).toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* Formula display for transparency */}
                        {calculatedPrice.formula_used && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                                <p className="text-xs text-gray-500 italic">
                                    Calculation: {calculatedPrice.formula_used}
                                </p>
                            </div>
                        )}
                    </div>
                )}

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
                        className={`px-5 py-3 rounded-lg text-white transition-all duration-200 ${loading || !selectedEservice || !tokenString || !calculatedPrice ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-900'}`}
                        onClick={handleQuickUse}
                        disabled={loading || !selectedEservice || !tokenString || !calculatedPrice}
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
