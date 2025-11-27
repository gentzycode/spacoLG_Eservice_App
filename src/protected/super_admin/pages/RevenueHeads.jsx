import React, { useState, useEffect } from 'react';
import {
    FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaSave,
    FaBook, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaListOl, FaEye, FaDownload
} from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { CSVLink } from 'react-csv';
import InitLoader from '../../../common/InitLoader';
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this revenue head?')) return;

        try {
            await deleteRevenueHead(id);
            toast.success('Revenue head deleted successfully');
            loadData();
        } catch (error) {
            console.error('Error deleting revenue head:', error);
            toast.error('Failed to delete revenue head');
        }
    };

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
        return <InitLoader />;
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Revenue Heads Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage revenue items from Yenagoa LGA By-Laws (Revenue) 2014 (As Amended 2025)
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue Heads</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
                        </div>
                        <FaBook className="text-blue-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                            <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
                        </div>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Schedules</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
                        </div>
                        <FaListOl className="text-purple-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                        </div>
                        <MdCategory className="text-orange-500 text-3xl" />
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search revenue heads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Schedule Filter */}
                    <select
                        value={selectedSchedule}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Schedules</option>
                        {schedules.map(schedule => (
                            <option key={schedule.number} value={schedule.number}>
                                Schedule {schedule.number}: {schedule.name}
                            </option>
                        ))}
                    </select>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Active Filter */}
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={activeOnly}
                                onChange={(e) => setActiveOnly(e.target.checked)}
                                className="mr-2"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Active Only</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredHeads.length} of {revenueHeads.length} revenue heads
                    </p>
                    <div className="flex gap-3">
                        <CSVLink
                            data={prepareExportData()}
                            headers={csvHeaders}
                            filename={generateFilename()}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                            onClick={() => {
                                toast.success(`Exporting ${filteredHeads.length} revenue heads to CSV`);
                            }}
                        >
                            <FaDownload /> Export to CSV
                        </CSVLink>
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                            <FaPlus /> Add Revenue Head
                        </button>
                    </div>
                </div>
            </div>

            {/* Revenue Heads Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Payment Frequency
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedHeads.map((head) => (
                                <tr key={head.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {head.code}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {head.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {head.schedule_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {head.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {head.payment_frequency}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {head.is_active ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleView(head)}
                                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-3"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(head)}
                                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(head.id)}
                                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredHeads.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No revenue heads found</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredHeads.length > 0 && (
                    <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Items per page selector */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    Show
                                </label>
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <label className="text-sm text-gray-700 dark:text-gray-300">
                                    entries
                                </label>
                            </div>

                            {/* Pagination info */}
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {filteredHeads.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredHeads.length)} of {filteredHeads.length} entries
                            </div>

                            {/* Pagination buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Previous
                                </button>

                                {/* Page numbers */}
                                <div className="flex gap-1">
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
                                                className={`px-3 py-1 border rounded-lg text-sm ${
                                                    currentPage === pageNum
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
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
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {editingHead ? 'Edit Revenue Head' : 'Add Revenue Head'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Schedule *
                                        </label>
                                        <select
                                            name="schedule_number"
                                            value={formData.schedule_number}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Paragraph Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="paragraph_number"
                                            value={formData.paragraph_number}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Sub-Paragraph
                                        </label>
                                        <input
                                            type="text"
                                            name="sub_paragraph"
                                            value={formData.sub_paragraph}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Category *
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Payment Frequency *
                                        </label>
                                        <select
                                            name="payment_frequency"
                                            value={formData.payment_frequency}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {paymentFrequencies.map(pf => (
                                                <option key={pf.value} value={pf.value}>
                                                    {pf.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Pricing Type *
                                        </label>
                                        <select
                                            name="pricing_type"
                                            value={formData.pricing_type}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {pricingTypes.map(pt => (
                                                <option key={pt.value} value={pt.value}>
                                                    {pt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Default Amount
                                        </label>
                                        <input
                                            type="number"
                                            name="default_amount"
                                            value={formData.default_amount}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        By-Law Reference
                                    </label>
                                    <input
                                        type="text"
                                        name="bylaw_reference"
                                        value={formData.bylaw_reference}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Active
                                        </span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaSave /> {loading ? 'Saving...' : 'Save'}
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
