import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { HiOutlinePlus } from 'react-icons/hi';
import { RiErrorWarningLine } from 'react-icons/ri';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdIncompleteCircle, MdOutlineHourglassTop } from 'react-icons/md';
import { FaSync, FaExclamationTriangle } from 'react-icons/fa';
import LineChart from '../../../charts/LineChart';
import { AuthContext } from '../../../context/AuthContext';
import useDashboardData from '../../../hooks/useDashboardData';
import useQuickActions from '../../../hooks/useQuickActions';
import QuickActions from './QuickActions';
import PageLoader from '../../../common/PageLoader';
import Wavinghand from '../../../assets/waving_hand.png';

/**
 * UserDashboard Component
 *
 * Comprehensive dashboard for PublicUser, Staff, and LocalAdmin roles
 * Features real-time metrics, Quick Actions, and activity tracking
 */
const UserDashboard = ({ goToApplications }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch dashboard data using custom hook
    const { data: dashboardData, loading, error, refetch } = useDashboardData({
        autoFetch: true,
    });

    // Fetch quick actions
    const { actions: quickActions, loading: actionsLoading } = useQuickActions({
        autoFetch: true,
    });

    // Loading state
    if (loading) {
        return <PageLoader message="Loading your dashboard..." />;
    }

    // Get user info from data or fallback
    const username = dashboardData?.userName || user?.username || 'User';
    const userRole = dashboardData?.userRole || user?.role?.name || 'User';

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 font-poppins">
            {/* Header with Refresh Button */}
            <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                        title="Refresh Dashboard"
                    >
                        <FaSync className={`text-[#0d544c] ${loading ? 'animate-spin' : ''}`} size={20} />
                    </button>
                    {(userRole === 'PublicUser' || userRole === 'Agent') && (
                        <button
                            className="flex items-center space-x-2 px-6 py-3 bg-[#F0B652] text-gray-900 font-medium rounded-lg shadow-md hover:bg-[#3B78BD] hover:text-white transition-all duration-300"
                            onClick={goToApplications || (() => navigate('/applications'))}
                        >
                            <HiOutlinePlus size={20} />
                            <span>New Application</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="w-full bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-8 rounded-lg shadow-md">
                    <div className="flex items-start space-x-3">
                        <FaExclamationTriangle className="text-red-500 mt-1" size={20} />
                        <div className="flex-1">
                            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-1">Error Loading Dashboard</h3>
                            <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                                {error.message || 'Failed to load dashboard data'}
                            </p>
                            <button
                                onClick={refetch}
                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            <div className="w-full md:w-[40%] mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all animate-fadeIn">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Hello, {username}</span>
                    <img src={Wavinghand} alt="waving hand" className="h-12" />
                </div>
                <div>
                    <span className="text-gray-600 dark:text-gray-300">
                        Welcome to the Yenagoa Local Government E-Services Portal.
                    </span>
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Role: <span className="font-semibold text-[#3B78BD] dark:text-[#F0B652]">{userRole}</span>
                </div>
            </div>

            {/* Pending Notice */}
            {(userRole === 'PublicUser' || userRole === 'Agent') &&
             (dashboardData?.applicationsPending > 0 || dashboardData?.pendingInvoices > 0) && (
                <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border-l-4 border-[#f06752] animate-slideIn">
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#f06752]/10 p-3 rounded-full">
                            <RiErrorWarningLine size={28} className="text-[#f06752]" />
                        </div>
                        <div className="flex-1">
                            <span className="text-gray-800 dark:text-gray-200 font-medium block">
                                You have {dashboardData?.applicationsPending || 0} pending application(s)
                                and {dashboardData?.pendingInvoices || 0} unpaid invoice(s).
                            </span>
                        </div>
                    </div>
                    <button
                        className="mt-4 px-6 py-2 bg-[#f06752] text-white rounded-lg shadow-md hover:bg-[#F0B652] hover:text-gray-900 transition-all duration-300"
                        onClick={goToApplications || (() => navigate('/applications'))}
                    >
                        View Pending Items
                    </button>
                </div>
            )}

            {/* Quick Actions Section */}
            {quickActions && quickActions.length > 0 && (
                <div className="mb-8">
                    <QuickActions
                        actions={quickActions}
                        loading={actionsLoading}
                        title="Quick Actions"
                        subtitle="Fast access to frequently used features"
                    />
                </div>
            )}

            {/* Application Status Metrics (PublicUser only) */}
            {userRole === 'PublicUser' && (
                <div className="w-full mb-8">
                    <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Application Status</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Processed', value: dashboardData?.applicationsProcessed || 0, color: '#10B981', icon: BsFillCheckCircleFill },
                            { title: 'Pending', value: dashboardData?.applicationsPending || 0, color: '#F59E0B', icon: MdOutlineHourglassTop },
                            { title: 'Incomplete', value: dashboardData?.applicationsIncomplete || 0, color: '#3B82F6', icon: MdIncompleteCircle },
                            { title: 'Rejected', value: dashboardData?.applicationsRejected || 0, color: '#EF4444', icon: AiFillCloseCircle },
                        ].map((status, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${status.color}20` }}>
                                    <status.icon size={28} style={{ color: status.color }} />
                                </div>
                                <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{status.title}</h1>
                                <h1 className="text-2xl font-bold" style={{ color: status.color }}>{status.value}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Invoice Metrics */}
            <div className="w-full mb-8">
                <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">
                    {userRole === 'Agent' || userRole === 'LocalAdmin' ? 'Invoice Management' : 'My Invoices'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Total Invoices', value: dashboardData?.totalInvoices || 0, description: 'All invoices created', bgColor: 'bg-gray-100 dark:bg-gray-700', textColor: 'text-gray-700 dark:text-gray-200', icon: RiErrorWarningLine },
                        { title: 'Paid Invoices', value: dashboardData?.paidInvoices || 0, description: 'Successfully completed payments', bgColor: 'bg-green-100 dark:bg-green-900/50', textColor: 'text-green-700 dark:text-green-400', icon: BsFillCheckCircleFill },
                        { title: 'Pending Invoices', value: dashboardData?.pendingInvoices || 0, description: 'Awaiting payment', bgColor: 'bg-yellow-100 dark:bg-yellow-900/50', textColor: 'text-yellow-700 dark:text-yellow-400', icon: MdOutlineHourglassTop },
                        { title: 'Total Paid', value: `₦${(dashboardData?.totalAmountPaid || 0).toLocaleString()}`, description: 'Total amount paid', bgColor: 'bg-blue-100 dark:bg-blue-900/50', textColor: 'text-blue-700 dark:text-blue-400', icon: BsFillCheckCircleFill },
                    ].map((item, index) => (
                        <div key={index} className={`${item.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn`} style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-full bg-white dark:bg-gray-600 shadow-sm">
                                    <item.icon size={28} className={`${item.textColor}`} />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-semibold">{item.title}</h1>
                                    <h1 className="text-2xl font-bold">{item.value}</h1>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payer Metrics (Agent/LocalAdmin only) */}
            {(userRole === 'Agent' || userRole === 'LocalAdmin') && (
                <div className="w-full mb-8">
                    <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Payer Management</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { title: 'Total Payers', value: dashboardData?.totalPayers || 0, description: 'All registered payers', bgColor: 'bg-purple-100 dark:bg-purple-900/50', textColor: 'text-purple-700 dark:text-purple-400', icon: BsFillCheckCircleFill },
                            { title: 'New This Month', value: dashboardData?.newPayersThisMonth || 0, description: 'Payers added this month', bgColor: 'bg-indigo-100 dark:bg-indigo-900/50', textColor: 'text-indigo-700 dark:text-indigo-400', icon: HiOutlinePlus },
                        ].map((item, index) => (
                            <div key={index} className={`${item.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn`} style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-white dark:bg-gray-600 shadow-sm">
                                        <item.icon size={28} className={`${item.textColor}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-lg font-semibold">{item.title}</h1>
                                        <h1 className="text-2xl font-bold">{item.value}</h1>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activity Overview */}
            <div className="w-full mb-8">
                <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Activity Overview</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Last 7 Days Activity</h3>
                        {dashboardData?.last7DaysData && dashboardData.last7DaysData.length > 0 ? (
                            <LineChart data={dashboardData.last7DaysData} />
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">No activity data available</div>
                        )}
                    </div>

                    {/* Recent Invoices */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Invoices</h3>
                        {dashboardData?.recentInvoices && dashboardData.recentInvoices.length > 0 ? (
                            <div className="space-y-3">
                                {dashboardData.recentInvoices.map((invoice, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 dark:text-gray-200">{invoice.payer}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.id} • {invoice.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white">₦{invoice.amount.toLocaleString()}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'}`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">No recent invoices</div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
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

export default UserDashboard;