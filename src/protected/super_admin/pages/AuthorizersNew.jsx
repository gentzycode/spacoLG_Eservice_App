import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getAllAuthorizers, removeAuthorizer } from '../../../apis/adminActions';
import InitLoader from '../../../common/InitLoader';
import AddModal from '../components/authorizers/AddModal';
import {
    FaFileSignature,
    FaUserPlus,
    FaSearch,
    FaFilter,
    FaTrash,
    FaUsers,
    FaBuilding,
    FaCertificate,
    FaChartLine,
    FaCheckCircle,
    FaUserShield,
    FaFileContract
} from 'react-icons/fa';
import { FaFileCircleCheck } from 'react-icons/fa6';
import { MdGridView, MdTableRows, MdVerifiedUser } from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';

const AuthorizersNew = () => {
    const { token, user, logout, record, refreshRecord } = useContext(AuthContext);

    const [authorizers, setAuthorizers] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [showmodal, setShowmodal] = useState(false);
    const [success, setSuccess] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [lgaFilter, setLgaFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table');

    const deleteAuthorizer = (id, authorizerName) => {
        if (window.confirm(`Are you sure you want to remove ${authorizerName} as an authorizer?`)) {
            removeAuthorizer(token, id, setSuccess, setError, setDeleting);
        }
    };

    useEffect(() => {
        getAllAuthorizers(token, setAuthorizers, setError, setFetching);
    }, [record]);

    if (success !== null) {
        alert('Authorizer removed successfully!');
        setSuccess(null);
        refreshRecord(Date.now());
    }

    if (error !== null && error?.message === 'Token has expired') {
        logout();
    }

    // Filter authorizers
    const filteredAuthorizers = authorizers ? authorizers.filter(auth => {
        const matchesSearch =
            auth.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auth.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auth.local_government?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            auth.eservice?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLGA = lgaFilter === 'all' || auth.local_government?.name === lgaFilter;
        const matchesService = serviceFilter === 'all' || auth.eservice?.name === serviceFilter;

        return matchesSearch && matchesLGA && matchesService;
    }) : [];

    // Calculate statistics
    const stats = {
        total: filteredAuthorizers.length,
        lgas: authorizers ? [...new Set(authorizers.map(a => a.local_government?.id))].length : 0,
        services: authorizers ? [...new Set(authorizers.map(a => a.eservice?.id))].length : 0,
        users: authorizers ? [...new Set(authorizers.map(a => a.user?.id))].length : 0,
    };

    // Get unique LGAs and services for filters
    const uniqueLGAs = authorizers ? [...new Set(authorizers.map(a => a.local_government?.name))].filter(Boolean) : [];
    const uniqueServices = authorizers ? [...new Set(authorizers.map(a => a.eservice?.name))].filter(Boolean) : [];

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                    {subtitle && (
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`${color} p-4 rounded-xl`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    const AuthorizerCard = ({ authorizer }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-xl">
                        {authorizer.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {authorizer.user?.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{authorizer.user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <FaBuilding className="text-blue-600" size={16} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">LGA</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{authorizer.local_government?.name}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <FaCertificate className="text-green-600" size={16} />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">E-Service</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{authorizer.eservice?.name}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm">
                    <FaCheckCircle className="text-green-600" size={16} />
                    <span className="text-gray-600 dark:text-gray-400">Active Authorizer</span>
                </div>
                {(user?.role === 'SuperAdmin' || user?.role === 'LocalAdmin') && (
                    <button
                        onClick={() => deleteAuthorizer(authorizer.id, authorizer.user?.username)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        title="Remove Authorizer"
                    >
                        <FaTrash size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    const AuthorizerTableRow = ({ authorizer }) => (
        <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fadeIn">
            <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold">
                        {authorizer.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{authorizer.user?.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{authorizer.user?.email}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                    <FaBuilding className="text-[#0d544c]" size={16} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{authorizer.local_government?.name}</span>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                    <FaCertificate className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{authorizer.eservice?.name}</span>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300">
                    <FaCheckCircle size={14} />
                    <span className="text-xs font-semibold">Active</span>
                </div>
            </td>
            <td className="py-4 px-4">
                {(user?.role === 'SuperAdmin' || user?.role === 'LocalAdmin') && (
                    <button
                        onClick={() => deleteAuthorizer(authorizer.id, authorizer.user?.username)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        title="Remove Authorizer"
                    >
                        <FaTrash size={16} />
                    </button>
                )}
            </td>
        </tr>
    );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
                            <FaFileCircleCheck className="text-[#0d544c]" />
                            <span>Certificate Authorizers</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Manage certificate signing authorities for e-services
                        </p>
                    </div>
                    {user?.role === 'SuperAdmin' && (
                        <button
                            className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium"
                            onClick={() => setShowmodal(true)}
                        >
                            <FaUserPlus size={20} />
                            <span>Add Authorizer</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Authorizers"
                    value={stats.total}
                    icon={FaUserShield}
                    color="bg-gradient-to-br from-[#0d544c] to-[#3B78BD]"
                    subtitle="Active certificate signers"
                />
                <StatCard
                    title="LGAs Covered"
                    value={stats.lgas}
                    icon={FaBuilding}
                    color="bg-gradient-to-br from-blue-500 to-indigo-500"
                    subtitle="Local governments"
                />
                <StatCard
                    title="E-Services"
                    value={stats.services}
                    icon={FaCertificate}
                    color="bg-gradient-to-br from-green-500 to-emerald-500"
                    subtitle="Services covered"
                />
                <StatCard
                    title="Unique Users"
                    value={stats.users}
                    icon={FaUsers}
                    color="bg-gradient-to-br from-purple-500 to-pink-500"
                    subtitle="Authorized users"
                />
            </div>

            {/* Filters and Search Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8 animate-slideIn">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search Bar */}
                    <div className="md:col-span-5">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by username, email, LGA, or service..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* LGA Filter */}
                    <div className="md:col-span-3">
                        <div className="relative">
                            <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white appearance-none"
                                value={lgaFilter}
                                onChange={(e) => setLgaFilter(e.target.value)}
                            >
                                <option value="all">All LGAs</option>
                                {uniqueLGAs.map((lga, index) => (
                                    <option key={index} value={lga}>{lga}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Service Filter */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white appearance-none"
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                            >
                                <option value="all">All Services</option>
                                {uniqueServices.map((service, index) => (
                                    <option key={index} value={service}>{service}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="md:col-span-2 flex items-center space-x-2">
                        <button
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-colors ${
                                viewMode === 'table'
                                    ? 'bg-[#0d544c] text-white'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setViewMode('table')}
                        >
                            <MdTableRows size={20} />
                            <span className="hidden lg:inline">Table</span>
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-[#0d544c] text-white'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setViewMode('grid')}
                        >
                            <MdGridView size={20} />
                            <span className="hidden lg:inline">Grid</span>
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Showing <span className="font-bold text-[#0d544c]">{filteredAuthorizers.length}</span> authorizers</span>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-[#f06752] hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            </div>

            {/* Authorizers Display */}
            {fetching ? (
                <div className="flex justify-center items-center h-64">
                    <InitLoader />
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAuthorizers.length > 0 ? (
                        filteredAuthorizers.map((authorizer) => <AuthorizerCard key={authorizer.id} authorizer={authorizer} />)
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <FaFileCircleCheck className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No authorizers found</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Table View */
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                                <tr>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Authorizer</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">LGA</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">E-Service</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAuthorizers.length > 0 ? (
                                    filteredAuthorizers.map((authorizer) => <AuthorizerTableRow key={authorizer.id} authorizer={authorizer} />)
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center">
                                            <FaFileCircleCheck className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">No authorizers found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Authorizer Modal */}
            {showmodal && <AddModal setShowmodal={setShowmodal} />}

            {/* Delete Loading Overlay */}
            {deleting && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                        <InitLoader />
                        <p className="text-gray-700 dark:text-gray-300 mt-4">Removing authorizer...</p>
                    </div>
                </div>
            )}

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

export default AuthorizersNew;
