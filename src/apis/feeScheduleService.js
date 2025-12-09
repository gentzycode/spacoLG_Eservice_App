import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://lga-backend.test';

/**
 * Fetch fee schedule with optional filters
 * @param {Object} params - Query parameters (search, schedule, category, payment_frequency, per_page)
 * @returns {Promise} - API response with fee schedule data
 */
export const fetchFeeSchedule = async (params = {}) => {
    try {
        // Build query params, only include non-empty values
        const queryParams = {};

        if (params.search) queryParams.search = params.search;
        if (params.schedule) queryParams.schedule = params.schedule;
        if (params.category) queryParams.category = params.category;
        if (params.payment_frequency) queryParams.payment_frequency = params.payment_frequency;
        queryParams.per_page = params.per_page || 20;

        console.log('Sending params to API:', queryParams);

        const response = await axios.get(`${API_BASE_URL}/api/public/fee-schedule`, {
            params: queryParams
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching fee schedule:', error);
        throw error;
    }
};

/**
 * Fetch fee schedule grouped by schedule number
 * @param {string} search - Optional search query
 * @returns {Promise} - API response with grouped data
 */
export const fetchGroupedFeeSchedule = async (search = '') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/public/fee-schedule/grouped`, {
            params: { search }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching grouped fee schedule:', error);
        throw error;
    }
};

/**
 * Fetch all available categories
 * @returns {Promise} - API response with categories array
 */
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/public/fee-schedule/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

/**
 * Fetch statistics for the fee schedule
 * @returns {Promise} - API response with statistics
 */
export const fetchStatistics = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/public/fee-schedule/statistics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }
};
