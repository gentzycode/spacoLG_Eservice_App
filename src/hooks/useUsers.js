import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../apis/adminBaseUrl';

/**
 * Custom hook for managing users data
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Whether to fetch data automatically on mount
 * @returns {Object} { data, loading, error, refetch }
 */
const useUsers = ({ autoFetch = true } = {}) => {
    const { token, logout } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('user-manager/users', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            setData(response.data?.data);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Failed to fetch users';
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
            fetchUsers();
        }
    }, [autoFetch, fetchUsers]);

    return {
        data,
        loading,
        error,
        refetch: fetchUsers
    };
};

export default useUsers;
