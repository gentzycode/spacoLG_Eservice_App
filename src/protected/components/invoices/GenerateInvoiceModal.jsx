import React, { useContext, useEffect, useState } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import { getEserviceItems, generateInvoice } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import Confetti from 'react-confetti';
import Select from 'react-select';
import PayInvoiceModal from './PayInvoiceModal';

const GenerateInvoiceModal = ({ closeModal, defaultCategory, defaultReferenceNumber }) => {
    const { token } = useContext(AuthContext);
    const [category, setCategory] = useState(defaultCategory || { value: 'individual', label: 'Individual' });
    const [referenceNumber, setReferenceNumber] = useState(defaultReferenceNumber || '');
    const [eserviceItemId, setEserviceItemId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [payerInfo, setPayerInfo] = useState(null);
    const [eserviceItems, setEserviceItems] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);

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
        if (referenceNumber) fetchPayerInfo();
    }, [referenceNumber]);

    // Real-time price calculation when item or quantity changes
    useEffect(() => {
        const calculatePrice = async () => {
            if (!eserviceItemId) {
                setCalculatedPrice(null);
                setSelectedItemDetails(null);
                return;
            }

            const item = eserviceItems.find(i => i.id === eserviceItemId.value);
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
                        discount_amount: 0,
                        tax_amount: 0,
                    },
                    formula_used: `₦${Number(item.value).toLocaleString()}`
                });
                return;
            }

            // For quantity-based or formula-based items, call backend API
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
                } else {
                    setError('Failed to calculate price');
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
                        discount_amount: 0,
                        tax_amount: 0,
                    },
                    formula_used: `${quantity} × ₦${Number(item.value).toLocaleString()}`
                });
            }
        };

        calculatePrice();
    }, [eserviceItemId, quantity, eserviceItems, token]);

    const fetchPayerInfo = async () => {
        setLoading(true);
        try {
            const endpoint = category.value === 'individual'
                ? `/individuals/reference/${referenceNumber}`
                : `/corporates/reference/${referenceNumber}`;
            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
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
        try {
            const payload = {
                category: category.value,
                reference_number: referenceNumber,
                eservice_item_id: eserviceItemId?.value || null,
                amount: calculatedPrice?.total_amount || 0,
            };

            // Add quantity if item requires it
            if (selectedItemDetails?.requires_quantity) {
                payload.quantity = parseFloat(quantity);
            }

            // Add pricing breakdown for audit trail
            if (calculatedPrice?.breakdown) {
                payload.pricing_breakdown = calculatedPrice.breakdown;
            }

            await generateInvoice(
                token,
                payload,
                setInvoiceData,
                setError,
                setLoading
            );
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        } catch (err) {
            setError('Failed to generate invoice');
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = () => {
        setShowPayModal(true);
    };

    const customStyles = {
        control: provided => ({ ...provided, borderColor: '#3B78BD', '&:hover': { borderColor: '#3B78BD' }, boxShadow: 'none' }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3B78BD' : state.isFocused ? '#D1E9FF' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': { backgroundColor: '#D1E9FF', color: 'black' }
        }),
        singleValue: provided => ({ ...provided, color: '#3B78BD' })
    };

    const formatEserviceOptions = eserviceItems.map(item => {
        let labelText = item.name;

        // Use pricing rule description if available
        if (item.has_variable_pricing && item.pricingRule) {
            labelText += ` - ${item.pricingRule.description || item.pricingRule.getReadableDescription || 'Variable pricing'}`;
        } else if (item.requires_quantity && item.quantity_unit) {
            labelText += ` - ₦${Number(item.value).toLocaleString()} per ${item.quantity_unit}`;
        } else {
            labelText += ` - ₦${Number(item.value).toLocaleString()} (${item.category})`;
        }

        return { value: item.id, label: labelText };
    });

    return (
        <>
            <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '50' }}>
                {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 text-white rounded-t-lg">
                        <h2 className="text-xl font-bold">Generate Invoice</h2>
                        <button className="text-white" onClick={closeModal}><AiOutlineClose size={24} /></button>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-[#3B78BD]">Category</label>
                        <Select
                            styles={customStyles}
                            className="w-full"
                            value={category}
                            onChange={selected => { setCategory(selected); setReferenceNumber(''); setPayerInfo(null); }}
                            options={[{ value: 'individual', label: 'Individual' }, { value: 'corporate', label: 'Corporate' }]}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-[#3B78BD]">Reference Number</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                            value={referenceNumber}
                            onChange={e => setReferenceNumber(e.target.value)}
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
                        <label className="block mb-2 text-lg font-medium text-[#3B78BD]">E-Service Item</label>
                        <Select
                            styles={customStyles}
                            className="w-full"
                            value={eserviceItemId}
                            onChange={selected => { setEserviceItemId(selected); setQuantity(1); setCalculatedPrice(null); }}
                            options={formatEserviceOptions}
                        />
                    </div>

                    {/* Generic quantity input - works for ALL items requiring quantity */}
                    {selectedItemDetails?.requires_quantity && (
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-[#3B78BD]">
                                {selectedItemDetails.quantity_label || 'Quantity'}
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    step="0.01"
                                    min={selectedItemDetails.min_quantity || 0.01}
                                    max={selectedItemDetails.max_quantity || undefined}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
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
                                    {calculatedPrice.breakdown.discount_amount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount:</span>
                                            <span>-₦{Number(calculatedPrice.breakdown.discount_amount).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {calculatedPrice.breakdown.tax_amount > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax:</span>
                                            <span>₦{Number(calculatedPrice.breakdown.tax_amount).toLocaleString()}</span>
                                        </div>
                                    )}
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

                    {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    {invoiceData && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                            <p>Invoice generated successfully!</p>
                            <p><strong>Amount:</strong> ₦{Number(invoiceData.invoice.amount).toLocaleString()}</p>
                            <p><strong>Purpose:</strong> {invoiceData.invoice.purpose}</p>
                            <p><strong>Description:</strong> {invoiceData.invoice.description}</p>
                            <p><strong>Reference Number:</strong> {invoiceData.invoice.invoice_ref}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700" onClick={closeModal}>Close</button>
                        {!invoiceData ? (
                            <button
                                className="px-5 py-3 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-lg transition"
                                onClick={handleSubmit}
                                disabled={loading || !referenceNumber || !eserviceItemId || !calculatedPrice}
                            >
                                {loading ? 'Processing...' : 'Generate'}
                            </button>
                        ) : (
                            <button className="px-5 py-3 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-lg transition" onClick={handlePayNow}>
                                Pay Now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showPayModal && (
                <PayInvoiceModal
                    closeModal={() => setShowPayModal(false)}
                    referenceNumber={invoiceData?.invoice?.reference_number}
                />
            )}
        </>
    );
};

export default GenerateInvoiceModal;
