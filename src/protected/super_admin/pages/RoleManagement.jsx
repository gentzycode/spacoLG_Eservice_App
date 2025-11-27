import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getRoles, getPermissionsGrouped, createRole, updateRole, deleteRole, assignRolePermissions } from '../../../apis/authActions';
import PageLoader from '../../../common/PageLoader';
import {
    FaShieldAlt,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaUsers,
    FaLock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimes,
    FaSave,
    FaKey
} from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';

const RoleManagement = () => {
    const { token, logout } = useContext(AuthContext);

    // State management
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form states
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Dropdown state
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rolesResponse, permissionsResponse] = await Promise.all([
                getRoles(token),
                getPermissionsGrouped(token)
            ]);

            if (rolesResponse.status === 'success') {
                setRoles(rolesResponse.data || []);
            }

            if (permissionsResponse.status === 'success') {
                // Convert array format to object format for easier use
                const permissionsArray = permissionsResponse.data || [];
                const permissionsObject = {};
                permissionsArray.forEach(group => {
                    if (group.module && group.permissions) {
                        permissionsObject[group.module] = group.permissions;
                    }
                });
                setPermissions(permissionsObject);
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load roles and permissions');
            if (err.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRole = () => {
        setIsEditing(false);
        setRoleName('');
        setSelectedPermissions([]);
        setSelectedRole(null);
        setShowRoleModal(true);
    };

    const handleEditRole = (role) => {
        setIsEditing(true);
        setSelectedRole(role);
        setRoleName(role.name);
        // Safely extract permission IDs
        const permIds = Array.isArray(role.permissions)
            ? role.permissions.map(p => p.id).filter(id => id != null)
            : [];
        setSelectedPermissions(permIds);
        setShowRoleModal(true);
        setActiveDropdown(null);
    };

    const handleManagePermissions = (role) => {
        setSelectedRole(role);
        // Safely extract permission IDs
        const permIds = Array.isArray(role.permissions)
            ? role.permissions.map(p => p.id).filter(id => id != null)
            : [];
        setSelectedPermissions(permIds);
        setShowPermissionModal(true);
        setActiveDropdown(null);
    };

    const handleDeleteRole = (role) => {
        setSelectedRole(role);
        setShowDeleteModal(true);
        setActiveDropdown(null);
    };

    const handleSubmitRole = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                name: roleName,
                permissions: selectedPermissions
            };

            let response;
            if (isEditing) {
                response = await updateRole(token, selectedRole.id, payload);
            } else {
                response = await createRole(token, payload);
            }

            if (response.status === 'success') {
                setSuccess(isEditing ? 'Role updated successfully' : 'Role created successfully');
                setShowRoleModal(false);
                loadData();
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.message || 'Failed to save role');
            }
        } catch (err) {
            console.error('Error saving role:', err);
            setError(err.response?.data?.message || 'Failed to save role');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitPermissions = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await assignRolePermissions(token, selectedRole.id, selectedPermissions);

            if (response.status === 'success') {
                setSuccess('Permissions updated successfully');
                setShowPermissionModal(false);
                loadData();
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.message || 'Failed to update permissions');
            }
        } catch (err) {
            console.error('Error updating permissions:', err);
            setError(err.response?.data?.message || 'Failed to update permissions');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDeleteRole = async () => {
        setSubmitting(true);
        setError(null);

        try {
            const response = await deleteRole(token, selectedRole.id);

            if (response.status === 'success') {
                setSuccess('Role deleted successfully');
                setShowDeleteModal(false);
                loadData();
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.message || 'Failed to delete role');
            }
        } catch (err) {
            console.error('Error deleting role:', err);
            setError(err.response?.data?.message || 'Failed to delete role');
        } finally {
            setSubmitting(false);
        }
    };

    const togglePermission = (permissionId) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const toggleModulePermissions = (modulePermissions) => {
        const modulePermissionIds = modulePermissions.map(p => p.id);
        const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !modulePermissionIds.includes(id)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissionIds])]);
        }
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <FaShieldAlt className="text-blue-600" />
                            Role & Permission Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage system roles and their permissions
                        </p>
                    </div>
                    <button
                        onClick={handleCreateRole}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <FaPlus />
                        Create Role
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
                    <FaCheckCircle />
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
                    <FaExclamationTriangle />
                    {error}
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map(role => (
                    <div
                        key={role.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-lg ${
                                        role.is_protected
                                            ? 'bg-red-100 dark:bg-red-900/30'
                                            : 'bg-blue-100 dark:bg-blue-900/30'
                                    }`}>
                                        {role.is_protected ? (
                                            <FaLock className="text-red-600 dark:text-red-400 text-xl" />
                                        ) : (
                                            <MdSecurity className="text-blue-600 dark:text-blue-400 text-xl" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {role.name}
                                        </h3>
                                        {role.is_protected && (
                                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                Protected Role
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === role.id ? null : role.id)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <BsThreeDotsVertical className="text-gray-600 dark:text-gray-400" />
                                    </button>
                                    {activeDropdown === role.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10">
                                            {!role.is_protected && (
                                                <button
                                                    onClick={() => handleEditRole(role)}
                                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                                                >
                                                    <FaEdit /> Edit Role
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleManagePermissions(role)}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                                            >
                                                <FaKey /> Manage Permissions
                                            </button>
                                            {!role.is_protected && !role.cannot_delete && (
                                                <button
                                                    onClick={() => handleDeleteRole(role)}
                                                    className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-red-600 dark:text-red-400"
                                                >
                                                    <FaTrash /> Delete Role
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <FaUsers />
                                    <span className="text-sm">
                                        {role.userCount || 0} users assigned
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <FaKey />
                                    <span className="text-sm">
                                        {role.permissions?.length || 0} permissions
                                    </span>
                                </div>
                            </div>

                            {role.permissions && role.permissions.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent Permissions:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.slice(0, 3).map(permission => (
                                            <span
                                                key={permission.id}
                                                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                                            >
                                                {permission.name}
                                            </span>
                                        ))}
                                        {role.permissions.length > 3 && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                                +{role.permissions.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredRoles.length === 0 && (
                <div className="text-center py-12">
                    <FaShieldAlt className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchQuery ? 'No roles found matching your search' : 'No roles available'}
                    </p>
                </div>
            )}

            {/* Role Create/Edit Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? 'Edit Role' : 'Create New Role'}
                            </h2>
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitRole} className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    required
                                    disabled={selectedRole?.is_protected}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900"
                                    placeholder="Enter role name"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Permissions
                                </label>
                                <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    {Object.keys(permissions).length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading permissions...</p>
                                    ) : (
                                        Object.entries(permissions).map(([module, modulePermissions]) => {
                                        // Ensure modulePermissions is an array
                                        const permsArray = Array.isArray(modulePermissions) ? modulePermissions : [];

                                        return (
                                            <div key={module} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={permsArray.length > 0 && permsArray.every(p => selectedPermissions.includes(p.id))}
                                                        onChange={() => toggleModulePermissions(permsArray)}
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label className="font-semibold text-gray-900 dark:text-white capitalize">
                                                        {module}
                                                    </label>
                                                </div>
                                                <div className="ml-6 space-y-2">
                                                    {permsArray.map(permission => (
                                                        <label key={permission.id} className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={() => togglePermission(permission.id)}
                                                                className="rounded text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                {permission.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <FaSave />
                                            {isEditing ? 'Update Role' : 'Create Role'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowRoleModal(false)}
                                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Permission Management Modal */}
            {showPermissionModal && selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Manage Permissions - {selectedRole.name}
                            </h2>
                            <button
                                onClick={() => setShowPermissionModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitPermissions} className="p-6">
                            <div className="mb-6">
                                <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    {Object.keys(permissions).length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading permissions...</p>
                                    ) : (
                                        Object.entries(permissions).map(([module, modulePermissions]) => {
                                            // Ensure modulePermissions is an array
                                            const permsArray = Array.isArray(modulePermissions) ? modulePermissions : [];

                                            return (
                                                <div key={module} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={permsArray.length > 0 && permsArray.every(p => selectedPermissions.includes(p.id))}
                                                            onChange={() => toggleModulePermissions(permsArray)}
                                                            className="rounded text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <label className="font-semibold text-gray-900 dark:text-white capitalize">
                                                            {module}
                                                        </label>
                                                    </div>
                                                    <div className="ml-6 space-y-2">
                                                        {permsArray.map(permission => (
                                                            <label key={permission.id} className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedPermissions.includes(permission.id)}
                                                                    onChange={() => togglePermission(permission.id)}
                                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                {permission.name}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Update Permissions
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPermissionModal(false)}
                                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Delete Role
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Are you sure you want to delete the role "{selectedRole.name}"?
                            </p>
                            {selectedRole.userCount > 0 && (
                                <p className="text-red-600 dark:text-red-400 mt-2 text-sm">
                                    Warning: {selectedRole.userCount} user(s) are assigned to this role.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmDeleteRole}
                                disabled={submitting}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                            >
                                {submitting ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveDropdown(null)}
                />
            )}
        </div>
    );
};

export default RoleManagement;
