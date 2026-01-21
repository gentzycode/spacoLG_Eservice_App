import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaSave,
    FaBook, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaListOl, FaEye, FaDownload,
    FaFileExcel, FaFileCsv, FaSync, FaChartLine
} from 'react-icons/fa';
import { MdCategory, MdGridView, MdTableRows } from 'react-icons/md';
import { CSVLink } from 'react-csv';
import PageLoader from '../../../common/PageLoader';
import {
    fetchRevenueHeads,
    fetchRevenueHeadsBySchedule,
    fetchRevenueCategories,
    createRevenueHead,
    updateRevenueHead,
    deleteRevenueHead,
} from '../../../apis/revenueActions';
import { toast } from 'react-toastify';

const RevenueHeads = () => {
    const [revenueHeads, setRevenueHeads] = useState([]);
    const [filteredHeads, setFilteredHeads] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingHead, setEditingHead] = useState(null);
    const [viewingHead, setViewingHead] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeOnly, setActiveOnly] = useState(false);

    // View mode
    const [viewMode, setViewMode] = useState('table'); // 'grid' or 'table'

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [paginatedHeads, setPaginatedHeads] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    // Statistics
    const [statistics, setStatistics] = useState({
        total: 0,
        active: 0,
        bySchedule: {},
        byCategory: {}
    });

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        schedule_number: '1',
        paragraph_number: '',
        sub_paragraph: '',
        category: '',
        payment_frequency: 'annually',
        pricing_type: 'fixed',
        default_amount: '',
        bylaw_reference: '',
        description: '',
        is_active: true,
    });

    // Schedules configuration
    const schedules = [
        { number: 1, name: 'Entertainment & Tenement' },
        { number: 2, name: 'Agriculture & Distribution' },
        { number: 3, name: 'Hospitality & Business' },
        { number: 4, name: 'Marine & Transport' },
        { number: 5, name: 'Industrial & Professional' },
        { number: 6, name: 'Civil Registration & Building' },
    ];

    const paymentFrequencies = [
        { value: 'one-time', label: 'One-Time' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'annually', label: 'Annually' },
    ];

    const pricingTypes = [
        { value: 'fixed', label: 'Fixed Amount' },
        { value: 'tiered', label: 'Tiered (Based on quantity/value)' },
        { value: 'quantity_based', label: 'Quantity Based' },
        { value: 'formula_based', label: 'Formula Based' },
        { value: 'variable', label: 'Variable (Case by case)' },
    ];

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterRevenueHeads();
    }, [searchTerm, selectedSchedule, selectedCategory, activeOnly, revenueHeads]);

    useEffect(() => {
        calculateStatistics();
    }, [revenueHeads]);

    useEffect(() => {
        paginateData();
    }, [filteredHeads, currentPage, itemsPerPage]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [headsResponse, categoriesResponse] = await Promise.all([
                fetchRevenueHeads(),
                fetchRevenueCategories(),
            ]);

            // Backend returns { status, code, data: { data: [...], total, ... } }
            setRevenueHeads(headsResponse.data?.data || []);
            setCategories(categoriesResponse.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load revenue heads');
        } finally {
            setLoading(false);
        }
    };

    const filterRevenueHeads = () => {
        let filtered = [...revenueHeads];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(head =>
                head.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                head.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                head.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Schedule filter
        if (selectedSchedule !== 'all') {
            filtered = filtered.filter(head => head.schedule_number === parseInt(selectedSchedule));
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(head => head.category === selectedCategory);
        }

        // Active filter
        if (activeOnly) {
            filtered = filtered.filter(head => head.is_active);
        }

        setFilteredHeads(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const calculateStatistics = () => {
        const total = revenueHeads.length;
        const active = revenueHeads.filter(h => h.is_active).length;

        const bySchedule = {};
        const byCategory = {};

        revenueHeads.forEach(head => {
            bySchedule[head.schedule_number] = (bySchedule[head.schedule_number] || 0) + 1;
            byCategory[head.category] = (byCategory[head.category] || 0) + 1;
        });

        setStatistics({ total, active, bySchedule, byCategory });
    };

    const paginateData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredHeads.slice(startIndex, endIndex);

        setPaginatedHeads(paginated);
        setTotalPages(Math.ceil(filteredHeads.length / itemsPerPage));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const handleAdd = () => {
        setEditingHead(null);
        setFormData({
            code: '',
            name: '',
            schedule_number: '1',
            paragraph_number: '',
            sub_paragraph: '',
            category: '',
            payment_frequency: 'annually',
            pricing_type: 'fixed',
            default_amount: '',
            bylaw_reference: '',
            description: '',
            is_active: true,
        });
        setShowModal(true);
    };

    const handleEdit = (head) => {
        setEditingHead(head);
        setFormData({
            code: head.code || '',
            name: head.name || '',
            schedule_number: head.schedule_number?.toString() || '1',
            paragraph_number: head.paragraph_number || '',
            sub_paragraph: head.sub_paragraph || '',
            category: head.category || '',
            payment_frequency: head.payment_frequency || 'annually',
            pricing_type: head.pricing_type || 'fixed',
            default_amount: head.default_amount || '',
            bylaw_reference: head.bylaw_reference || '',
            description: head.description || '',
            is_active: head.is_active !== false,
        });
        setShowModal(true);
    };

    const handleView = (head) => {
        setViewingHead(head);
        setShowViewModal(true);
    };

    const handleDelete = useCallback(async (id, name) => {
        // Use toast for confirmation
        const confirmDelete = async () => {
            setLoading(true);
            try {
                await deleteRevenueHead(id);
                toast.success('Revenue head deleted successfully');
                loadData();
            } catch (error) {
                console.error('Error deleting revenue head:', error);
                toast.error('Failed to delete revenue head');
            } finally {
                setLoading(false);
            }
        };

        // Show warning toast with action button
        toast.warn(
            <div className="flex flex-col space-y-3">
                <p className="font-semibold">Delete Revenue Head?</p>
                <p className="text-sm">{name || 'This item'} will be permanently removed.</p>
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>,
            {
                position: 'top-center',
                autoClose: 5000,
                closeButton: true,
                draggable: false,
            }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                schedule_number: parseInt(formData.schedule_number),
            };

            if (editingHead) {
                await updateRevenueHead(editingHead.id, data);
                toast.success('Revenue head updated successfully');
            } else {
                await createRevenueHead(data);
                toast.success('Revenue head created successfully');
            }

            setShowModal(false);
            loadData();
        } catch (error) {
            console.error('Error saving revenue head:', error);
            toast.error(error.response?.data?.message || 'Failed to save revenue head');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Export functionality
    const prepareExportData = () => {
        return filteredHeads.map((head, index) => {
            const schedule = schedules.find(s => s.number === head.schedule_number);
            const paymentFreq = paymentFrequencies.find(pf => pf.value === head.payment_frequency);
            const pricingTypeObj = pricingTypes.find(pt => pt.value === head.pricing_type);

            return {
                'S/N': index + 1,
                'Revenue Head ID': head.id || 'N/A',
                'Code': head.code || 'N/A',
                'Name': head.name || 'N/A',
                'Schedule Number': head.schedule_number || 'N/A',
                'Schedule Name': schedule?.name || 'N/A',
                'Paragraph Number': head.paragraph_number || 'N/A',
                'Sub-Paragraph': head.sub_paragraph || 'N/A',
                'Category': head.category || 'N/A',
                'Payment Frequency': paymentFreq?.label || head.payment_frequency || 'N/A',
                'Pricing Type': pricingTypeObj?.label || head.pricing_type || 'N/A',
                'Default Amount (₦)': head.default_amount ? parseFloat(head.default_amount).toFixed(2) : '0.00',
                'Bylaw Reference': head.bylaw_reference || 'N/A',
                'Description': head.description || 'N/A',
                'Status': head.is_active ? 'Active' : 'Inactive',
                'Tranzakt Collection ID': head.tranzakt_collection_id || 'Not Mapped',
                'Tranzakt Collection Name': head.tranzakt_collection_name || 'Not Mapped',
                'Effective From': head.effective_from ? new Date(head.effective_from).toLocaleDateString() : 'N/A',
                'Effective To': head.effective_to ? new Date(head.effective_to).toLocaleDateString() : 'Indefinite',
                'Created At': head.created_at ? new Date(head.created_at).toLocaleDateString() : 'N/A',
                'Updated At': head.updated_at ? new Date(head.updated_at).toLocaleDateString() : 'N/A'
            };
        });
    };

    const csvHeaders = [
        { label: 'S/N', key: 'S/N' },
        { label: 'Revenue Head ID', key: 'Revenue Head ID' },
        { label: 'Code', key: 'Code' },
        { label: 'Name', key: 'Name' },
        { label: 'Schedule Number', key: 'Schedule Number' },
        { label: 'Schedule Name', key: 'Schedule Name' },
        { label: 'Paragraph Number', key: 'Paragraph Number' },
        { label: 'Sub-Paragraph', key: 'Sub-Paragraph' },
        { label: 'Category', key: 'Category' },
        { label: 'Payment Frequency', key: 'Payment Frequency' },
        { label: 'Pricing Type', key: 'Pricing Type' },
        { label: 'Default Amount (₦)', key: 'Default Amount (₦)' },
        { label: 'Bylaw Reference', key: 'Bylaw Reference' },
        { label: 'Description', key: 'Description' },
        { label: 'Status', key: 'Status' },
        { label: 'Tranzakt Collection ID', key: 'Tranzakt Collection ID' },
        { label: 'Tranzakt Collection Name', key: 'Tranzakt Collection Name' },
        { label: 'Effective From', key: 'Effective From' },
        { label: 'Effective To', key: 'Effective To' },
        { label: 'Created At', key: 'Created At' },
        { label: 'Updated At', key: 'Updated At' }
    ];

    const generateFilename = () => {
        const date = new Date();
        const timestamp = date.toISOString().split('T')[0];
        return `Revenue_Heads_Export_${timestamp}.csv`;
    };

    if (loading && revenueHeads.length === 0) {
        return <PageLoader message="Loading revenue heads data..." fullScreen={true} />;
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 animate-fadeIn">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
                            <FaBook className="text-[#0d544c]" />
                            <span>Revenue Heads Management</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Manage revenue items from Yenagoa LGA By-Laws (Revenue) 2014 (As Amended 2025)
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Refresh Button */}
                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium shadow-sm"
                            title="Refresh data"
                        >
                            <FaSync size={16} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        {/* Add Revenue Head Button */}
                        <button
                            onClick={handleAdd}
                            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium"
                        >
                            <FaPlus size={20} />
                            <span>Add Revenue Head</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideIn">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Revenue Heads</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.total}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <FaBook className="text-white text-2xl" />
                        </div>
                    </div>
                    {statistics.total > 0 && (
                        <div className="flex items-center space-x-2 text-xs">
                            <FaChartLine className="text-green-600" size={14} />
                            <span className="text-green-600 font-semibold">
                                {Math.round((statistics.active / statistics.total) * 100)}%
                            </span>
                            <span className="text-gray-400">active</span>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active</p>
                            <h3 className="text-3xl font-bold text-green-600">{statistics.active}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <FaCheckCircle className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">
                            {statistics.total - statistics.active} inactive
                        </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Schedules</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">6</h3>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <FaListOl className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">By-Laws (Revenue) 2014</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Categories</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{categories.length}</h3>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <MdCategory className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">Unique categories</span>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8 animate-slideIn">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <FaFilter className="text-[#0d544c]" size={18} />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters & Search</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* View Toggle */}
                        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2.5 rounded-lg transition-all duration-300 ${
                                    viewMode === 'table'
                                        ? 'bg-white dark:bg-gray-600 text-[#0d544c] shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                title="Table View"
                            >
                                <MdTableRows size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-lg transition-all duration-300 ${
                                    viewMode === 'grid'
                                        ? 'bg-white dark:bg-gray-600 text-[#0d544c] shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                title="Grid View"
                            >
                                <MdGridView size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search revenue heads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Schedule Filter */}
                    <div className="relative">
                        <select
                            value={selectedSchedule}
                            onChange={(e) => setSelectedSchedule(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent appearance-none cursor-pointer transition-all duration-300"
                        >
                            <option value="all">All Schedules</option>
                            {schedules.map(schedule => (
                                <option key={schedule.number} value={schedule.number}>
                                    Schedule {schedule.number}: {schedule.name}
                                </option>
                            ))}
                        </select>
                        <FaListOl className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={14} />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent appearance-none cursor-pointer transition-all duration-300"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <MdCategory className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
                    </div>

                    {/* Active Filter */}
                    <div className="flex items-center justify-center">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={activeOnly}
                                onChange={(e) => setActiveOnly(e.target.checked)}
                                className="w-5 h-5 text-[#0d544c] border-gray-300 rounded focus:ring-[#0d544c] focus:ring-2 cursor-pointer"
                            />
                            <span className="ml-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#0d544c] dark:group-hover:text-[#3B78BD] transition-colors">
                                Active Only
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredHeads.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{revenueHeads.length}</span> revenue heads
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <CSVLink
                            data={prepareExportData()}
                            headers={csvHeaders}
                            filename={generateFilename()}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                            onClick={() => {
                                toast.success(`Exporting ${filteredHeads.length} revenue heads to CSV`);
                            }}
                        >
                            <FaFileCsv size={16} />
                            <span>Export CSV</span>
                        </CSVLink>
                        <CSVLink
                            data={prepareExportData()}
                            headers={csvHeaders}
                            filename={generateFilename().replace('.csv', '.xlsx')}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                            onClick={() => {
                                toast.success(`Exporting ${filteredHeads.length} revenue heads to Excel`);
                            }}
                        >
                            <FaFileExcel size={16} />
                            <span>Export Excel</span>
                        </CSVLink>
                    </div>
                </div>
            </div>

            {/* Revenue Heads Content - Grid or Table View */}
            {viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedHeads.map((head, index) => (
                        <div
                            key={head.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="px-2.5 py-1 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-lg text-xs font-bold">
                                            {head.code}
                                        </span>
                                        {head.is_active ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                                <FaCheckCircle className="mr-1" size={10} />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                                                <FaTimesCircle className="mr-1" size={10} />
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                                        {head.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                        <MdCategory size={14} />
                                        <span>Category</span>
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">{head.category}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                        <FaCalendarAlt size={12} />
                                        <span>Frequency</span>
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">{head.payment_frequency}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                        <FaListOl size={12} />
                                        <span>Tariffs</span>
                                    </span>
                                    <span className="font-semibold text-[#0d544c] dark:text-[#3B78BD]">
                                        {head.tariffs?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleView(head)}
                                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300"
                                    title="View Details"
                                >
                                    <FaEye size={14} />
                                    <span className="text-xs font-medium">View</span>
                                </button>
                                <button
                                    onClick={() => handleEdit(head)}
                                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300"
                                    title="Edit"
                                >
                                    <FaEdit size={14} />
                                    <span className="text-xs font-medium">Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(head.id, head.name)}
                                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
                                    title="Delete"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Table View */
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Tariffs
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Payment Frequency
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedHeads.map((head, index) => (
                                    <tr
                                        key={head.id}
                                        className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-750 transition-all duration-200"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0d544c] dark:text-[#3B78BD]">
                                            {head.code}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {head.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d544c] to-[#3B78BD]">
                                                    <span className="text-white font-bold text-xs">
                                                        {head.tariffs?.length || 0}
                                                    </span>
                                                </div>
                                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                                    {(head.tariffs?.length || 0) === 1 ? 'tariff' : 'tariffs'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                <MdCategory className="mr-1" size={12} />
                                                {head.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                                <FaCalendarAlt className="mr-1" size={10} />
                                                {head.payment_frequency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {head.is_active ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700">
                                                    <FaCheckCircle className="mr-1.5" size={12} />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">
                                                    <FaTimesCircle className="mr-1.5" size={12} />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleView(head)}
                                                    className="p-2 rounded-lg text-green-600 hover:text-white hover:bg-green-600 dark:text-green-400 dark:hover:bg-green-600 transition-all duration-300 group"
                                                    title="View Details"
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(head)}
                                                    className="p-2 rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 dark:text-blue-400 dark:hover:bg-blue-600 transition-all duration-300 group"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(head.id, head.name)}
                                                    className="p-2 rounded-lg text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:bg-red-600 transition-all duration-300 group"
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

            {/* Empty State */}
            {filteredHeads.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <FaBook className="text-gray-400 dark:text-gray-500" size={24} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No revenue heads found</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your filters or search term</p>
                </div>
            )}

            {/* Pagination */}
            {filteredHeads.length > 0 && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Items per page selector */}
                            <div className="flex items-center gap-2.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Show
                                </label>
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="px-3.5 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300 cursor-pointer"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    entries
                                </label>
                            </div>

                            {/* Pagination info */}
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600">
                                Showing <span className="text-[#0d544c] dark:text-[#3B78BD] font-semibold">{filteredHeads.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                                <span className="text-[#0d544c] dark:text-[#3B78BD] font-semibold">{Math.min(currentPage * itemsPerPage, filteredHeads.length)}</span> of{' '}
                                <span className="text-[#0d544c] dark:text-[#3B78BD] font-semibold">{filteredHeads.length}</span> entries
                            </div>

                            {/* Pagination buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[#0d544c] hover:to-[#3B78BD] hover:text-white hover:border-transparent transition-all duration-300"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[#0d544c] hover:to-[#3B78BD] hover:text-white hover:border-transparent transition-all duration-300"
                                >
                                    Previous
                                </button>

                                {/* Page numbers */}
                                <div className="flex gap-1.5">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`min-w-[2.5rem] px-3 py-2 border rounded-xl text-sm font-semibold transition-all duration-300 ${
                                                    currentPage === pageNum
                                                        ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white border-transparent shadow-md'
                                                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-[#0d544c] hover:text-[#0d544c] dark:hover:border-[#3B78BD] dark:hover:text-[#3B78BD]'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[#0d544c] hover:to-[#3B78BD] hover:text-white hover:border-transparent transition-all duration-300"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-[#0d544c] hover:to-[#3B78BD] hover:text-white hover:border-transparent transition-all duration-300"
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideIn">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] px-6 py-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                        {editingHead ? <FaEdit className="text-white" size={20} /> : <FaPlus className="text-white" size={20} />}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingHead ? 'Edit Revenue Head' : 'Add Revenue Head'}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                                    title="Close"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                                            placeholder="Enter revenue code"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Schedule <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="schedule_number"
                                            value={formData.schedule_number}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300 cursor-pointer"
                                        >
                                            {schedules.map(s => (
                                                <option key={s.number} value={s.number}>
                                                    Schedule {s.number}: {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                                        placeholder="Enter revenue head name"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Paragraph Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="paragraph_number"
                                            value={formData.paragraph_number}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                                            placeholder="e.g., 1.0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Sub-Paragraph
                                        </label>
                                        <input
                                            type="text"
                                            name="sub_paragraph"
                                            value={formData.sub_paragraph}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                                            placeholder="e.g., (a)"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                                            placeholder="Enter category"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Frequency <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="payment_frequency"
                                            value={formData.payment_frequency}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300 cursor-pointer"
                                        >
                                            {paymentFrequencies.map(pf => (
                                                <option key={pf.value} value={pf.value}>
                                                    {pf.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Pricing Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="pricing_type"
                                            value={formData.pricing_type}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300 cursor-pointer"
                                        >
                                            {pricingTypes.map(pt => (
                                                <option key={pt.value} value={pt.value}>
                                                    {pt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Default Amount
                                        </label>
                                        <input
                                            type="number"
                                            name="default_amount"
                                            value={formData.default_amount}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        By-Law Reference
                                    </label>
                                    <input
                                        type="text"
                                        name="bylaw_reference"
                                        value={formData.bylaw_reference}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300"
                                        placeholder="Enter by-law reference"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-transparent transition-all duration-300 resize-none"
                                        placeholder="Enter description..."
                                    />
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-[#0d544c] border-gray-300 rounded focus:ring-[#0d544c] focus:ring-2 cursor-pointer"
                                        />
                                        <span className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#0d544c] dark:group-hover:text-[#3B78BD] transition-colors">
                                            Active Revenue Head
                                        </span>
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
                                        Enable this revenue head for use in the system
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#0a3d37] hover:to-[#2d5fa0] text-white rounded-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                    >
                                        <FaSave size={16} />
                                        <span>{loading ? 'Saving...' : 'Save Revenue Head'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && viewingHead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Revenue Head Details
                                </h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Code</label>
                                            <p className="mt-1 text-gray-900 dark:text-white font-semibold">{viewingHead.code}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                            <p className="mt-1">
                                                {viewingHead.is_active ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        Inactive
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule & Classification */}
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Classification</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Schedule Number</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                Schedule {viewingHead.schedule_number} - {schedules.find(s => s.number === viewingHead.schedule_number)?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Paragraph Number</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.paragraph_number || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Sub-Paragraph</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.sub_paragraph || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.category || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Frequency</label>
                                            <p className="mt-1 text-gray-900 dark:text-white capitalize">{viewingHead.payment_frequency || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Pricing Type</label>
                                            <p className="mt-1 text-gray-900 dark:text-white capitalize">{viewingHead.pricing_type?.replace('_', ' ') || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Legal References */}
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal References</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">By-Law Reference</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.bylaw_reference || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Legal Description</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.legal_description || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Details</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                                            <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.description || 'No description provided'}</p>
                                        </div>
                                        {viewingHead.requires_renewal && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Renewal Period</label>
                                                <p className="mt-1 text-gray-900 dark:text-white">{viewingHead.renewal_period_days} days</p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Effective From</label>
                                                <p className="mt-1 text-gray-900 dark:text-white">
                                                    {viewingHead.effective_from ? new Date(viewingHead.effective_from).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Effective To</label>
                                                <p className="mt-1 text-gray-900 dark:text-white">
                                                    {viewingHead.effective_to ? new Date(viewingHead.effective_to).toLocaleDateString() : 'Indefinite'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tariffs */}
                                {viewingHead.tariffs && viewingHead.tariffs.length > 0 && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Associated Tariffs</h3>
                                        <div className="space-y-3">
                                            {viewingHead.tariffs.map((tariff, index) => (
                                                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Purpose</label>
                                                            <p className="mt-1 text-gray-900 dark:text-white">{tariff.purpose || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                                                            <p className="mt-1 text-gray-900 dark:text-white font-bold text-lg">
                                                                ₦{Number(tariff.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                                                            <p className="mt-1 text-gray-900 dark:text-white">{tariff.category || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Frequency</label>
                                                            <p className="mt-1 text-gray-900 dark:text-white capitalize">{tariff.payment_frequency || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleEdit(viewingHead);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueHeads;
