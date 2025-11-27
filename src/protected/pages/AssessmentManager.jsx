import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
    fetchAssessments,
    getAssessmentStatistics,
    deleteAssessment,
    reviewAssessment,
    approveAssessment,
    rejectAssessment,
    generateInvoiceFromAssessment,
} from '../../apis/invoiceAssessmentActions';
import { getEnabledPaymentGateways } from '../../apis/authActions';
import AssessmentStatistics from '../components/assessment/AssessmentStatistics';
import AssessmentTable from '../components/assessment/AssessmentTable';
import AssessmentFilters from '../components/assessment/AssessmentFilters';
import CreateAssessmentModal from '../components/assessment/CreateAssessmentModal';
import ViewAssessmentModal from '../components/assessment/ViewAssessmentModal';
import ApproveAssessmentModal from '../components/assessment/ApproveAssessmentModal';
import RejectAssessmentModal from '../components/assessment/RejectAssessmentModal';
import ConfirmModal from '../components/common/ConfirmModal';
import InputModal from '../components/common/InputModal';
import InvoicePaymentModal from '../components/InvoicePaymentModal';
import { toast } from 'react-toastify';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';

const AssessmentManager = () => {
    const { token } = useContext(AuthContext);
    const [assessments, setAssessments] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    const [filters, setFilters] = useState({
        status: '',
        template_id: '',
        revenue_head_id: '',
        applicant_phone: '',
        start_date: '',
        end_date: '',
        search: '',
        per_page: 15,
        page: 1,
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [generatedInvoice, setGeneratedInvoice] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        fetchData();
        fetchStats();
        loadPaymentMethods();
    }, [filters, token]);

    const loadPaymentMethods = async () => {
        try {
            const response = await getEnabledPaymentGateways();
            setPaymentMethods(response?.data || []);
        } catch (err) {
            console.error('Error loading payment methods:', err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchAssessments(token, filters, setError, setLoading);
            console.log('Assessments API Response:', response);
            if (response) {
                // Handle different response structures
                const assessmentsData = response.assessments?.data || response.data?.data || response.data || [];
                const paginationData = response.assessments || response.data || response.pagination || {};

                setAssessments(Array.isArray(assessmentsData) ? assessmentsData : []);
                if (paginationData.current_page) {
                    setPagination({
                        current_page: paginationData.current_page || 1,
                        last_page: paginationData.last_page || 1,
                        per_page: paginationData.per_page || 15,
                        total: paginationData.total || 0,
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching assessments:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getAssessmentStatistics(token, setError, () => {});
            if (response && response.statistics) {
                setStatistics(response.statistics);
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters, page: 1 });
    };

    const handlePageChange = (page) => {
        setFilters({ ...filters, page });
    };

    const handleCreate = () => {
        setShowCreateModal(true);
    };

    const handleView = (assessment) => {
        setSelectedAssessment(assessment);
        setShowViewModal(true);
    };

    const handleReview = (assessment) => {
        setSelectedAssessment(assessment);
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (notes) => {
        try {
            setLoading(true);
            await reviewAssessment(token, selectedAssessment.id, notes, setError, () => {});
            toast.success('Assessment marked as under review');
            setShowReviewModal(false);
            setSelectedAssessment(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to mark assessment under review');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (assessment) => {
        setSelectedAssessment(assessment);
        setShowApproveModal(true);
    };

    const handleReject = (assessment) => {
        setSelectedAssessment(assessment);
        setShowRejectModal(true);
    };

    const handleGenerateInvoice = (assessment) => {
        setSelectedAssessment(assessment);
        setShowGenerateInvoiceModal(true);
    };

    const handleGenerateInvoiceConfirm = async () => {
        try {
            setLoading(true);
            const response = await generateInvoiceFromAssessment(token, selectedAssessment.id, setError, () => {});
            toast.success(`Invoice ${response.invoice.invoice_number} generated successfully`);

            // Store the generated invoice and show payment modal
            setGeneratedInvoice(response.invoice);
            setShowGenerateInvoiceModal(false);
            setShowPaymentModal(true);

            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to generate invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (assessment) => {
        setSelectedAssessment(assessment);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            await deleteAssessment(token, selectedAssessment.id, setError, () => {});
            toast.success('Assessment deleted successfully');
            setShowDeleteModal(false);
            setSelectedAssessment(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to delete assessment');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setShowViewModal(false);
        setShowApproveModal(false);
        setShowRejectModal(false);
        setShowReviewModal(false);
        setShowGenerateInvoiceModal(false);
        setShowDeleteModal(false);
        setShowPaymentModal(false);
        setSelectedAssessment(null);
        setGeneratedInvoice(null);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        setGeneratedInvoice(null);
        setSelectedAssessment(null);
        toast.success('Payment recorded successfully!');
        fetchData();
        fetchStats();
    };

    const handleSuccess = () => {
        handleModalClose();
        fetchData();
        fetchStats();
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
            {error && (
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                            <AiOutlineClose size={20} />
                        </button>
                    </div>
                </div>
            )}

            <div className="px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Assessment Manager</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage revenue assessments and calculations</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleCreate}
                            className="px-5 py-2.5 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 shadow-md flex items-center space-x-2 font-semibold"
                        >
                            <AiOutlinePlus size={20} />
                            <span>Create Assessment</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Section */}
                <AssessmentStatistics statistics={statistics} loading={loading} />

                {/* Filters Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                    <AssessmentFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <AssessmentTable
                            assessments={assessments}
                            loading={loading}
                            error={error}
                            onView={handleView}
                            onReview={handleReview}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onGenerateInvoice={handleGenerateInvoice}
                            onDelete={handleDelete}
                        />
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                                {pagination.total} assessments
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="px-4 py-2 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="px-4 py-2 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateAssessmentModal
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    token={token}
                />
            )}

            {showViewModal && selectedAssessment && (
                <ViewAssessmentModal
                    assessment={selectedAssessment}
                    onClose={handleModalClose}
                    token={token}
                />
            )}

            {showApproveModal && selectedAssessment && (
                <ApproveAssessmentModal
                    assessment={selectedAssessment}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    token={token}
                />
            )}

            {showRejectModal && selectedAssessment && (
                <RejectAssessmentModal
                    assessment={selectedAssessment}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    token={token}
                />
            )}

            {/* Review Notes Modal */}
            <InputModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onSubmit={handleReviewSubmit}
                title="Review Assessment"
                message={selectedAssessment ? `Enter review notes for assessment ${selectedAssessment.assessment_number}:` : ''}
                placeholder="Enter your review notes..."
                confirmText="Submit Review"
                multiline={true}
                loading={loading}
            />

            {/* Generate Invoice Confirmation */}
            <ConfirmModal
                isOpen={showGenerateInvoiceModal}
                onClose={() => setShowGenerateInvoiceModal(false)}
                onConfirm={handleGenerateInvoiceConfirm}
                title="Generate Invoice"
                message={selectedAssessment ? `Generate invoice for assessment ${selectedAssessment.assessment_number}?` : ''}
                confirmText="Generate Invoice"
                confirmButtonClass="bg-green-500 hover:bg-green-600"
                loading={loading}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Assessment"
                message={selectedAssessment ? `Are you sure you want to delete assessment ${selectedAssessment.assessment_number}? This action cannot be undone.` : ''}
                confirmText="Delete"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
                loading={loading}
            />

            {/* Payment Modal for Generated Invoice */}
            {showPaymentModal && generatedInvoice && paymentMethods.length > 0 && (
                <InvoicePaymentModal
                    invoice={generatedInvoice}
                    paymentMethods={paymentMethods}
                    onClose={handleModalClose}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default AssessmentManager;
