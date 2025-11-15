import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getAllUsers, getLGAsStaff } from '../../../apis/adminActions';
import { getLGAs } from '../../../apis/noAuthActions';
import InitLoader from '../../../common/InitLoader';
import LgasStaffModal from '../components/lgas-staff/LgasStaffModal';
import {
    FaBuilding,
    FaUserPlus,
    FaSearch,
    FaFilter,
    FaEye,
    FaEdit,
    FaUsers,
    FaUserTie,
    FaChartLine,
    FaMapMarkerAlt,
    FaDownload,
    FaUserShield
} from 'react-icons/fa';
import { MdGridView, MdTableRows, MdBusiness } from 'react-icons/md';
import { ImOffice } from 'react-icons/im';

const LgasStaffNew = () => {
    const { token, logout, record } = useContext(AuthContext);

    const [lgasstaff, setLgasstaff] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [showmodal, setShowmodal] = useState(false);
    const [users, setUsers] = useState(null);
    const [lgas, setLgas] = useState(null);
    const [lgastaff, setLgastaff] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [lgaFilter, setLgaFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [viewMode, setViewMode] = useState('table');

    const editLGAStaff = (lgstf) => {
        setLgastaff(lgstf);
        setShowmodal(true);
    };

    useEffect(() => {
        getLGAsStaff(token, setLgasstaff, setError, setFetching);
        getAllUsers(token, setUsers, setError, setFetching);
        getLGAs(setLgas, setError);
    }, [record]);

    if (error !== null && error?.message === 'Token has expired') {
        logout();
    }

    // Filter staff based on search, LGA, and role
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

    // Calculate statistics
    const stats = {
        total: filteredStaff.length,
        lgas: lgas ? lgas.length : 0,
        staff: filteredStaff.filter(s => s.user?.role?.name === 'Staff').length,
        localAdmins: filteredStaff.filter(s => s.user?.role?.name === 'LocalAdmin').length,
    };

    // Get unique LGAs from staff data
    const uniqueLGAs = lgasstaff ? [...new Set(lgasstaff.map(s => s.local_government?.id))].length : 0;

    const getRoleBadgeColor = (roleName) => {
        switch(roleName) {
            case 'LocalAdmin': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Staff': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Agent': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

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

    const StaffCard = ({ staff }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-xl">
                        {staff.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {staff.user?.username}
                        </h3>
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

    const StaffTableRow = ({ staff }) => (
        <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fadeIn">
            <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold">
                        {staff.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{staff.user?.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{staff.user?.email}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                    <FaBuilding className="text-[#0d544c]" size={16} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{staff.local_government?.name}</span>
                </div>
            </td>
            <td className="py-4 px-4">
                <p className="text-sm text-gray-900 dark:text-white">{staff.user?.mobile}</p>
            </td>
            <td className="py-4 px-4">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleBadgeColor(staff.user?.role?.name)}`}>
                    <FaUserTie size={14} />
                    <span className="text-xs font-semibold">{staff.user?.role?.name}</span>
                </div>
            </td>
            <td className="py-4 px-4">
                <button
                    onClick={() => editLGAStaff(staff)}
                    className="p-2 bg-[#3B78BD]/10 text-[#3B78BD] rounded-lg hover:bg-[#3B78BD] hover:text-white transition-colors"
                    title="Edit Staff"
                >
                    <FaEdit size={16} />
                </button>
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
                            <ImOffice className="text-[#0d544c]" />
                            <span>LGA Staff Management</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Manage local government staff assignments and roles
                        </p>
                    </div>
                    <button
                        className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium"
                        onClick={() => setShowmodal(true)}
                    >
                        <FaUserPlus size={20} />
                        <span>Assign LGA Staff</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Staff"
                    value={stats.total}
                    icon={FaUsers}
                    color="bg-gradient-to-br from-[#0d544c] to-[#3B78BD]"
                    subtitle="Assigned staff members"
                />
                <StatCard
                    title="LGAs Covered"
                    value={uniqueLGAs}
                    icon={FaBuilding}
                    color="bg-gradient-to-br from-blue-500 to-indigo-500"
                    subtitle={`Out of ${stats.lgas} total`}
                />
                <StatCard
                    title="Local Admins"
                    value={stats.localAdmins}
                    icon={FaUserShield}
                    color="bg-gradient-to-br from-purple-500 to-pink-500"
                    subtitle="LGA administrators"
                />
                <StatCard
                    title="Staff Members"
                    value={stats.staff}
                    icon={FaUserTie}
                    color="bg-gradient-to-br from-green-500 to-emerald-500"
                    subtitle="Regular staff"
                />
            </div>

            {/* Filters and Search Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8 animate-slideIn">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search Bar */}
                    <div className="md:col-span-4">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by username, email, LGA..."
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
                                {lgas && lgas.map(lga => (
                                    <option key={lga.id} value={lga.id}>{lga.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Role Filter */}
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

                    {/* View Mode Toggle */}
                    <div className="md:col-span-3 flex items-center space-x-2">
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
                    <span>Showing <span className="font-bold text-[#0d544c]">{filteredStaff.length}</span> staff members</span>
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

            {/* Staff Display */}
            {fetching ? (
                <div className="flex justify-center items-center h-64">
                    <InitLoader />
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.length > 0 ? (
                        filteredStaff.map((staff) => <StaffCard key={staff.id} staff={staff} />)
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <ImOffice className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No staff assignments found</p>
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
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Staff</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">LGA</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Mobile</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                                    <th className="py-4 px-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((staff) => <StaffTableRow key={staff.id} staff={staff} />)
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center">
                                            <ImOffice className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">No staff assignments found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add/Edit Staff Modal */}
            {showmodal && (
                <LgasStaffModal
                    users={users}
                    lgas={lgas}
                    setShowmodal={setShowmodal}
                    lgastaff={lgastaff}
                    setLagstaff={setLgastaff}
                />
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

export default LgasStaffNew;
