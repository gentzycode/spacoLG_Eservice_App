import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import {
    FaShieldAlt, FaFilter, FaSearch, FaDownload, FaCalendar,
    FaUser, FaClock, FaExclamationTriangle, FaCheckCircle,
    FaTimesCircle, FaLock, FaUnlock, FaSignInAlt, FaSignOutAlt,
    FaEdit, FaTrash, FaFileExport, FaEye, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { MdSecurity, MdWarning, MdInfo, MdError } from 'react-icons/md';
import { BsShieldCheck, BsShieldX } from 'react-icons/bs';
import PageLoader from '../../../common/PageLoader';

const SecurityAuditLogs = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [dateRange, setDateRange] = useState('today');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // Modal state
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    // Audit Logs Data
    const [auditLogs, setAuditLogs] = useState([]);

    // Statistics
    const [statistics, setStatistics] = useState({
        totalLogs: 0,
        todayLogs: 0,
        criticalEvents: 0,
        failedLogins: 0,
        successRate: 0
    });

    useEffect(() => {
        fetchAuditLogs();
    }, [token, currentPage, filterType, filterSeverity, dateRange]);

    const fetchAuditLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/super-admin/audit-logs', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    page: currentPage,
                    per_page: itemsPerPage,
                    type: filterType,
                    severity: filterSeverity,
                    date_range: dateRange,
                    start_date: startDate,
                    end_date: endDate,
                    search: searchTerm
                }
            });

            if (response.data.status === 'success') {
                setAuditLogs(response.data.data || []);

                // Update statistics if provided
                if (response.data.statistics) {
                    setStatistics(response.data.statistics);
                }
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            setError('Failed to load audit logs');
            setAuditLogs([]);
            setLoading(false);
        }
    };

    const handleExport = () => {
        setSuccess('Exporting audit logs...');
        setTimeout(() => {
            setSuccess('Audit logs exported successfully!');
            setTimeout(() => setSuccess(null), 3000);
        }, 1500);
    };

    const getSeverityConfig = (severity) => {
        const configs = {
            info: {
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                text: 'text-blue-700 dark:text-blue-400',
                icon: MdInfo,
                badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            },
            warning: {
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                text: 'text-yellow-700 dark:text-yellow-400',
                icon: MdWarning,
                badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
            },
            error: {
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                text: 'text-orange-700 dark:text-orange-400',
                icon: FaExclamationTriangle,
                badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
            },
            critical: {
                bg: 'bg-red-50 dark:bg-red-900/20',
                text: 'text-red-700 dark:text-red-400',
                icon: MdError,
                badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }
        };
        return configs[severity] || configs.info;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <FaCheckCircle className="text-green-600" />;
            case 'failed':
                return <FaTimesCircle className="text-red-600" />;
            case 'blocked':
                return <FaLock className="text-red-600" />;
            default:
                return <FaClock className="text-gray-600" />;
        }
    };

    const getActionIcon = (type) => {
        const icons = {
            authentication: FaSignInAlt,
            user_management: FaUser,
            system: FaEdit,
            transaction: FaFileExport,
            security: FaShieldAlt
        };
        const Icon = icons[type] || FaEdit;
        return <Icon size={16} />;
    };

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch =
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ip.includes(searchTerm);

        const matchesType = filterType === 'all' || log.type === filterType;
        const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;

        return matchesSearch && matchesType && matchesSeverity;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                    {subtitle && (
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`${color} p-3 rounded-xl`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className='flex space-x-2 items-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                            <FaShieldAlt size={30} className='text-[#0d544c]' />
                            <span>Security & Audit Logs</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 ml-10">
                            Monitor system activities and security events
                        </p>
                    </div>

                    <button
                        onClick={handleExport}
                        className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-lg hover:from-[#3B78BD] hover:to-[#0d544c] transition-all shadow-md"
                    >
                        <FaDownload />
                        <span>Export Logs</span>
                    </button>
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

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <MetricCard
                        title="Total Logs"
                        value={statistics.totalLogs.toLocaleString()}
                        icon={FaShieldAlt}
                        color="bg-[#0d544c]/10 text-[#0d544c]"
                        subtitle="All time"
                    />
                    <MetricCard
                        title="Today's Logs"
                        value={statistics.todayLogs}
                        icon={FaClock}
                        color="bg-[#3B78BD]/10 text-[#3B78BD]"
                        subtitle="Last 24 hours"
                    />
                    <MetricCard
                        title="Critical Events"
                        value={statistics.criticalEvents}
                        icon={MdError}
                        color="bg-red-100 dark:bg-red-900/20 text-red-600"
                        subtitle="Requires attention"
                    />
                    <MetricCard
                        title="Failed Logins"
                        value={statistics.failedLogins}
                        icon={FaTimesCircle}
                        color="bg-orange-100 dark:bg-orange-900/20 text-orange-600"
                        subtitle="Today"
                    />
                    <MetricCard
                        title="Success Rate"
                        value={`${statistics.successRate}%`}
                        icon={FaCheckCircle}
                        color="bg-green-100 dark:bg-green-900/20 text-green-600"
                        subtitle="Overall"
                    />
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex items-center space-x-2">
                            <FaFilter className="text-gray-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                            >
                                <option value="all">All Types</option>
                                <option value="authentication">Authentication</option>
                                <option value="user_management">User Management</option>
                                <option value="system">System</option>
                                <option value="transaction">Transaction</option>
                                <option value="security">Security</option>
                            </select>
                        </div>

                        {/* Severity Filter */}
                        <div>
                            <select
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                            >
                                <option value="all">All Severity</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center space-x-2">
                            <FaCalendar className="text-gray-400" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                            >
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Audit Logs Table */}
                {loading ? (
                    <PageLoader message="Loading audit logs..." fullScreen={false} />
                ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Timestamp</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Action</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Severity</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">IP Address</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {currentItems.map((log) => {
                                    const severityConfig = getSeverityConfig(log.severity);
                                    const SeverityIcon = severityConfig.icon;

                                    return (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <FaClock className="text-gray-400" size={14} />
                                                    <span className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                                        {log.timestamp}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.user}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.userId}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {getActionIcon(log.type)}
                                                    <span className="text-sm text-gray-900 dark:text-white">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                                                    {log.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.badge}`}>
                                                    <SeverityIcon size={12} />
                                                    <span className="capitalize">{log.severity}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{log.ip}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(log.status)}
                                                    <span className={`text-sm capitalize ${
                                                        log.status === 'success' ? 'text-green-600' :
                                                        log.status === 'failed' ? 'text-red-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLog(log);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="text-[#3B78BD] hover:text-[#0d544c] transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} logs
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg transition-colors ${
                                        currentPage === 1
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-[#0d544c] text-white hover:bg-[#3B78BD]'
                                    }`}
                                >
                                    <FaChevronLeft size={14} />
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${
                                            currentPage === index + 1
                                                ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white font-semibold'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg transition-colors ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-[#0d544c] text-white hover:bg-[#3B78BD]'
                                    }`}
                                >
                                    <FaChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                )}

                {/* Details Modal */}
                {showDetailsModal && selectedLog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideIn">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <FaShieldAlt size={24} />
                                    <h3 className="text-xl font-bold">Audit Log Details</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedLog(null);
                                    }}
                                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                                >
                                    <FaTimesCircle size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Status & Severity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">Status</p>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(selectedLog.status)}
                                            <span className={`text-lg font-semibold capitalize ${
                                                selectedLog.status === 'success' ? 'text-green-600' :
                                                selectedLog.status === 'failed' ? 'text-red-600' :
                                                'text-gray-600'
                                            }`}>
                                                {selectedLog.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">Severity</p>
                                        <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-semibold ${getSeverityConfig(selectedLog.severity).badge}`}>
                                            {(() => {
                                                const SeverityIcon = getSeverityConfig(selectedLog.severity).icon;
                                                return <SeverityIcon size={16} />;
                                            })()}
                                            <span className="capitalize">{selectedLog.severity}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">Timestamp</p>
                                    <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                        <FaClock className="text-gray-400" />
                                        <span className="text-lg font-mono">{selectedLog.timestamp}</span>
                                    </div>
                                </div>

                                {/* User Information */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold uppercase">User Information</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedLog.user}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">User ID:</span>
                                            <span className="text-sm font-mono text-gray-900 dark:text-white">{selectedLog.userId}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">IP Address:</span>
                                            <span className="text-sm font-mono text-gray-900 dark:text-white">{selectedLog.ip}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Details */}
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">Action</p>
                                    <div className="flex items-center space-x-2">
                                        {getActionIcon(selectedLog.type)}
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLog.action}</span>
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                                            {selectedLog.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">Details</p>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">{selectedLog.details}</p>
                                    </div>
                                </div>

                                {/* User Agent */}
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">User Agent</p>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{selectedLog.userAgent}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 rounded-b-2xl flex justify-end">
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedLog(null);
                                    }}
                                    className="px-6 py-2 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-lg hover:from-[#3B78BD] hover:to-[#0d544c] transition-all shadow-md font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
            `}</style>
        </div>
    );
};

export default SecurityAuditLogs;
