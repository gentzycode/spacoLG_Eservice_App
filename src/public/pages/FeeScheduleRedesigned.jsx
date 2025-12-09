import React, { useState, useEffect, useMemo } from 'react';
import { FaBook, FaListAlt, FaTag, FaLayerGroup, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { fetchFeeSchedule, fetchCategories, fetchStatistics } from '../../apis/feeScheduleService';
import PublicHeader from '../../components/layout/PublicHeader';
import StatCard from '../../components/fee-schedule/StatCard';
import FilterBar from '../../components/fee-schedule/FilterBar';
import RevenueHeadCard from '../../components/fee-schedule/RevenueHeadCard';
import { SkeletonLoader } from '../../components/fee-schedule/SkeletonCard';

const FeeScheduleRedesigned = () => {
    // State management
    const [revenueHeads, setRevenueHeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
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
    const perPage = 20;

    // Filter options
    const scheduleOptions = [
        { value: '', label: 'All Schedules' },
        { value: '1', label: 'Schedule 1' },
        { value: '2', label: 'Schedule 2' },
        { value: '3', label: 'Schedule 3' },
        { value: '4', label: 'Schedule 4' },
        { value: '5', label: 'Schedule 5' },
        { value: '6', label: 'Schedule 6' },
    ];

    const frequencyOptions = [
        { value: '', label: 'All Frequencies' },
        { value: 'one-time', label: 'One-Time' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'annually', label: 'Annually' },
    ];

    // Load categories and statistics
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoriesRes, statsRes] = await Promise.all([
                    fetchCategories(),
                    fetchStatistics()
                ]);

                if (categoriesRes.status === 'success') {
                    setCategories(categoriesRes.data);
                }
                if (statsRes.status === 'success') {
                    setStatistics(statsRes.data);
                }
            } catch (err) {
                console.error('Failed to load initial data:', err);
            }
        };

        loadInitialData();
    }, []);

    // Load fee schedule data
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

                if (response.status === 'success') {
                    const data = response.data;
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
    }, [searchQuery, selectedSchedule, selectedCategory, selectedFrequency, perPage]);

    // Active filters for display
    const activeFilters = useMemo(() => {
        const filters = [];
        if (searchQuery) filters.push({ key: 'search', label: 'Search', value: searchQuery });
        if (selectedSchedule) {
            const schedule = scheduleOptions.find(s => s.value === selectedSchedule);
            filters.push({ key: 'schedule', label: 'Schedule', value: schedule?.label || selectedSchedule });
        }
        if (selectedCategory) filters.push({ key: 'category', label: 'Category', value: selectedCategory });
        if (selectedFrequency) {
            const freq = frequencyOptions.find(f => f.value === selectedFrequency);
            filters.push({ key: 'frequency', label: 'Frequency', value: freq?.label || selectedFrequency });
        }
        return filters;
    }, [searchQuery, selectedSchedule, selectedCategory, selectedFrequency]);

    // Handle filter removal
    const handleRemoveFilter = (key) => {
        switch (key) {
            case 'search':
                setSearchQuery('');
                break;
            case 'schedule':
                setSelectedSchedule('');
                break;
            case 'category':
                setSelectedCategory('');
                break;
            case 'frequency':
                setSelectedFrequency('');
                break;
        }
    };

    // Clear all filters
    const handleClearAllFilters = () => {
        setSearchQuery('');
        setSelectedSchedule('');
        setSelectedCategory('');
        setSelectedFrequency('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Public Header */}
            <PublicHeader />

            {/* Page Hero */}
            <div className="bg-gradient-to-r from-[#3B78BD] to-[#2d5f94] text-white">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full">
                            Yenagoa Local Government Area
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
                        <FaBook className="h-10 w-10" />
                        Official Fee Schedule
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-3xl">
                        Browse all revenue heads, products, and tariffs. Search and filter to find exactly what you need.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                {loading && !statistics ? (
                    <SkeletonLoader />
                ) : (
                    <>
                        {/* Statistics Cards */}
                        {statistics && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatCard
                                    icon={FaBook}
                                    label="Revenue Heads"
                                    value={statistics.total_revenue_heads}
                                    sublabel="Active revenue heads"
                                    colorClass="border-blue-500"
                                />
                                <StatCard
                                    icon={FaListAlt}
                                    label="Total Tariffs"
                                    value={statistics.total_tariffs}
                                    sublabel="Configured tariffs"
                                    colorClass="border-green-500"
                                />
                                <StatCard
                                    icon={FaLayerGroup}
                                    label="Schedules"
                                    value={statistics.total_schedules}
                                    sublabel="Different schedules"
                                    colorClass="border-purple-500"
                                />
                                <StatCard
                                    icon={FaTag}
                                    label="Categories"
                                    value={statistics.total_categories}
                                    sublabel="Unique categories"
                                    colorClass="border-yellow-500"
                                />
                            </div>
                        )}

                        {/* Search and Filters */}
                        <div className="mb-8">
                            <FilterBar
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                showFilters={showFilters}
                                onToggleFilters={() => setShowFilters(!showFilters)}
                                activeFilters={activeFilters}
                                onRemoveFilter={handleRemoveFilter}
                                onClearAll={handleClearAllFilters}
                            />

                            {/* Filter Panel */}
                            {showFilters && (
                                <div className="mt-4 bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-fadeIn">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Schedule Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Schedule
                                            </label>
                                            <select
                                                value={selectedSchedule}
                                                onChange={(e) => setSelectedSchedule(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none transition-all"
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
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none transition-all"
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
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:border-transparent outline-none transition-all"
                                            >
                                                {frequencyOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="space-y-4">
                                <SkeletonLoader />
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                                <FaInfoCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Data</h3>
                                <p className="text-red-700 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && revenueHeads.length === 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center">
                                <FaInfoCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-yellow-900 mb-2">No Results Found</h3>
                                <p className="text-yellow-700 mb-6 max-w-md mx-auto">
                                    No tariffs match your current filters. Try adjusting your search or removing some filters.
                                </p>
                                {activeFilters.length > 0 && (
                                    <button
                                        onClick={handleClearAllFilters}
                                        className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Revenue Heads List */}
                        {!loading && !error && revenueHeads.length > 0 && (
                            <div className="space-y-4">
                                {revenueHeads.map((revenueHead) => (
                                    <RevenueHeadCard key={revenueHead.id} revenueHead={revenueHead} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-6 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>

                                <span className="px-6 py-3 font-medium text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
                    <p className="text-gray-400 mb-2">
                        © {new Date().getFullYear()} Yenagoa Local Government Area. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Official Fee Schedule - By-Law Year {statistics?.bylaw_year || 2014}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default FeeScheduleRedesigned;
