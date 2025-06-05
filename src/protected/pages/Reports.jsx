// src/protected/pages/Reports.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getWalletHistory, getPaidInvoicesByAgent, getTokenUsageHistory, getInvoiceStatistics } from '../../apis/authActions';
import SummaryCards from '../components/reports/SummaryCards';
import Charts from '../components/reports/Charts';
import Filters from '../components/reports/Filters';
import DetailedTable from '../components/reports/DetailedTable';
import PaymentCollectionsTable from '../components/reports/PaymentCollectionsTable';
import TokenTransactionsTable from '../components/reports/TokenTransactionsTable';

const Reports = () => {
    const { token, user } = useContext(AuthContext);
    const [walletHistory, setWalletHistory] = useState([]);
    const [paidInvoices, setPaidInvoices] = useState([]);
    const [tokenUsage, setTokenUsage] = useState([]);
    const [invoiceStatistics, setInvoiceStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ dateRange: '', category: '' });

    useEffect(() => {
        if (user && user.id) {
            fetchReports();
        }
    }, [token, user]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            await Promise.all([
                getWalletHistory(token, user.id, setWalletHistory, setError, setLoading),
                getPaidInvoicesByAgent(token, user.id, setPaidInvoices, setError, setLoading),
                getTokenUsageHistory(token, user.id, setTokenUsage, setError, setLoading),
                getInvoiceStatistics(token, user.id, setInvoiceStatistics, setError, setLoading),
            ]);
        } catch (err) {
            setError(err.message || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const exportToCSV = (data, filename) => {
        const csvContent = `data:text/csv;charset=utf-8,${data
            .map((row) => Object.values(row).join(','))
            .join('\n')}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
            <h1 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Reports</h1>
            {error && (
                <div className="text-center py-6 text-red-600 dark:text-red-400">{error}</div>
            )}
            {loading && (
                <div className="flex justify-center my-5">
                    <svg
                        className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h-8z"
                        ></path>
                    </svg>
                </div>
            )}
            {!loading && (
                <>
                    <Filters filters={filters} onFilterChange={handleFilterChange} onApplyFilters={fetchReports} />
                    <SummaryCards
                        summaries={[
                            {
                                title: 'Total Wallet Transactions',
                                value: walletHistory?.length || 0,
                                bgColor: 'from-green-500 to-green-700',
                                textColor: 'text-white',
                            },
                            {
                                title: 'Token Usage',
                                value: tokenUsage?.length || 0,
                                bgColor: 'from-blue-500 to-blue-700',
                                textColor: 'text-white',
                            },
                            {
                                title: 'Invoice Statistics',
                                value: invoiceStatistics?.total_invoices || 0,
                                bgColor: 'from-yellow-500 to-yellow-700',
                                textColor: 'text-white',
                            },
                        ]}
                    />
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Payment Collections</h2>
                            <button
                                className="px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => exportToCSV(paidInvoices, 'payment_collections')}
                            >
                                Export to CSV
                            </button>
                        </div>
                        <PaymentCollectionsTable data={paidInvoices} loading={loading} error={error} />
                    </div>
                    <Charts walletData={walletHistory} tokenData={tokenUsage} />
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Detailed Wallet Refill Log</h2>
                            <button
                                className="px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => exportToCSV(walletHistory, 'wallet_refill_log')}
                            >
                                Export to CSV
                            </button>
                        </div>
                        <DetailedTable data={walletHistory} loading={loading} error={error} />
                    </div>
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Token Transactions</h2>
                            <button
                                className="px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => exportToCSV(tokenUsage, 'token_transactions')}
                            >
                                Export to CSV
                            </button>
                        </div>
                        <TokenTransactionsTable data={tokenUsage} loading={loading} error={error} />
                    </div>
                </>
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

export default Reports;