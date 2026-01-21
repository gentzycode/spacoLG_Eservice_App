import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    FaExclamationTriangle, FaGavel, FaCheckCircle, FaTimesCircle,
    FaMoneyBillWave, FaSearch, FaFilter, FaTimes, FaSave,
    FaBan, FaFileInvoiceDollar, FaPaperPlane, FaCalendarAlt,
    FaChartLine, FaSync
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import PageLoader from '../../../common/PageLoader';
import {
    fetchPenaltyAssessments,
    assessPenalty,
    recordPenaltyPayment,
    waivePenalty,
    sendDemandNotice,
    initiateLegalAction,
    processOverdueInvoices,
    bulkSendDemandNotices,
    getPenaltySummary,
    getAssessmentsRequiringLegalAction,
} from '../../../apis/revenueActions';
import { toast } from 'react-toastify';

const PenaltyManagement = () => {
    const [assessments, setAssessments] = useState([]);
    const [filteredAssessments, setFilteredAssessments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAssessModal, setShowAssessModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showWaiveModal, setShowWaiveModal] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [outstandingOnly, setOutstandingOnly] = useState(false);

    // Summary statistics
    const [summary, setSummary] = useState({
        outstanding: { count: 0, total: 0 },
        paid: { count: 0, total: 0 },
        waived: { count: 0, total: 0 },
        legal_action: { count: 0, total: 0 },
    });

    // Form states
    const [assessForm, setAssessForm] = useState({
        invoice_id: '',
        penalty_rule_id: '',
    });

    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        payment_reference: '',
    });

    const [waiveForm, setWaiveForm] = useState({
        reason: '',
    });

    const [legalForm, setLegalForm] = useState({
        court_reference: '',
        notes: '',
    });

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'assessed', label: 'Assessed' },
        { value: 'demand_notice_sent', label: 'Demand Notice Sent' },
        { value: 'partially_paid', label: 'Partially Paid' },
        { value: 'paid', label: 'Paid' },
        { value: 'waived', label: 'Waived' },
        { value: 'legal_action', label: 'Legal Action' },
    ];

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterAssessments();
    }, [searchTerm, statusFilter, outstandingOnly, assessments]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [assessmentsResponse, summaryResponse] = await Promise.all([
                fetchPenaltyAssessments(),
                getPenaltySummary(),
            ]);

            // Backend returns { status, code, data: { data: [...], total, ... } }
            setAssessments(assessmentsResponse.data?.data || []);
            setSummary(summaryResponse.data || {});
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load penalty assessments');
        } finally {
            setLoading(false);
        }
    };

    const filterAssessments = () => {
        let filtered = [...assessments];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(a =>
                a.invoice?.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.court_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.payer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => a.status === statusFilter);
        }

        // Outstanding only
        if (outstandingOnly) {
            filtered = filtered.filter(a => a.balance > 0 && a.status !== 'waived');
        }

        setFilteredAssessments(filtered);
    };

    const handleAssessPenalty = () => {
        setAssessForm({ invoice_id: '', penalty_rule_id: '' });
        setShowAssessModal(true);
    };

    const handleSubmitAssess = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await assessPenalty(assessForm);
            toast.success('Penalty assessed successfully');
            setShowAssessModal(false);
            loadData();
        } catch (error) {
            console.error('Error assessing penalty:', error);
            toast.error(error.response?.data?.message || 'Failed to assess penalty');
        } finally {
            setLoading(false);
        }
    };

    const handleRecordPayment = (assessment) => {
        setSelectedAssessment(assessment);
        setPaymentForm({
            amount: assessment.balance || '',
            payment_reference: '',
        });
        setShowPaymentModal(true);
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await recordPenaltyPayment(selectedAssessment.id, paymentForm);
            toast.success('Payment recorded successfully');
            setShowPaymentModal(false);
            loadData();
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error(error.response?.data?.message || 'Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    const handleWaive = (assessment) => {
        setSelectedAssessment(assessment);
        setWaiveForm({ reason: '' });
        setShowWaiveModal(true);
    };

    const handleSubmitWaive = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await waivePenalty(selectedAssessment.id, waiveForm);
            toast.success('Penalty waived successfully');
            setShowWaiveModal(false);
            loadData();
        } catch (error) {
            console.error('Error waiving penalty:', error);
            toast.error(error.response?.data?.message || 'Failed to waive penalty');
        } finally {
            setLoading(false);
        }
    };

    const handleSendDemandNotice = async (assessmentId) => {
        // Create a custom confirmation toast
        const confirmSend = () => {
            toast.dismiss();
            performSend();
        };

        const performSend = async () => {
            try {
                await sendDemandNotice(assessmentId);
                toast.success('Demand notice sent successfully');
                loadData();
            } catch (error) {
                console.error('Error sending demand notice:', error);
                toast.error('Failed to send demand notice');
            }
        };

        // Show confirmation toast
        toast.info(
            <div>
                <p className="font-semibold mb-2">Send demand notice?</p>
                <p className="text-sm mb-3">This will notify the payer about the penalty assessment.</p>
                <div className="flex gap-2">
                    <button
                        onClick={confirmSend}
                        className="bg-[#0d544c] hover:bg-[#0d544c]/90 text-white px-3 py-1 rounded text-sm font-semibold"
                    >
                        Send Notice
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
            }
        );
    };

    const handleInitiateLegal = (assessment) => {
        setSelectedAssessment(assessment);
        setLegalForm({ court_reference: '', notes: '' });
        setShowLegalModal(true);
    };

    const handleSubmitLegal = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await initiateLegalAction(selectedAssessment.id, legalForm);
            toast.success('Legal action initiated successfully');
            setShowLegalModal(false);
            loadData();
        } catch (error) {
            console.error('Error initiating legal action:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate legal action');
        } finally {
            setLoading(false);
        }
    };

    const handleProcessOverdue = async () => {
        // Create a custom confirmation toast
        const confirmProcess = () => {
            toast.dismiss();
            performProcess();
        };

        const performProcess = async () => {
            setLoading(true);
            try {
                const result = await processOverdueInvoices({ grace_days: 7 });
                toast.success(`Processed ${result.data.assessed_count} overdue invoices`);
                loadData();
            } catch (error) {
                console.error('Error processing overdue invoices:', error);
                toast.error('Failed to process overdue invoices');
            } finally {
                setLoading(false);
            }
        };

        // Show confirmation toast
        toast.warning(
            <div>
                <p className="font-semibold mb-2">Process overdue invoices?</p>
                <p className="text-sm mb-3">This will assess penalties for all overdue invoices. This may take a while.</p>
                <div className="flex gap-2">
                    <button
                        onClick={confirmProcess}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm font-semibold"
                    >
                        Process Now
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
            }
        );
    };

    const handleBulkSendNotices = async () => {
        // Create a custom confirmation toast
        const confirmBulkSend = () => {
            toast.dismiss();
            performBulkSend();
        };

        const performBulkSend = async () => {
            setLoading(true);
            try {
                const result = await bulkSendDemandNotices();
                toast.success(result.message || 'Demand notices sent successfully');
                loadData();
            } catch (error) {
                console.error('Error bulk sending notices:', error);
                toast.error('Failed to send demand notices');
            } finally {
                setLoading(false);
            }
        };

        // Show confirmation toast
        toast.info(
            <div>
                <p className="font-semibold mb-2">Bulk send demand notices?</p>
                <p className="text-sm mb-3">This will send notices to all applicable penalty assessments.</p>
                <div className="flex gap-2">
                    <button
                        onClick={confirmBulkSend}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-semibold"
                    >
                        Send All
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
            }
        );
    };

    const formatCurrency = (amount) => {
        return `₦${parseFloat(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-NG');
    };

    if (loading && assessments.length === 0) {
        return <PageLoader />;
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
            {/* Header */}
            <div className="mb-8 animate-fadeIn">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
                            <FaGavel className="text-[#0d544c]" />
                            <span>Penalty Management</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Manage penalty assessments, payments, waivers, and legal actions (Section 9, 11 & 13)
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium shadow-sm"
                        >
                            <FaSync size={16} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideIn">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Outstanding</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {summary.outstanding?.count || 0}
                            </p>
                            <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                {formatCurrency(summary.outstanding?.total || 0)}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                            <FaExclamationTriangle className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Paid</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {summary.paid?.count || 0}
                            </p>
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                {formatCurrency(summary.paid?.total || 0)}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                            <FaCheckCircle className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Waived</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {summary.waived?.count || 0}
                            </p>
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {formatCurrency(summary.waived?.total || 0)}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                            <FaBan className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Legal Action</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {summary.legal_action?.count || 0}
                            </p>
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                {formatCurrency(summary.legal_action?.total || 0)}
                            </p>
                        </div>
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                            <FaGavel className="text-white text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by invoice, payer, court ref..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c] transition-all duration-200"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c] transition-all duration-200"
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Outstanding Only */}
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={outstandingOnly}
                                onChange={(e) => setOutstandingOnly(e.target.checked)}
                                className="mr-2 w-4 h-4 text-[#0d544c] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-[#0d544c] focus:ring-2"
                            />
                            <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-[#0d544c] transition-colors">
                                Outstanding Only
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Showing <span className="text-[#0d544c] dark:text-[#3B78BD] font-bold">{filteredAssessments.length}</span> of <span className="font-semibold">{assessments.length}</span> assessments
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleBulkSendNotices}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                            <FaPaperPlane size={14} />
                            <span>Bulk Send Notices</span>
                        </button>
                        <button
                            onClick={handleProcessOverdue}
                            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                            <FaCalendarAlt size={14} />
                            <span>Process Overdue</span>
                        </button>
                        <button
                            onClick={handleAssessPenalty}
                            className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#0d544c]/90 hover:to-[#3B78BD]/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                            <FaExclamationTriangle size={14} />
                            <span>Assess Penalty</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Assessments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Invoice
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Payer
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Original Amount
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Penalty
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Balance
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Days Overdue
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredAssessments.map((assessment) => (
                                <tr key={assessment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        <div className="font-semibold">{assessment.invoice?.invoice_number || '-'}</div>
                                        {assessment.court_reference && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Court: {assessment.court_reference}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {assessment.payer?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(assessment.original_amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 dark:text-red-500">
                                        {formatCurrency(assessment.penalty_amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600 dark:text-orange-500">
                                        {formatCurrency(assessment.balance)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">{assessment.days_overdue || 0}</span> days
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${assessment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                              assessment.status === 'waived' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                              assessment.status === 'legal_action' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                              'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                            {assessment.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex justify-center gap-2">
                                            {assessment.balance > 0 && !assessment.is_waived && (
                                                <>
                                                    <button
                                                        onClick={() => handleRecordPayment(assessment)}
                                                        className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200"
                                                        title="Record Payment"
                                                    >
                                                        <MdPayment size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleWaive(assessment)}
                                                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                                                        title="Waive Penalty"
                                                    >
                                                        <FaBan size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {!assessment.demand_notice_sent_at && assessment.balance > 0 && (
                                                <button
                                                    onClick={() => handleSendDemandNotice(assessment.id)}
                                                    className="p-2 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-200"
                                                    title="Send Demand Notice"
                                                >
                                                    <FaPaperPlane size={16} />
                                                </button>
                                            )}
                                            {assessment.demand_notice_sent_at && !assessment.legal_action_initiated && assessment.balance > 0 && (
                                                <button
                                                    onClick={() => handleInitiateLegal(assessment)}
                                                    className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
                                                    title="Initiate Legal Action"
                                                >
                                                    <FaGavel size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAssessments.length === 0 && (
                    <div className="text-center py-12">
                        <FaExclamationTriangle className="mx-auto text-gray-400 text-5xl mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No penalty assessments found</p>
                    </div>
                )}
            </div>

            {/* Assess Penalty Modal */}
            {showAssessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideIn">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaExclamationTriangle className="text-[#0d544c]" />
                                    Assess Penalty
                                </h2>
                                <button
                                    onClick={() => setShowAssessModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-all"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitAssess} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Invoice ID *
                                    </label>
                                    <input
                                        type="number"
                                        value={assessForm.invoice_id}
                                        onChange={(e) => setAssessForm({ ...assessForm, invoice_id: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Penalty Rule ID (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        value={assessForm.penalty_rule_id}
                                        onChange={(e) => setAssessForm({ ...assessForm, penalty_rule_id: e.target.value })}
                                        placeholder="Leave blank for default 20% rule"
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d544c] focus:border-[#0d544c] transition-all"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Default: 20% surcharge after 7 working days</p>
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowAssessModal(false)}
                                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] hover:from-[#0d544c]/90 hover:to-[#3B78BD]/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <FaSave size={14} />
                                        <span>{loading ? 'Assessing...' : 'Assess Penalty'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Record Payment Modal */}
            {showPaymentModal && selectedAssessment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideIn">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <MdPayment className="text-green-600" />
                                    Record Payment
                                </h2>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-all"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="mb-6 p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                                <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Balance Due</p>
                                <p className="text-3xl font-bold text-green-900 dark:text-green-300">
                                    {formatCurrency(selectedAssessment.balance)}
                                </p>
                            </div>

                            <form onSubmit={handleSubmitPayment} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Amount *
                                    </label>
                                    <input
                                        type="number"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                        required
                                        step="0.01"
                                        min="0"
                                        max={selectedAssessment.balance}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Payment Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentForm.payment_reference}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, payment_reference: e.target.value })}
                                        placeholder="e.g., TXN123456789"
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <FaSave size={14} />
                                        <span>{loading ? 'Recording...' : 'Record Payment'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Waive Penalty Modal */}
            {showWaiveModal && selectedAssessment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideIn">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaBan className="text-blue-600" />
                                    Waive Penalty
                                </h2>
                                <button
                                    onClick={() => setShowWaiveModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-all"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitWaive} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Reason for Waiver *
                                    </label>
                                    <textarea
                                        value={waiveForm.reason}
                                        onChange={(e) => setWaiveForm({ ...waiveForm, reason: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        placeholder="Provide detailed reason for waiving this penalty..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowWaiveModal(false)}
                                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <FaSave size={14} />
                                        <span>{loading ? 'Waiving...' : 'Waive Penalty'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Legal Action Modal */}
            {showLegalModal && selectedAssessment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideIn">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaGavel className="text-red-600" />
                                    Initiate Legal Action
                                </h2>
                                <button
                                    onClick={() => setShowLegalModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-all"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitLegal} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Court Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={legalForm.court_reference}
                                        onChange={(e) => setLegalForm({ ...legalForm, court_reference: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                        placeholder="e.g., HC/YEN/2025/123"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={legalForm.notes}
                                        onChange={(e) => setLegalForm({ ...legalForm, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                                        placeholder="Additional notes about legal action..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowLegalModal(false)}
                                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                                    >
                                        <FaGavel size={14} />
                                        <span>{loading ? 'Initiating...' : 'Initiate Legal Action'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
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

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                .animate-slideIn {
                    animation: slideIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PenaltyManagement;
