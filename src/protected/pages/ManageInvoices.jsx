import React, { useContext, useEffect, useState, useCallback, memo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import InvoiceStatistics from '../components/invoices/InvoiceStatistics';
import InvoiceHistory from '../components/invoices/InvoiceHistory';
import GenerateInvoiceModal from '../components/invoices/GenerateInvoiceModal';
import PayInvoiceModal from '../components/invoices/PayInvoiceModal';
import QuickUseTokenModal from '../components/invoices/QuickUseTokenModal';
import InvoiceDetailModal from '../components/invoices/InvoiceDetailModal';
import { getInvoiceStatistics } from '../../apis/authActions';

const ManageInvoices = () => {
    const { token, user } = useContext(AuthContext);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showQuickUseModal, setShowQuickUseModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [refreshData, setRefreshData] = useState(false);

    const fetchData = useCallback(() => {
        if (user?.id) {
            getInvoiceStatistics(token, user.id, setStatistics, setError, setLoading);
        }
    }, [token, user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshData]);

    const handleGenerateClick = useCallback(() => {
        setShowGenerateModal(true);
    }, []);

    const handlePayClick = useCallback(() => {
        setShowPayModal(true);
    }, []);

    const handleQuickUseClick = useCallback(() => {
        setShowQuickUseModal(true);
    }, []);

    const handleViewClick = useCallback((invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setShowGenerateModal(false);
        setShowPayModal(false);
        setShowQuickUseModal(false);
        setShowDetailModal(false);
        setRefreshData(prev => !prev);
    }, []);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center my-12">
                    <svg
                        className="animate-spin h-12 w-12 text-[#3B78BD] dark:text-[#F0B652]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-label="Loading invoices"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h-8z"
                        />
                    </svg>
                </div>
            ) : (
                <div className="mt-8">
                    <InvoiceStatistics statistics={statistics} />
                    <div className="w-full flex flex-wrap justify-end my-4 gap-4">
                        <button
                            className="min-w-[180px] flex justify-center items-center space-x-2 rounded-lg py-2 px-4 bg-[#3B78BD] hover:bg-[#F0B652] dark:bg-[#F0B652] dark:hover:bg-[#3B78BD] text-white dark:text-gray-900 font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={handleGenerateClick}
                            disabled={loading}
                            aria-label="Generate invoice"
                        >
                            Generate Invoice
                        </button>
                        <button
                            className="min-w-[180px] flex justify-center items-center space-x-2 rounded-lg py-2 px-4 bg-[#F0B652] hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-[#F0B652] text-white dark:text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={handlePayClick}
                            disabled={loading}
                            aria-label="Pay invoice"
                        >
                            Pay Invoice
                        </button>
                        <button
                            className="min-w-[180px] flex justify-center items-center space-x-2 rounded-lg py-2 px-4 bg-gray-600 hover:bg-[#3B78BD] dark:bg-[#3B78BD] dark:hover:bg-gray-600 text-white dark:text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={handleQuickUseClick}
                            disabled={loading}
                            aria-label="Quick use token"
                        >
                            Quick Use Token
                        </button>
                    </div>
                    <InvoiceHistory token={token} agentId={user?.id} onViewClick={handleViewClick} />
                </div>
            )}

            {showGenerateModal && (
                <GenerateInvoiceModal closeModal={handleModalClose} />
            )}

            {showPayModal && (
                <PayInvoiceModal closeModal={handleModalClose} />
            )}

            {showQuickUseModal && (
                <QuickUseTokenModal closeModal={handleModalClose} agentId={user?.id} />
            )}

            {showDetailModal && selectedInvoice && (
                <InvoiceDetailModal
                    invoice={selectedInvoice}
                    token={token}
                    agentId={user?.id}
                    onClose={handleModalClose}
                />
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default memo(ManageInvoices);
