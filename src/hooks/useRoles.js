import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../apis/adminBaseUrl';

/**
 * Custom hook for managing roles data
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Whether to fetch data automatically on mount
 * @returns {Object} { data, loading, error, refetch }
 */
const useRoles = ({ autoFetch = true } = {}) => {
    const { token, logout } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoles = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('role-manager/roles', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            setData(response.data?.data);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Failed to fetch roles';
            setError({
                message: errorMessage,
                status: err?.response?.status
            });

            // Handle token expiration
            if (err?.response?.data?.message === 'Token has expired') {
                logout();
            }
        } finally {
            setLoading(false);
        }
    }, [token, logout]);

    useEffect(() => {
        if (autoFetch) {
            fetchRoles();
        }
    }, [autoFetch, fetchRoles]);

    return {
        data,
        loading,
        error,
        refetch: fetchRoles
    };
};

export default useRoles;
