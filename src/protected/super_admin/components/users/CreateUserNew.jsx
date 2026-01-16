import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { createUser, updateUser } from '../../../../apis/adminActions';
import useRoles from '../../../../hooks/useRoles';
import { toast } from 'react-toastify';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaUserShield,
    FaTimes,
    FaCheck,
    FaArrowRight,
    FaArrowLeft,
    FaUserPlus,
    FaEdit
} from 'react-icons/fa';
import ButtonLoader from '../../../../common/ButtonLoader';

// Input Field Component - Memoized to prevent re-renders
const InputField = React.memo(({ name, label, type = 'text', icon: Icon, placeholder, value, onChange, onBlur, error, touched }) => (
    <div className="space-y-2 animate-fadeIn">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className={`h-5 w-5 ${error && touched ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-offset-2 transition-all ${
                    error && touched
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-[#0d544c] focus:border-[#0d544c]'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            />
            {error && touched && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaTimes className="h-5 w-5 text-red-500" />
                </div>
            )}
        </div>
        {error && touched && (
            <p className="text-sm text-red-600 dark:text-red-400 animate-slideIn">{error}</p>
        )}
    </div>
));

InputField.displayName = 'InputField';

/**
 * CreateUserNew Component
 *
 * Modern, animated, multi-step user creation modal
 */
const CreateUserNew = ({ useredit, closeUserform }) => {
    const { token, refreshRecord } = useContext(AuthContext);
    const { data: roles, loading: rolesLoading } = useRoles({ autoFetch: true });

    // Form state
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        username: useredit?.username || '',
        email: useredit?.email || '',
        mobile: useredit?.mobile || '',
        role_id: useredit?.role_id || '',
        password_hash: '',
        password_hash_confirmation: ''
    });

    // UI state
    const [creating, setCreating] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const totalSteps = useredit ? 2 : 3;

    // Validation function - memoized
    const validateField = useCallback((name, value) => {
        switch (name) {
            case 'username':
                if (!value) return 'Username is required';
                if (value.length < 6) return 'Username must be at least 6 characters';
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
                return '';
            case 'email':
                if (!value) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                return '';
            case 'mobile':
                if (!value) return 'Mobile number is required';
                if (!/^[0-9]{10,15}$/.test(value.replace(/[\s-]/g, ''))) return 'Mobile must be 10-15 digits';
                return '';
            case 'role_id':
                if (!value) return 'Role is required';
                return '';
            case 'password_hash':
                if (useredit) return '';
                if (!value) return 'Password is required';
                if (value.length < 8) return 'Password must be at least 8 characters';
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    return 'Password must contain uppercase, lowercase, and number';
                }
                return '';
            case 'password_hash_confirmation':
                if (useredit) return '';
                if (!value) return 'Please confirm password';
                if (value !== formData.password_hash) return 'Passwords do not match';
                return '';
            default:
                return '';
        }
    }, [useredit, formData.password_hash]);

    // Handle input change - memoized
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    }, [touched, validateField]);

    // Handle blur - memoized
    const handleBlur = useCallback((name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
    }, [formData, validateField]);

    // Get fields for current step
    const getStepFields = useCallback((step) => {
        if (useredit) {
            return step === 1
                ? ['username', 'email', 'mobile']
                : ['role_id'];
        } else {
            switch (step) {
                case 1:
                    return ['username', 'email', 'mobile'];
                case 2:
                    return ['password_hash', 'password_hash_confirmation'];
                case 3:
                    return ['role_id'];
                default:
                    return [];
            }
        }
    }, [useredit]);

    // Validate current step
    const validateStep = useCallback(() => {
        const stepFields = getStepFields(currentStep);
        const stepErrors = {};
        let isValid = true;

        stepFields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                stepErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(prev => ({ ...prev, ...stepErrors }));
        return isValid;
    }, [currentStep, formData, getStepFields, validateField]);

    // Handle next step
    const handleNext = useCallback(() => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        } else {
            const stepFields = getStepFields(currentStep);
            const newTouched = {};
            stepFields.forEach(field => {
                newTouched[field] = true;
            });
            setTouched(prev => ({ ...prev, ...newTouched }));
        }
    }, [validateStep, totalSteps, currentStep, getStepFields]);

    // Handle previous step
    const handlePrevious = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    // Handle submit
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateStep()) {
            const stepFields = getStepFields(currentStep);
            const newTouched = {};
            stepFields.forEach(field => {
                newTouched[field] = true;
            });
            setTouched(prev => ({ ...prev, ...newTouched }));
            return;
        }

        setCreating(true);

        const data = useredit
            ? {
                username: formData.username,
                email: formData.email,
                mobile: formData.mobile,
                role_id: formData.role_id
            }
            : formData;

        const onSuccess = () => {
            toast.success(useredit ? 'User updated successfully!' : 'User created successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            refreshRecord(Date.now());
            closeUserform();
        };

        const onError = (error) => {
            setCreating(false);

            // Handle validation errors from backend
            if (error?.response?.data?.errors) {
                const backendErrors = {};
                const errorMessages = [];

                Object.keys(error.response.data.errors).forEach(key => {
                    const fieldErrors = error.response.data.errors[key];
                    backendErrors[key] = fieldErrors[0];
                    errorMessages.push(fieldErrors[0]);
                });

                setErrors(prev => ({ ...prev, ...backendErrors }));

                // Show specific validation errors to user
                errorMessages.forEach((msg, index) => {
                    setTimeout(() => {
                        toast.error(msg, {
                            position: 'top-right',
                            autoClose: 5000
                        });
                    }, index * 100); // Stagger toasts slightly
                });

                // Navigate back to step 1 where username/email fields are
                setCurrentStep(1);

                // Mark the fields as touched to show errors
                const newTouched = {};
                Object.keys(backendErrors).forEach(key => {
                    newTouched[key] = true;
                });
                setTouched(prev => ({ ...prev, ...newTouched }));
            } else {
                // Show generic error message
                const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 5000
                });
            }
        };

        if (useredit) {
            updateUser(token, useredit.id, data, onSuccess, onError, setCreating);
        } else {
            createUser(token, data, onSuccess, onError, setCreating);
        }
    }, [validateStep, getStepFields, currentStep, formData, useredit, token, refreshRecord, closeUserform]);

    // Get role color - memoized
    const getRoleColor = useCallback((roleName) => {
        switch (roleName) {
            case 'SuperAdmin': return 'from-yellow-500 to-orange-500';
            case 'LocalAdmin': return 'from-blue-500 to-indigo-500';
            case 'Agent': return 'from-green-500 to-emerald-500';
            case 'Staff': return 'from-purple-500 to-pink-500';
            default: return 'from-gray-500 to-gray-600';
        }
    }, []);

    // Progress bar - memoized
    const ProgressBar = useMemo(() => () => (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <div key={step} className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                            step < currentStep
                                ? 'bg-green-500 text-white'
                                : step === currentStep
                                ? 'bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white shadow-lg scale-110'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}>
                            {step < currentStep ? <FaCheck size={16} /> : step}
                        </div>
                        {step < totalSteps && (
                            <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                                step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Account Info</span>
                {!useredit && <span>Security</span>}
                <span>Role & Confirm</span>
            </div>
        </div>
    ), [currentStep, totalSteps, useredit]);

    // Render step content
    const renderStepContent = () => {
        if (useredit) {
            if (currentStep === 1) {
                return (
                    <div className="space-y-4">
                        <InputField
                            name="username"
                            label="Username"
                            icon={FaUser}
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={() => handleBlur('username')}
                            error={errors.username}
                            touched={touched.username}
                        />
                        <InputField
                            name="email"
                            label="Email Address"
                            type="email"
                            icon={FaEnvelope}
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            error={errors.email}
                            touched={touched.email}
                        />
                        <InputField
                            name="mobile"
                            label="Mobile Number"
                            icon={FaPhone}
                            placeholder="08012345678"
                            value={formData.mobile}
                            onChange={handleChange}
                            onBlur={() => handleBlur('mobile')}
                            error={errors.mobile}
                            touched={touched.mobile}
                        />
                    </div>
                );
            } else {
                return (
                    <div className="space-y-4">
                        <div className="space-y-2 animate-fadeIn">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                User Role
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUserShield className={`h-5 w-5 ${errors.role_id && touched.role_id ? 'text-red-500' : 'text-gray-400'}`} />
                                </div>
                                <select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('role_id')}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-offset-2 transition-all ${
                                        errors.role_id && touched.role_id
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-[#0d544c] focus:border-[#0d544c]'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                >
                                    <option value="">Select a role</option>
                                    {roles && roles.filter(r => r.name !== 'SuperAdmin').map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.role_id && touched.role_id && (
                                <p className="text-sm text-red-600 dark:text-red-400 animate-slideIn">{errors.role_id}</p>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Update Preview</h4>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FaUser className="text-[#0d544c]" />
                                    <div>
                                        <p className="text-xs text-gray-500">Username</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formData.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaEnvelope className="text-[#3B78BD]" />
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaPhone className="text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Mobile</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formData.mobile}</p>
                                    </div>
                                </div>
                                {formData.role_id && (
                                    <div className="flex items-center space-x-3">
                                        <FaUserShield className="text-purple-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Role</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {roles?.find(r => r.id === parseInt(formData.role_id))?.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            switch (currentStep) {
                case 1:
                    return (
                        <div className="space-y-4">
                            <InputField
                                name="username"
                                label="Username"
                                icon={FaUser}
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                onBlur={() => handleBlur('username')}
                                error={errors.username}
                                touched={touched.username}
                            />
                            <InputField
                                name="email"
                                label="Email Address"
                                type="email"
                                icon={FaEnvelope}
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur('email')}
                                error={errors.email}
                                touched={touched.email}
                            />
                            <InputField
                                name="mobile"
                                label="Mobile Number"
                                icon={FaPhone}
                                placeholder="08012345678"
                                value={formData.mobile}
                                onChange={handleChange}
                                onBlur={() => handleBlur('mobile')}
                                error={errors.mobile}
                                touched={touched.mobile}
                            />
                        </div>
                    );
                case 2:
                    return (
                        <div className="space-y-4">
                            <InputField
                                name="password_hash"
                                label="Password"
                                type="password"
                                icon={FaLock}
                                placeholder="Enter password"
                                value={formData.password_hash}
                                onChange={handleChange}
                                onBlur={() => handleBlur('password_hash')}
                                error={errors.password_hash}
                                touched={touched.password_hash}
                            />
                            <InputField
                                name="password_hash_confirmation"
                                label="Confirm Password"
                                type="password"
                                icon={FaLock}
                                placeholder="Re-enter password"
                                value={formData.password_hash_confirmation}
                                onChange={handleChange}
                                onBlur={() => handleBlur('password_hash_confirmation')}
                                error={errors.password_hash_confirmation}
                                touched={touched.password_hash_confirmation}
                            />
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 animate-fadeIn">
                                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">Password Requirements:</p>
                                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                    <li className="flex items-center space-x-2">
                                        <span className={formData.password_hash.length >= 8 ? 'text-green-600' : ''}>
                                            {formData.password_hash.length >= 8 ? '✓' : '○'}
                                        </span>
                                        <span>At least 8 characters</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={/[A-Z]/.test(formData.password_hash) ? 'text-green-600' : ''}>
                                            {/[A-Z]/.test(formData.password_hash) ? '✓' : '○'}
                                        </span>
                                        <span>One uppercase letter</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={/[a-z]/.test(formData.password_hash) ? 'text-green-600' : ''}>
                                            {/[a-z]/.test(formData.password_hash) ? '✓' : '○'}
                                        </span>
                                        <span>One lowercase letter</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={/\d/.test(formData.password_hash) ? 'text-green-600' : ''}>
                                            {/\d/.test(formData.password_hash) ? '✓' : '○'}
                                        </span>
                                        <span>One number</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    );
                case 3:
                    return (
                        <div className="space-y-4">
                            <div className="space-y-2 animate-fadeIn">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    User Role
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserShield className={`h-5 w-5 ${errors.role_id && touched.role_id ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <select
                                        name="role_id"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('role_id')}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-offset-2 transition-all ${
                                            errors.role_id && touched.role_id
                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 dark:border-gray-600 focus:ring-[#0d544c] focus:border-[#0d544c]'
                                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                    >
                                        <option value="">Select a role</option>
                                        {roles && roles.filter(r => r.name !== 'SuperAdmin').map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.role_id && touched.role_id && (
                                    <p className="text-sm text-red-600 dark:text-red-400 animate-slideIn">{errors.role_id}</p>
                                )}
                            </div>

                            {/* Role descriptions */}
                            {formData.role_id && (
                                <div className="grid grid-cols-1 gap-3 animate-fadeIn">
                                    {roles?.filter(r => r.id === parseInt(formData.role_id)).map(role => (
                                        <div key={role.id} className={`p-4 rounded-xl bg-gradient-to-r ${getRoleColor(role.name)} text-white shadow-lg`}>
                                            <div className="flex items-center space-x-3">
                                                <FaUserShield size={24} />
                                                <div>
                                                    <h4 className="font-bold">{role.name}</h4>
                                                    <p className="text-sm opacity-90">{role.description || 'System user role'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Preview */}
                            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Summary</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <FaUser className="text-[#0d544c]" />
                                        <div>
                                            <p className="text-xs text-gray-500">Username</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{formData.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-[#3B78BD]" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FaPhone className="text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Mobile</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{formData.mobile}</p>
                                        </div>
                                    </div>
                                    {formData.role_id && (
                                        <div className="flex items-center space-x-3">
                                            <FaUserShield className="text-purple-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Role</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {roles?.find(r => r.id === parseInt(formData.role_id))?.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity animate-fadeIn"
                onClick={closeUserform}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl animate-slideIn overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {useredit ? (
                                    <FaEdit className="text-white" size={24} />
                                ) : (
                                    <FaUserPlus className="text-white" size={24} />
                                )}
                                <h2 className="text-2xl font-bold text-white">
                                    {useredit ? 'Edit User' : 'Create New User'}
                                </h2>
                            </div>
                            <button
                                onClick={closeUserform}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6">
                        <ProgressBar />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {renderStepContent()}

                            {/* Action buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={currentStep === 1 ? closeUserform : handlePrevious}
                                    className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                                >
                                    <FaArrowLeft size={16} />
                                    <span>{currentStep === 1 ? 'Cancel' : 'Previous'}</span>
                                </button>

                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all font-medium"
                                    >
                                        <span>Next</span>
                                        <FaArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {creating ? (
                                            <>
                                                <ButtonLoader />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck size={16} />
                                                <span>{useredit ? 'Update User' : 'Create User'}</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CreateUserNew;
