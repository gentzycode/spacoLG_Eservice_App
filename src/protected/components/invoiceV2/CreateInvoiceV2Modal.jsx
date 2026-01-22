import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { createInvoiceV2 } from '../../../apis/invoiceAssessmentActions';
import { fetchRevenueHeads } from '../../../apis/revenueActions';
import {
    getIndividuals,
    getCorporates,
    getEnabledPaymentGateways,
    createIndividual,
    createCorporate
} from '../../../apis/authActions';
import IndividualModal from '../payerManagement/IndividualModalEnhanced';
import CorporateModal from '../payerManagement/CorporateModal';
import InvoicePaymentModal from '../InvoicePaymentModal';
import TariffSelectorModal from './TariffSelectorModal';
import InvoicePrintModal from './InvoicePrintModal';
import { toast } from 'react-toastify';
import { AiOutlineClose, AiOutlineUser, AiOutlineTeam, AiOutlinePlus, AiOutlineCheckCircle, AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import { FaSearch, FaTrash, FaShoppingCart, FaFileInvoiceDollar, FaCreditCard, FaPrint } from 'react-icons/fa';

const CreateInvoiceV2Modal = ({ onClose, onSuccess, token: propToken }) => {
    const { token: contextToken } = useContext(AuthContext);
    const token = propToken || contextToken;

    // Wizard Step Management
    const [currentStep, setCurrentStep] = useState(1); // 1: Payer, 2: Tariffs, 3: Payment Options

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
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to tomorrow (+1 day)
        notes: '',
        items: [], // Start with empty items - user will add tariffs from selector
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
    const [showTariffSelector, setShowTariffSelector] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [generatedInvoice, setGeneratedInvoice] = useState(null);
    const [invoiceCreated, setInvoiceCreated] = useState(false);

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

    const handleSelectTariff = (tariff) => {
        // Add tariff as a new line item with all data pre-populated
        const newItem = {
            revenue_head_id: tariff.revenue_head_id,
            tariff_id: tariff.id,
            description: tariff.purpose,
            quantity: 1,
            unit_price: Number(tariff.amount),
            tariff_name: tariff.purpose,
            revenue_head_name: tariff.revenueHead?.name || '',
            category: tariff.category,
            monnify_product_code: tariff.monnify_product_code || '',
        };

        setFormData({
            ...formData,
            items: [...formData.items, newItem],
        });

        toast.success(`Added: ${tariff.purpose}`);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData({ ...formData, items: updatedItems });
    };

    const removeItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
        if (updatedItems.length === 0) {
            toast.info('Add at least one tariff to proceed');
        }
    };

    const calculateItemSubtotal = (item) => {
        return Number(item.quantity) * Number(item.unit_price);
    };

    const calculateTotal = () => {
        return formData.items.reduce((total, item) => total + calculateItemSubtotal(item), 0);
    };

    // Auto-generate invoice title from tariffs
    const generateInvoiceTitle = () => {
        if (formData.items.length === 0) return 'Invoice';
        if (formData.items.length === 1) return formData.items[0].tariff_name || formData.items[0].description;
        return `Invoice for ${formData.items.length} items`;
    };

    const generateInvoiceDescription = () => {
        return formData.items.map(item => item.tariff_name || item.description).join(', ');
    };

    const validateStep1 = () => {
        if (!selectedPayer) {
            toast.error('Please select a payer to continue');
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
        return true;
    };

    const validateStep2 = () => {
        if (formData.items.length === 0) {
            toast.error('Please add at least one tariff to the invoice');
            return false;
        }
        if (!formData.due_date) {
            toast.error('Due date is required');
            return false;
        }
        // Validate each item
        for (let i = 0; i < formData.items.length; i++) {
            const item = formData.items[i];
            if (Number(item.quantity) <= 0) {
                toast.error(`Tariff ${i + 1}: Quantity must be at least 1`);
                return false;
            }
        }
        return true;
    };

    const handleNextStep = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCreateInvoice = async (payNow = false) => {
        try {
            setSubmitting(true);
            setError(null);

            // Auto-generate title and description
            const submissionData = {
                ...formData,
                title: generateInvoiceTitle(),
                description: generateInvoiceDescription(),
            };

            const response = await createInvoiceV2(token, submissionData, setError, setSubmitting);

            if (response && response.invoice) {
                setGeneratedInvoice(response.invoice);
                setInvoiceCreated(true);
                toast.success(`Invoice ${response.invoice.invoice_number} created successfully!`);

                if (payNow) {
                    // Show payment modal
                    setShowPaymentModal(true);
                }
            } else {
                toast.success('Invoice created successfully');
                onSuccess();
                onClose();
            }
        } catch (err) {
            // Display detailed validation errors
            const errorMessage = err?.message || err?.errors
                ? (typeof err.errors === 'object'
                    ? Object.values(err.errors).flat().join('\n')
                    : err.message)
                : 'Failed to create invoice';
            toast.error(errorMessage, { autoClose: 8000 });
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

    const handlePrintInvoice = () => {
        setShowPrintModal(true);
    };

    // Wizard Step Indicator
    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                            currentStep >= step
                                ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white shadow-lg scale-110'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                            {currentStep > step ? <AiOutlineCheckCircle size={24} /> : step}
                        </div>
                        <p className={`mt-2 text-xs font-semibold ${
                            currentStep >= step
                                ? 'text-[#0d544c] dark:text-[#3B78BD]'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            {step === 1 ? 'Select Payer' : step === 2 ? 'Add Tariffs' : 'Payment Options'}
                        </p>
                    </div>
                    {index < 2 && (
                        <div className={`w-16 sm:w-24 h-1 mx-2 transition-all duration-300 ${
                            currentStep > step
                                ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD]'
                                : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full ${
                    searchResults.length > 0 && currentStep === 1
                        ? 'min-h-[70vh]' // Ensure enough space when search results are visible
                        : 'max-h-[90vh]'
                } my-4 overflow-hidden flex flex-col`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] p-6 flex justify-between items-center flex-shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                <FaFileInvoiceDollar size={28} />
                                <span>Create New Invoice</span>
                            </h2>
                            <p className="text-gray-100 text-sm mt-1">
                                {currentStep === 1 && 'Step 1: Select or create a payer'}
                                {currentStep === 2 && 'Step 2: Add tariffs and set due date'}
                                {currentStep === 3 && 'Step 3: Choose payment or print option'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 flex-shrink-0">
                            {error}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-6 relative">
                        {/* Step Indicator */}
                        <StepIndicator />

                        {/* STEP 1: PAYER SELECTION */}
                        {currentStep === 1 && (
                            <div className="animate-fadeIn">
                                {/* Payer Type Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Select Payer Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handlePayerTypeChange('individual')}
                                            className={`p-4 border-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                                                payerType === 'individual'
                                                    ? 'border-[#0d544c] bg-[#0d544c]/10 dark:bg-[#0d544c]/20 text-[#0d544c] dark:text-[#3B78BD] shadow-md'
                                                    : 'border-gray-300 dark:border-gray-600 hover:border-[#0d544c] text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            <AiOutlineUser size={20} />
                                            <span className="font-medium">Existing Individual</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handlePayerTypeChange('corporate')}
                                            className={`p-4 border-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                                                payerType === 'corporate'
                                                    ? 'border-[#0d544c] bg-[#0d544c]/10 dark:bg-[#0d544c]/20 text-[#0d544c] dark:text-[#3B78BD] shadow-md'
                                                    : 'border-gray-300 dark:border-gray-600 hover:border-[#0d544c] text-gray-700 dark:text-gray-300'
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
                                            className={`p-4 border-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                                                payerType === 'new_individual'
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-md'
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
                                            className={`p-4 border-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                                                payerType === 'new_corporate'
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-md'
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
                                    <div className={`space-y-4 ${searchResults.length > 0 ? 'mb-80' : 'mb-6'}`}>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {payerType === 'individual' ? 'Search Individual (Ref, Name, or Phone) *' : 'Search Corporate (Ref, Name, or Phone) *'}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.payer_reference}
                                                onChange={(e) => handleChange('payer_reference', e.target.value)}
                                                placeholder={payerType === 'individual' ? 'Type to search individuals...' : 'Type to search corporates...'}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c]"
                                                required
                                            />

                                            {/* Search Results Dropdown */}
                                            {searchResults.length > 0 && (
                                                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-700 border-2 border-[#0d544c] dark:border-[#3B78BD] rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-fadeIn">
                                                    <div className="sticky top-0 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] px-4 py-2 text-white text-sm font-semibold rounded-t-xl">
                                                        {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                                                    </div>
                                                    {searchResults.map((payer, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => handleSelectPayer(payer)}
                                                            className="w-full px-4 py-3 text-left hover:bg-[#0d544c]/10 dark:hover:bg-[#3B78BD]/20 border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-all duration-200"
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
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fadeIn">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-start space-x-3">
                                                        <AiOutlineCheckCircle className="text-green-600 dark:text-green-400 mt-1" size={24} />
                                                        <div>
                                                            <p className="font-semibold text-green-900 dark:text-green-100">
                                                                {formData.payer_name}
                                                            </p>
                                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                                Ref: {formData.payer_reference} • Phone: {formData.payer_phone}
                                                            </p>
                                                            {formData.payer_email && (
                                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                                    Email: {formData.payer_email}
                                                                </p>
                                                            )}
                                                        </div>
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
                                                        className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
                                                    >
                                                        <AiOutlineClose size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 2: TARIFF SELECTION */}
                        {currentStep === 2 && (
                            <div className="animate-fadeIn">
                                {/* Due Date */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Invoice Dates
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                Issue Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.issue_date}
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                                                readOnly
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-set to today</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                Due Date *
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.due_date}
                                                onChange={(e) => handleChange('due_date', e.target.value)}
                                                min={formData.issue_date}
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c]"
                                                required
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">When payment is due</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tariffs/Line Items */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                                                <FaShoppingCart />
                                                <span>Selected Tariffs</span>
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Browse and add tariffs from the system
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowTariffSelector(true)}
                                            className="px-5 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-semibold"
                                        >
                                            <FaSearch size={16} />
                                            <span>Browse Tariffs</span>
                                        </button>
                                    </div>

                                    {formData.items.length === 0 ? (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                                            <FaShoppingCart className="mx-auto text-gray-400 mb-3" size={48} />
                                            <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">No tariffs added yet</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                                                Click "Browse Tariffs" to select tariffs from the system
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setShowTariffSelector(true)}
                                                className="px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2 font-semibold"
                                            >
                                                <FaSearch size={16} />
                                                <span>Browse Tariffs</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {formData.items.map((item, index) => (
                                                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-200">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-start gap-3 mb-3">
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                                                        {item.description || item.tariff_name}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {item.revenue_head_name || 'N/A'}
                                                                    </p>
                                                                    {item.category && (
                                                                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                                            item.category === 'One-Off'
                                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                        }`}>
                                                                            {item.category}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(index)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                                                                    title="Remove tariff"
                                                                >
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-3 gap-4">
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        Quantity
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                                        min="1"
                                                                        step="1"
                                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c]"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        Unit Price
                                                                    </label>
                                                                    <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold">
                                                                        ₦{Number(item.unit_price).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                        Subtotal
                                                                    </label>
                                                                    <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white font-bold">
                                                                        ₦{calculateItemSubtotal(item).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Total Amount */}
                                {formData.items.length > 0 && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-xl border-2 border-[#0d544c] dark:border-[#3B78BD]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                                Total Amount:
                                            </span>
                                            <span className="text-3xl font-bold text-[#0d544c] dark:text-[#3B78BD]">
                                                ₦{calculateTotal().toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => handleChange('notes', e.target.value)}
                                        rows="3"
                                        placeholder="Add any additional notes or instructions..."
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PAYMENT OPTIONS */}
                        {currentStep === 3 && !invoiceCreated && (
                            <div className="animate-fadeIn">
                                <div className="text-center mb-8">
                                    <FaFileInvoiceDollar className="mx-auto text-[#0d544c] dark:text-[#3B78BD] mb-4" size={64} />
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Review Invoice Summary
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Choose how you'd like to proceed with this invoice
                                    </p>
                                </div>

                                {/* Invoice Summary */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-600">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Payer</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{formData.payer_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{formData.payer_phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Issue Date</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{formData.issue_date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{formData.due_date}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{formData.items.length}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">Total Amount</p>
                                            <p className="text-2xl font-bold text-[#0d544c] dark:text-[#3B78BD]">
                                                ₦{calculateTotal().toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleCreateInvoice(true)}
                                        disabled={submitting}
                                        className="p-6 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-xl hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50"
                                    >
                                        <FaCreditCard className="text-green-600 dark:text-green-400 mb-3" size={32} />
                                        <h4 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                                            Pay Now
                                        </h4>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Create invoice and proceed to payment immediately
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleCreateInvoice(false)}
                                        disabled={submitting}
                                        className="p-6 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50"
                                    >
                                        <FaPrint className="text-blue-600 dark:text-blue-400 mb-3" size={32} />
                                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">
                                            Generate & Print
                                        </h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Create invoice for later payment (can be printed)
                                        </p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Success State after Invoice Created */}
                        {currentStep === 3 && invoiceCreated && !showPaymentModal && (
                            <div className="animate-fadeIn text-center py-8">
                                <AiOutlineCheckCircle className="mx-auto text-green-600 dark:text-green-400 mb-4" size={80} />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Invoice Created Successfully!
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Invoice {generatedInvoice?.invoice_number} has been created
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handlePrintInvoice}
                                        className="px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-semibold"
                                    >
                                        <FaPrint />
                                        <span>Download PDF</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onSuccess();
                                            onClose();
                                        }}
                                        className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Navigation */}
                    {!invoiceCreated && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center space-x-2"
                            >
                                <AiOutlineArrowLeft />
                                <span>Previous</span>
                            </button>

                            {currentStep < 3 && (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center space-x-2"
                                >
                                    <span>Next</span>
                                    <AiOutlineArrowRight />
                                </button>
                            )}

                            {currentStep === 3 && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    )}
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
                        try {
                            // Call the API to create the individual
                            const response = await createIndividual(token, payload);

                            // Reload the payers list
                            await loadPayers();

                            // Auto-select the newly created individual
                            if (response && response.individual_ref) {
                                const newIndividual = response;
                                setSelectedPayer(newIndividual);
                                setFormData({
                                    ...formData,
                                    payer_reference: newIndividual.individual_ref,
                                    payer_name: `${newIndividual.first_name} ${newIndividual.last_name}`,
                                    payer_phone: newIndividual.mobile_number || '',
                                    payer_email: newIndividual.email || '',
                                    payer_address: newIndividual.address || '',
                                    payer_type: 'individual'
                                });
                                toast.success('Individual created and selected! You can now proceed to add tariffs.');
                            }

                            // Close modal and show success
                            setShowIndividualModal(false);
                            setPayerType('individual');
                        } catch (error) {
                            // Error will be thrown back to the modal to display
                            throw error;
                        }
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
                    onSave={async (response) => {
                        // CorporateModal handles the API call internally and passes the response
                        // Reload payers list
                        await loadPayers();

                        // Auto-select the newly created corporate
                        if (response && response.corporate_ref) {
                            const newCorporate = response;
                            setSelectedPayer(newCorporate);
                            setFormData({
                                ...formData,
                                payer_reference: newCorporate.corporate_ref,
                                payer_name: newCorporate.company_name,
                                payer_phone: newCorporate.phone_number || '',
                                payer_email: newCorporate.email || '',
                                payer_address: newCorporate.address || '',
                                payer_type: 'corporate'
                            });
                            toast.success('Corporate created and selected! You can now proceed to add tariffs.');
                        }

                        setShowCorporateModal(false);
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

            {/* Tariff Selector Modal */}
            {showTariffSelector && (
                <TariffSelectorModal
                    onClose={() => setShowTariffSelector(false)}
                    onSelectTariff={handleSelectTariff}
                />
            )}

            {/* Invoice Print Modal */}
            {showPrintModal && generatedInvoice && (
                <InvoicePrintModal
                    invoice={generatedInvoice}
                    onClose={() => {
                        setShowPrintModal(false);
                        onSuccess();
                        onClose();
                    }}
                />
            )}

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default CreateInvoiceV2Modal;
