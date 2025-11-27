import React, { useState, useEffect } from 'react';
import {
    FaExclamationTriangle, FaGavel, FaCheckCircle, FaTimesCircle,
    FaMoneyBillWave, FaSearch, FaFilter, FaTimes, FaSave,
    FaBan, FaFileInvoiceDollar, FaPaperPlane, FaCalendarAlt
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import InitLoader from '../../../common/InitLoader';
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
        if (!window.confirm('Send demand notice for this penalty assessment?')) return;

        try {
            await sendDemandNotice(assessmentId);
            toast.success('Demand notice sent successfully');
            loadData();
        } catch (error) {
            console.error('Error sending demand notice:', error);
            toast.error('Failed to send demand notice');
        }
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
        if (!window.confirm('Process all overdue invoices and assess penalties? This may take a while.')) return;

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

    const handleBulkSendNotices = async () => {
        if (!window.confirm('Send demand notices to all applicable penalty assessments?')) return;

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

    const formatCurrency = (amount) => {
        return `₦${parseFloat(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-NG');
    };

    if (loading && assessments.length === 0) {
        return <InitLoader />;
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Penalty Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage penalty assessments, payments, waivers, and legal actions (Section 9, 11 & 13)
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {summary.outstanding?.count || 0}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatCurrency(summary.outstanding?.total || 0)}
                            </p>
                        </div>
                        <FaExclamationTriangle className="text-orange-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                            <p className="text-2xl font-bold text-green-600">
                                {summary.paid?.count || 0}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatCurrency(summary.paid?.total || 0)}
                            </p>
                        </div>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Waived</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {summary.waived?.count || 0}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatCurrency(summary.waived?.total || 0)}
                            </p>
                        </div>
                        <FaBan className="text-blue-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Legal Action</p>
                            <p className="text-2xl font-bold text-red-600">
                                {summary.legal_action?.count || 0}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatCurrency(summary.legal_action?.total || 0)}
                            </p>
                        </div>
                        <FaGavel className="text-red-500 text-3xl" />
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by invoice, payer, court ref..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Outstanding Only */}
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={outstandingOnly}
                                onChange={(e) => setOutstandingOnly(e.target.checked)}
                                className="mr-2"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Outstanding Only</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredAssessments.length} of {assessments.length} assessments
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleBulkSendNotices}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
                        >
                            <FaPaperPlane /> Bulk Send Notices
                        </button>
                        <button
                            onClick={handleProcessOverdue}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
                        >
                            <FaCalendarAlt /> Process Overdue
                        </button>
                        <button
                            onClick={handleAssessPenalty}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
                        >
                            <FaExclamationTriangle /> Assess Penalty
                        </button>
                    </div>
                </div>
            </div>

            {/* Assessments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Invoice
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Payer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Original Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Penalty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Balance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Days Overdue
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredAssessments.map((assessment) => (
                                <tr key={assessment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {assessment.invoice?.invoice_number || '-'}
                                        {assessment.court_reference && (
                                            <div className="text-xs text-gray-500">
                                                Court: {assessment.court_reference}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {assessment.payer?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {formatCurrency(assessment.original_amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                        {formatCurrency(assessment.penalty_amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                                        {formatCurrency(assessment.balance)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {assessment.days_overdue || 0} days
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${assessment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                              assessment.status === 'waived' ? 'bg-blue-100 text-blue-800' :
                                              assessment.status === 'legal_action' ? 'bg-red-100 text-red-800' :
                                              'bg-orange-100 text-orange-800'}`}>
                                            {assessment.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            {assessment.balance > 0 && !assessment.is_waived && (
                                                <>
                                                    <button
                                                        onClick={() => handleRecordPayment(assessment)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Record Payment"
                                                    >
                                                        <MdPayment size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleWaive(assessment)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Waive Penalty"
                                                    >
                                                        <FaBan size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {!assessment.demand_notice_sent_at && assessment.balance > 0 && (
                                                <button
                                                    onClick={() => handleSendDemandNotice(assessment.id)}
                                                    className="text-purple-600 hover:text-purple-900"
                                                    title="Send Demand Notice"
                                                >
                                                    <FaPaperPlane size={16} />
                                                </button>
                                            )}
                                            {assessment.demand_notice_sent_at && !assessment.legal_action_initiated && assessment.balance > 0 && (
                                                <button
                                                    onClick={() => handleInitiateLegal(assessment)}
                                                    className="text-red-600 hover:text-red-900"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Assess Penalty
                                </h2>
                                <button onClick={() => setShowAssessModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitAssess} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Invoice ID *
                                    </label>
                                    <input
                                        type="number"
                                        value={assessForm.invoice_id}
                                        onChange={(e) => setAssessForm({ ...assessForm, invoice_id: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Penalty Rule ID (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        value={assessForm.penalty_rule_id}
                                        onChange={(e) => setAssessForm({ ...assessForm, penalty_rule_id: e.target.value })}
                                        placeholder="Leave blank for default 20% rule"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Default: 20% surcharge after 7 working days</p>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAssessModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaSave /> {loading ? 'Assessing...' : 'Assess Penalty'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Record Payment Modal */}
            {showPaymentModal && selectedAssessment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Record Payment
                                </h2>
                                <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Balance Due</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(selectedAssessment.balance)}
                                </p>
                            </div>

                            <form onSubmit={handleSubmitPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentForm.payment_reference}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, payment_reference: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaSave /> {loading ? 'Recording...' : 'Record Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Waive Penalty Modal */}
            {showWaiveModal && selectedAssessment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Waive Penalty
                                </h2>
                                <button onClick={() => setShowWaiveModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitWaive} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Reason for Waiver *
                                    </label>
                                    <textarea
                                        value={waiveForm.reason}
                                        onChange={(e) => setWaiveForm({ ...waiveForm, reason: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Provide detailed reason for waiving this penalty..."
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowWaiveModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaSave /> {loading ? 'Waiving...' : 'Waive Penalty'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Legal Action Modal */}
            {showLegalModal && selectedAssessment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Initiate Legal Action
                                </h2>
                                <button onClick={() => setShowLegalModal(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitLegal} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Court Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={legalForm.court_reference}
                                        onChange={(e) => setLegalForm({ ...legalForm, court_reference: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="e.g., HC/YEN/2025/123"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={legalForm.notes}
                                        onChange={(e) => setLegalForm({ ...legalForm, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Additional notes about legal action..."
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowLegalModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaGavel /> {loading ? 'Initiating...' : 'Initiate Legal Action'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PenaltyManagement;
