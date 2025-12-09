import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FaSearch,
    FaFilter,
    FaChevronDown,
    FaChevronUp,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaInfoCircle,
    FaBook,
    FaTimes,
    FaSpinner
} from 'react-icons/fa';
import { fetchFeeSchedule, fetchCategories, fetchStatistics } from '../../apis/feeScheduleService';
import PublicLinks from '../../common/PublicLinks';
import Logo from '../../assets/logo-bayelsa.png';

const FeeSchedule = () => {

    // State management
    const [revenueHeads, setRevenueHeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Categories and stats
    const [categories, setCategories] = useState([]);
    const [statistics, setStatistics] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(20);

    // Expanded items
    const [expandedItems, setExpandedItems] = useState(new Set());

    // Payment frequencies
    const paymentFrequencies = [
        { value: '', label: 'All Frequencies' },
        { value: 'one-time', label: 'One-Time' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'annually', label: 'Annually' },
    ];

    // Schedule options
    const scheduleOptions = [
        { value: '', label: 'All Schedules' },
        { value: '1', label: 'Schedule 1 - Entertainment & Recreation' },
        { value: '2', label: 'Schedule 2 - Hotels, Lodges & Hospitality' },
        { value: '3', label: 'Schedule 3 - Commercial Vehicles & Transportation' },
        { value: '4', label: 'Schedule 4 - Markets, Shops & Trading' },
        { value: '5', label: 'Schedule 5 - Property & Land Use' },
        { value: '6', label: 'Schedule 6 - Other Fees & Charges' },
    ];

    // Fetch categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                if (response.status === 'success') {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };

        const loadStatistics = async () => {
            try {
                const response = await fetchStatistics();
                if (response.status === 'success') {
                    setStatistics(response.data);
                }
            } catch (err) {
                console.error('Failed to load statistics:', err);
            }
        };

        loadCategories();
        loadStatistics();
    }, []);

    // Fetch fee schedule data
    useEffect(() => {
        const loadFeeSchedule = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchFeeSchedule({
                    search: searchQuery,
                    schedule: selectedSchedule,
                    category: selectedCategory,
                    payment_frequency: selectedFrequency,
                    per_page: perPage,
                });

                console.log('API Response:', response);

                if (response.status === 'success') {
                    const data = response.data;
                    console.log('Revenue Heads Data:', data.data);
                    setRevenueHeads(data.data || []);
                    setTotalPages(data.last_page || 1);
                    setCurrentPage(data.current_page || 1);
                } else {
                    setError('Failed to load fee schedule');
                }
            } catch (err) {
                setError('An error occurred while loading the fee schedule. Please try again.');
                console.error('Error loading fee schedule:', err);
            } finally {
                setLoading(false);
            }
        };

        loadFeeSchedule();
    }, [searchQuery, selectedSchedule, selectedCategory, selectedFrequency, perPage, reloadTrigger]);

    // Toggle expanded item
    const toggleExpanded = (id) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedSchedule('');
        setSelectedCategory('');
        setSelectedFrequency('');
        setCurrentPage(1);
    };

    // Reload data
    const handleReload = () => {
        setReloadTrigger(prev => prev + 1);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Get badge color for payment frequency
    const getFrequencyBadgeColor = (frequency) => {
        const colors = {
            'one-time': 'bg-gray-100 text-gray-800',
            'daily': 'bg-blue-100 text-blue-800',
            'weekly': 'bg-green-100 text-green-800',
            'monthly': 'bg-purple-100 text-purple-800',
            'quarterly': 'bg-yellow-100 text-yellow-800',
            'annually': 'bg-red-100 text-red-800',
        };
        return colors[frequency] || 'bg-gray-100 text-gray-800';
    };

    // Active filters count
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (selectedSchedule) count++;
        if (selectedCategory) count++;
        if (selectedFrequency) count++;
        return count;
    }, [searchQuery, selectedSchedule, selectedCategory, selectedFrequency]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <img src={Logo} alt="Yenagoa LG Logo" className="h-12 w-auto" />
                        <PublicLinks />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <FaBook className="text-[#3B78BD]" />
                        Official Fee Schedule
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Browse all revenue heads, products, and tariffs for Yenagoa Local Government Area
                    </p>

                    {/* Statistics */}
                    {statistics && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                                <div className="text-sm text-gray-600">Revenue Heads</div>
                                <div className="text-2xl font-bold text-gray-900">{statistics.total_revenue_heads}</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                                <div className="text-sm text-gray-600">Total Tariffs</div>
                                <div className="text-2xl font-bold text-gray-900">{statistics.total_tariffs}</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                                <div className="text-sm text-gray-600">Schedules</div>
                                <div className="text-2xl font-bold text-gray-900">{statistics.total_schedules}</div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                                <div className="text-sm text-gray-600">Categories</div>
                                <div className="text-2xl font-bold text-gray-900">{statistics.total_categories}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, code, category, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none text-gray-700"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-[#3B78BD] hover:text-[#2d5f94] font-medium transition-colors"
                        >
                            <FaFilter />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="bg-[#3B78BD] text-white text-xs rounded-full px-2 py-0.5">
                                    {activeFiltersCount}
                                </span>
                            )}
                            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                            {/* Schedule Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Schedule
                                </label>
                                <select
                                    value={selectedSchedule}
                                    onChange={(e) => setSelectedSchedule(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none text-gray-700"
                                >
                                    {scheduleOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none text-gray-700"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Payment Frequency Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Frequency
                                </label>
                                <select
                                    value={selectedFrequency}
                                    onChange={(e) => setSelectedFrequency(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none text-gray-700"
                                >
                                    {paymentFrequencies.map(freq => (
                                        <option key={freq.value} value={freq.value}>
                                            {freq.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <FaSpinner className="animate-spin text-[#3B78BD] text-4xl" />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <FaInfoCircle className="text-red-500 text-3xl mx-auto mb-3" />
                        <p className="text-red-700 font-medium">{error}</p>
                        <button
                            onClick={handleReload}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Revenue Heads List */}
                {!loading && !error && (
                    <>
                        {revenueHeads.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                                <FaInfoCircle className="text-yellow-500 text-4xl mx-auto mb-3" />
                                <p className="text-yellow-700 text-lg font-medium">No results found</p>
                                <p className="text-yellow-600 mt-2">Try adjusting your search or filters</p>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {revenueHeads.map((revenueHead) => (
                                    <div
                                        key={revenueHead.id}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
                                    >
                                        {/* Revenue Head Header */}
                                        <div
                                            onClick={() => toggleExpanded(revenueHead.id)}
                                            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {revenueHead.name}
                                                        </h3>
                                                        <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                            {revenueHead.code}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-600 mb-3">{revenueHead.description}</p>

                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                            Schedule {revenueHead.schedule_number}
                                                        </span>
                                                        {revenueHead.category && (
                                                            <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                                                {revenueHead.category}
                                                            </span>
                                                        )}
                                                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${getFrequencyBadgeColor(revenueHead.payment_frequency)}`}>
                                                            <FaCalendarAlt className="text-xs" />
                                                            {revenueHead.payment_frequency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </span>
                                                        {revenueHead.tariffs && revenueHead.tariffs.length > 0 && (
                                                            <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                                {revenueHead.tariffs.length} {revenueHead.tariffs.length === 1 ? 'Tariff' : 'Tariffs'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button className="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                                                    {expandedItems.has(revenueHead.id) ? (
                                                        <FaChevronUp className="text-xl" />
                                                    ) : (
                                                        <FaChevronDown className="text-xl" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Tariffs */}
                                        {expandedItems.has(revenueHead.id) && revenueHead.tariffs && revenueHead.tariffs.length > 0 && (
                                            <div className="border-t border-gray-200 bg-gray-50 p-6">
                                                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <FaMoneyBillWave className="text-green-600" />
                                                    Tariffs & Fees
                                                </h4>
                                                <div className="grid gap-4">
                                                    {revenueHead.tariffs.map((tariff) => (
                                                        <div
                                                            key={tariff.id}
                                                            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#3B78BD] transition-colors"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex-1">
                                                                    <h5 className="font-semibold text-gray-900 mb-1">
                                                                        {tariff.purpose || tariff.description}
                                                                    </h5>
                                                                    {tariff.description && tariff.purpose !== tariff.description && (
                                                                        <p className="text-sm text-gray-600">{tariff.description}</p>
                                                                    )}
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    <div className="text-2xl font-bold text-[#3B78BD]">
                                                                        {formatCurrency(tariff.amount)}
                                                                    </div>
                                                                    {tariff.duration && (
                                                                        <div className="text-xs text-gray-500">
                                                                            per {tariff.duration}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Tariff Metadata */}
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {tariff.category && (
                                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                                        {tariff.category}
                                                                    </span>
                                                                )}
                                                                {tariff.payment_frequency && (
                                                                    <span className={`text-xs px-2 py-1 rounded ${getFrequencyBadgeColor(tariff.payment_frequency)}`}>
                                                                        {tariff.payment_frequency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                    </span>
                                                                )}
                                                                {tariff.has_variable_pricing && (
                                                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                                        Variable Pricing
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Pricing Metadata */}
                                                            {tariff.pricing_metadata && Object.keys(tariff.pricing_metadata).length > 0 && (
                                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                                    <div className="text-xs text-gray-600 font-medium mb-2">Additional Details:</div>
                                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                                        {Object.entries(tariff.pricing_metadata).map(([key, value]) => (
                                                                            <div key={key} className="flex justify-between">
                                                                                <span className="text-gray-600">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                                                                                <span className="font-medium text-gray-900">{value}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Tariffs Message */}
                                        {expandedItems.has(revenueHead.id) && (!revenueHead.tariffs || revenueHead.tariffs.length === 0) && (
                                            <div className="border-t border-gray-200 bg-gray-50 p-6 text-center">
                                                <p className="text-gray-500">No tariffs available for this revenue head</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>

                                <span className="px-4 py-2 text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} Yenagoa Local Government Area. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Official Fee Schedule - Bylaw Year {statistics?.bylaw_year || 2014}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default FeeSchedule;
