import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
    fetchInvoicesV2,
    getInvoiceV2Statistics,
    deleteInvoiceV2,
    approveInvoiceV2,
    cancelInvoiceV2,
} from '../../apis/invoiceAssessmentActions';
import InvoiceV2Statistics from '../components/invoiceV2/InvoiceV2Statistics';
import InvoiceV2Table from '../components/invoiceV2/InvoiceV2Table';
import InvoiceV2Filters from '../components/invoiceV2/InvoiceV2Filters';
import CreateInvoiceV2Modal from '../components/invoiceV2/CreateInvoiceV2Modal';
import EditInvoiceV2Modal from '../components/invoiceV2/EditInvoiceV2Modal';
import ViewInvoiceV2Modal from '../components/invoiceV2/ViewInvoiceV2Modal';
import RecordPaymentModal from '../components/invoiceV2/RecordPaymentModal';
import PaymentGatewayModal from '../components/invoiceV2/PaymentGatewayModal';
import PaymentCallbackHandler from '../components/invoiceV2/PaymentCallbackHandler';
import ConfirmModal from '../components/common/ConfirmModal';
import InputModal from '../components/common/InputModal';
import { toast } from 'react-toastify';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { FaFileInvoiceDollar, FaSync } from 'react-icons/fa';
import PageLoader from '../../common/PageLoader';

const InvoiceV2Manager = () => {
    const { token } = useContext(AuthContext);
    const [invoices, setInvoices] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        payment_status: '',
        payer_phone: '',
        start_date: '',
        end_date: '',
        search: '',
        per_page: 15,
        page: 1,
    });

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentGatewayModal, setShowPaymentGatewayModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchData();
        fetchStats();
    }, [filters, token]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchInvoicesV2(token, filters, setError, setLoading);
            console.log('Invoice V2 API Response:', response);
            if (response) {
                // Handle different response structures
                const invoicesData = response.invoices?.data || response.data?.data || response.data || [];
                const paginationData = response.invoices || response.data || response.pagination || {};

                setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
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
            console.error('Error fetching invoices:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getInvoiceV2Statistics(token, setError, () => {});
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

    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setShowEditModal(true);
    };

    const handleView = (invoice) => {
        setSelectedInvoice(invoice);
        setShowViewModal(true);
    };

    const handleRecordPayment = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentModal(true);
    };

    const handlePayOnline = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentGatewayModal(true);
    };

    const handleApprove = (invoice) => {
        setSelectedInvoice(invoice);
        setShowApproveModal(true);
    };

    const handleApproveConfirm = async () => {
        try {
            setLoading(true);
            await approveInvoiceV2(token, selectedInvoice.id, setError, () => {});
            toast.success('Invoice approved successfully');
            setShowApproveModal(false);
            setSelectedInvoice(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to approve invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (invoice) => {
        setSelectedInvoice(invoice);
        setShowCancelModal(true);
    };

    const handleCancelSubmit = async (reason) => {
        try {
            setLoading(true);
            await cancelInvoiceV2(token, selectedInvoice.id, reason, setError, () => {});
            toast.success('Invoice cancelled successfully');
            setShowCancelModal(false);
            setSelectedInvoice(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to cancel invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            await deleteInvoiceV2(token, selectedInvoice.id, setError, () => {});
            toast.success('Invoice deleted successfully');
            setShowDeleteModal(false);
            setSelectedInvoice(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to delete invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowPaymentModal(false);
        setShowPaymentGatewayModal(false);
        setShowApproveModal(false);
        setShowCancelModal(false);
        setShowDeleteModal(false);
        setSelectedInvoice(null);
    };

    const handlePaymentComplete = (invoiceId) => {
        console.log('Payment completed for invoice:', invoiceId);
        fetchData();
        fetchStats();
    };

    const handleSuccess = () => {
        handleModalClose();
        fetchData();
        fetchStats();
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
            {error && (
                <div className="mb-4 animate-fadeIn">
                    <div className="flex items-center justify-between text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 shadow-lg">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400">
                            <AiOutlineClose size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="mb-8 animate-fadeIn">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
                            <FaFileInvoiceDollar className="text-[#0d544c]" />
                            <span>Invoice Management</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Create, manage, and track all invoices for individuals and corporates
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-[#0d544c] dark:hover:border-[#3B78BD] hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50"
                        >
                            <FaSync className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold"
                        >
                            <AiOutlinePlus size={20} />
                            <span>Create Invoice</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <InvoiceV2Statistics statistics={statistics} loading={loading} />

            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 animate-fadeIn">
                <InvoiceV2Filters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <div className="p-6">
                    <InvoiceV2Table
                        invoices={invoices}
                        loading={loading}
                        error={error}
                        onView={handleView}
                        onEdit={handleEdit}
                        onRecordPayment={handleRecordPayment}
                        onPayOnline={handlePayOnline}
                        onApprove={handleApprove}
                        onCancel={handleCancel}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                            {pagination.total} invoices
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Previous
                            </button>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateInvoiceV2Modal
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    token={token}
                />
            )}

            {showEditModal && selectedInvoice && (
                <EditInvoiceV2Modal
                    invoice={selectedInvoice}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    token={token}
                />
            )}

            {showViewModal && selectedInvoice && (
                <ViewInvoiceV2Modal
                    invoice={selectedInvoice}
                    onClose={handleModalClose}
                    token={token}
                />
            )}

            {showPaymentModal && selectedInvoice && (
                <RecordPaymentModal
                    invoice={selectedInvoice}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    token={token}
                />
            )}

            {showPaymentGatewayModal && selectedInvoice && (
                <PaymentGatewayModal
                    invoice={selectedInvoice}
                    onClose={handleModalClose}
                />
            )}

            {/* Payment Callback Handler */}
            <PaymentCallbackHandler onPaymentComplete={handlePaymentComplete} />

            {/* Approve Confirmation */}
            <ConfirmModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={handleApproveConfirm}
                title="Approve Invoice"
                message={selectedInvoice ? `Are you sure you want to approve invoice ${selectedInvoice.invoice_number}?` : ''}
                confirmText="Approve"
                confirmButtonClass="bg-green-500 hover:bg-green-600"
                loading={loading}
            />

            {/* Cancel Modal */}
            <InputModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onSubmit={handleCancelSubmit}
                title="Cancel Invoice"
                message={selectedInvoice ? `Enter reason for cancelling invoice ${selectedInvoice.invoice_number}:` : ''}
                placeholder="Enter cancellation reason..."
                confirmText="Cancel Invoice"
                multiline={true}
                loading={loading}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Invoice"
                message={selectedInvoice ? `Are you sure you want to delete invoice ${selectedInvoice.invoice_number}? This action cannot be undone.` : ''}
                confirmText="Delete"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
                loading={loading}
            />

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

export default InvoiceV2Manager;
