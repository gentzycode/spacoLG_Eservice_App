import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { createInvoiceV2 } from '../../../apis/invoiceAssessmentActions';
import { fetchRevenueHeads } from '../../../apis/revenueActions';
import {
    getIndividuals,
    getCorporates,
    getEnabledPaymentGateways
} from '../../../apis/authActions';
import IndividualModal from '../payerManagement/IndividualModalEnhanced';
import CorporateModal from '../payerManagement/CorporateModal';
import InvoicePaymentModal from '../InvoicePaymentModal';
import { toast } from 'react-toastify';
import { AiOutlineClose, AiOutlineUser, AiOutlineTeam, AiOutlinePlus } from 'react-icons/ai';

const CreateInvoiceV2Modal = ({ onClose, onSuccess, token: propToken }) => {
    const { token: contextToken } = useContext(AuthContext);
    const token = propToken || contextToken;

    // Payer Type Selection
    const [payerType, setPayerType] = useState('individual'); // individual, corporate, new_individual, new_corporate

    // Form Data
    const [formData, setFormData] = useState({
        payer_reference: '', // Will be individual_ref or corporate_ref
        payer_type: 'individual',
        payer_name: '',
        payer_phone: '',
        payer_email: '',
        payer_address: '',
        title: '',
        description: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: '',
        notes: '',
        items: [
            {
                revenue_head_id: '',
                tariff_id: '',
                description: '',
                quantity: 1,
                unit_price: 0,
            },
        ],
    });

    // Options Data
    const [revenueHeads, setRevenueHeads] = useState([]);
    const [individuals, setIndividuals] = useState([]);
    const [corporates, setCorporates] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    // State Management
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPayer, setSelectedPayer] = useState(null);

    // Modal State
    const [showIndividualModal, setShowIndividualModal] = useState(false);
    const [showCorporateModal, setShowCorporateModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [generatedInvoice, setGeneratedInvoice] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load revenue heads (required)
            try {
                const revenueResponse = await fetchRevenueHeads();
                const heads = revenueResponse?.data?.data || revenueResponse?.data || [];
                setRevenueHeads(Array.isArray(heads) ? heads : []);
                console.log('Revenue heads loaded:', heads.length);
            } catch (err) {
                console.error('Error loading revenue heads:', err);
                toast.error('Failed to load revenue heads');
            }

            // Load payment gateways (optional)
            try {
                const paymentGateways = await getEnabledPaymentGateways();
                setPaymentMethods(paymentGateways?.data || []);
                console.log('Payment methods loaded:', paymentGateways?.data?.length || 0);
            } catch (err) {
                console.error('Error loading payment gateways:', err);
                // Don't show error, payment modal is optional
            }

            // Load all payers for searching (optional)
            try {
                await loadPayers();
            } catch (err) {
                console.error('Error loading payers:', err);
                toast.warning('Could not load payers list. You can still create new payers.');
            }
        } catch (err) {
            console.error('Error in fetchInitialData:', err);
            setError('Failed to load form data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadPayers = async () => {
        try {
            await Promise.all([
                new Promise((resolve) => {
                    getIndividuals(token, (data) => {
                        setIndividuals(data || []);
                        resolve();
                    }, (err) => {
                        console.error('Error loading individuals:', err);
                        resolve();
                    }, () => {});
                }),
                new Promise((resolve) => {
                    getCorporates(token, (data) => {
                        setCorporates(data || []);
                        resolve();
                    }, (err) => {
                        console.error('Error loading corporates:', err);
                        resolve();
                    }, () => {});
                })
            ]);
        } catch (err) {
            console.error('Error loading payers:', err);
        }
    };

    const handlePayerTypeChange = (type) => {
        setPayerType(type);
        setFormData({
            ...formData,
            payer_reference: '',
            payer_type: type === 'corporate' || type === 'new_corporate' ? 'corporate' : 'individual',
            payer_name: '',
            payer_phone: '',
            payer_email: '',
            payer_address: ''
        });
        setSelectedPayer(null);
        setSearchResults([]);
    };

    const handleSearchPayer = (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
            setSearchResults([]);
            return;
        }

        const term = searchTerm.toLowerCase();
        let results = [];

        if (payerType === 'individual') {
            results = individuals.filter(ind =>
                ind.individual_ref?.toLowerCase().includes(term) ||
                ind.mobile_number?.toLowerCase().includes(term) ||
                ind.first_name?.toLowerCase().includes(term) ||
                ind.last_name?.toLowerCase().includes(term)
            ).slice(0, 5);
        } else if (payerType === 'corporate') {
            results = corporates.filter(corp =>
                corp.corporate_ref?.toLowerCase().includes(term) ||
                corp.phone_number?.toLowerCase().includes(term) ||
                corp.company_name?.toLowerCase().includes(term)
            ).slice(0, 5);
        }

        setSearchResults(results);
    };

    const handleSelectPayer = (payer) => {
        setSelectedPayer(payer);
        if (payerType === 'individual') {
            setFormData({
                ...formData,
                payer_reference: payer.individual_ref,
                payer_name: `${payer.first_name} ${payer.last_name}`,
                payer_phone: payer.mobile_number,
                payer_email: payer.email || '',
                payer_address: payer.address || '',
                payer_type: 'individual'
            });
        } else {
            setFormData({
                ...formData,
                payer_reference: payer.corporate_ref,
                payer_name: payer.company_name,
                payer_phone: payer.phone_number,
                payer_email: payer.email || '',
                payer_address: payer.address || '',
                payer_type: 'corporate'
            });
        }
        setSearchResults([]);
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });

        // Auto-search when typing reference
        if (field === 'payer_reference') {
            handleSearchPayer(value);
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData({ ...formData, items: updatedItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    revenue_head_id: '',
                    tariff_id: '',
                    description: '',
                    quantity: 1,
                    unit_price: 0,
                },
            ],
        });
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) {
            toast.error('At least one line item is required');
            return;
        }
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    const calculateItemSubtotal = (item) => {
        return Number(item.quantity) * Number(item.unit_price);
    };

    const calculateTotal = () => {
        return formData.items.reduce((total, item) => total + calculateItemSubtotal(item), 0);
    };

    const validateForm = () => {
        if (!selectedPayer) {
            toast.error('Please select a payer');
            return false;
        }
        if (!formData.payer_name.trim()) {
            toast.error('Payer name is required');
            return false;
        }
        if (!formData.payer_phone.trim()) {
            toast.error('Payer phone is required');
            return false;
        }
        if (!formData.title.trim()) {
            toast.error('Invoice title is required');
            return false;
        }
        if (!formData.due_date) {
            toast.error('Due date is required');
            return false;
        }
        if (formData.items.length === 0) {
            toast.error('At least one line item is required');
            return false;
        }
        for (let i = 0; i < formData.items.length; i++) {
            const item = formData.items[i];
            if (!item.description.trim()) {
                toast.error(`Item ${i + 1}: Description is required`);
                return false;
            }
            if (!item.revenue_head_id) {
                toast.error(`Item ${i + 1}: Revenue head is required`);
                return false;
            }
            if (Number(item.quantity) <= 0) {
                toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
                return false;
            }
            if (Number(item.unit_price) <= 0) {
                toast.error(`Item ${i + 1}: Unit price must be greater than 0`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSubmitting(true);
            setError(null);

            const response = await createInvoiceV2(token, formData, setError, setSubmitting);

            if (response && response.invoice) {
                toast.success(`Invoice ${response.invoice.invoice_number} created successfully!`);

                // Show payment modal immediately
                setGeneratedInvoice(response.invoice);
                setShowPaymentModal(true);
            } else {
                toast.success('Invoice created successfully');
                onSuccess();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create invoice');
            console.error('Error creating invoice:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        toast.success('Payment recorded successfully!');
        onSuccess();
        onClose();
    };

    const handlePaymentModalClose = () => {
        setShowPaymentModal(false);
        // Invoice created but payment deferred
        onSuccess();
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-6 flex justify-between items-center z-10">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Create Invoice
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Payer Type Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Select Payer Type *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handlePayerTypeChange('individual')}
                                    className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                                        payerType === 'individual'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <AiOutlineUser size={20} />
                                    <span className="font-medium">Existing Individual</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handlePayerTypeChange('corporate')}
                                    className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                                        payerType === 'corporate'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <AiOutlineTeam size={20} />
                                    <span className="font-medium">Existing Corporate</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setPayerType('new_individual');
                                        setShowIndividualModal(true);
                                    }}
                                    className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                                        payerType === 'new_individual'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-green-300 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <AiOutlinePlus size={20} />
                                    <span className="font-medium">New Individual</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setPayerType('new_corporate');
                                        setShowCorporateModal(true);
                                    }}
                                    className={`p-4 border-2 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                                        payerType === 'new_corporate'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-green-300 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <AiOutlinePlus size={20} />
                                    <span className="font-medium">New Corporate</span>
                                </button>
                            </div>
                        </div>

                        {/* Payer Search Fields (for existing payers) */}
                        {(payerType === 'individual' || payerType === 'corporate') && (
                            <div className="mb-6 space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {payerType === 'individual' ? 'Individual Reference or Phone *' : 'Corporate Reference or Phone *'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.payer_reference}
                                        onChange={(e) => handleChange('payer_reference', e.target.value)}
                                        placeholder={payerType === 'individual' ? 'Enter individual ref or phone...' : 'Enter corporate ref or phone...'}
                                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                    {/* Search Results Dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {searchResults.map((payer, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSelectPayer(payer)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                                                >
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {payerType === 'individual'
                                                            ? `${payer.first_name} ${payer.last_name}`
                                                            : payer.company_name
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        Ref: {payerType === 'individual' ? payer.individual_ref : payer.corporate_ref}
                                                        {' • '}
                                                        Phone: {payerType === 'individual' ? payer.mobile_number : payer.phone_number}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Payer Display */}
                                {selectedPayer && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-green-900 dark:text-green-100">
                                                    Selected: {formData.payer_name}
                                                </p>
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    Ref: {formData.payer_reference} • Phone: {formData.payer_phone}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPayer(null);
                                                    setFormData({
                                                        ...formData,
                                                        payer_reference: '',
                                                        payer_name: '',
                                                        payer_phone: '',
                                                        payer_email: '',
                                                        payer_address: ''
                                                    });
                                                }}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <AiOutlineClose size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payer Information (Read-only when selected) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Payer Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.payer_name}
                                    onChange={(e) => handleChange('payer_name', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    readOnly={!!selectedPayer}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Payer Phone *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.payer_phone}
                                    onChange={(e) => handleChange('payer_phone', e.target.value)}
                                    placeholder="080..."
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    readOnly={!!selectedPayer}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Payer Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.payer_email}
                                    onChange={(e) => handleChange('payer_email', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    readOnly={!!selectedPayer}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Payer Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.payer_address}
                                    onChange={(e) => handleChange('payer_address', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    readOnly={!!selectedPayer}
                                />
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Invoice Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows="2"
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Issue Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.issue_date}
                                    onChange={(e) => handleChange('issue_date', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Due Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => handleChange('due_date', e.target.value)}
                                    min={formData.issue_date}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Line Items
                                </h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
                                >
                                    + Add Item
                                </button>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                                            Item {index + 1}
                                        </h4>
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Description *
                                            </label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Revenue Head *
                                            </label>
                                            <select
                                                value={item.revenue_head_id}
                                                onChange={(e) => handleItemChange(index, 'revenue_head_id', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                required
                                            >
                                                <option value="">Select Revenue Head</option>
                                                {Array.isArray(revenueHeads) && revenueHeads.map((rh) => (
                                                    <option key={rh.id} value={rh.id}>
                                                        {rh.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                min="1"
                                                step="1"
                                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Unit Price (₦) *
                                            </label>
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Subtotal
                                            </label>
                                            <input
                                                type="text"
                                                value={`₦${calculateItemSubtotal(item).toLocaleString()}`}
                                                readOnly
                                                className="w-full px-3 py-2 border rounded-md bg-gray-200 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Amount */}
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Total Amount:
                                </span>
                                <span className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">
                                    ₦{calculateTotal().toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !selectedPayer}
                                className="px-6 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Creating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Individual Creation Modal */}
            {showIndividualModal && (
                <IndividualModal
                    closeModal={() => {
                        setShowIndividualModal(false);
                        if (payerType === 'new_individual') {
                            setPayerType('individual');
                        }
                    }}
                    individual={null}
                    viewMode={false}
                    onSave={async (id, payload) => {
                        await loadPayers();
                        setShowIndividualModal(false);
                        toast.success('Individual created! Please search and select them to continue.');
                        setPayerType('individual');
                    }}
                />
            )}

            {/* Corporate Creation Modal */}
            {showCorporateModal && (
                <CorporateModal
                    closeModal={() => {
                        setShowCorporateModal(false);
                        if (payerType === 'new_corporate') {
                            setPayerType('corporate');
                        }
                    }}
                    corporate={null}
                    viewMode={false}
                    onSave={async () => {
                        await loadPayers();
                        setShowCorporateModal(false);
                        toast.success('Corporate created! Please search and select them to continue.');
                        setPayerType('corporate');
                    }}
                />
            )}

            {/* Payment Modal */}
            {showPaymentModal && generatedInvoice && paymentMethods.length > 0 && (
                <InvoicePaymentModal
                    invoice={generatedInvoice}
                    paymentMethods={paymentMethods}
                    onClose={handlePaymentModalClose}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
};

export default CreateInvoiceV2Modal;
