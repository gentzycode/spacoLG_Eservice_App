import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { removeAuthorizer } from '../../../apis/adminActions';
import { getLGAs } from '../../../apis/noAuthActions';
import PageLoader from '../../../common/PageLoader';
import CreateUserNew from '../components/users/CreateUserNew';
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
    FaFileExcel,
    FaFileCsv,
    FaSync,
    FaCheckSquare,
    FaBan,
    FaUserTag,
    FaEnvelope
} from 'react-icons/fa';
import { FaFileCircleCheck } from 'react-icons/fa6';
import { MdGridView, MdTableRows } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ImOffice } from 'react-icons/im';
import { filterAdminusers } from '../../../apis/functions';
import { toast } from 'react-toastify';
import axios from '../../../apis/adminBaseUrl';

// Import custom hooks
import useUsers from '../../../hooks/useUsers';
import useRoles from '../../../hooks/useRoles';
import useLGAStaff from '../../../hooks/useLGAStaff';
import useAuthorizers from '../../../hooks/useAuthorizers';

const UsersUnified = () => {
    const { token, user, logout, refreshRecord } = useContext(AuthContext);

    // Custom hooks for data fetching
    const { data: users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers({ autoFetch: true });
    const { data: roles, refetch: refetchRoles } = useRoles({ autoFetch: true });
    const { data: lgasstaff, loading: staffLoading, refetch: refetchStaff } = useLGAStaff({ autoFetch: true });
    const { data: authorizers, loading: authorizersLoading, refetch: refetchAuthorizers } = useAuthorizers({ autoFetch: true });

    // Active tab state
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'staff', 'authorizers'

    // Users data
    const [userdetail, setUserdetail] = useState(false);
    const [userid, setUserid] = useState(null);
    const [useredit, setUseredit] = useState(null);
    const [userform, setUserform] = useState(false);

    // LGA Staff data
    const [lgas, setLgas] = useState(null);
    const [selectedLgaStaff, setSelectedLgaStaff] = useState(null);
    const [staffmodal, setStaffmodal] = useState(false);

    // Authorizers data
    const [authmodal, setAuthmodal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Bulk selection states
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    // Export states
    const [exporting, setExporting] = useState(false);

    // Common states
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [lgaFilter, setLgaFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // Default to grid

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // 12 items per page for grid (3x4 layout)

    // Fetch LGAs
    useEffect(() => {
        getLGAs(setLgas, setError);
    }, []);

    useEffect(() => {
        // Reset pagination when switching tabs or changing filters
        setCurrentPage(1);
        // Reset bulk selection when switching tabs
        setSelectedUsers([]);
        setShowBulkActions(false);
    }, [activeTab, searchQuery, roleFilter, lgaFilter, serviceFilter]);

    // Handle errors
    useEffect(() => {
        if (usersError && usersError?.message === 'Token has expired') {
            logout();
        }
    }, [usersError, logout]);

    // Refresh all data handler
    const handleRefreshAll = useCallback(async () => {
        try {
            await Promise.all([
                refetchUsers(),
                refetchRoles(),
                refetchStaff(),
                refetchAuthorizers()
            ]);
            toast.success('Data refreshed successfully!');
        } catch (err) {
            toast.error('Failed to refresh data');
        }
    }, [refetchUsers, refetchRoles, refetchStaff, refetchAuthorizers]);

    // Export handlers
    const handleExportCSV = useCallback(async () => {
        setExporting(true);
        try {
            const response = await axios.get('user-manager/users/export/csv', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { role_filter: roleFilter, search: searchQuery },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('CSV exported successfully!');
        } catch (err) {
            toast.error('Failed to export CSV');
            console.error('Export error:', err);
        } finally {
            setExporting(false);
        }
    }, [token, roleFilter, searchQuery]);

    const handleExportExcel = useCallback(async () => {
        setExporting(true);
        try {
            const response = await axios.get('user-manager/users/export/excel', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { role_filter: roleFilter, search: searchQuery },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Excel exported successfully!');
        } catch (err) {
            toast.error('Failed to export Excel');
            console.error('Export error:', err);
        } finally {
            setExporting(false);
        }
    }, [token, roleFilter, searchQuery]);

    // Bulk action handlers
    const handleSelectUser = useCallback((userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                const newSelection = prev.filter(id => id !== userId);
                setShowBulkActions(newSelection.length > 0);
                return newSelection;
            } else {
                setShowBulkActions(true);
                return [...prev, userId];
            }
        });
    }, []);


    const handleBulkDelete = useCallback(async () => {
        // Use toast for confirmation
        const confirmDelete = () => {
            setBulkActionLoading(true);

            const executeDelete = async () => {
                try {
                    const response = await axios.post('user-manager/users/bulk/delete', {
                        user_ids: selectedUsers
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    toast.success(response.data.message);
                    setSelectedUsers([]);
                    setShowBulkActions(false);
                    await refetchUsers();
                } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to delete users');
                } finally {
                    setBulkActionLoading(false);
                }
            };

            executeDelete();
        };

        // Show warning toast with action button
        toast.warn(
            <div className="flex flex-col space-y-3">
                <p className="font-semibold">Delete {selectedUsers.length} user(s)?</p>
                <p className="text-sm">This action cannot be undone.</p>
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>,
            {
                position: 'top-center',
                autoClose: 5000,
                closeButton: true,
                draggable: false,
            }
        );
    }, [selectedUsers, token, refetchUsers]);

    const handleBulkUpdateRole = useCallback(async (roleId) => {
        if (!roleId) return;

        setBulkActionLoading(true);
        try {
            const response = await axios.post('user-manager/users/bulk/update-role', {
                user_ids: selectedUsers,
                role_id: roleId
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success(response.data.message);
            setSelectedUsers([]);
            setShowBulkActions(false);
            await refetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update roles');
        } finally {
            setBulkActionLoading(false);
        }
    }, [selectedUsers, token, refetchUsers]);

    const handleBulkBan = useCallback(async (banned) => {
        const action = banned ? 'ban' : 'unban';

        // Use toast for confirmation
        const confirmBan = () => {
            setBulkActionLoading(true);

            const executeBan = async () => {
                try {
                    const response = await axios.post('user-manager/users/bulk/ban', {
                        user_ids: selectedUsers,
                        banned: banned
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    toast.success(response.data.message);
                    setSelectedUsers([]);
                    setShowBulkActions(false);
                    await refetchUsers();
                } catch (err) {
                    toast.error(err.response?.data?.message || `Failed to ${action} users`);
                } finally {
                    setBulkActionLoading(false);
                }
            };

            executeBan();
        };

        // Show warning toast with action button
        toast.warn(
            <div className="flex flex-col space-y-3">
                <p className="font-semibold">{banned ? 'Ban' : 'Unban'} {selectedUsers.length} user(s)?</p>
                <p className="text-sm">Are you sure you want to proceed?</p>
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={confirmBan}
                        className={`px-4 py-2 ${banned ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg text-sm font-medium`}
                    >
                        Yes, {banned ? 'Ban' : 'Unban'}
                    </button>
                </div>
            </div>,
            {
                position: 'top-center',
                autoClose: 5000,
                closeButton: true,
                draggable: false,
            }
        );
    }, [selectedUsers, token, refetchUsers]);

    // Determine loading state
    const isLoading = useMemo(() => {
        switch(activeTab) {
            case 'users': return usersLoading;
            case 'staff': return staffLoading;
            case 'authorizers': return authorizersLoading;
            default: return false;
        }
    }, [activeTab, usersLoading, staffLoading, authorizersLoading]);

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

    const filteredStaff = (lgasstaff && Array.isArray(lgasstaff)) ? lgasstaff.filter(staff => {
        const matchesSearch =
            staff.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.user?.mobile?.includes(searchQuery) ||
            staff.local_government?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLGA = lgaFilter === 'all' || staff.local_government?.id === parseInt(lgaFilter);
        const matchesRole = roleFilter === 'all' || staff.user?.role?.name === roleFilter;
        return matchesSearch && matchesLGA && matchesRole;
    }) : [];

    const filteredAuthorizers = (authorizers && Array.isArray(authorizers)) ? authorizers.filter(auth => {
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

    // Handle select all (must be after currentItems is defined)
    const handleSelectAll = useCallback(() => {
        if (selectedUsers.length === currentItems.length && currentItems.length > 0) {
            setSelectedUsers([]);
            setShowBulkActions(false);
        } else {
            const allIds = currentItems.map(item => item.id);
            setSelectedUsers(allIds);
            setShowBulkActions(allIds.length > 0);
        }
    }, [selectedUsers.length, currentItems]);

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
            lgas: (lgas && Array.isArray(lgas)) ? lgas.length : 0,
            uniqueLGAs: (lgasstaff && Array.isArray(lgasstaff)) ? [...new Set(lgasstaff.map(s => s.local_government?.id))].length : 0,
            localAdmins: filteredStaff.filter(s => s.user?.role?.name === 'LocalAdmin').length,
            staff: filteredStaff.filter(s => s.user?.role?.name === 'Staff').length,
        },
        authorizers: {
            total: filteredAuthorizers.length,
            lgas: (authorizers && Array.isArray(authorizers)) ? [...new Set(authorizers.map(a => a.local_government?.id))].length : 0,
            services: (authorizers && Array.isArray(authorizers)) ? [...new Set(authorizers.map(a => a.eservice?.id))].length : 0,
            users: (authorizers && Array.isArray(authorizers)) ? [...new Set(authorizers.map(a => a.user?.id))].length : 0,
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

    const viewUser = (userdata) => {
        setUserid(userdata.id);
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
        setSelectedLgaStaff(lgstf);
        setStaffmodal(true);
    };

    const deleteAuthorizer = useCallback(async (id, authorizerName) => {
        // Use toast for confirmation
        const confirmRemove = () => {
            setDeleting(true);

            const executeRemove = async () => {
                try {
                    await removeAuthorizer(token, id, () => {
                        toast.success('Authorizer removed successfully!');
                        refetchAuthorizers();
                    }, setError, setDeleting);
                } catch (err) {
                    toast.error('Failed to remove authorizer');
                } finally {
                    setDeleting(false);
                }
            };

            executeRemove();
        };

        // Show warning toast with action button
        toast.warn(
            <div className="flex flex-col space-y-3">
                <p className="font-semibold">Remove {authorizerName} as authorizer?</p>
                <p className="text-sm">This action will revoke their authorization permissions.</p>
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={confirmRemove}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                    >
                        Yes, Remove
                    </button>
                </div>
            </div>,
            {
                position: 'top-center',
                autoClose: 5000,
                closeButton: true,
                draggable: false,
            }
        );
    }, [token, refetchAuthorizers]);

    // Get unique values for filters
    const uniqueLGAs = (authorizers && Array.isArray(authorizers)) ? [...new Set(authorizers.map(a => a.local_government?.name))].filter(Boolean) : [];
    const uniqueServices = (authorizers && Array.isArray(authorizers)) ? [...new Set(authorizers.map(a => a.eservice?.name))].filter(Boolean) : [];

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

    const UserCard = ({ user }) => {
        const isSelected = selectedUsers.includes(user.id);

        return (
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                isSelected ? 'border-[#0d544c] ring-2 ring-[#0d544c]/20' : 'border-gray-100 dark:border-gray-700'
            } animate-fadeIn group relative`}>
                {/* Selection checkbox */}
                {activeTab === 'users' && (
                    <div className="absolute top-4 right-4">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectUser(user.id)}
                            className="w-5 h-5 text-[#0d544c] border-gray-300 rounded focus:ring-[#0d544c] cursor-pointer"
                        />
                    </div>
                )}
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
    };

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

    // Show full-screen loader during initial data load (AFTER all hooks are defined)
    if (usersLoading && !users) {
        return <PageLoader message="Loading users data..." fullScreen={true} />;
    }

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
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
                            <FaUsers className="text-[#0d544c]" />
                            <span>User Management</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Manage users, LGA staff, and certificate authorizers
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Refresh Button */}
                        <button
                            onClick={handleRefreshAll}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium shadow-sm"
                            title="Refresh data"
                        >
                            <FaSync size={16} className={isLoading ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        {/* Export Dropdown (only for users tab) */}
                        {activeTab === 'users' && (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium shadow-sm">
                                    <FaDownload size={16} />
                                    <span>Export</span>
                                </button>
                                {/* Export dropdown menu */}
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <button
                                        onClick={handleExportCSV}
                                        disabled={exporting}
                                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-xl"
                                    >
                                        <FaFileCsv className="text-green-600" size={18} />
                                        <span>Export as CSV</span>
                                    </button>
                                    <button
                                        onClick={handleExportExcel}
                                        disabled={exporting}
                                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-b-xl"
                                    >
                                        <FaFileExcel className="text-blue-600" size={18} />
                                        <span>Export as Excel</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add User/Staff/Authorizer Button */}
                        <button
                            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-xl transition-all duration-300 font-medium"
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
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-bold text-[#0d544c]">{currentData.length}</span> results
                    </div>
                    {/* Select All checkbox for users tab */}
                    {activeTab === 'users' && currentItems.length > 0 && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedUsers.length === currentItems.length && currentItems.length > 0}
                                onChange={handleSelectAll}
                                className="w-5 h-5 text-[#0d544c] border-gray-300 rounded focus:ring-[#0d544c] cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select All</span>
                        </label>
                    )}
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {showBulkActions && activeTab === 'users' && (
                <div className="mb-6 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-2xl p-4 shadow-lg animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <FaCheckSquare size={20} />
                            <span className="font-semibold">{selectedUsers.length} user(s) selected</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Bulk Delete */}
                            <button
                                onClick={handleBulkDelete}
                                disabled={bulkActionLoading}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaTrash size={16} />
                                <span>Delete</span>
                            </button>

                            {/* Bulk Ban */}
                            <button
                                onClick={() => handleBulkBan(true)}
                                disabled={bulkActionLoading}
                                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaBan size={16} />
                                <span>Ban</span>
                            </button>

                            {/* Bulk Unban */}
                            <button
                                onClick={() => handleBulkBan(false)}
                                disabled={bulkActionLoading}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaCheckCircle size={16} />
                                <span>Unban</span>
                            </button>

                            {/* Bulk Change Role */}
                            <div className="relative group">
                                <button
                                    disabled={bulkActionLoading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaUserTag size={16} />
                                    <span>Change Role</span>
                                </button>
                                {/* Role dropdown */}
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    {roles && roles.map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleBulkUpdateRole(role.id)}
                                            disabled={bulkActionLoading}
                                            className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                        >
                                            {role.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cancel Selection */}
                            <button
                                onClick={() => {
                                    setSelectedUsers([]);
                                    setShowBulkActions(false);
                                }}
                                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Grid/Table */}
            {isLoading && !currentItems.length ? (
                <PageLoader
                    message={`Loading ${activeTab === 'users' ? 'Users' : activeTab === 'staff' ? 'LGA Staff' : 'Authorizers'}...`}
                    fullScreen={false}
                />
            ) : (
                <>
                    {viewMode === 'grid' ? (
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
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                                        <tr>
                                            {activeTab === 'users' && (
                                                <>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.length === currentItems.length && currentItems.length > 0}
                                                            onChange={handleSelectAll}
                                                            className="w-4 h-4 text-[#0d544c] border-gray-300 rounded focus:ring-[#0d544c] cursor-pointer"
                                                        />
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Mobile</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                                </>
                                            )}
                                            {activeTab === 'staff' && (
                                                <>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Staff Member</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">LGA</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                                </>
                                            )}
                                            {activeTab === 'authorizers' && (
                                                <>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Authorizer</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">LGA</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {currentItems.length > 0 ? (
                                            currentItems.map((item) => {
                                                if (activeTab === 'users') {
                                                    const isSelected = selectedUsers.includes(item.id);
                                                    return (
                                                        <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isSelected ? 'bg-[#0d544c]/5' : ''}`}>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => handleSelectUser(item.id)}
                                                                    className="w-4 h-4 text-[#0d544c] border-gray-300 rounded focus:ring-[#0d544c] cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-sm">
                                                                        {item.username?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                                            {item.personal_information?.first_name} {item.personal_information?.last_name}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">@{item.username}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.email}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.mobile}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#0d544c]/10 text-[#0d544c]">
                                                                    {getRoleIcon(item.role?.name)}
                                                                    <span>{item.role?.name}</span>
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                                                    item.is_verified
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                }`}>
                                                                    {item.is_verified ? 'Verified' : 'Unverified'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => viewUser(item)}
                                                                        className="p-2 text-[#0d544c] hover:bg-[#0d544c]/10 rounded-lg transition-colors"
                                                                        title="View Details"
                                                                    >
                                                                        <FaEye size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => editUser(item)}
                                                                        className="p-2 text-[#3B78BD] hover:bg-[#3B78BD]/10 rounded-lg transition-colors"
                                                                        title="Edit User"
                                                                    >
                                                                        <FaEdit size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                if (activeTab === 'staff') {
                                                    return (
                                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-sm">
                                                                        {item.user?.username?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                                            {item.user?.personal_information?.first_name} {item.user?.personal_information?.last_name}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">@{item.user?.username}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.user?.email}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.local_government?.name}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#0d544c]/10 text-[#0d544c]">
                                                                    {getRoleIcon(item.user?.role?.name)}
                                                                    <span>{item.user?.role?.name}</span>
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    onClick={() => editLGAStaff(item)}
                                                                    className="p-2 text-[#3B78BD] hover:bg-[#3B78BD]/10 rounded-lg transition-colors"
                                                                    title="Edit Staff"
                                                                >
                                                                    <FaEdit size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                if (activeTab === 'authorizers') {
                                                    return (
                                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-sm">
                                                                        {item.user?.username?.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                                            {item.user?.personal_information?.first_name} {item.user?.personal_information?.last_name}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">@{item.user?.username}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.user?.email}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.local_government?.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.eservice?.name}</td>
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    onClick={() => deleteAuthorizer(item.id, item.user?.username)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    title="Remove Authorizer"
                                                                >
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return null;
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-12">
                                                    <FaUsers className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
                                                    <p className="text-gray-500 dark:text-gray-400 text-lg">No results found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <Pagination />
                </>
            )}

            {/* Modals */}
            {userform && <CreateUserNew useredit={useredit} closeUserform={closeUserform} />}
            {staffmodal && <LgasStaffModal users={users} lgas={lgas} setShowmodal={setStaffmodal} lgastaff={selectedLgaStaff} setLagstaff={setSelectedLgaStaff} />}
            {authmodal && <AddModal setShowmodal={setAuthmodal} />}
            {deleting && (
                <PageLoader message="Removing authorizer..." fullScreen={true} />
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
