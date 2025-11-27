import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import {
    generateInvoice,
    getEserviceItems,
    getIndividuals,
    getCorporates,
    getEnabledPaymentGateways
} from '../../../apis/authActions';
import IndividualModal from '../payerManagement/IndividualModalEnhanced';
import CorporateModal from '../payerManagement/CorporateModal';
import InvoicePaymentModal from '../InvoicePaymentModal';
import { toast } from 'react-toastify';
import { AiOutlineClose, AiOutlineUser, AiOutlineTeam, AiOutlinePlus } from 'react-icons/ai';

const CreateInvoiceModal = ({ onClose, onSuccess }) => {
    const { token } = useContext(AuthContext);

    // Payer Type Selection
    const [payerType, setPayerType] = useState('individual'); // individual, corporate, new_individual, new_corporate

    // Form Data
    const [formData, setFormData] = useState({
        eservice_item_id: '',
        payer_reference: '', // Will be individual_ref or corporate_ref
        payer_phone: '', // For searching by phone
        amount: '',
        purpose: '',
        description: '',
    });

    // Options Data
    const [eserviceItems, setEserviceItems] = useState([]);
    const [individuals, setIndividuals] = useState([]);
    const [corporates, setCorporates] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    // State Management
    const [loading, setLoading] = useState(false);
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
            const [items, paymentGateways] = await Promise.all([
                getEserviceItems(token),
                getEnabledPaymentGateways()
            ]);
            setEserviceItems(items || []);
            setPaymentMethods(paymentGateways?.data || []);

            // Load all payers for searching
            await loadPayers();
        } catch (err) {
            setError('Failed to load form data');
            console.error('Error loading data:', err);
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
        setFormData({ ...formData, payer_reference: '', payer_phone: '' });
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
            ).slice(0, 5); // Limit to 5 results
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
                payer_phone: payer.mobile_number
            });
        } else {
            setFormData({
                ...formData,
                payer_reference: payer.corporate_ref,
                payer_phone: payer.phone_number
            });
        }
        setSearchResults([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Auto-search when typing reference or phone
        if (name === 'payer_reference' || name === 'payer_phone') {
            handleSearchPayer(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Prepare invoice data based on payer type
            const invoiceData = {
                eservice_item_id: formData.eservice_item_id,
                amount: formData.amount,
                purpose: formData.purpose,
                description: formData.description,
            };

            // Add the appropriate identifier based on payer type
            if (payerType === 'individual') {
                invoiceData.identifier_id = 1; // Assuming 1 is for individual_ref
                invoiceData.reference_number = formData.payer_reference;
            } else if (payerType === 'corporate') {
                invoiceData.identifier_id = 2; // Assuming 2 is for corporate_ref
                invoiceData.reference_number = formData.payer_reference;
            }

            const response = await generateInvoice(
                token,
                invoiceData,
                () => {},
                setError,
                setLoading
            );

            if (response && response.invoice) {
                toast.success(`Invoice ${response.invoice.invoice_ref} generated successfully!`);

                // Show payment modal immediately
                setGeneratedInvoice(response.invoice);
                setShowPaymentModal(true);
            }
        } catch (err) {
            setError(err.message || 'Failed to create invoice');
            toast.error(err.message || 'Failed to create invoice');
        } finally {
            setLoading(false);
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
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Invoice</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Payer Type Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Select Payer Type
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
                            <div className="mb-4 space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {payerType === 'individual' ? 'Individual Reference or Phone' : 'Corporate Reference or Phone'}
                                    </label>
                                    <input
                                        type="text"
                                        name="payer_reference"
                                        value={formData.payer_reference}
                                        onChange={handleChange}
                                        placeholder={payerType === 'individual' ? 'Enter individual ref or phone...' : 'Enter corporate ref or phone...'}
                                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                    {/* Search Results Dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                                                    Selected: {payerType === 'individual'
                                                        ? `${selectedPayer.first_name} ${selectedPayer.last_name}`
                                                        : selectedPayer.company_name
                                                    }
                                                </p>
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    Ref: {payerType === 'individual' ? selectedPayer.individual_ref : selectedPayer.corporate_ref}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPayer(null);
                                                    setFormData({ ...formData, payer_reference: '', payer_phone: '' });
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

                        {/* Service Item */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Service Item
                            </label>
                            <select
                                name="eservice_item_id"
                                value={formData.eservice_item_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Service Item</option>
                                {eserviceItems.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Amount (₦)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        {/* Purpose */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Purpose
                            </label>
                            <input
                                type="text"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Market Fee, Parking Fee"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="Additional details about this invoice..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !selectedPayer}
                                className="px-5 py-2.5 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                            >
                                {loading ? 'Creating...' : 'Create Invoice'}
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
                        // The modal will handle the API call
                        // We just need to handle the success case
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

export default CreateInvoiceModal;
