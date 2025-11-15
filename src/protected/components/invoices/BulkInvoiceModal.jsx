import React, { useContext, useEffect, useState } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import { getEserviceItems } from '../../../apis/authActions';
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai';
import Select from 'react-select';

const BulkInvoiceModal = ({ closeModal, selectedPayers, payerType }) => {
    const { token } = useContext(AuthContext);
    const [eserviceItemId, setEserviceItemId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(null);
    const [sameQuantityForAll, setSameQuantityForAll] = useState(true);
    const [individualQuantities, setIndividualQuantities] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eserviceItems, setEserviceItems] = useState([]);
    const [successCount, setSuccessCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
    const [processing, setProcessing] = useState(false);

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

    // Initialize individual quantities
    useEffect(() => {
        const initialQuantities = {};
        selectedPayers.forEach(payer => {
            initialQuantities[payer.id] = 1;
        });
        setIndividualQuantities(initialQuantities);
    }, [selectedPayers]);

    // Real-time price calculation for preview
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
    }, [eserviceItemId, quantity, eserviceItems, token]);

    const handleBulkGenerate = async () => {
        setProcessing(true);
        setError(null);
        let successCount = 0;
        let failedCount = 0;

        for (const payer of selectedPayers) {
            try {
                const qty = sameQuantityForAll ? quantity : (individualQuantities[payer.id] || 1);

                // Calculate price for this payer
                let priceData = calculatedPrice;
                if (!sameQuantityForAll && selectedItemDetails?.requires_quantity) {
                    const response = await axios.get(
                        `/auth/eservice-items/${selectedItemDetails.id}/calculate-price`,
                        {
                            params: { quantity: qty },
                            headers: { 'Authorization': `Bearer ${token}` }
                        }
                    );
                    priceData = response.data.data;
                }

                const payload = {
                    category: payerType,
                    reference_number: payer.individual_ref || payer.corporate_ref,
                    eservice_item_id: eserviceItemId?.value || null,
                    amount: priceData?.total_amount || 0,
                };

                if (selectedItemDetails?.requires_quantity) {
                    payload.quantity = parseFloat(qty);
                }

                if (priceData?.breakdown) {
                    payload.pricing_breakdown = priceData.breakdown;
                }

                await axios.post('/auth/invoices', payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                successCount++;
            } catch (err) {
                console.error(`Failed to generate invoice for payer ${payer.id}:`, err);
                failedCount++;
            }
        }

        setSuccessCount(successCount);
        setFailedCount(failedCount);
        setProcessing(false);
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

        if (item.has_variable_pricing && item.pricingRule) {
            labelText += ` - ${item.pricingRule.description || 'Variable pricing'}`;
        } else if (item.requires_quantity && item.quantity_unit) {
            labelText += ` - ₦${Number(item.value).toLocaleString()} per ${item.quantity_unit}`;
        } else {
            labelText += ` - ₦${Number(item.value).toLocaleString()} (${item.category})`;
        }

        return { value: item.id, label: labelText };
    });

    return (
        <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '50' }}>
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 text-white rounded-t-lg">
                    <h2 className="text-xl font-bold">Bulk Generate Invoices ({selectedPayers.length} Payers)</h2>
                    <button className="text-white" onClick={closeModal}><AiOutlineClose size={24} /></button>
                </div>

                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-800">
                        <strong>Selected Payers:</strong> {selectedPayers.length} {payerType === 'individual' ? 'individuals' : 'corporates'}
                    </p>
                    <div className="mt-2 max-h-32 overflow-y-auto">
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                            {selectedPayers.slice(0, 10).map(payer => (
                                <li key={payer.id}>
                                    {payer.first_name ? `${payer.first_name} ${payer.last_name}` : payer.company_name}
                                    {' - '}
                                    <span className="text-gray-500">{payer.individual_ref || payer.corporate_ref}</span>
                                </li>
                            ))}
                            {selectedPayers.length > 10 && (
                                <li className="text-gray-500">... and {selectedPayers.length - 10} more</li>
                            )}
                        </ul>
                    </div>
                </div>

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

                {selectedItemDetails?.requires_quantity && (
                    <>
                        <div className="mb-6">
                            <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sameQuantityForAll}
                                    onChange={(e) => setSameQuantityForAll(e.target.checked)}
                                    className="w-4 h-4 text-[#3B78BD]"
                                />
                                <span>Same quantity for all payers</span>
                            </label>
                        </div>

                        {sameQuantityForAll ? (
                            <div className="mb-6">
                                <label className="block mb-2 text-lg font-medium text-[#3B78BD]">
                                    {selectedItemDetails.quantity_label || 'Quantity'}
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={selectedItemDetails.min_quantity || 0.01}
                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        placeholder={`Enter ${selectedItemDetails.quantity_unit || 'quantity'}`}
                                    />
                                    <span className="text-gray-600 font-semibold min-w-[80px]">
                                        {selectedItemDetails.quantity_unit || 'units'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 max-h-64 overflow-y-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Payer</th>
                                            <th className="px-4 py-2 text-right">{selectedItemDetails.quantity_label || 'Quantity'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPayers.map(payer => (
                                            <tr key={payer.id} className="border-t">
                                                <td className="px-4 py-2">
                                                    {payer.first_name ? `${payer.first_name} ${payer.last_name}` : payer.company_name}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min={selectedItemDetails.min_quantity || 0.01}
                                                        className="w-full p-2 border rounded"
                                                        value={individualQuantities[payer.id] || 1}
                                                        onChange={e => setIndividualQuantities({
                                                            ...individualQuantities,
                                                            [payer.id]: e.target.value
                                                        })}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {calculatedPrice && sameQuantityForAll && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-semibold text-gray-700">
                                Price per Payer:
                            </span>
                            <span className="text-2xl font-bold text-green-700">
                                ₦{Number(calculatedPrice.total_amount).toLocaleString()}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                            <strong>Total for all {selectedPayers.length} payers:</strong> ₦{Number(calculatedPrice.total_amount * selectedPayers.length).toLocaleString()}
                        </div>
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

                {(successCount > 0 || failedCount > 0) && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <p className="text-green-800 font-semibold flex items-center">
                            <AiOutlineCheck className="mr-2" /> Bulk Invoice Generation Complete!
                        </p>
                        <div className="mt-2 text-sm">
                            <p className="text-green-700">✓ Success: {successCount} invoices generated</p>
                            {failedCount > 0 && (
                                <p className="text-red-700">✗ Failed: {failedCount} invoices</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                    <button
                        className="px-5 py-3 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={handleBulkGenerate}
                        disabled={processing || !eserviceItemId || !calculatedPrice}
                    >
                        {processing ? `Processing... (${successCount}/${selectedPayers.length})` : 'Generate All Invoices'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkInvoiceModal;
