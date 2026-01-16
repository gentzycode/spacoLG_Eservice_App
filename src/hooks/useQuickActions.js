import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../apis/baseUrl';

/**
 * Custom hook for fetching quick actions
 *
 * Fetches role-specific quick actions from the backend
 * Can be used independently or as part of dashboard data
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Auto-fetch on mount (default: true)
 * @param {Array} options.fallbackActions - Fallback actions if API fails
 * @returns {Object} Quick actions data, loading state, and error
 */
const useQuickActions = ({ autoFetch = true, fallbackActions = [] } = {}) => {
    const { token, user } = useContext(AuthContext);

    const [actions, setActions] = useState(fallbackActions);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch quick actions from API
     */
    const fetchQuickActions = useCallback(async () => {
        if (!token || !user) {
            setLoading(false);
            setActions(fallbackActions);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // SuperAdmin has dedicated quick actions endpoint
            const roleName = typeof user.role === 'string' ? user.role : user.role.name;
            let endpoint = '/dashboard/user'; // Default endpoint returns quick actions

            if (roleName === 'SuperAdmin') {
                endpoint = '/super-admin/dashboard/quick-actions';
            }

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                // Quick actions can be in data directly or in data.quickActions
                const quickActions = response.data.data.quickActions || response.data.data;
                setActions(Array.isArray(quickActions) ? quickActions : fallbackActions);
            } else {
                throw new Error('Failed to fetch quick actions');
            }
        } catch (err) {
            console.error('Quick actions fetch error:', err);
            setError(err.message);
            setActions(fallbackActions);
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    /**
     * Auto-fetch on mount
     */
    useEffect(() => {
        if (autoFetch) {
            fetchQuickActions();
        }
    }, [autoFetch, fetchQuickActions]);

    return {
        actions,
        loading,
        error,
        refetch: fetchQuickActions,
    };
};

export default useQuickActions;
