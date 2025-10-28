import React, { useContext, useState, useEffect, useCallback, memo } from 'react';
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

    const fetchReports = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);
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
    }, [token, user?.id]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleFilterChange = useCallback((e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const exportToCSV = useCallback((data, filename) => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((row) => Object.values(row).join(',')).join('\n');
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const summaries = [
        {
            title: 'Total Wallet Transactions',
            value: walletHistory?.length || 0,
            bgColor: 'from-green-500 to-green-700 dark:from-green-600 dark:to-green-800',
            textColor: 'text-white',
        },
        {
            title: 'Token Usage',
            value: tokenUsage?.length || 0,
            bgColor: 'from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800',
            textColor: 'text-white',
        },
        {
            title: 'Invoice Statistics',
            value: invoiceStatistics?.total_invoices || 0,
            bgColor: 'from-yellow-500 to-yellow-700 dark:from-yellow-600 dark:to-yellow-800',
            textColor: 'text-white',
        },
    ];

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">
                Reports
            </h1>

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
                        aria-label="Loading reports"
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
                <>
                    <Filters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApplyFilters={fetchReports}
                    />

                    <SummaryCards summaries={summaries} />

                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Payment Collections
                            </h2>
                            <button
                                className="px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] dark:bg-[#F0B652] dark:hover:bg-[#3B78BD] text-white dark:text-gray-900 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={() => exportToCSV(paidInvoices, 'payment_collections')}
                                disabled={!paidInvoices || paidInvoices.length === 0}
                                aria-label="Export payment collections to CSV"
                            >
                                Export to CSV
                            </button>
                        </div>
                        <PaymentCollectionsTable data={paidInvoices} loading={loading} error={error} />
                    </div>

                    <Charts walletData={walletHistory} tokenData={tokenUsage} />

                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Detailed Wallet Refill Log
                            </h2>
                            <button
                                className="px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] dark:bg-[#F0B652] dark:hover:bg-[#3B78BD] text-white dark:text-gray-900 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={() => exportToCSV(walletHistory, 'wallet_refill_log')}
                                disabled={!walletHistory || walletHistory.length === 0}
                                aria-label="Export wallet refill log to CSV"
                            >
                                Export to CSV
                            </button>
                        </div>
                        <DetailedTable data={walletHistory} loading={loading} error={error} />
                    </div>

                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Token Transactions
                            </h2>
                            <button
                                className="px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] dark:bg-[#F0B652] dark:hover:bg-[#3B78BD] text-white dark:text-gray-900 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={() => exportToCSV(tokenUsage, 'token_transactions')}
                                disabled={!tokenUsage || tokenUsage.length === 0}
                                aria-label="Export token transactions to CSV"
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

export default memo(Reports);
