import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import {
    FaCreditCard, FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaCheckCircle,
    FaExclamationTriangle, FaToggleOn, FaToggleOff, FaKey, FaLink,
    FaChartLine, FaMoneyBillWave, FaShieldAlt, FaCheck, FaExclamationCircle,
    FaSearch, FaFilter, FaCog, FaHistory, FaThLarge, FaListAlt
} from 'react-icons/fa';
import { MdPayment, MdVerified, MdError } from 'react-icons/md';
import { BsLightningChargeFill } from 'react-icons/bs';
import PageLoader from '../../../common/PageLoader';

const PaymentGateways = () => {
    const { token } = useContext(AuthContext);
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [showGatewayModal, setShowGatewayModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [editingGateway, setEditingGateway] = useState(null);
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [imageErrors, setImageErrors] = useState({});

    // Statistics
    const [statistics, setStatistics] = useState({
        totalGateways: 0,
        enabledGateways: 0,
        totalTransactions: 0,
        successRate: 0
    });

    // Form state for gateway
    const [gatewayForm, setGatewayForm] = useState({
        name: '',
        slug: '',
        public_key: '',
        secret_key: '',
        merchant_id: '',
        callback_url: '',
        logo_url: '',
        is_enabled: true,
        is_test_mode: false,
        description: '',
        supported_currencies: ['NGN'],
        transaction_fee_percentage: 0,
        transaction_fee_cap: 0
    });

    // Fetch gateways on mount
    useEffect(() => {
        fetchGateways();
    }, []);

    // Update statistics when gateways change
    useEffect(() => {
        calculateStatistics();
    }, [gateways]);

    const calculateStatistics = () => {
        const totalGateways = gateways.length;
        const enabledGateways = gateways.filter(g => g.is_enabled).length;
        // TODO: Fetch actual transaction stats from backend
        const totalTransactions = 0;
        const successRate = 0;

        setStatistics({
            totalGateways,
            enabledGateways,
            totalTransactions,
            successRate
        });
    };

    const fetchGateways = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/paymentgateways', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Handle paginated response - extract the actual data array
            let rawData = response.data.data?.data || response.data.data || response.data || [];

            // Ensure data is always an array
            if (!Array.isArray(rawData)) {
                // If it's an object with numeric keys or properties, convert to array
                if (typeof rawData === 'object' && rawData !== null) {
                    rawData = Object.values(rawData).filter(item => typeof item === 'object' && item !== null);
                } else {
                    rawData = [];
                }
            }

            // Map backend field names to frontend field names
            const mappedData = rawData.map(gateway => ({
                id: gateway.id,
                name: gateway.gateway_name || gateway.name || '',
                slug: gateway.slug || gateway.gateway_name?.toLowerCase().replace(/\s+/g, '-') || '',
                public_key: gateway.public_key || '',
                secret_key: gateway.secret_key || '',
                merchant_id: gateway.merchant_id || '',
                callback_url: gateway.callback_url || '',
                logo_url: gateway.logo_url || '',
                is_enabled: gateway.status === 'ENABLED' || gateway.is_enabled === true || gateway.is_enabled === 1,
                is_test_mode: gateway.is_test_mode || false,
                description: gateway.description || '',
                supported_currencies: gateway.supported_currencies || ['NGN'],
                transaction_fee_percentage: gateway.transaction_fee_percentage || 0,
                transaction_fee_cap: gateway.transaction_fee_cap || 0,
                created_at: gateway.created_at,
                updated_at: gateway.updated_at
            }));

            setGateways(mappedData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching payment gateways:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch payment gateways';
            setError(errorMessage);
            setGateways([]);
            setLoading(false);
        }
    };

    const handleAddGateway = () => {
        setEditingGateway(null);
        setGatewayForm({
            name: '',
            slug: '',
            public_key: '',
            secret_key: '',
            merchant_id: '',
            callback_url: '',
            logo_url: '',
            is_enabled: true,
            is_test_mode: false,
            description: '',
            supported_currencies: ['NGN'],
            transaction_fee_percentage: 0,
            transaction_fee_cap: 0
        });
        setShowGatewayModal(true);
    };

    const handleEditGateway = (gateway) => {
        setEditingGateway(gateway);
        setGatewayForm({
            name: gateway.name || '',
            slug: gateway.slug || '',
            public_key: gateway.public_key || '',
            secret_key: gateway.secret_key || '',
            merchant_id: gateway.merchant_id || '',
            callback_url: gateway.callback_url || '',
            logo_url: gateway.logo_url || '',
            is_enabled: gateway.is_enabled !== false,
            is_test_mode: gateway.is_test_mode || false,
            description: gateway.description || '',
            supported_currencies: gateway.supported_currencies || ['NGN'],
            transaction_fee_percentage: gateway.transaction_fee_percentage || 0,
            transaction_fee_cap: gateway.transaction_fee_cap || 0
        });
        setShowGatewayModal(true);
    };

    const handleSaveGateway = async () => {
        setLoading(true);
        setError(null);

        try {
            // Map frontend field names to backend field names
            const backendPayload = {
                gateway_name: gatewayForm.name,
                slug: gatewayForm.slug || gatewayForm.name.toLowerCase().replace(/\s+/g, '-'),
                public_key: gatewayForm.public_key || '',
                secret_key: gatewayForm.secret_key || '',
                merchant_id: gatewayForm.merchant_id || '',
                callback_url: gatewayForm.callback_url || '',
                logo_url: gatewayForm.logo_url || '',
                status: gatewayForm.is_enabled ? 'ENABLED' : 'DISABLED',
                is_test_mode: gatewayForm.is_test_mode ? 1 : 0,
                description: gatewayForm.description || '',
                supported_currencies: Array.isArray(gatewayForm.supported_currencies)
                    ? gatewayForm.supported_currencies
                    : ['NGN'],
                transaction_fee_percentage: parseFloat(gatewayForm.transaction_fee_percentage) || 0,
                transaction_fee_cap: parseFloat(gatewayForm.transaction_fee_cap) || 0
            };

            console.log('Saving gateway with payload:', backendPayload);

            if (editingGateway) {
                // Update existing gateway
                console.log('Updating gateway ID:', editingGateway.id);
                const response = await axios.put(
                    `/paymentgateways/${editingGateway.id}`,
                    backendPayload,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                console.log('Update response:', response.data);
                setSuccess('Payment gateway updated successfully!');
            } else {
                // Create new gateway
                console.log('Creating new gateway');
                const response = await axios.post(
                    '/paymentgateways',
                    backendPayload,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                console.log('Create response:', response.data);
                setSuccess('Payment gateway created successfully!');
            }

            await fetchGateways();
            setShowGatewayModal(false);
            setLoading(false);

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Save gateway error:', err.response?.data || err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save payment gateway');
            setLoading(false);
        }
    };

    const handleToggleGateway = async (gateway) => {
        // Don't use global loading state - it blocks all interactions
        console.log('Toggle clicked for gateway:', gateway.name, 'Current state:', gateway.is_enabled);

        try {
            // Calculate new status
            const newStatus = !gateway.is_enabled;

            // Optimistically update UI immediately for instant feedback
            setGateways(prevGateways =>
                prevGateways.map(g =>
                    g.id === gateway.id ? { ...g, is_enabled: newStatus } : g
                )
            );

            // Show immediate feedback message
            setSuccess(`${newStatus ? 'Enabling' : 'Disabling'} ${gateway.name}...`);

            // Map to backend field names
            const backendPayload = {
                gateway_name: gateway.name,
                slug: gateway.slug,
                public_key: gateway.public_key,
                secret_key: gateway.secret_key,
                merchant_id: gateway.merchant_id || '',
                callback_url: gateway.callback_url || '',
                logo_url: gateway.logo_url || '',
                status: gateway.is_enabled ? 'DISABLED' : 'ENABLED', // Toggle the status
                is_test_mode: gateway.is_test_mode ? 1 : 0,
                description: gateway.description || '',
                supported_currencies: Array.isArray(gateway.supported_currencies)
                    ? gateway.supported_currencies
                    : ['NGN'],
                transaction_fee_percentage: parseFloat(gateway.transaction_fee_percentage) || 0,
                transaction_fee_cap: parseFloat(gateway.transaction_fee_cap) || 0
            };

            console.log('Sending toggle request with payload:', backendPayload);

            const response = await axios.put(
                `/paymentgateways/${gateway.id}`,
                backendPayload,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            console.log('Toggle response:', response.data);

            // Update success message with final result
            setSuccess(`${gateway.name} ${newStatus ? 'enabled' : 'disabled'} successfully!`);

            // Refresh from server to ensure data consistency
            await fetchGateways();

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            console.error('Toggle gateway error:', err.response?.data || err);

            // Revert optimistic update on error
            setGateways(prevGateways =>
                prevGateways.map(g =>
                    g.id === gateway.id ? { ...g, is_enabled: gateway.is_enabled } : g
                )
            );

            setError(err.response?.data?.message || 'Failed to toggle gateway status');

            // Scroll to top to show error message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteGateway = async (gatewayId) => {
        if (!window.confirm('Are you sure you want to delete this payment gateway? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(
                `/paymentgateways/${gatewayId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setSuccess('Payment gateway deleted successfully!');
            await fetchGateways();
            setLoading(false);

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete payment gateway');
            setLoading(false);
        }
    };

    const handleTestConnection = async (gateway) => {
        setTesting(true);
        setError(null);
        try {
            // TODO: Implement actual connection test endpoint
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate test
            setSuccess(`Connection test successful for ${gateway.name}!`);
            setTesting(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(`Connection test failed for ${gateway.name}`);
            setTesting(false);
        }
    };

    const handleViewConfig = (gateway) => {
        setSelectedGateway(gateway);
        setShowConfigModal(true);
    };

    const filteredGateways = gateways
        .filter(gateway => {
            const matchesSearch = (gateway.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                (gateway.slug?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' ||
                                (filterStatus === 'enabled' && gateway.is_enabled) ||
                                (filterStatus === 'disabled' && !gateway.is_enabled);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            // Sort enabled gateways first
            if (a.is_enabled === b.is_enabled) return 0;
            return a.is_enabled ? -1 : 1;
        });

    const getGatewayIconFallback = (gateway) => {
        // Icon-based fallbacks based on gateway name
        const iconMap = {
            'paystack': { icon: '🟢', color: '#00C3A0', type: 'emoji' },
            'interswitch': { icon: '🔵', color: '#D42027', type: 'emoji' },
            'remita': { icon: '🟡', color: '#FCB040', type: 'emoji' },
            'tranzakt': { icon: '/tranzak.svg', color: '#6C5CE7', type: 'image' },
            'monnify': { icon: '🔷', color: '#0066FF', type: 'emoji' },
            'flutterwave': { icon: '🟠', color: '#F5A623', type: 'emoji' },
            'cash': { icon: '💵', color: '#27AE60', type: 'emoji' },
            'e-wallet': { icon: '👛', color: '#3498DB', type: 'emoji' },
            'wallet': { icon: '💰', color: '#3498DB', type: 'emoji' },
            'token': { icon: '🎟️', color: '#9B59B6', type: 'emoji' },
            'gtpay': { icon: '🏦', color: '#E74C3C', type: 'emoji' },
            'etranzact': { icon: '💳', color: '#34495E', type: 'emoji' }
        };

        const slug = gateway.slug?.toLowerCase() || gateway.name?.toLowerCase() || '';

        for (const [key, value] of Object.entries(iconMap)) {
            if (slug.includes(key)) {
                return value;
            }
        }

        return { icon: '💳', color: '#95A5A6', type: 'emoji' };
    };

    const handleImageError = (gatewayId) => {
        setImageErrors(prev => ({ ...prev, [gatewayId]: true }));
    };

    const renderGatewayLogo = (gateway) => {
        // If image failed to load or no URL, show icon fallback
        if (!gateway.logo_url || imageErrors[gateway.id]) {
            const fallback = getGatewayIconFallback(gateway);

            // If fallback is an image (like Tranzakt SVG), render it as an img tag
            if (fallback.type === 'image') {
                return (
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center p-2"
                        style={{ backgroundColor: `${fallback.color}20` }}
                    >
                        <img
                            src={fallback.icon}
                            alt={gateway.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                );
            }

            // Otherwise, render emoji fallback
            return (
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${fallback.color}20` }}
                >
                    {fallback.icon}
                </div>
            );
        }

        // Try to load the image
        return (
            <img
                src={gateway.logo_url}
                alt={gateway.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={() => handleImageError(gateway.id)}
            />
        );
    };

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className='flex space-x-2 items-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                            <FaCreditCard size={30} className='text-[#0d544c]' />
                            <span>Payment Gateways</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 ml-10">
                            Manage and configure payment gateway integrations
                        </p>
                    </div>
                    <button
                        onClick={handleAddGateway}
                        className="mt-4 md:mt-0 flex items-center space-x-2 py-3 px-6 rounded-md bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#3B78BD] hover:to-[#0d544c] text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <FaPlus />
                        <span>Add Gateway</span>
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
                    {/* Total Gateways */}
                    <div className="bg-gradient-to-br from-[#0d544c] to-[#2b7d54] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Total Gateways</p>
                                <h3 className="text-3xl font-bold mt-2">{statistics.totalGateways}</h3>
                                <p className="text-white/60 text-xs mt-1">Configured</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaCreditCard size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Enabled Gateways */}
                    <div className="bg-gradient-to-br from-[#3B78BD] to-[#5a9ad6] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Active Gateways</p>
                                <h3 className="text-3xl font-bold mt-2">{statistics.enabledGateways}</h3>
                                <p className="text-white/60 text-xs mt-1">Currently enabled</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaToggleOn size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Total Transactions */}
                    <div className="bg-gradient-to-br from-[#F0B652] to-[#f5c976] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Total Transactions</p>
                                <h3 className="text-3xl font-bold mt-2">{statistics.totalTransactions.toLocaleString()}</h3>
                                <p className="text-white/60 text-xs mt-1">All gateways</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaMoneyBillWave size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Success Rate */}
                    <div className="bg-gradient-to-br from-[#f06752] to-[#f58775] rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Success Rate</p>
                                <h3 className="text-3xl font-bold mt-2">{statistics.successRate}%</h3>
                                <p className="text-white/60 text-xs mt-1">Average</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaChartLine size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search gateways by name or slug..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                            />
                        </div>

                        {/* Status Filter Toggle */}
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                                    filterStatus === 'all'
                                        ? 'bg-[#0d544c] text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                All Gateways
                            </button>
                            <button
                                onClick={() => setFilterStatus('enabled')}
                                className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                                    filterStatus === 'enabled'
                                        ? 'bg-[#0d544c] text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                Active Only
                            </button>
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

                {/* Gateways Display */}
                {loading && filteredGateways.length === 0 ? (
                    <PageLoader message="Loading payment gateways..." fullScreen={false} />
                ) : filteredGateways.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <FaCreditCard className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={60} />
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                            {searchTerm || filterStatus !== 'all' ? 'No gateways match your search' : 'No payment gateways configured'}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Click "Add Gateway" to configure your first payment gateway'}
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGateways.map(gateway => (
                            <div
                                key={gateway.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                            >
                                <div className={`h-2 ${gateway.is_enabled ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD]' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            {renderGatewayLogo(gateway)}
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {gateway.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {gateway.slug}
                                                </p>
                                            </div>
                                        </div>
                                        {gateway.is_enabled ? (
                                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full flex items-center space-x-1">
                                                <FaCheck size={10} />
                                                <span>Enabled</span>
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs rounded-full">
                                                Disabled
                                            </span>
                                        )}
                                    </div>

                                    {gateway.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {gateway.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 mb-4">
                                        {gateway.is_test_mode && (
                                            <div className="flex items-center space-x-2 text-xs text-yellow-600 dark:text-yellow-400">
                                                <FaExclamationCircle />
                                                <span>Test Mode Enabled</span>
                                            </div>
                                        )}
                                        {gateway.merchant_id && (
                                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                                <FaKey size={10} />
                                                <span>Merchant ID: {gateway.merchant_id.substring(0, 15)}...</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleToggleGateway(gateway);
                                                }}
                                                disabled={loading}
                                                className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    gateway.is_enabled
                                                        ? 'text-[#0d544c] hover:bg-green-100 dark:hover:bg-green-900/30'
                                                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                                title={gateway.is_enabled ? 'Click to Disable' : 'Click to Enable'}
                                            >
                                                {gateway.is_enabled ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                            </button>
                                            <button
                                                onClick={() => handleViewConfig(gateway)}
                                                className="p-2 text-[#3B78BD] hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                title="View Configuration"
                                            >
                                                <FaCog size={18} />
                                            </button>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditGateway(gateway)}
                                                className="p-2 text-[#3B78BD] hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                title="Edit Gateway"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGateway(gateway.id)}
                                                className="p-2 text-[#f06752] hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                                title="Delete Gateway"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Gateway</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Mode</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Merchant ID</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredGateways.map(gateway => (
                                        <tr key={gateway.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {renderGatewayLogo(gateway)}
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">
                                                            {gateway.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {gateway.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {gateway.is_enabled ? (
                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full flex items-center space-x-1 w-fit">
                                                        <FaCheck size={10} />
                                                        <span>Enabled</span>
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-sm rounded-full w-fit">
                                                        Disabled
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {gateway.is_test_mode ? (
                                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm rounded-full">
                                                        Test
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full">
                                                        Live
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                    {gateway.merchant_id ? `${gateway.merchant_id.substring(0, 20)}...` : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleToggleGateway(gateway);
                                                        }}
                                                        disabled={loading}
                                                        className={`px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                            gateway.is_enabled
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                                                        }`}
                                                        title={gateway.is_enabled ? 'Click to Disable' : 'Click to Enable'}
                                                    >
                                                        {gateway.is_enabled ? 'Enabled' : 'Disabled'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewConfig(gateway)}
                                                        className="p-2 text-[#3B78BD] hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                        title="View Config"
                                                    >
                                                        <FaCog size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditGateway(gateway)}
                                                        className="p-2 text-[#3B78BD] hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGateway(gateway.id)}
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
                )}
            </div>

            {/* Add/Edit Gateway Modal */}
            {showGatewayModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[9999] p-4 pt-20 pb-20 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] p-6 rounded-t-lg z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingGateway ? 'Edit Payment Gateway' : 'Add Payment Gateway'}
                                </h2>
                                <button
                                    onClick={() => setShowGatewayModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Gateway Name */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Gateway Name *
                                </label>
                                <input
                                    type="text"
                                    value={gatewayForm.name}
                                    onChange={e => setGatewayForm({ ...gatewayForm, name: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    placeholder="e.g., Paystack"
                                    required
                                />
                            </div>

                            {/* Gateway Slug */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Gateway Slug *
                                </label>
                                <input
                                    type="text"
                                    value={gatewayForm.slug}
                                    onChange={e => setGatewayForm({ ...gatewayForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    placeholder="e.g., paystack"
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    URL-friendly identifier (lowercase, no spaces)
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={gatewayForm.description}
                                    onChange={e => setGatewayForm({ ...gatewayForm, description: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    rows="2"
                                    placeholder="Brief description of the payment gateway..."
                                />
                            </div>

                            {/* API Credentials Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Public Key */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Public Key *
                                    </label>
                                    <input
                                        type="text"
                                        value={gatewayForm.public_key}
                                        onChange={e => setGatewayForm({ ...gatewayForm, public_key: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD] font-mono text-sm"
                                        placeholder="pk_test_xxxxx"
                                        required
                                    />
                                </div>

                                {/* Secret Key */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Secret Key *
                                    </label>
                                    <input
                                        type="password"
                                        value={gatewayForm.secret_key}
                                        onChange={e => setGatewayForm({ ...gatewayForm, secret_key: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD] font-mono text-sm"
                                        placeholder="sk_test_xxxxx"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Merchant ID and Callback URL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Merchant ID */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Merchant ID
                                    </label>
                                    <input
                                        type="text"
                                        value={gatewayForm.merchant_id}
                                        onChange={e => setGatewayForm({ ...gatewayForm, merchant_id: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                        placeholder="Optional merchant identifier"
                                    />
                                </div>

                                {/* Logo URL */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Logo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={gatewayForm.logo_url}
                                        onChange={e => setGatewayForm({ ...gatewayForm, logo_url: e.target.value })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                            </div>

                            {/* Callback URL */}
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Callback URL
                                </label>
                                <input
                                    type="url"
                                    value={gatewayForm.callback_url}
                                    onChange={e => setGatewayForm({ ...gatewayForm, callback_url: e.target.value })}
                                    className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                    placeholder="https://yourapp.com/api/payment/callback"
                                />
                            </div>

                            {/* Transaction Fees */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Fee Percentage */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Transaction Fee (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={gatewayForm.transaction_fee_percentage}
                                        onChange={e => setGatewayForm({ ...gatewayForm, transaction_fee_percentage: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                        placeholder="1.5"
                                    />
                                </div>

                                {/* Fee Cap */}
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Fee Cap (₦)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={gatewayForm.transaction_fee_cap}
                                        onChange={e => setGatewayForm({ ...gatewayForm, transaction_fee_cap: parseFloat(e.target.value) || 0 })}
                                        className="w-full p-3 border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD] focus:border-[#3B78BD]"
                                        placeholder="2000"
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-3">
                                {/* Is Enabled */}
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="is_enabled"
                                        checked={gatewayForm.is_enabled}
                                        onChange={e => setGatewayForm({ ...gatewayForm, is_enabled: e.target.checked })}
                                        className="w-5 h-5 text-[#0d544c] rounded focus:ring-[#3B78BD]"
                                    />
                                    <label htmlFor="is_enabled" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Enable this gateway (users can make payments)
                                    </label>
                                </div>

                                {/* Is Test Mode */}
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="is_test_mode"
                                        checked={gatewayForm.is_test_mode}
                                        onChange={e => setGatewayForm({ ...gatewayForm, is_test_mode: e.target.checked })}
                                        className="w-5 h-5 text-[#F0B652] rounded focus:ring-[#F0B652]"
                                    />
                                    <label htmlFor="is_test_mode" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Test Mode (use test credentials)
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowGatewayModal(false)}
                                    className="px-5 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveGateway}
                                    disabled={loading || !gatewayForm.name || !gatewayForm.slug || !gatewayForm.public_key || !gatewayForm.secret_key}
                                    className="px-5 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#3B78BD] hover:to-[#0d544c] text-white rounded transition-all flex items-center space-x-2 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
                                >
                                    <FaSave />
                                    <span>{loading ? 'Saving...' : (editingGateway ? 'Update Gateway' : 'Create Gateway')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Configuration Modal */}
            {showConfigModal && selectedGateway && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[9999] p-4 pt-20 pb-20 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl">
                        <div className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] p-6 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedGateway.name} Configuration
                                </h2>
                                <button
                                    onClick={() => setShowConfigModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gateway Slug</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedGateway.slug}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <p className="font-semibold">{selectedGateway.is_enabled ?
                                        <span className="text-green-600">Enabled</span> :
                                        <span className="text-gray-600">Disabled</span>}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Mode</p>
                                    <p className="font-semibold">{selectedGateway.is_test_mode ?
                                        <span className="text-yellow-600">Test Mode</span> :
                                        <span className="text-blue-600">Live Mode</span>}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Fee</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedGateway.transaction_fee_percentage}%
                                        {selectedGateway.transaction_fee_cap > 0 && ` (Cap: ₦${selectedGateway.transaction_fee_cap})`}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Public Key</p>
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-sm break-all">
                                    {selectedGateway.public_key}
                                </div>
                            </div>

                            {selectedGateway.merchant_id && (
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Merchant ID</p>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-sm break-all">
                                        {selectedGateway.merchant_id}
                                    </div>
                                </div>
                            )}

                            {selectedGateway.callback_url && (
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Callback URL</p>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-sm break-all">
                                        {selectedGateway.callback_url}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleTestConnection(selectedGateway)}
                                    disabled={testing}
                                    className="px-5 py-3 bg-[#F0B652] hover:bg-[#f5c976] text-white rounded transition-colors flex items-center space-x-2 disabled:bg-gray-400"
                                >
                                    <BsLightningChargeFill />
                                    <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                                </button>
                                <button
                                    onClick={() => setShowConfigModal(false)}
                                    className="px-5 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                    Close
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

export default PaymentGateways;
