import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { apiRequest, getInvoiceStatistics, getAgentUnpaidInvoices, getUnpaidInvoices, getRecentInvoices } from '../../apis/authActions';
import InvoiceStatistics from '../components/invoicesPage/InvoiceStatistics';
import InvoiceCharts from '../components/invoicesPage/InvoiceCharts';
import InvoiceTable from '../components/invoicesPage/InvoiceTable';
import RecentInvoices from '../components/invoicesPage/RecentInvoices';
import PaymentHistoryTable from '../components/invoicesPage/PaymentHistoryTable';
import PayerInvoices from '../components/invoicesPage/PayerInvoices';
import ReceiptVerification from '../components/invoicesPage/ReceiptVerification';
import CreateInvoiceModal from '../components/invoicesPage/CreateInvoiceModal';
import EditInvoiceModal from '../components/invoicesPage/EditInvoiceModal';
import PayInvoiceModal from '../components/invoicesPage/PayInvoiceModal';
import PaymentReceiptModal from '../components/invoicesPage/PaymentReceiptModal';
import DeleteInvoiceModal from '../components/invoicesPage/DeleteInvoiceModal';
import InvoiceDetailsModal from '../components/invoicesPage/InvoiceDetailsModal';

const InvoicesPage = () => {
    const { user, token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('personal');
    const [invoices, setInvoices] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchStatistics();
        fetchInvoices();
    }, [activeTab, user]);

    const fetchStatistics = async () => {
        if (!user || !user.id || user.role !== 'agent') return;
        setLoading(true);
        try {
            await getInvoiceStatistics(token, user.id, setStatistics, setError, setLoading);
        } catch (err) {
            setError('Failed to load statistics');
            console.error(err);
        }
    };

    const fetchInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'personal' && user.role === 'agent') {
                await getAgentUnpaidInvoices(token, user.id, setInvoices, setError, setLoading);
            } else if (activeTab === 'all' && user.role === 'agent') {
                await getUnpaidInvoices(token, setInvoices, setError, setLoading);
            } else if (activeTab === 'recent') {
                await getRecentInvoices(token, setInvoices, setError, setLoading);
            }
        } catch (err) {
            setError('Failed to load invoices');
            console.error(err);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setInvoices([]);
    };

    const handleCreateInvoice = () => setShowCreateModal(true);
    const handleEditInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowEditModal(true);
    };
    const handlePayInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPayModal(true);
    };
    const handlePrintReceipt = (invoice) => {
        setSelectedInvoice(invoice);
        setShowReceiptModal(true);
    };
    const handleDeleteInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDeleteModal(true);
    };
    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailsModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Invoices</h1>

                {/* Statistics Section */}
                {user.role === 'agent' && (
                    <InvoiceStatistics statistics={statistics} loading={loading} error={error} />
                )}

                {/* Charts Section */}
                {user.role === 'agent' && statistics && (
                    <InvoiceCharts statistics={statistics} />
                )}

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    {user.role === 'agent' && (
                        <>
                            <button
                                className={`px-4 py-2 font-medium ${activeTab === 'personal' ? 'border-b-2 border-[#3B78BD] text-[#3B78BD]' : 'text-gray-600'}`}
                                onClick={() => handleTabChange('personal')}
                            >
                                Personal Invoices
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'border-b-2 border-[#3B78BD] text-[#3B78BD]' : 'text-gray-600'}`}
                                onClick={() => handleTabChange('all')}
                            >
                                All Invoices
                            </button>
                        </>
                    )}
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'recent' ? 'border-b-2 border-[#3B78BD] text-[#3B78BD]' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('recent')}
                    >
                        Recent Invoices
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'payer' ? 'border-b-2 border-[#3B78BD] text-[#3B78BD]' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('payer')}
                    >
                        Payer Invoices
                    </button>
                    {user.role === 'agent' && (
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'paymentHistory' ? 'border-b-2 border-[#3B78BD] text-[#3B78BD]' : 'text-gray-600'}`}
                            onClick={() => handleTabChange('paymentHistory')}
                        >
                            Payment History
                        </button>
                    )}
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'verify' ? 'border-b-2 border-[#3B78BD] text-[#3B78BD]' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('verify')}
                    >
                        Verify Receipt
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    {activeTab === 'personal' && user.role === 'agent' && (
                        <>
                            <button
                                className="mb-4 bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-4 rounded transition-all"
                                onClick={handleCreateInvoice}
                            >
                                Create Invoice
                            </button>
                            <InvoiceTable
                                invoices={invoices}
                                loading={loading}
                                error={error}
                                onPay={handlePayInvoice}
                                onPrint={handlePrintReceipt}
                                onEdit={handleEditInvoice}
                                onDelete={handleDeleteInvoice}
                                onView={handleViewDetails}
                            />
                        </>
                    )}
                    {activeTab === 'all' && user.role === 'agent' && (
                        <InvoiceTable
                            invoices={invoices}
                            loading={loading}
                            error={error}
                            onPay={handlePayInvoice}
                            onPrint={handlePrintReceipt}
                            onEdit={handleEditInvoice}
                            onDelete={handleDeleteInvoice}
                            onView={handleViewDetails}
                        />
                    )}
                    {activeTab === 'recent' && (
                        <RecentInvoices invoices={invoices} loading={loading} error={error} />
                    )}
                    {activeTab === 'payer' && (
                        <PayerInvoices
                            onPay={handlePayInvoice}
                            onPrint={handlePrintReceipt}
                            onView={handleViewDetails}
                        />
                    )}
                    {activeTab === 'paymentHistory' && user.role === 'agent' && (
                        <PaymentHistoryTable />
                    )}
                    {activeTab === 'verify' && (
                        <ReceiptVerification onPrint={handlePrintReceipt} />
                    )}
                </div>

                {/* Modals */}
            {showCreateModal && (
                <CreateInvoiceModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchInvoices}
                />
            )}
            {showEditModal && selectedInvoice && (
                <EditInvoiceModal
                    invoice={selectedInvoice}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={fetchInvoices}
                />
            )}
            {showPayModal && selectedInvoice && (
                <PayInvoiceModal
                    invoice={selectedInvoice}
                    onClose={() => setShowPayModal(false)}
                    onSuccess={fetchInvoices}
                />
            )}
            {showReceiptModal && selectedInvoice && (
                <PaymentReceiptModal
                    paymentData={selectedInvoice}
                    onClose={() => setShowReceiptModal(false)}
                />
            )}
            {showDeleteModal && selectedInvoice && (
                <DeleteInvoiceModal
                    invoice={selectedInvoice}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={fetchInvoices}
                />
            )}
            {showDetailsModal && selectedInvoice && (
                <InvoiceDetailsModal
                    invoice={selectedInvoice}
                    onClose={() => setShowDetailsModal(false)}
                />
            )}
        </div>
    );
};

export default InvoicesPage;