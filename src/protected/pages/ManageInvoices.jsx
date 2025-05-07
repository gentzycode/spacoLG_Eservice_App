import React, { useContext, useEffect, useState } from 'react';
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

    const fetchData = () => {
        if (user && user.id) {
            getInvoiceStatistics(token, user.id, setStatistics, setError, setLoading);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, user, refreshData]);

    const handleGenerateClick = () => setShowGenerateModal(true);
    const handlePayClick = () => setShowPayModal(true);
    const handleQuickUseClick = () => setShowQuickUseModal(true);
    const handleViewClick = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };

    const handleModalClose = () => {
        setShowGenerateModal(false);
        setShowPayModal(false);
        setShowQuickUseModal(false);
        setShowDetailModal(false);
        setRefreshData(!refreshData);
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
            {error && <div className="text-center py-4 text-red-600">{error}</div>}
            {loading ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-300">Loading...</div>
            ) : (
                <div className="mt-8">
                    <InvoiceStatistics statistics={statistics} />
                    <div className="w-full flex justify-end my-4 space-x-4">
                        <button
                            className="w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#3B78BD] hover:bg-[#F0B652] text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                            onClick={handleGenerateClick}
                        >
                            Generate Invoice
                        </button>
                        <button
                            className="w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#F0B652] hover:bg-[#6B7280] text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                            onClick={handlePayClick}
                        >
                            Pay Invoice
                        </button>
                        <button
                            className="w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#6B7280] hover:bg-[#3B78BD] text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                            onClick={handleQuickUseClick}
                        >
                            Quick Use Token
                        </button>
                    </div>
                    <InvoiceHistory token={token} agentId={user?.id} onViewClick={handleViewClick} />
                </div>
            )}
            {showGenerateModal && <GenerateInvoiceModal closeModal={handleModalClose} />}
            {showPayModal && <PayInvoiceModal closeModal={handleModalClose} />}
            {showQuickUseModal && <QuickUseTokenModal closeModal={handleModalClose} agentId={user?.id} />}
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

export default ManageInvoices;