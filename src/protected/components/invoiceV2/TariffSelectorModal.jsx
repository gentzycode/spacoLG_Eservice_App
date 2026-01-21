import React, { useState, useEffect } from 'react';
import { fetchTariffs, fetchRevenueHeads } from '../../../apis/revenueActions';
import { AiOutlineClose, AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TariffSelectorModal = ({ onClose, onSelectTariff }) => {
    const [tariffs, setTariffs] = useState([]);
    const [revenueHeads, setRevenueHeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRevenueHead, setSelectedRevenueHead] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredTariffs, setFilteredTariffs] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterTariffs();
    }, [tariffs, searchTerm, selectedRevenueHead, selectedCategory]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Fetch tariffs with active_only filter
            const tariffsResponse = await fetchTariffs({ active_only: true });
            const tariffsData = tariffsResponse?.data?.data || tariffsResponse?.data || [];
            setTariffs(Array.isArray(tariffsData) ? tariffsData : []);

            // Fetch revenue heads
            const revenueResponse = await fetchRevenueHeads();
            const revenueData = revenueResponse?.data?.data || revenueResponse?.data || [];
            setRevenueHeads(Array.isArray(revenueData) ? revenueData : []);
        } catch (error) {
            console.error('Error loading tariffs:', error);
            toast.error('Failed to load tariffs');
        } finally {
            setLoading(false);
        }
    };

    const filterTariffs = () => {
        let filtered = [...tariffs];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(tariff =>
                tariff.purpose?.toLowerCase().includes(term) ||
                tariff.monnify_product_code?.toLowerCase().includes(term) ||
                tariff.revenueHead?.name?.toLowerCase().includes(term)
            );
        }

        // Revenue head filter
        if (selectedRevenueHead) {
            filtered = filtered.filter(tariff => tariff.revenue_head_id === parseInt(selectedRevenueHead));
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(tariff => tariff.category === selectedCategory);
        }

        setFilteredTariffs(filtered);
    };

    const handleSelectTariff = (tariff) => {
        onSelectTariff(tariff);
        onClose();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedRevenueHead('');
        setSelectedCategory('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Select Tariff</h2>
                        <p className="text-gray-100 text-sm mt-1">Browse and select from available tariffs</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                    >
                        <AiOutlineClose size={24} />
                    </button>
                </div>

                {/* Filters Section */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search tariffs by purpose, code, or revenue head..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c]"
                                />
                            </div>
                        </div>

                        {/* Revenue Head Filter */}
                        <div>
                            <select
                                value={selectedRevenueHead}
                                onChange={(e) => setSelectedRevenueHead(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c]"
                            >
                                <option value="">All Revenue Heads</option>
                                {revenueHeads.map((rh) => (
                                    <option key={rh.id} value={rh.id}>
                                        {rh.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c]"
                            >
                                <option value="">All Categories</option>
                                <option value="One-Off">One-Off</option>
                                <option value="Recurring">Recurring</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || selectedRevenueHead || selectedCategory) && (
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 text-sm font-semibold"
                            >
                                <FaTimes size={14} />
                                Clear Filters
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {filteredTariffs.length} of {tariffs.length} tariffs
                            </span>
                        </div>
                    )}
                </div>

                {/* Tariffs Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d544c]"></div>
                        </div>
                    ) : filteredTariffs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No tariffs found</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                Try adjusting your search criteria
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTariffs.map((tariff) => (
                                <div
                                    key={tariff.id}
                                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:shadow-lg hover:border-[#0d544c] dark:hover:border-[#3B78BD] transition-all duration-200 cursor-pointer group"
                                    onClick={() => handleSelectTariff(tariff)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#0d544c] dark:group-hover:text-[#3B78BD] transition-colors">
                                                {tariff.purpose}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {tariff.revenueHead?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <AiOutlinePlus size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Amount:</span>
                                            <span className="text-lg font-bold text-[#0d544c] dark:text-[#3B78BD]">
                                                ₦{Number(tariff.amount || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Category:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                tariff.category === 'One-Off'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            }`}>
                                                {tariff.category || 'N/A'}
                                            </span>
                                        </div>

                                        {tariff.monnify_product_code && (
                                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Code:</span>
                                                    <span className="px-2 py-1 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white text-xs font-mono rounded">
                                                        {tariff.monnify_product_code}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TariffSelectorModal;
