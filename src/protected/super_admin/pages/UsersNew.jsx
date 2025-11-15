import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getAllUsers, getAllRoles } from '../../../apis/adminActions';
import InitLoader from '../../../common/InitLoader';
import CreateUser from '../components/users/CreateUser';
import UserDetail from '../components/users/UserDetail';
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
    FaUserCheck,
    FaChartLine,
    FaCrown,
    FaUserCog,
    FaDownload,
    FaUpload
} from 'react-icons/fa';
import { MdVerified, MdBlock, MdGridView, MdTableRows } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { filterAdminusers } from '../../../apis/functions';

const UsersNew = () => {
    const { token, user, logout, record, refreshRecord } = useContext(AuthContext);

    const [users, setUsers] = useState(null);
    const [roles, setRoles] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [userdetail, setUserdetail] = useState(false);
    const [userid, setUserid] = useState(null);
    const [useredit, setUseredit] = useState(null);
    const [userform, setUserform] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [selectedUsers, setSelectedUsers] = useState([]);

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

    useEffect(() => {
        getAllUsers(token, setUsers, setError, setFetching);
        getAllRoles(token, setRoles, setError);
    }, [record]);

    if (error !== null && error?.message === 'Token has expired') {
        logout();
    }

    // Filter users based on search and role
    const filteredUsers = users ? filterAdminusers(users).filter(user => {
        const matchesSearch =
            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.mobile?.includes(searchQuery) ||
            user.personal_information?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.personal_information?.last_name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role?.name === roleFilter;

        return matchesSearch && matchesRole;
    }) : [];

    // Calculate statistics
    const stats = {
        total: filteredUsers.length,
        superAdmins: filteredUsers.filter(u => u.role?.name === 'SuperAdmin').length,
        localAdmins: filteredUsers.filter(u => u.role?.name === 'LocalAdmin').length,
        agents: filteredUsers.filter(u => u.role?.name === 'Agent').length,
        staff: filteredUsers.filter(u => u.role?.name === 'Staff').length,
    };

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
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <BsThreeDotsVertical className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span>
                    <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Mobile:</span>
                    <span>{user.mobile}</span>
                </div>
                {user.staff_locale?.local_government?.name && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">LGA:</span>
                        <span>{user.staff_locale.local_government.name}</span>
                    </div>
                )}
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
                    {(user?.role === 'SuperAdmin' || user?.role === 'LocalAdmin') && (
                        <button
                            onClick={() => editUser(user)}
                            className="p-2 bg-[#3B78BD]/10 text-[#3B78BD] rounded-lg hover:bg-[#3B78BD] hover:text-white transition-colors"
                        >
                            <FaEdit size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const UserTableRow = ({ user }) => (
        <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fadeIn">
            <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.personal_information?.first_name} {user.personal_information?.last_name}
                        </p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
            </td>
            <td className="py-4 px-4">
                <p className="text-sm text-gray-900 dark:text-white">{user.mobile}</p>
            </td>
            <td className="py-4 px-4">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleBadgeColor(user.role?.name)}`}>
                    {getRoleIcon(user.role?.name)}
                    <span className="text-xs font-semibold">{user.role?.name}</span>
                </div>
            </td>
            <td className="py-4 px-4">
                <p className="text-sm text-gray-900 dark:text-white">{user.staff_locale?.local_government?.name || '-'}</p>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => showUserDetail(user.id)}
                        className="p-2 bg-[#0d544c]/10 text-[#0d544c] rounded-lg hover:bg-[#0d544c] hover:text-white transition-colors"
                        title="View Details"
                    >
                        <FaEye size={16} />
                    </button>
                    {(user?.role === 'SuperAdmin' || user?.role === 'LocalAdmin') && (
                        <button
                            onClick={() => editUser(user)}
                            className="p-2 bg-[#3B78BD]/10 text-[#3B78BD] rounded-lg hover:bg-[#3B78BD] hover:text-white transition-colors"
                            title="Edit User"
                        >
                            <FaEdit size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );

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
                            Manage system users, roles, and permissions
                        </p>
                    </div>
                    <button
                        className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium"
                        onClick={() => setUserform(true)}
                    >
                        <FaUserPlus size={20} />
                        <span>Add New User</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.total}
                    icon={FaUsers}
                    color="bg-gradient-to-br from-[#0d544c] to-[#3B78BD]"
                />
                <StatCard
                    title="Super Admins"
                    value={stats.superAdmins}
                    icon={FaCrown}
                    color="bg-gradient-to-br from-yellow-500 to-orange-500"
                    percentage={((stats.superAdmins / stats.total) * 100).toFixed(1)}
                />
                <StatCard
                    title="Agents"
                    value={stats.agents}
                    icon={FaUserTie}
                    color="bg-gradient-to-br from-green-500 to-emerald-500"
                    percentage={((stats.agents / stats.total) * 100).toFixed(1)}
                />
                <StatCard
                    title="Local Admins"
                    value={stats.localAdmins}
                    icon={FaUserShield}
                    color="bg-gradient-to-br from-blue-500 to-indigo-500"
                    percentage={((stats.localAdmins / stats.total) * 100).toFixed(1)}
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
                                placeholder="Search by username, email, mobile, or name..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent text-gray-900 dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
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

                    {/* Export Button */}
                    <div className="md:col-span-2">
                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#F0B652] text-gray-900 rounded-xl hover:bg-[#f06752] hover:text-white transition-colors font-medium">
                            <FaDownload size={18} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Showing <span className="font-bold text-[#0d544c]">{filteredUsers.length}</span> users</span>
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

            {/* Users Display */}
            {fetching ? (
                <div className="flex justify-center items-center h-64">
                    <InitLoader />
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <FaUsers className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No users found</p>
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
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">User</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Mobile</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">LGA</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => <UserTableRow key={user.id} user={user} />)
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <FaUsers className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">No users found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit User Modal */}
            {userform && <CreateUser useredit={useredit} closeUserform={closeUserform} />}

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

export default UsersNew;
