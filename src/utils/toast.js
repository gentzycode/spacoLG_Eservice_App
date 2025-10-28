/**
 * Centralized Toast Notification Utility
 * Wraps react-toastify with consistent styling and configuration
 */

import { toast as reactToast } from 'react-toastify';

// Default configuration for all toasts
const defaultConfig = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
};

// Custom toast utility
const toast = {
    // Success toast
    success: (message, options = {}) => {
        return reactToast.success(message, {
            ...defaultConfig,
            ...options,
        });
    },

    // Error toast
    error: (message, options = {}) => {
        return reactToast.error(message, {
            ...defaultConfig,
            ...options,
        });
    },

    // Info toast
    info: (message, options = {}) => {
        return reactToast.info(message, {
            ...defaultConfig,
            ...options,
        });
    },

    // Warning toast
    warning: (message, options = {}) => {
        return reactToast.warning(message, {
            ...defaultConfig,
            ...options,
        });
    },

    // Loading toast (useful for async operations)
    loading: (message, options = {}) => {
        return reactToast.loading(message, {
            ...defaultConfig,
            ...options,
        });
    },

    // Update existing toast (useful for loading -> success/error)
    update: (toastId, options = {}) => {
        return reactToast.update(toastId, {
            ...defaultConfig,
            ...options,
        });
    },

    // Dismiss specific toast
    dismiss: (toastId) => {
        return reactToast.dismiss(toastId);
    },

    // Dismiss all toasts
    dismissAll: () => {
        return reactToast.dismiss();
    },

    // Promise toast (automatic loading -> success/error)
    promise: (promise, messages, options = {}) => {
        return reactToast.promise(
            promise,
            {
                pending: messages.pending || 'Processing...',
                success: messages.success || 'Success!',
                error: messages.error || 'Something went wrong',
            },
            {
                ...defaultConfig,
                ...options,
            }
        );
    },
};

// Pre-configured toast messages for common actions
export const toastMessages = {
    // Authentication
    auth: {
        loginSuccess: 'Welcome back! Login successful.',
        loginError: 'Login failed. Please check your credentials.',
        registerSuccess: 'Registration successful! Please verify your email.',
        registerError: 'Registration failed. Please try again.',
        logoutSuccess: 'Logged out successfully.',
        verifyEmailSuccess: 'Email verified successfully!',
        verifyEmailError: 'Email verification failed.',
        passwordResetSent: 'Password reset link sent to your email.',
        passwordResetSuccess: 'Password reset successfully!',
        passwordResetError: 'Password reset failed.',
    },

    // Services
    services: {
        applicationStarted: 'Application started successfully!',
        applicationSubmitted: 'Application submitted successfully!',
        applicationError: 'Failed to submit application.',
        serviceSelected: 'Service selected. Please login to continue.',
        formSaved: 'Form saved successfully!',
        formError: 'Failed to save form.',
    },

    // General
    general: {
        saveSuccess: 'Saved successfully!',
        saveError: 'Failed to save.',
        deleteSuccess: 'Deleted successfully!',
        deleteError: 'Failed to delete.',
        updateSuccess: 'Updated successfully!',
        updateError: 'Failed to update.',
        copySuccess: 'Copied to clipboard!',
        networkError: 'Network error. Please check your connection.',
        serverError: 'Server error. Please try again later.',
        validationError: 'Please fill all required fields correctly.',
    },

    // Payments
    payments: {
        paymentSuccess: 'Payment successful!',
        paymentPending: 'Payment is being processed...',
        paymentFailed: 'Payment failed. Please try again.',
        invoiceGenerated: 'Invoice generated successfully!',
    },
};

// Toast wrapper for async operations with loading state
export const toastAsync = async (promise, messages) => {
    const toastId = toast.loading(messages.loading || 'Processing...');

    try {
        const result = await promise;
        toast.update(toastId, {
            render: messages.success || 'Success!',
            type: 'success',
            isLoading: false,
            autoClose: 3000,
        });
        return result;
    } catch (error) {
        toast.update(toastId, {
            render: messages.error || error.message || 'Something went wrong',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
        });
        throw error;
    }
};

// Toast for API errors with proper formatting
export const toastApiError = (error) => {
    let message = 'An unexpected error occurred';

    if (error.response) {
        // Server responded with error
        if (error.response.data?.message) {
            message = error.response.data.message;
        } else if (error.response.data?.error) {
            message = error.response.data.error;
        } else if (error.response.statusText) {
            message = error.response.statusText;
        }
    } else if (error.request) {
        // Request made but no response
        message = 'Network error. Please check your connection.';
    } else if (error.message) {
        // Error in request setup
        message = error.message;
    }

    toast.error(message);
};

// Toast for validation errors
export const toastValidation = (errors) => {
    if (typeof errors === 'string') {
        toast.warning(errors);
    } else if (Array.isArray(errors)) {
        errors.forEach((error) => toast.warning(error));
    } else if (typeof errors === 'object') {
        Object.values(errors).forEach((error) => {
            if (Array.isArray(error)) {
                error.forEach((msg) => toast.warning(msg));
            } else {
                toast.warning(error);
            }
        });
    }
};

export default toast;
