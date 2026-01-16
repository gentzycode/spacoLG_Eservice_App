import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { getUserById } from '../../../../apis/adminActions';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaUserShield,
    FaCalendar,
    FaMapMarkerAlt,
    FaVenusMars,
    FaEdit,
    FaTimes,
    FaCheck,
    FaShieldAlt,
    FaCheckCircle
} from 'react-icons/fa';
import { MdEmail, MdVerifiedUser } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from '../../../../apis/adminBaseUrl';
import PageLoader from '../../../../common/PageLoader';

// Memoized input component to prevent re-renders
const ProfileInput = React.memo(({ type = 'text', name, value, onChange, required = false, placeholder, label, as = 'input', rows }) => {
    const Component = as;
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && '*'}
            </label>
            <Component
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
                placeholder={placeholder}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
        </div>
    );
});

// Memoized select component
const ProfileSelect = React.memo(({ name, value, onChange, required = false, label, options }) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && '*'}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#0d544c] focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
});

const UserDetail = ({ userid, setUserid, setUserdetail }) => {
    const { token } = useContext(AuthContext);

    const [userinfo, setUserinfo] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [searchPermission, setSearchPermission] = useState('');

    // Profile form state
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        address: ''
    });

    const closeUserinfo = () => {
        setUserid(null);
        setUserdetail(false);
    };

    useEffect(() => {
        getUserById(token, userid, setUserinfo, setError, setFetching);
    }, [token, userid]);

    // Update profile data when userinfo changes
    useEffect(() => {
        if (userinfo?.personal_information) {
            setProfileData({
                first_name: userinfo.personal_information.first_name || '',
                last_name: userinfo.personal_information.last_name || '',
                gender: userinfo.personal_information.gender || '',
                date_of_birth: userinfo.personal_information.date_of_birth || '',
                address: userinfo.personal_information.address || ''
            });
        }
    }, [userinfo]);

    const handleProfileSubmit = useCallback(async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const response = await axios.post(`user-manager/users/${userid}/profile`, profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.success('Profile updated successfully!');
            setShowProfileModal(false);
            // Refresh user data
            getUserById(token, userid, setUserinfo, setError, setFetching);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    }, [profileData, userid, token]);

    const handleProfileChange = useCallback((e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    }, []);

    // Filter permissions based on search
    const filteredPermissions = userinfo?.permissions?.filter(perm =>
        perm?.name?.toLowerCase().includes(searchPermission.toLowerCase())
    ) || [];

    // Group permissions by category (extract prefix before first underscore)
    const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
        const category = perm.name.split('_')[0] || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(perm);
        return acc;
    }, {});

    // ProfileModal component - only rendered when showProfileModal is true
    const renderProfileModal = () => (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowProfileModal(false)} />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl animate-slideIn">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] px-8 py-6 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FaEdit className="text-white" size={24} />
                                <h2 className="text-2xl font-bold text-white">
                                    {userinfo?.personal_information?.user_id ? 'Edit Profile' : 'Complete Profile'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleProfileSubmit} className="px-8 py-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <ProfileInput
                                type="text"
                                name="first_name"
                                value={profileData.first_name}
                                onChange={handleProfileChange}
                                required
                                label="First Name"
                                placeholder="Enter first name"
                            />

                            {/* Last Name */}
                            <ProfileInput
                                type="text"
                                name="last_name"
                                value={profileData.last_name}
                                onChange={handleProfileChange}
                                required
                                label="Last Name"
                                placeholder="Enter last name"
                            />

                            {/* Gender */}
                            <ProfileSelect
                                name="gender"
                                value={profileData.gender}
                                onChange={handleProfileChange}
                                required
                                label="Gender"
                                options={[
                                    { value: '', label: 'Select gender' },
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                            />

                            {/* Date of Birth */}
                            <ProfileInput
                                type="date"
                                name="date_of_birth"
                                value={profileData.date_of_birth}
                                onChange={handleProfileChange}
                                required
                                label="Date of Birth"
                            />
                        </div>

                        {/* Address */}
                        <ProfileInput
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            required
                            label="Address"
                            placeholder="Enter full address"
                            as="textarea"
                            rows={3}
                        />

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setShowProfileModal(false)}
                                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaCheck size={16} />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    if (fetching || !userinfo) {
        return <PageLoader message="Loading user details..." fullScreen={false} />;
    }

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0d544c] to-[#3B78BD] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {userinfo?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {userinfo?.personal_information?.first_name && userinfo?.personal_information?.last_name
                                ? `${userinfo.personal_information.first_name} ${userinfo.personal_information.last_name}`
                                : userinfo?.username
                            }
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">@{userinfo?.username}</p>
                    </div>
                </div>
                <button
                    onClick={closeUserinfo}
                    className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                >
                    <FaTimes size={24} />
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Bio-data Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                            <FaUser className="text-[#0d544c]" />
                            <span>Bio-data</span>
                        </h3>
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#0d544c] text-white rounded-lg hover:bg-[#3B78BD] transition-colors text-sm"
                        >
                            <FaEdit size={14} />
                            <span>{userinfo?.personal_information?.user_id ? 'Edit' : 'Complete'} Profile</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <FaEnvelope className="text-[#0d544c]" size={20} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{userinfo?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <FaPhone className="text-green-600" size={20} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Mobile</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{userinfo?.mobile}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <FaUserShield className="text-purple-600" size={20} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{userinfo?.role?.name}</p>
                            </div>
                        </div>

                        {/* Personal Information */}
                        {userinfo?.personal_information?.user_id ? (
                            <>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Personal Details</h4>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <FaVenusMars className="text-blue-600" size={20} />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{userinfo.personal_information.gender}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <FaCalendar className="text-orange-600" size={20} />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{userinfo.personal_information.date_of_birth}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <FaMapMarkerAlt className="text-red-600 mt-1" size={20} />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{userinfo.personal_information.address}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg">
                                <MdEmail className="text-orange-600" size={24} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                        Profile information not provided yet!
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                        Click "Complete Profile" to add personal details
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Permissions Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                            <FaShieldAlt className="text-[#0d544c]" />
                            <span>Permissions</span>
                            <span className="text-sm font-normal text-gray-500">
                                ({userinfo?.permissions?.length || 0})
                            </span>
                        </h3>
                    </div>

                    {userinfo?.permissions?.length > 0 ? (
                        <>
                            {/* Search Permissions */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search permissions..."
                                    value={searchPermission}
                                    onChange={(e) => setSearchPermission(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0d544c] focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                                />
                            </div>

                            {/* Permissions List - Scrollable with max height */}
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.keys(groupedPermissions).sort().map(category => (
                                    <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                        <div className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] px-4 py-2">
                                            <h4 className="text-sm font-semibold text-white capitalize">
                                                {category.replace('_', ' ')} ({groupedPermissions[category].length})
                                            </h4>
                                        </div>
                                        <div className="p-3 space-y-1 bg-gray-50 dark:bg-gray-700/50">
                                            {groupedPermissions[category].map(perm => (
                                                <div
                                                    key={perm.id}
                                                    className="flex items-center space-x-2 py-2 px-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <FaCheckCircle className="text-green-500 flex-shrink-0" size={14} />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                        {perm.name.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg">
                            <FaShieldAlt className="text-orange-600" size={24} />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                    No permissions assigned to this user!
                                </p>
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                    Contact an administrator to assign permissions
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && renderProfileModal()}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #0d544c;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3B78BD;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default UserDetail;
