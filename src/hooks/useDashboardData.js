import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../apis/baseUrl';

/**
 * Custom hook for fetching dashboard data
 *
 * Automatically detects user role and fetches appropriate dashboard data
 * Provides loading, error states, and refetch functionality
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Auto-fetch on mount (default: true)
 * @param {number} options.refreshInterval - Auto-refresh interval in ms (default: null)
 * @returns {Object} Dashboard data, loading state, error, and refetch function
 */
const useDashboardData = ({ autoFetch = true, refreshInterval = null } = {}) => {
    const { token, user } = useContext(AuthContext);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);

    /**
     * Determine which endpoint to call based on user role
     */
    const getEndpoint = useCallback(() => {
        if (!user?.role) return null;

        const roleName = typeof user.role === 'string' ? user.role : user.role.name;

        switch (roleName) {
            case 'SuperAdmin':
                return '/super-admin/dashboard';
            case 'Agent':
                return '/dashboard/agent';
            case 'PublicUser':
            case 'Staff':
            case 'LocalAdmin':
                return '/dashboard/user';
            default:
                return '/dashboard/user';
        }
    }, [user]);

    /**
     * Fetch dashboard data from API
     */
    const fetchDashboardData = useCallback(async () => {
        const endpoint = getEndpoint();

        if (!endpoint || !token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                setData(response.data.data);
                setLastFetch(new Date());
            } else {
                throw new Error(response.data.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Dashboard data fetch error:', err);
            setError({
                message: err.response?.data?.message || err.message || 'Failed to load dashboard',
                status: err.response?.status,
                details: err.response?.data?.error,
            });
        } finally {
            setLoading(false);
        }
    }, [token, getEndpoint]);

    /**
     * Manual refetch function
     */
    const refetch = useCallback(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    /**
     * Auto-fetch on mount and when dependencies change
     */
    useEffect(() => {
        if (autoFetch) {
            fetchDashboardData();
        }
    }, [autoFetch, fetchDashboardData]);

    /**
     * Set up auto-refresh interval if specified
     */
    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const intervalId = setInterval(() => {
                fetchDashboardData();
            }, refreshInterval);

            return () => clearInterval(intervalId);
        }
    }, [refreshInterval, fetchDashboardData]);

    return {
        data,
        loading,
        error,
        refetch,
        lastFetch,
    };
};

export default useDashboardData;
