import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import {
    FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaCheckCircle,
    FaExclamationTriangle, FaDollarSign, FaMoneyBillWave,
    FaChartLine, FaToggleOn, FaToggleOff, FaSearch, FaFilter,
    FaListAlt, FaThLarge, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { MdCategory, MdTrendingUp } from 'react-icons/md';
import { BsGraphUpArrow } from 'react-icons/bs';
import InitLoader from '../../../common/InitLoader';

const PricingManagement = () => {
    const { token } = useContext(AuthContext);
    const [eserviceItems, setEserviceItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [pricingRules, setPricingRules] = useState([]);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [showTariffModal, setShowTariffModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [editingTariff, setEditingTariff] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [filterCategory, setFilterCategory] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // 12 items per page for grid view

    // Statistics
    const [statistics, setStatistics] = useState({
        totalTariffs: 0,
        activeTariffs: 0,
        totalRevenue: 0,
        categories: []
    });

    // Form state for pricing rule
    const [ruleForm, setRuleForm] = useState({
        pricing_type: 'fixed',
        fixed_price: '',
        unit_price: '',
        unit_type: '',
        min_quantity: '',
        max_quantity: '',
        pricing_formula: '',
        formula_variables: {},
        tier_breakpoints: [],
        conditions: [],
        description: '',
        is_active: true,
        effective_from: '',
        effective_to: ''
    });

    // Form state for tariff/e-service item
    const [tariffForm, setTariffForm] = useState({
        name: '',
        category: '',
        value: '',
        has_variable_pricing: false,
        description: '',
        is_active: true
    });

    // Fetch all e-service items on mount
    useEffect(() => {
        fetchEserviceItems();
    }, []);

    // Update statistics when eserviceItems change
    useEffect(() => {
        calculateStatistics();
    }, [eserviceItems]);

    // Filter items based on search and category
    useEffect(() => {
        let filtered = eserviceItems;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(item => item.category === filterCategory);
        }

        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, filterCategory, eserviceItems]);

    const calculateStatistics = () => {
        const totalTariffs = eserviceItems.length;
        const activeTariffs = eserviceItems.filter(item => item.is_active !== false).length;
        const totalRevenue = eserviceItems.reduce((sum, item) => {
            return sum + (parseFloat(item.value) || 0);
        }, 0);

        // Get unique categories
        const categorySet = new Set(eserviceItems.map(item => item.category).filter(Boolean));
        const categories = Array.from(categorySet);

        setStatistics({
            totalTariffs,
            activeTariffs,
            totalRevenue,
            categories
        });
    };

    const fetchEserviceItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/eservice-items', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const items = response.data.data || response.data || [];
            setEserviceItems(items);
            setFilteredItems(items);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching e-service items:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch e-service items';
            setError(`Error: ${errorMessage}. Please check if you have the required permissions or contact your administrator.`);
            setEserviceItems([]);
            setFilteredItems([]);
            setLoading(false);
        }
    };

    const fetchPricingRules = async (itemId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/eservice-items/${itemId}/pricing-rules`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPricingRules(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch pricing rules:', err);
            setPricingRules([]);
            setLoading(false);
        }
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        fetchPricingRules(item.id);
        setError(null);
        setSuccess(null);

        // Scroll to pricing rules section
        setTimeout(() => {
            const rulesSection = document.getElementById('pricing-rules-section');
            if (rulesSection) {
                rulesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleAddTariff = () => {
        setEditingTariff(null);
        setTariffForm({
            name: '',
            category: '',
            value: '',
            has_variable_pricing: false,
            description: '',
            is_active: true
        });
        setShowTariffModal(true);
    };

    const handleEditTariff = (item) => {
        setEditingTariff(item);
        setTariffForm({
            name: item.name || '',
            category: item.category || '',
            value: item.value || '',
            has_variable_pricing: item.has_variable_pricing || false,
            description: item.description || '',
            is_active: item.is_active !== false
        });
        setShowTariffModal(true);
    };

    const handleSaveTariff = async () => {
        setLoading(true);
        setError(null);

        try {
            if (editingTariff) {
                // Update existing tariff
                await axios.put(
                    `/eservice-items/${editingTariff.id}`,
                    tariffForm,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                setSuccess('Tariff updated successfully!');
            } else {
                // Create new tariff
                await axios.post(
                    '/eservice-items',
                    tariffForm,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                setSuccess('Tariff created successfully!');
            }

            await fetchEserviceItems();
            setShowTariffModal(false);
            setLoading(false);

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save tariff');
            setLoading(false);
        }
    };

    const handleDeleteTariff = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this tariff? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(
                `/eservice-items/${itemId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setSuccess('Tariff deleted successfully!');
            await fetchEserviceItems();
            setLoading(false);

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete tariff');
            setLoading(false);
        }
    };

    const handleAddRule = () => {
        setEditingRule(null);
        setRuleForm({
            pricing_type: 'fixed',
            fixed_price: '',
            unit_price: '',
            unit_type: '',
            min_quantity: '',
            max_quantity: '',
            pricing_formula: '',
            formula_variables: {},
            tier_breakpoints: [],
            conditions: [],
            description: '',
            is_active: true,
            effective_from: '',
            effective_to: ''
        });
        setShowRuleModal(true);
    };

    const handleEditRule = (rule) => {
        setEditingRule(rule);
        setRuleForm({
            pricing_type: rule.pricing_type,
            fixed_price: rule.fixed_price || '',
            unit_price: rule.unit_price || '',
            unit_type: rule.unit_type || '',
            min_quantity: rule.min_quantity || '',
            max_quantity: rule.max_quantity || '',
            pricing_formula: rule.pricing_formula || '',
            formula_variables: rule.formula_variables || {},
            tier_breakpoints: rule.tier_breakpoints || [],
            conditions: rule.conditions || [],
            description: rule.description || '',
            is_active: rule.is_active,
            effective_from: rule.effective_from || '',
            effective_to: rule.effective_to || ''
        });
        setShowRuleModal(true);
    };

    const handleSaveRule = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...ruleForm,
                eservice_item_id: selectedItem.id
            };

            if (editingRule) {
                await axios.put(
                    `/eservice-items/${selectedItem.id}/pricing-rules/${editingRule.id}`,
                    payload,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                setSuccess('Pricing rule updated successfully!');
            } else {
                await axios.post(
                    `/eservice-items/${selectedItem.id}/pricing-rules`,
                    payload,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                setSuccess('Pricing rule created successfully!');
            }

            await fetchPricingRules(selectedItem.id);
            setShowRuleModal(false);
            setLoading(false);

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save pricing rule');
            setLoading(false);
        }
    };

    const handleDeleteRule = async (ruleId) => {
        if (!window.confirm('Are you sure you want to delete this pricing rule?')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(
                `/eservice-items/${selectedItem.id}/pricing-rules/${ruleId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setSuccess('Pricing rule deleted successfully!');
            await fetchPricingRules(selectedItem.id);
            setLoading(false);

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete pricing rule');
            setLoading(false);
        }
    };

    const addFormulaVariable = () => {
        const key = prompt('Enter variable name (e.g., rate_per_naira):');
        const value = prompt('Enter variable value (e.g., 0.25):');
        if (key && value) {
            setRuleForm({
                ...ruleForm,
                formula_variables: {
                    ...ruleForm.formula_variables,
                    [key]: parseFloat(value)
                }
            });
        }
    };

    const removeFormulaVariable = (key) => {
        const newVars = { ...ruleForm.formula_variables };
        delete newVars[key];
        setRuleForm({ ...ruleForm, formula_variables: newVars });
    };

    const addTierBreakpoint = () => {
        setRuleForm({
            ...ruleForm,
            tier_breakpoints: [
                ...ruleForm.tier_breakpoints,
                { from: 0, to: 100, rate: 0 }
            ]
        });
    };

    const updateTierBreakpoint = (index, field, value) => {
        const newTiers = [...ruleForm.tier_breakpoints];
        newTiers[index][field] = parseFloat(value) || 0;
        setRuleForm({ ...ruleForm, tier_breakpoints: newTiers });
    };

    const removeTierBreakpoint = (index) => {
        const newTiers = ruleForm.tier_breakpoints.filter((_, i) => i !== index);
        setRuleForm({ ...ruleForm, tier_breakpoints: newTiers });
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            <div className="w-full p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className='flex space-x-2 items-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                            <FaDollarSign size={30} className='text-[#0d544c]' />
                            <span>Tariffs & Pricing Management</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 ml-10">
                            Comprehensive tariff management with advanced pricing rules
                        </p>
                    </div>
                    <button
                        onClick={handleAddTariff}
                        className="mt-4 md:mt-0 flex items-center space-x-2 py-3 px-6 rounded-md bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#3B78BD] hover:to-[#0d544c] text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <FaPlus />
                        <span>Add New Tariff</span>
                    </button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-[#0d544c] rounded flex items-center animate-slideIn">
                        <FaCheckCircle className="text-[#0d544c] mr-3" size={20} />
                        <span className="text-[#0d544c] dark:text-green-400">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-[#f06752] rounded flex items-center animate-slideIn">
                        <FaExclamationTriangle className="text-[#f06752] mr-3" size={20} />
                        <span className="text-[#f06752] dark:text-red-400">{error}</span>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Tariffs */}
                    <div className="bg-gradient-to-br from-[#0d544c] to-[#2b7d54] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Total Tariffs</p>
                                <h3 className="text-3xl font-bold mt-2">{statistics.totalTariffs}</h3>
                                <p className="text-white/60 text-xs mt-1">All e-services</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaListAlt size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Active Tariffs */}
                    <div className="bg-gradient-to-br from-[#3B78BD] to-[#5a9ad6] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Active Tariffs</p>
                                <h3 className="text-3xl font-bold mt-2">{statistics.activeTariffs}</h3>
                                <p className="text-white/60 text-xs mt-1">Currently enabled</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaToggleOn size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Total Base Revenue */}
                    <div className="bg-gradient-to-br from-[#F0B652] to-[#f5c976] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Total Base Value</p>
                                <h3 className="text-3xl font-bold mt-2">₦{statistics.totalRevenue.toLocaleString()}</h3>
                                <p className="text-white/60 text-xs mt-1">Combined tariff values</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaMoneyBillWave size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-gradient-to-br from-[#f06752] to-[#f58775] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Categories</p>
                                <h3 className="text-3xl font-bold mt-2">{statistics.categories.length}</h3>
                                <p className="text-white/60 text-xs mt-1">Service categories</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <MdCategory size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search, Filter, and View Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tariffs by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center space-x-2">
                            <FaFilter className="text-gray-400" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                            >
                                <option value="all">All Categories</option>
                                {statistics.categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-[#0d544c] text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <FaThLarge size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-[#0d544c] text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <FaListAlt size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tariffs Display */}
                {loading && filteredItems.length === 0 ? (
                    <InitLoader />
                ) : filteredItems.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <FaDollarSign className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={60} />
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                            {searchTerm || filterCategory !== 'all' ? 'No tariffs match your search' : 'No tariffs configured'}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            {searchTerm || filterCategory !== 'all' ? 'Try adjusting your filters' : 'Click "Add New Tariff" to create your first tariff'}
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <>
                        {/* Grid View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentItems.map(item => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                            >
                                <div className={`h-2 ${item.has_variable_pricing ? 'bg-gradient-to-r from-[#F0B652] to-[#f5c976]' : 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD]'}`}></div>
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
                                            {item.name}
                                        </h3>
                                        {item.is_active !== false ? (
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs rounded-full">
                                                Inactive
                                            </span>
                                        )}
                                    </div>

                                    {item.category && (
                                        <div className="flex items-center space-x-2 mb-3">
                                            <MdCategory className="text-gray-400" size={14} />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        {item.has_variable_pricing ? (
                                            <div className="flex items-center space-x-2">
                                                <BsGraphUpArrow className="text-[#F0B652]" />
                                                <span className="text-sm font-semibold text-[#F0B652]">Variable Pricing</span>
                                            </div>
                                        ) : (
                                            <div className="text-2xl font-bold text-[#0d544c] dark:text-[#3B78BD]">
                                                ₦{Number(item.value).toLocaleString()}
                                            </div>
                                        )}
                                    </div>

                                    {item.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => handleSelectItem(item)}
                                            className="text-[#3B78BD] hover:text-[#0d544c] font-medium text-sm transition-colors"
                                        >
                                            Manage Rules
                                        </button>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditTariff(item)}
                                                className="p-2 text-[#3B78BD] hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                title="Edit Tariff"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTariff(item.id)}
                                                className="p-2 text-[#f06752] hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                                title="Delete Tariff"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>

                        {/* Pagination for Grid View */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} tariffs
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg transition-colors ${
                                            currentPage === 1
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-[#0d544c] text-white hover:bg-[#3B78BD]'
                                        }`}
                                    >
                                        <FaChevronLeft size={14} />
                                    </button>

                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded-lg transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white font-semibold'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg transition-colors ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-[#0d544c] text-white hover:bg-[#3B78BD]'
                                        }`}
                                    >
                                        <FaChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Table View */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Tariff Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Pricing</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {currentItems.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {item.name}
                                                </div>
                                                {item.description && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                                                    {item.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.has_variable_pricing ? (
                                                    <div className="flex items-center space-x-2">
                                                        <BsGraphUpArrow className="text-[#F0B652]" />
                                                        <span className="text-sm font-semibold text-[#F0B652]">Variable</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-lg font-bold text-[#0d544c] dark:text-[#3B78BD]">
                                                        ₦{Number(item.value).toLocaleString()}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.is_active !== false ? (
                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full flex items-center space-x-1 w-fit">
                                                        <FaToggleOn />
                                                        <span>Active</span>
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-sm rounded-full flex items-center space-x-1 w-fit">
                                                        <FaToggleOff />
                                                        <span>Inactive</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleSelectItem(item)}
                                                        className="px-3 py-1 bg-[#3B78BD] hover:bg-[#0d544c] text-white text-sm rounded transition-colors"
                                                    >
                                                        Rules
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditTariff(item)}
                                                        className="p-2 text-[#3B78BD] hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTariff(item.id)}
                                                        className="p-2 text-[#f06752] hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </div>

                        {/* Pagination for Table View */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} tariffs
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg transition-colors ${
                                            currentPage === 1
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-[#0d544c] text-white hover:bg-[#3B78BD]'
                                        }`}
                                    >
                                        <FaChevronLeft size={14} />
                                    </button>

                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 rounded-lg transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white font-semibold'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg transition-colors ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-[#0d544c] text-white hover:bg-[#3B78BD]'
                                        }`}
                                    >
                                        <FaChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Pricing Rules Panel (Shown when item is selected) */}
                {selectedItem && (
                    <div id="pricing-rules-section" className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-slideIn">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-3 md:space-y-0">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                    <FaChartLine className="text-[#3B78BD]" />
                                    <span>Pricing Rules for {selectedItem.name}</span>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Configure advanced pricing rules and formulas
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleAddRule}
                                    className="flex items-center space-x-2 py-3 px-6 rounded-md bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#3B78BD] hover:to-[#0d544c] text-white transition-all shadow-lg hover:shadow-xl"
                                >
                                    <FaPlus />
                                    <span>Add Rule</span>
                                </button>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Pricing Rules List */}
                        {loading ? (
                            <InitLoader />
                        ) : pricingRules.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <FaChartLine className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                                <p className="text-lg mb-2">No pricing rules configured</p>
                                <p className="text-sm">Click "Add Rule" to create advanced pricing rules</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pricingRules.map(rule => (
                                    <div
                                        key={rule.id}
                                        className={`p-5 rounded-lg border-2 ${
                                            rule.is_active
                                                ? 'bg-green-50 dark:bg-green-900/20 border-[#0d544c]'
                                                : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                                        } hover:shadow-md transition-shadow`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3 flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-gradient-to-r from-[#3B78BD] to-[#5a9ad6] text-white text-xs font-semibold rounded uppercase">
                                                        {rule.pricing_type.replace('_', ' ')}
                                                    </span>
                                                    {rule.is_active ? (
                                                        <span className="px-3 py-1 bg-[#0d544c] text-white text-xs font-semibold rounded flex items-center space-x-1">
                                                            <FaToggleOn />
                                                            <span>Active</span>
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded flex items-center space-x-1">
                                                            <FaToggleOff />
                                                            <span>Inactive</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                                                    {rule.description || 'No description'}
                                                </p>

                                                {/* Display rule details based on type */}
                                                {rule.pricing_type === 'fixed' && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        Fixed Price: <span className="font-bold text-lg text-[#0d544c] dark:text-[#3B78BD]">₦{Number(rule.fixed_price).toLocaleString()}</span>
                                                    </p>
                                                )}

                                                {rule.pricing_type === 'quantity_based' && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                        <p>Unit Price: <span className="font-semibold">₦{Number(rule.unit_price).toLocaleString()}</span> per {rule.unit_type}</p>
                                                        {rule.min_quantity && <p>Min Quantity: {rule.min_quantity}</p>}
                                                        {rule.max_quantity && <p>Max Quantity: {rule.max_quantity}</p>}
                                                    </div>
                                                )}

                                                {rule.pricing_type === 'formula_based' && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        <p className="font-mono bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-3 rounded text-[#3B78BD] font-semibold">
                                                            {rule.pricing_formula}
                                                        </p>
                                                        {rule.formula_variables && Object.keys(rule.formula_variables).length > 0 && (
                                                            <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                                                <p className="font-semibold mb-2">Variables:</p>
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                                    {Object.entries(rule.formula_variables).map(([key, value]) => (
                                                                        <div key={key} className="bg-white dark:bg-gray-700 px-3 py-2 rounded">
                                                                            <span className="font-mono text-xs">{key}</span>
                                                                            <span className="mx-2">=</span>
                                                                            <span className="font-bold text-[#F0B652]">{value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {rule.pricing_type === 'tiered' && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        <p className="font-semibold mb-2">Tier Breakpoints:</p>
                                                        <div className="space-y-1">
                                                            {rule.tier_breakpoints?.map((tier, idx) => (
                                                                <div key={idx} className="bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded flex items-center justify-between">
                                                                    <span>{tier.from} - {tier.to || '∞'}</span>
                                                                    <span className="font-bold text-[#0d544c] dark:text-[#3B78BD]">₦{tier.rate} per unit</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {(rule.effective_from || rule.effective_to) && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                                                        Valid: {rule.effective_from || 'Always'} to {rule.effective_to || 'Always'}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() => handleEditRule(rule)}
                                                    className="p-2 text-[#3B78BD] hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                    title="Edit Rule"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRule(rule.id)}
                                                    className="p-2 text-[#f06752] hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                                    title="Delete Rule"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Tariff Modal */}
            {showTariffModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[9999] p-4 pt-20 pb-20 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] p-6 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingTariff ? 'Edit Tariff' : 'Add New Tariff'}
                                </h2>
                                <button
                                    onClick={() => setShowTariffModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Tariff Name */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Tariff Name *
                                </label>
                                <input
                                    type="text"
                                    value={tariffForm.name}
                                    onChange={e => setTariffForm({ ...tariffForm, name: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    placeholder="e.g., Tenement Rate"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={tariffForm.category}
                                    onChange={e => setTariffForm({ ...tariffForm, category: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    placeholder="e.g., Property Tax"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={tariffForm.description}
                                    onChange={e => setTariffForm({ ...tariffForm, description: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    rows="3"
                                    placeholder="Brief description of this tariff..."
                                />
                            </div>

                            {/* Variable Pricing Toggle */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="has_variable_pricing"
                                    checked={tariffForm.has_variable_pricing}
                                    onChange={e => setTariffForm({ ...tariffForm, has_variable_pricing: e.target.checked })}
                                    className="w-5 h-5 text-[#0d544c] rounded focus:ring-[#3B78BD]"
                                />
                                <label htmlFor="has_variable_pricing" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Has Variable Pricing (uses pricing rules instead of fixed value)
                                </label>
                            </div>

                            {/* Base Value (shown only if not variable pricing) */}
                            {!tariffForm.has_variable_pricing && (
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Base Value (₦) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={tariffForm.value}
                                        onChange={e => setTariffForm({ ...tariffForm, value: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                        placeholder="5000.00"
                                        required={!tariffForm.has_variable_pricing}
                                    />
                                </div>
                            )}

                            {/* Active Status */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="tariff_is_active"
                                    checked={tariffForm.is_active}
                                    onChange={e => setTariffForm({ ...tariffForm, is_active: e.target.checked })}
                                    className="w-5 h-5 text-[#0d544c] rounded focus:ring-[#3B78BD]"
                                />
                                <label htmlFor="tariff_is_active" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Active (uncheck to deactivate this tariff)
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowTariffModal(false)}
                                    className="px-5 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTariff}
                                    disabled={loading || !tariffForm.name || (!tariffForm.has_variable_pricing && !tariffForm.value)}
                                    className="px-5 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#3B78BD] hover:to-[#0d544c] text-white rounded transition-all flex items-center space-x-2 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
                                >
                                    <FaSave />
                                    <span>{loading ? 'Saving...' : (editingTariff ? 'Update Tariff' : 'Create Tariff')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pricing Rule Modal */}
            {showRuleModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[9999] p-4 pt-20 pb-20 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] p-6 rounded-t-lg z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingRule ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
                                </h2>
                                <button
                                    onClick={() => setShowRuleModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Pricing Type */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Pricing Type
                                </label>
                                <select
                                    value={ruleForm.pricing_type}
                                    onChange={e => setRuleForm({ ...ruleForm, pricing_type: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                >
                                    <option value="fixed">Fixed Price</option>
                                    <option value="quantity_based">Quantity Based</option>
                                    <option value="formula_based">Formula Based (e.g., Tenement Rate)</option>
                                    <option value="tiered">Tiered Pricing</option>
                                    <option value="conditional">Conditional Pricing</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={ruleForm.description}
                                    onChange={e => setRuleForm({ ...ruleForm, description: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    rows="2"
                                    placeholder="E.g., 25 Kobo per ₦1.00 of assessed property value (annually)"
                                />
                            </div>

                            {/* Fixed Price Fields */}
                            {ruleForm.pricing_type === 'fixed' && (
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Fixed Price (₦)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={ruleForm.fixed_price}
                                        onChange={e => setRuleForm({ ...ruleForm, fixed_price: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                        placeholder="5000.00"
                                    />
                                </div>
                            )}

                            {/* Quantity-Based Fields */}
                            {ruleForm.pricing_type === 'quantity_based' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Unit Price (₦)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={ruleForm.unit_price}
                                                onChange={e => setRuleForm({ ...ruleForm, unit_price: e.target.value })}
                                                className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                                placeholder="5000.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Unit Type
                                            </label>
                                            <input
                                                type="text"
                                                value={ruleForm.unit_type}
                                                onChange={e => setRuleForm({ ...ruleForm, unit_type: e.target.value })}
                                                className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                                placeholder="stall, m², etc."
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Min Quantity (optional)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={ruleForm.min_quantity}
                                                onChange={e => setRuleForm({ ...ruleForm, min_quantity: e.target.value })}
                                                className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                                placeholder="1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Max Quantity (optional)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={ruleForm.max_quantity}
                                                onChange={e => setRuleForm({ ...ruleForm, max_quantity: e.target.value })}
                                                className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Formula-Based Fields */}
                            {ruleForm.pricing_type === 'formula_based' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Pricing Formula
                                        </label>
                                        <input
                                            type="text"
                                            value={ruleForm.pricing_formula}
                                            onChange={e => setRuleForm({ ...ruleForm, pricing_formula: e.target.value })}
                                            className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD] font-mono"
                                            placeholder="assessed_value * rate_per_naira"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Use variable names like: assessed_value, rate_per_naira, area, etc.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Formula Variables
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addFormulaVariable}
                                                className="px-3 py-1 bg-[#3B78BD] text-white text-xs rounded hover:bg-[#0d544c] transition-colors"
                                            >
                                                Add Variable
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {Object.entries(ruleForm.formula_variables).map(([key, value]) => (
                                                <div key={key} className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                                    <span className="font-mono text-sm flex-1 text-gray-700 dark:text-gray-300">{key} = {value}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFormulaVariable(key)}
                                                        className="text-[#f06752] hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {Object.keys(ruleForm.formula_variables).length === 0 && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                No variables defined. Click "Add Variable" to add one.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tiered Pricing Fields */}
                            {ruleForm.pricing_type === 'tiered' && (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Tier Breakpoints
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addTierBreakpoint}
                                            className="px-3 py-1 bg-[#3B78BD] text-white text-xs rounded hover:bg-[#0d544c] transition-colors"
                                        >
                                            Add Tier
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {ruleForm.tier_breakpoints.map((tier, idx) => (
                                            <div key={idx} className="grid grid-cols-4 gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={tier.from}
                                                        onChange={e => updateTierBreakpoint(idx, 'from', e.target.value)}
                                                        className="w-full p-2 text-sm border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                                        placeholder="From"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={tier.to}
                                                        onChange={e => updateTierBreakpoint(idx, 'to', e.target.value)}
                                                        className="w-full p-2 text-sm border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                                        placeholder="To"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={tier.rate}
                                                        onChange={e => updateTierBreakpoint(idx, 'rate', e.target.value)}
                                                        className="w-full p-2 text-sm border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                                        placeholder="Rate (₦)"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTierBreakpoint(idx)}
                                                    className="text-[#f06752] hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Active Status */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={ruleForm.is_active}
                                    onChange={e => setRuleForm({ ...ruleForm, is_active: e.target.checked })}
                                    className="w-5 h-5 text-[#0d544c] rounded focus:ring-[#3B78BD]"
                                />
                                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Active (uncheck to deactivate this rule)
                                </label>
                            </div>

                            {/* Effective Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Effective From (optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={ruleForm.effective_from}
                                        onChange={e => setRuleForm({ ...ruleForm, effective_from: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Effective To (optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={ruleForm.effective_to}
                                        onChange={e => setRuleForm({ ...ruleForm, effective_to: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowRuleModal(false)}
                                    className="px-5 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveRule}
                                    disabled={loading}
                                    className="px-5 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#3B78BD] hover:to-[#0d544c] text-white rounded transition-all flex items-center space-x-2 disabled:from-gray-400 disabled:to-gray-400"
                                >
                                    <FaSave />
                                    <span>{loading ? 'Saving...' : 'Save Pricing Rule'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PricingManagement;
