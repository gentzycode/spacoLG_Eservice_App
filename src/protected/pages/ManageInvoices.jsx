import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import InvoiceStatistics from '../components/invoices/InvoiceStatistics';
import InvoiceHistory from '../components/invoices/InvoiceHistory';
import GenerateInvoiceModal from '../components/invoices/GenerateInvoiceModal';
import PayInvoiceModal from '../components/invoices/PayInvoiceModal';
import QuickUseTokenModal from '../components/invoices/QuickUseTokenModal'; // Import the new modal
import InvoiceDetailModal from '../components/invoices/InvoiceDetailModal';
import { getInvoiceStatistics } from '../../apis/authActions';

const ManageInvoices = () => {
    const { token, user } = useContext(AuthContext);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showQuickUseModal, setShowQuickUseModal] = useState(false); // Add state for Quick Use Token modal
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

    const handleGenerateClick = () => {
        setShowGenerateModal(true);
    };

    const handlePayClick = () => {
        setShowPayModal(true);
    };

    const handleQuickUseClick = () => {
        console.log('Quick Use Token button clicked'); // Add console log
        setShowQuickUseModal(true);
    };

    const handleViewClick = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };

    const handleModalClose = () => {
        setShowGenerateModal(false);
        setShowPayModal(false);
        setShowQuickUseModal(false); // Close Quick Use Token modal
        setShowDetailModal(false);
        setRefreshData(!refreshData); // Toggle refresh data state to trigger useEffect
    };

    return (
        <div className="w-full">
            {error && <span className='text-red-600'>{error}</span>}
            {loading ? <div>Loading...</div> : (
                <div className="mt-8">
                    <InvoiceStatistics statistics={statistics} />
                    <div className="w-full flex justify-end my-4 space-x-4">
                        <button
                            className='w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#0d544c] hover:bg-green-700 text-white cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105'
                            onClick={handleGenerateClick}
                        >
                            Generate Invoice
                        </button>
                        <button
                            className='w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#0d544c] hover:bg-green-700 text-white cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105'
                            onClick={handlePayClick}
                        >
                            Pay Invoice
                        </button>
                        <button
                            className='w-[180px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#0d544c] hover:bg-green-700 text-white cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105'
                            onClick={handleQuickUseClick}
                        >
                            Quick Use Token
                        </button>
                    </div>
                    <InvoiceHistory token={token} agentId={user?.id} onViewClick={handleViewClick} /> {/* Add optional chaining */}
                </div>
            )}
            {showGenerateModal && (
                <GenerateInvoiceModal
                    closeModal={handleModalClose}
                />
            )}
            {showPayModal && (
                <PayInvoiceModal
                    closeModal={handleModalClose}
                />
            )}
            {showQuickUseModal && (
                <QuickUseTokenModal
                    closeModal={handleModalClose}
                    agentId={user?.id}
                />
            )}
            {showDetailModal && selectedInvoice && (
                <InvoiceDetailModal
                    invoice={selectedInvoice}
                    token={token}
                    agentId={user?.id}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default ManageInvoices;
