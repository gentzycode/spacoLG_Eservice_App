import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getWalletHistory, getPaidInvoicesByAgent, getTokenUsageHistory, getInvoiceStatistics } from "../../apis/authActions";
import SummaryCards from "../components/reports/SummaryCards";
import Charts from "../components/reports/Charts";
import Filters from "../components/reports/Filters";
import DetailedTable from "../components/reports/DetailedTable";
import PaymentCollectionsTable from "../components/reports/PaymentCollectionsTable";

const Reports = () => {
    const { token, user } = useContext(AuthContext);
    const [walletHistory, setWalletHistory] = useState([]);
    const [paidInvoices, setPaidInvoices] = useState([]);
    const [tokenUsage, setTokenUsage] = useState([]);
    const [invoiceStatistics, setInvoiceStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ dateRange: "", category: "" });

    useEffect(() => {
        if (user && user.id) {
            fetchReports();
        }
    }, [token, user]);

    const fetchReports = async () => {
        try {
            setLoading(true);

            const walletPromise = getWalletHistory(token, user.id, setWalletHistory, setError, setLoading);
            const invoicesPromise = getPaidInvoicesByAgent(token, user.id, setPaidInvoices, setError, setLoading);
            const tokenPromise = getTokenUsageHistory(token, user.id, setTokenUsage, setError, setLoading);
            const invoiceStatsPromise = getInvoiceStatistics(token, user.id, setInvoiceStatistics, setError, setLoading);

            await Promise.all([walletPromise, invoicesPromise, tokenPromise, invoiceStatsPromise]);
        } catch (err) {
            setError(err.message || "Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const exportToCSV = (data, filename) => {
        const csvContent = `data:text/csv;charset=utf-8,${data
            .map((row) => Object.values(row).join(","))
            .join("\n")}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="w-full p-4">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Reports</h1>

            {/* Filters Section */}
            <Filters filters={filters} onFilterChange={handleFilterChange} onApplyFilters={fetchReports} />

            {/* Summary Section */}
            <SummaryCards
                summaries={[
                    {
                        title: "Total Wallet Transactions",
                        value: walletHistory?.length || 0,
                        bgColor: "bg-green-100",
                        textColor: "text-green-700",
                    },
                    {
                        title: "Token Usage",
                        value: tokenUsage?.length || 0,
                        bgColor: "bg-blue-100",
                        textColor: "text-blue-700",
                    },
                    {
                        title: "Invoice Statistics",
                        value: invoiceStatistics?.total_invoices || 0,
                        bgColor: "bg-yellow-100",
                        textColor: "text-yellow-700",
                    },
                ]}
            />

            {/* Payment Collections Table */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Payment Collections</h2>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => exportToCSV(paidInvoices, "payment_collections")}
                    >
                        Export to CSV
                    </button>
                </div>
                <PaymentCollectionsTable
                    data={paidInvoices}
                    loading={loading}
                    error={error}
                />
            </div>

            {/* Charts Section */}
            <div className="mb-6">
                <Charts walletData={walletHistory} tokenData={tokenUsage} />
            </div>

            {/* Detailed Wallet Refill Log Table */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Detailed Wallet Refill Log</h2>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => exportToCSV(walletHistory, "wallet_refill_log")}
                    >
                        Export to CSV
                    </button>
                </div>
                <DetailedTable
                    title="Detailed Wallet Refill Log"
                    data={walletHistory}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default Reports;
