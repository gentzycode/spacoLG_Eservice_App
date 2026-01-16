import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axios from '../../../apis/baseUrl';
import {
    FaWallet,
    FaUsers,
    FaFileInvoiceDollar,
    FaChartLine,
    FaMoneyBillWave,
    FaArrowUp,
    FaArrowDown,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaTimesCircle,
    FaBuilding,
    FaUserTie,
    FaCreditCard,
    FaDollarSign,
    FaSync
} from 'react-icons/fa';
import { MdTrendingUp, MdPendingActions, MdAttachMoney } from 'react-icons/md';
import { BsCashStack, BsGraphUp } from 'react-icons/bs';
import PageLoader from '../../../common/PageLoader';
import LineChart from '../../../charts/LineChart';
import BarChart from '../../../charts/BarChart';
import PieChart from '../../../charts/PieChart';
import QuickActions from './QuickActions';
import useQuickActions from '../../../hooks/useQuickActions';

const SuperAdminDashboard = ({ username }) => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch quick actions
    const { actions: quickActions, loading: actionsLoading } = useQuickActions({
        autoFetch: true,
    });

    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalInvoices: 0,
        pendingInvoices: 0,
        totalPayers: 0,
        totalAgents: 0,
        recentTransactions: [],
        revenueGrowth: 0,
        monthlyRevenueGrowth: 0,
        payersGrowth: 0,
        collectionRate: 0,
        collectionRateChange: 0,
        averageInvoiceValue: 0,
        avgInvoiceValueChange: 0,
        outstandingAmount: 0,
        revenueSources: [],
        newPayersLast30Days: 0,
        paymentSuccessRate: 0,
        currentMonthName: '',
        avgResponseTime: 'N/A',
        systemHealth: 'Good',
        todayLogins: 0,
        activeUsersToday: 0,
        todayTransactions: 0,
        last7DaysActivity: [],
        monthlyRevenueTrend: [],
        paymentPerformance: null,
    });

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/super-admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setDashboardData(response.data.data || {
                    totalRevenue: 0,
                    monthlyRevenue: 0,
                    totalInvoices: 0,
                    pendingInvoices: 0,
                    totalPayers: 0,
                    totalAgents: 0,
                    recentTransactions: [],
                    revenueGrowth: 0,
                    monthlyRevenueGrowth: 0,
                    payersGrowth: 0,
                    collectionRate: 0,
                    collectionRateChange: 0,
                    averageInvoiceValue: 0,
                    avgInvoiceValueChange: 0,
                    outstandingAmount: 0,
                    revenueSources: [],
                    newPayersLast30Days: 0,
                    paymentSuccessRate: 0,
                    currentMonthName: '',
                    avgResponseTime: 'N/A',
                    systemHealth: 'Good',
                    todayLogins: 0,
                    activeUsersToday: 0,
                    todayTransactions: 0,
                    last7DaysActivity: [],
                    monthlyRevenueTrend: [],
                    paymentPerformance: null,
                });
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError({
                message: err.response?.data?.message || 'Failed to load dashboard data',
                details: err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
    };

    const MetricCard = ({ title, value, icon: Icon, trend, trendValue, iconBg, iconColor, subtitle }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
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
                        <span className="text-sm font-semibold">{trendValue}%</span>
                    </div>
                    <span className="text-gray-400 text-xs">vs last month</span>
                </div>
            )}
        </div>
    );

    const TransactionRow = ({ transaction }) => {
        const statusConfig = {
            completed: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: FaCheckCircle },
            pending: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: FaClock },
            failed: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: FaTimesCircle },
        };

        const config = statusConfig[transaction.status] || statusConfig.pending;
        const StatusIcon = config.icon;

        return (
            <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-[#0d544c]/10 p-2 rounded-lg">
                            <FaFileInvoiceDollar className="text-[#0d544c]" size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{transaction.id}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                        </div>
                    </div>
                </td>
                <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{transaction.payer}</p>
                </td>
                <td className="py-4 px-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(transaction.amount)}</p>
                </td>
                <td className="py-4 px-4">
                    <div className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1`}>
                        <StatusIcon size={12} />
                        <span className="capitalize">{transaction.status}</span>
                    </div>
                </td>
            </tr>
        );
    };

    if (loading) {
        return <PageLoader message="Loading dashboard..." fullScreen={true} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 lg:p-8 animate-fadeIn">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome back, <span className="text-[#0d544c]">{username}</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Here's what's happening with your revenue today
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        {/* Refresh Button */}
                        <button
                            onClick={fetchDashboardData}
                            disabled={loading}
                            className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Refresh dashboard data"
                        >
                            <FaSync className={`text-[#0d544c] ${loading ? 'animate-spin' : ''}`} size={16} />
                        </button>

                        {/* Today's Date */}
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Today's Date</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date().toLocaleDateString('en-NG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <FaExclamationTriangle className="text-red-500 mt-1 mr-3" size={20} />
                        <div className="flex-1">
                            <h3 className="text-red-800 dark:text-red-300 font-semibold mb-1">
                                Error Loading Dashboard
                            </h3>
                            <p className="text-red-700 dark:text-red-400 text-sm">
                                {error.message}
                            </p>
                            {error.details && (
                                <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                                    {error.details}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Actions Section */}
            <div className="mb-8">
                <QuickActions
                    actions={quickActions}
                    loading={actionsLoading}
                    title="Quick Actions"
                    subtitle="Fast access to frequently used features"
                />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Revenue"
                    value={formatCurrency(dashboardData.totalRevenue)}
                    icon={FaDollarSign}
                    trend="up"
                    trendValue={dashboardData.revenueGrowth}
                    iconBg="bg-[#0d544c]/10"
                    iconColor="text-[#0d544c]"
                    subtitle="All-time collection"
                />
                <MetricCard
                    title="Monthly Revenue"
                    value={formatCurrency(dashboardData.monthlyRevenue)}
                    icon={BsCashStack}
                    trend={dashboardData.monthlyRevenueGrowth >= 0 ? "up" : "down"}
                    trendValue={Math.abs(dashboardData.monthlyRevenueGrowth || 0).toFixed(1)}
                    iconBg="bg-[#3B78BD]/10"
                    iconColor="text-[#3B78BD]"
                    subtitle={dashboardData.currentMonthName || new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                />
                <MetricCard
                    title="Total Invoices"
                    value={dashboardData.totalInvoices.toLocaleString()}
                    icon={FaFileInvoiceDollar}
                    iconBg="bg-[#F0B652]/10"
                    iconColor="text-[#F0B652]"
                    subtitle={`${dashboardData.pendingInvoices} pending`}
                />
                <MetricCard
                    title="Active Payers"
                    value={dashboardData.totalPayers.toLocaleString()}
                    icon={FaUsers}
                    trend={dashboardData.payersGrowth >= 0 ? "up" : "down"}
                    trendValue={Math.abs(dashboardData.payersGrowth || 0).toFixed(1)}
                    iconBg="bg-purple-100 dark:bg-purple-900/20"
                    iconColor="text-purple-600 dark:text-purple-400"
                    subtitle={`${dashboardData.totalAgents} agents`}
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#0d544c] to-[#3B78BD] rounded-2xl p-6 shadow-xl text-white animate-slideIn">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">Collection Rate</p>
                            <h3 className="text-3xl font-bold">{dashboardData.collectionRate?.toFixed(1) || '0.0'}%</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <MdTrendingUp size={28} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                        {dashboardData.collectionRateChange >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                        <span className="text-sm">{dashboardData.collectionRateChange >= 0 ? '+' : ''}{dashboardData.collectionRateChange?.toFixed(1) || '0.0'}% from last month</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#F0B652] to-[#f06752] rounded-2xl p-6 shadow-xl text-white animate-slideIn" style={{animationDelay: '0.1s'}}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">Avg. Invoice Value</p>
                            <h3 className="text-3xl font-bold">{formatCurrency(dashboardData.averageInvoiceValue || 0)}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <FaMoneyBillWave size={28} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                        {dashboardData.avgInvoiceValueChange >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                        <span className="text-sm">{dashboardData.avgInvoiceValueChange >= 0 ? '+' : ''}{Math.abs(dashboardData.avgInvoiceValueChange || 0).toFixed(1)}% {dashboardData.avgInvoiceValueChange >= 0 ? 'increase' : 'decrease'}</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white animate-slideIn" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">Outstanding</p>
                            <h3 className="text-3xl font-bold">{formatCurrency(dashboardData.outstandingAmount || 0)}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <MdPendingActions size={28} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                        <FaClock size={12} />
                        <span className="text-sm">{dashboardData.pendingInvoices} invoices pending</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly collection overview</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-[#0d544c] text-white text-sm rounded-lg hover:bg-[#3B78BD] transition-colors">
                                6 Months
                            </button>
                            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                1 Year
                            </button>
                        </div>
                    </div>
                    <LineChart chartData={dashboardData.monthlyRevenueTrend} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Sources</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">By service category</p>
                    </div>
                    <PieChart chartData={dashboardData.revenueSources} />
                    <div className="mt-6 space-y-3">
                        {(dashboardData.revenueSources || [
                            { name: 'Tenement Rate', percentage: 45, color: '#0d544c' },
                            { name: 'Business Permits', percentage: 30, color: '#3B78BD' },
                            { name: 'Other Services', percentage: 25, color: '#F0B652' },
                        ]).map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Performance</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Invoice status breakdown</p>
                    </div>
                    <BarChart chartData={dashboardData.paymentPerformance} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Stats</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'New Payers (30d)', value: dashboardData.newPayersLast30Days || 0, icon: FaUserTie, color: 'text-green-600' },
                            { label: 'Active Agents', value: dashboardData.totalAgents, icon: FaUsers, color: 'text-blue-600' },
                            { label: 'Avg Response Time', value: dashboardData.avgResponseTime || 'N/A', icon: FaClock, color: 'text-purple-600' },
                            { label: 'Payment Success', value: `${dashboardData.paymentSuccessRate?.toFixed(1) || '0.0'}%`, icon: FaCheckCircle, color: 'text-green-600' },
                        ].map((stat, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <stat.icon className={stat.color} size={20} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Status and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">System Health</p>
                            <h3 className="text-2xl font-bold">{dashboardData.systemHealth || 'Good'}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <FaCheckCircle size={24} />
                        </div>
                    </div>
                    <p className="text-white/80 text-xs">All systems operational</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Today's Logins</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.todayLogins || 0}</h3>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl">
                            <FaUsers className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">{dashboardData.activeUsersToday || 0} unique users</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Today's Transactions</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.todayTransactions || 0}</h3>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl">
                            <FaFileInvoiceDollar className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">Invoice activity today</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.activeUsersToday || 0}</h3>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl">
                            <FaUserTie className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs">Currently online</p>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest invoice payments and collections</p>
                        </div>
                        <button className="px-4 py-2 bg-[#0d544c] text-white text-sm rounded-lg hover:bg-[#3B78BD] transition-colors flex items-center space-x-2">
                            <span>View All</span>
                            <FaArrowUp className="rotate-45" size={12} />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Invoice ID</th>
                                <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Payer</th>
                                <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recentTransactions.map((transaction, index) => (
                                <TransactionRow key={index} transaction={transaction} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
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
            `}</style>
        </div>
    );
};

export default SuperAdminDashboard;
