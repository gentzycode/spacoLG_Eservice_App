import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getAllUsers, getAllRoles, getLGAsStaff, getAllAuthorizers, removeAuthorizer } from '../../../apis/adminActions';
import { getLGAs } from '../../../apis/noAuthActions';
import InitLoader from '../../../common/InitLoader';
import CreateUser from '../components/users/CreateUser';
import UserDetail from '../components/users/UserDetail';
import LgasStaffModal from '../components/lgas-staff/LgasStaffModal';
import AddModal from '../components/authorizers/AddModal';
import {
    FaUsers,
    FaUserPlus,
    FaSearch,
    FaFilter,
    FaEye,
    FaEdit,
    FaTrash,
    FaUserShield,
    FaUserTie,
    FaChartLine,
    FaCrown,
    FaUserCog,
    FaDownload,
    FaBuilding,
    FaCertificate,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaFileCircleCheck
} from 'react-icons/fa';
import { MdGridView, MdTableRows } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ImOffice } from 'react-icons/im';
import { filterAdminusers } from '../../../apis/functions';

const UsersUnified = () => {
    const { token, user, logout, record, refreshRecord } = useContext(AuthContext);

    // Active tab state
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'staff', 'authorizers'

    // Users data
    const [users, setUsers] = useState(null);
    const [roles, setRoles] = useState(null);
    const [userdetail, setUserdetail] = useState(false);
    const [userid, setUserid] = useState(null);
    const [useredit, setUseredit] = useState(null);
    const [userform, setUserform] = useState(false);

    // LGA Staff data
    const [lgasstaff, setLgasstaff] = useState(null);
    const [lgas, setLgas] = useState(null);
    const [lgastaff, setLgastaff] = useState(null);
    const [staffmodal, setStaffmodal] = useState(false);

    // Authorizers data
    const [authorizers, setAuthorizers] = useState(null);
    const [authmodal, setAuthmodal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [success, setSuccess] = useState(null);

    // Common states
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [lgaFilter, setLgaFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // Default to grid

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // 12 items per page for grid (3x4 layout)

    useEffect(() => {
        getAllUsers(token, setUsers, setError, setFetching);
        getAllRoles(token, setRoles, setError);
        getLGAsStaff(token, setLgasstaff, setError, setFetching);
        getLGAs(setLgas, setError);
        getAllAuthorizers(token, setAuthorizers, setError, setFetching);
    }, [record]);

    useEffect(() => {
        // Reset pagination when switching tabs or changing filters
        setCurrentPage(1);
    }, [activeTab, searchQuery, roleFilter, lgaFilter, serviceFilter]);

    if (success !== null) {
        alert('Authorizer removed successfully!');
        setSuccess(null);
        refreshRecord(Date.now());
    }

    if (error !== null && error?.message === 'Token has expired') {
        logout();
    }

    // Filter functions
    const filteredUsers = users ? filterAdminusers(users).filter(u => {
        const matchesSearch =
            u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.mobile?.includes(searchQuery) ||
            u.personal_information?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.personal_information?.last_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role?.name === roleFilter;
        return matchesSearch && matchesRole;
    }) : [];

    const filteredStaff = lgasstaff ? lgasstaff.filter(staff => {
        const matchesSearch =
            staff.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.user?.mobile?.includes(searchQuery) ||
            staff.local_government?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLGA = lgaFilter === 'all' || staff.local_government?.id === parseInt(lgaFilter);
        const matchesRole = roleFilter === 'all' || staff.user?.role?.name === roleFilter;
        return matchesSearch && matchesLGA && matchesRole;
    }) : [];

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

    // Get current data based on active tab
    const getCurrentData = () => {
        switch(activeTab) {
            case 'users': return filteredUsers;
            case 'staff': return filteredStaff;
            case 'authorizers': return filteredAuthorizers;
            default: return [];
        }
    };

    // Pagination logic
    const currentData = getCurrentData();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(currentData.length / itemsPerPage);

    // Calculate statistics
    const stats = {
        users: {
            total: filteredUsers.length,
            superAdmins: filteredUsers.filter(u => u.role?.name === 'SuperAdmin').length,
            localAdmins: filteredUsers.filter(u => u.role?.name === 'LocalAdmin').length,
            agents: filteredUsers.filter(u => u.role?.name === 'Agent').length,
        },
        staff: {
            total: filteredStaff.length,
            lgas: lgas ? lgas.length : 0,
            uniqueLGAs: lgasstaff ? [...new Set(lgasstaff.map(s => s.local_government?.id))].length : 0,
            localAdmins: filteredStaff.filter(s => s.user?.role?.name === 'LocalAdmin').length,
            staff: filteredStaff.filter(s => s.user?.role?.name === 'Staff').length,
        },
        authorizers: {
            total: filteredAuthorizers.length,
            lgas: authorizers ? [...new Set(authorizers.map(a => a.local_government?.id))].length : 0,
            services: authorizers ? [...new Set(authorizers.map(a => a.eservice?.id))].length : 0,
            users: authorizers ? [...new Set(authorizers.map(a => a.user?.id))].length : 0,
        }
    };

    // Helper functions
    const getRoleIcon = (roleName) => {
        switch(roleName) {
            case 'SuperAdmin': return <FaCrown className="text-yellow-600" />;
            case 'LocalAdmin': return <FaUserShield className="text-blue-600" />;
            case 'Agent': return <FaUserTie className="text-green-600" />;
            case 'Staff': return <FaUserCog className="text-purple-600" />;
            default: return <FaUsers className="text-gray-600" />;
        }
    };

    const getRoleBadgeColor = (roleName) => {
        switch(roleName) {
            case 'SuperAdmin': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'LocalAdmin': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Agent': return 'bg-green-100 text-green-800 border-green-300';
            case 'Staff': return 'bg-purple-100 text-purple-800 border-purple-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Action handlers
    const showUserDetail = (id) => {
        setUserid(id);
        setUserdetail(true);
    };

    const editUser = (userdata) => {
        setUseredit(userdata);
        setUserform(true);
    };

    const closeUserform = () => {
        setUseredit(null);
        setUserform(false);
    };

    const editLGAStaff = (lgstf) => {
        setLgastaff(lgstf);
        setStaffmodal(true);
    };

    const deleteAuthorizer = (id, authorizerName) => {
        if (window.confirm(`Are you sure you want to remove ${authorizerName} as an authorizer?`)) {
            removeAuthorizer(token, id, setSuccess, setError, setDeleting);
        }
    };

    // Get unique values for filters
    const uniqueLGAs = authorizers ? [...new Set(authorizers.map(a => a.local_government?.name))].filter(Boolean) : [];
    const uniqueServices = authorizers ? [...new Set(authorizers.map(a => a.eservice?.name))].filter(Boolean) : [];

    // Components
    const StatCard = ({ title, value, icon: Icon, color, percentage }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`${color} p-4 rounded-xl`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
            {percentage && (
                <div className="flex items-center space-x-2 text-sm">
                    <FaChartLine className="text-green-600" size={14} />
                    <span className="text-green-600 font-semibold">{percentage}%</span>
                    <span className="text-gray-400">of total</span>
                </div>
            )}
        </div>
    );

    const UserCard = ({ user }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-xl">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {user.personal_information?.first_name} {user.personal_information?.last_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Mobile:</span>
                    <span>{user.mobile}</span>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleBadgeColor(user.role?.name)}`}>
                    {getRoleIcon(user.role?.name)}
                    <span className="text-xs font-semibold">{user.role?.name}</span>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => showUserDetail(user.id)}
                        className="p-2 bg-[#0d544c]/10 text-[#0d544c] rounded-lg hover:bg-[#0d544c] hover:text-white transition-colors"
                    >
                        <FaEye size={16} />
                    </button>
                    <button
                        onClick={() => editUser(user)}
                        className="p-2 bg-[#3B78BD]/10 text-[#3B78BD] rounded-lg hover:bg-[#3B78BD] hover:text-white transition-colors"
                    >
                        <FaEdit size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    const StaffCard = ({ staff }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-xl">
                        {staff.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{staff.user?.username}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                            <FaMapMarkerAlt size={12} />
                            <span>{staff.local_government?.name}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{staff.user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Mobile:</span>
                    <span>{staff.user?.mobile}</span>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleBadgeColor(staff.user?.role?.name)}`}>
                    <FaUserTie size={14} />
                    <span className="text-xs font-semibold">{staff.user?.role?.name}</span>
                </div>
                <button
                    onClick={() => editLGAStaff(staff)}
                    className="p-2 bg-[#3B78BD]/10 text-[#3B78BD] rounded-lg hover:bg-[#3B78BD] hover:text-white transition-colors"
                >
                    <FaEdit size={16} />
                </button>
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
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{authorizer.user?.username}</h3>
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
                    <span className="text-gray-600 dark:text-gray-400">Active</span>
                </div>
                {(user?.role === 'SuperAdmin' || user?.role === 'LocalAdmin') && (
                    <button
                        onClick={() => deleteAuthorizer(authorizer.id, authorizer.user?.username)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    >
                        <FaTrash size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex items-center justify-between mt-8 px-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, currentData.length)} of {currentData.length} results
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentPage(1)}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-2">...</span>}
                        </>
                    )}
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === number
                                    ? 'bg-[#0d544c] text-white'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-2">...</span>}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    if (userdetail) {
        return (
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <button
                    className="mb-6 flex items-center space-x-2 px-6 py-3 bg-[#0d544c] text-white rounded-xl hover:bg-[#3B78BD] transition-colors shadow-lg"
                    onClick={() => setUserdetail(false)}
                >
                    <FaUsers size={20} />
                    <span>Back to Users</span>
                </button>
                <UserDetail userid={userid} setUserid={setUserid} setUserdetail={setUserdetail} />
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
            {/* Header Section */}
            <div className="mb-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
                            <FaUsers className="text-[#0d544c]" />
                            <span>User Management</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Manage users, LGA staff, and certificate authorizers
                        </p>
                    </div>
                    <button
                        className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium"
                        onClick={() => {
                            if (activeTab === 'users') setUserform(true);
                            else if (activeTab === 'staff') setStaffmodal(true);
                            else if (activeTab === 'authorizers' && user?.role === 'SuperAdmin') setAuthmodal(true);
                        }}
                    >
                        <FaUserPlus size={20} />
                        <span>
                            {activeTab === 'users' ? 'Add User' : activeTab === 'staff' ? 'Assign Staff' : 'Add Authorizer'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 animate-slideIn">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-100 dark:border-gray-700 inline-flex space-x-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                            activeTab === 'users'
                                ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        <FaUsers size={18} />
                        <span>Users</span>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{stats.users.total}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                            activeTab === 'staff'
                                ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        <ImOffice size={18} />
                        <span>LGA Staff</span>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{stats.staff.total}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('authorizers')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                            activeTab === 'authorizers'
                                ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        <FaFileCircleCheck size={18} />
                        <span>Authorizers</span>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{stats.authorizers.total}</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {activeTab === 'users' && (
                    <>
                        <StatCard title="Total Users" value={stats.users.total} icon={FaUsers} color="bg-gradient-to-br from-[#0d544c] to-[#3B78BD]" />
                        <StatCard title="Super Admins" value={stats.users.superAdmins} icon={FaCrown} color="bg-gradient-to-br from-yellow-500 to-orange-500" percentage={((stats.users.superAdmins / stats.users.total) * 100).toFixed(1)} />
                        <StatCard title="Agents" value={stats.users.agents} icon={FaUserTie} color="bg-gradient-to-br from-green-500 to-emerald-500" percentage={((stats.users.agents / stats.users.total) * 100).toFixed(1)} />
                        <StatCard title="Local Admins" value={stats.users.localAdmins} icon={FaUserShield} color="bg-gradient-to-br from-blue-500 to-indigo-500" percentage={((stats.users.localAdmins / stats.users.total) * 100).toFixed(1)} />
                    </>
                )}
                {activeTab === 'staff' && (
                    <>
                        <StatCard title="Total Staff" value={stats.staff.total} icon={FaUsers} color="bg-gradient-to-br from-[#0d544c] to-[#3B78BD]" />
                        <StatCard title="LGAs Covered" value={stats.staff.uniqueLGAs} icon={FaBuilding} color="bg-gradient-to-br from-blue-500 to-indigo-500" />
                        <StatCard title="Local Admins" value={stats.staff.localAdmins} icon={FaUserShield} color="bg-gradient-to-br from-purple-500 to-pink-500" />
                        <StatCard title="Staff Members" value={stats.staff.staff} icon={FaUserTie} color="bg-gradient-to-br from-green-500 to-emerald-500" />
                    </>
                )}
                {activeTab === 'authorizers' && (
                    <>
                        <StatCard title="Total Authorizers" value={stats.authorizers.total} icon={FaUserShield} color="bg-gradient-to-br from-[#0d544c] to-[#3B78BD]" />
                        <StatCard title="LGAs Covered" value={stats.authorizers.lgas} icon={FaBuilding} color="bg-gradient-to-br from-blue-500 to-indigo-500" />
                        <StatCard title="E-Services" value={stats.authorizers.services} icon={FaCertificate} color="bg-gradient-to-br from-green-500 to-emerald-500" />
                        <StatCard title="Unique Users" value={stats.authorizers.users} icon={FaUsers} color="bg-gradient-to-br from-purple-500 to-pink-500" />
                    </>
                )}
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8 animate-slideIn">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    {activeTab === 'users' && (
                        <div className="md:col-span-3">
                            <div className="relative">
                                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white appearance-none"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">All Roles</option>
                                    {roles && roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    {activeTab === 'staff' && (
                        <>
                            <div className="md:col-span-3">
                                <div className="relative">
                                    <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white appearance-none"
                                        value={lgaFilter}
                                        onChange={(e) => setLgaFilter(e.target.value)}
                                    >
                                        <option value="all">All LGAs</option>
                                        {lgas && lgas.map(lga => (
                                            <option key={lga.id} value={lga.id}>{lga.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white appearance-none"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="LocalAdmin">Local Admin</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Agent">Agent</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                    {activeTab === 'authorizers' && (
                        <>
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
                        </>
                    )}
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
                        </button>
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Showing <span className="font-bold text-[#0d544c]">{currentData.length}</span> results
                </div>
            </div>

            {/* Content Grid */}
            {fetching ? (
                <div className="flex justify-center items-center h-64">
                    <InitLoader />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => {
                                if (activeTab === 'users') return <UserCard key={item.id} user={item} />;
                                if (activeTab === 'staff') return <StaffCard key={item.id} staff={item} />;
                                if (activeTab === 'authorizers') return <AuthorizerCard key={item.id} authorizer={item} />;
                                return null;
                            })
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <FaUsers className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No results found</p>
                            </div>
                        )}
                    </div>
                    <Pagination />
                </>
            )}

            {/* Modals */}
            {userform && <CreateUser useredit={useredit} closeUserform={closeUserform} />}
            {staffmodal && <LgasStaffModal users={users} lgas={lgas} setShowmodal={setStaffmodal} lgastaff={lgastaff} setLagstaff={setLgastaff} />}
            {authmodal && <AddModal setShowmodal={setAuthmodal} />}
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

export default UsersUnified;
