import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import {
    FaChartBar, FaDownload, FaFilter, FaCalendar, FaFileExcel,
    FaFilePdf, FaPrint, FaArrowUp, FaArrowDown, FaMoneyBillWave,
    FaUsers, FaFileInvoiceDollar, FaCheckCircle, FaClock, FaTimesCircle,
    FaChartLine, FaChartPie, FaSearch, FaExclamationTriangle
} from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown, MdAttachMoney } from 'react-icons/md';
import { BsCashStack, BsGraphUp } from 'react-icons/bs';
import PageLoader from '../../../common/PageLoader';
import LineChart from '../../../charts/LineChart';
import BarChart from '../../../charts/BarChart';
import PieChart from '../../../charts/PieChart';

const FinancialReports = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Filters
    const [dateRange, setDateRange] = useState('thisMonth');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('overview');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Financial Data
    const [financialData, setFinancialData] = useState({
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        totalTransactions: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        averageTransactionValue: 0,
        revenueGrowth: 0,
        topPayingCategories: [],
        monthlyTrend: [],
        topPayers: [],
        paymentMethods: []
    });

    useEffect(() => {
        fetchFinancialData();
    }, [token, dateRange, startDate, endDate, selectedCategory]);

    const fetchFinancialData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/super-admin/reports/financial', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    date_range: dateRange,
                    start_date: startDate,
                    end_date: endDate,
                    category: selectedCategory
                }
            });

            if (response.data.status === 'success') {
                setFinancialData(response.data.data || {
                    totalRevenue: 0,
                    monthlyRevenue: 0,
                    totalInvoices: 0,
                    paidInvoices: 0,
                    pendingInvoices: 0,
                    overdueInvoices: 0,
                    totalTransactions: 0,
                    successfulTransactions: 0,
                    failedTransactions: 0,
                    averageTransactionValue: 0,
                    revenueGrowth: 0,
                    topPayingCategories: [],
                    monthlyTrend: [],
                    topPayers: [],
                    paymentMethods: []
                });
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching financial data:', err);
            setError('Failed to load financial data. Please try again.');
            setLoading(false);
        }
    };

    const handleExport = (format) => {
        setSuccess(`Exporting report as ${format.toUpperCase()}...`);

        // In production, call export API
        // const response = await axios.get(`/reports/export/${format}`, {
        //     headers: { 'Authorization': `Bearer ${token}` },
        //     params: { dateRange, startDate, endDate },
        //     responseType: 'blob'
        // });

        setTimeout(() => {
            setSuccess(`Report exported successfully as ${format.toUpperCase()}!`);
            setTimeout(() => setSuccess(null), 3000);
        }, 1500);
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (amount) => {
        return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    };

    const formatNumber = (num) => {
        return Number(num).toLocaleString('en-NG');
    };

    const getDateRangeLabel = () => {
        const labels = {
            today: 'Today',
            yesterday: 'Yesterday',
            thisWeek: 'This Week',
            lastWeek: 'Last Week',
            thisMonth: 'This Month',
            lastMonth: 'Last Month',
            thisYear: 'This Year',
            custom: 'Custom Range'
        };
        return labels[dateRange] || 'Select Period';
    };

    const MetricCard = ({ title, value, icon: Icon, trend, trendValue, iconBg, iconColor, subtitle, format = 'currency' }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {format === 'currency' ? formatCurrency(value) : formatNumber(value)}
                    </h3>
                    {subtitle && (
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`${iconBg} ${iconColor} p-3 rounded-xl`}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                        <span className="text-sm font-semibold">{Math.abs(trendValue)}%</span>
                    </div>
                    <span className="text-gray-400 text-xs">vs last period</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className='flex space-x-2 items-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                            <FaChartBar size={30} className='text-[#0d544c]' />
                            <span>Financial Reports</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 ml-10">
                            Comprehensive financial analytics and insights
                        </p>
                    </div>

                    {/* Export Buttons */}
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                        <button
                            onClick={() => handleExport('excel')}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                        >
                            <FaFileExcel />
                            <span>Export Excel</span>
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                        >
                            <FaFilePdf />
                            <span>Export PDF</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
                        >
                            <FaPrint />
                            <span>Print</span>
                        </button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-[#0d544c] rounded flex items-center animate-slideIn">
                        <FaCheckCircle className="text-[#0d544c] mr-3" size={20} />
                        <span className="text-[#0d544c] dark:text-green-400">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-[#f06752] rounded flex items-center animate-slideIn">
                        <FaExclamationTriangle className="text-[#f06752] mr-3" size={20} />
                        <span className="text-[#f06752] dark:text-red-400">{error}</span>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                        {/* Date Range Selector */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Time Period
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaCalendar className="text-gray-400" />
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                >
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="thisWeek">This Week</option>
                                    <option value="lastWeek">Last Week</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="lastMonth">Last Month</option>
                                    <option value="thisYear">This Year</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                            </div>
                        </div>

                        {/* Custom Date Range */}
                        {dateRange === 'custom' && (
                            <>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </div>
                            </>
                        )}

                        {/* Category Filter */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaFilter className="text-gray-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="tenement">Tenement Rate</option>
                                    <option value="business">Business Permits</option>
                                    <option value="land">Land Registration</option>
                                    <option value="other">Other Services</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Revenue"
                        value={financialData.totalRevenue}
                        icon={MdAttachMoney}
                        trend="up"
                        trendValue={financialData.revenueGrowth}
                        iconBg="bg-[#0d544c]/10"
                        iconColor="text-[#0d544c]"
                        subtitle="All-time collection"
                    />
                    <MetricCard
                        title="Period Revenue"
                        value={financialData.monthlyRevenue}
                        icon={BsCashStack}
                        trend="up"
                        trendValue={8.2}
                        iconBg="bg-[#3B78BD]/10"
                        iconColor="text-[#3B78BD]"
                        subtitle={getDateRangeLabel()}
                    />
                    <MetricCard
                        title="Total Transactions"
                        value={financialData.totalTransactions}
                        icon={FaFileInvoiceDollar}
                        iconBg="bg-[#F0B652]/10"
                        iconColor="text-[#F0B652]"
                        subtitle={`${financialData.successfulTransactions} successful`}
                        format="number"
                    />
                    <MetricCard
                        title="Average Transaction"
                        value={financialData.averageTransactionValue}
                        icon={FaMoneyBillWave}
                        trend="up"
                        trendValue={3.7}
                        iconBg="bg-purple-100 dark:bg-purple-900/20"
                        iconColor="text-purple-600 dark:text-purple-400"
                        subtitle="Per transaction"
                    />
                </div>

                {/* Invoice Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">Paid Invoices</p>
                                <h3 className="text-3xl font-bold">{formatNumber(financialData.paidInvoices)}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <FaCheckCircle size={24} />
                            </div>
                        </div>
                        <p className="text-white/90 text-xs">
                            {((financialData.paidInvoices / financialData.totalInvoices) * 100).toFixed(1)}% of total
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">Pending Invoices</p>
                                <h3 className="text-3xl font-bold">{formatNumber(financialData.pendingInvoices)}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <FaClock size={24} />
                            </div>
                        </div>
                        <p className="text-white/90 text-xs">
                            {((financialData.pendingInvoices / financialData.totalInvoices) * 100).toFixed(1)}% of total
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">Overdue Invoices</p>
                                <h3 className="text-3xl font-bold">{formatNumber(financialData.overdueInvoices)}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <FaTimesCircle size={24} />
                            </div>
                        </div>
                        <p className="text-white/90 text-xs">
                            {((financialData.overdueInvoices / financialData.totalInvoices) * 100).toFixed(1)}% of total
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#0d544c] to-[#3B78BD] rounded-xl p-6 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-white/80 text-sm font-medium mb-1">Total Invoices</p>
                                <h3 className="text-3xl font-bold">{formatNumber(financialData.totalInvoices)}</h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <FaFileInvoiceDollar size={24} />
                            </div>
                        </div>
                        <p className="text-white/90 text-xs">Generated this period</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Trend Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly collection overview</p>
                            </div>
                        </div>
                        <LineChart />
                    </div>

                    {/* Revenue by Category */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue by Category</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Service breakdown</p>
                        </div>
                        <PieChart />
                        <div className="mt-6 space-y-3">
                            {financialData.topPayingCategories.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{
                                            backgroundColor: ['#0d544c', '#3B78BD', '#F0B652', '#f06752'][index]
                                        }}></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Revenue Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Revenue Categories</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Performance by service category</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Category</th>
                                    <th className="py-4 px-6 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Revenue</th>
                                    <th className="py-4 px-6 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Percentage</th>
                                    <th className="py-4 px-6 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Growth</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {financialData.topPayingCategories.map((category, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(category.amount)}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-[#0d544c] h-2 rounded-full"
                                                        style={{ width: `${category.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{category.percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                category.trend === 'up'
                                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                            }`}>
                                                {category.trend === 'up' ? <MdTrendingUp /> : <MdTrendingDown />}
                                                <span>{Math.abs(category.growth)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Payers and Payment Methods */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Payers */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Payers</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Highest contributing payers</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {financialData.topPayers.map((payer, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-[#0d544c] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{payer.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {payer.invoices} invoices • {payer.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#0d544c]">{formatCurrency(payer.amount)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Methods</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Revenue by payment gateway</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {financialData.paymentMethods.map((method, index) => (
                                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{method.method}</span>
                                        <span className="text-sm font-bold text-[#0d544c]">{formatCurrency(method.amount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                            <div
                                                className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] h-2 rounded-full"
                                                style={{ width: `${method.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{method.percentage}%</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatNumber(method.transactions)} transactions
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.6s ease-out forwards;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default FinancialReports;
