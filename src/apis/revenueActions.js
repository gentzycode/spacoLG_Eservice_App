import { adminApiClient } from './apiClient';
import logger from '../utils/logger';

/**
 * Revenue Management API Actions
 * Handles Revenue Heads, Daily Tickets, and Penalty Assessments
 */

// ==================== PAYMENT GATEWAYS ====================

/**
 * Fetch enabled payment gateways
 * @returns {Promise} API response
 */
export const fetchEnabledPaymentMethods = async () => {
    try {
        const response = await adminApiClient.get('/paymentgateways/enabled');
        return response.data;
    } catch (error) {
        logger.error('Error fetching enabled payment methods:', error);
        throw error;
    }
};

// ==================== REVENUE HEADS ====================

/**
 * Fetch all revenue heads with optional filters
 * @param {Object} params - Filter parameters (schedule, category, active_only, etc.)
 * @returns {Promise} API response
 */
export const fetchRevenueHeads = async (params = {}) => {
    try {
        const response = await adminApiClient.get('/revenue-manager/revenue-heads', { params });
        return response.data;
    } catch (error) {
        logger.error('Error fetching revenue heads:', error);
        throw error;
    }
};

/**
 * Fetch a single revenue head by ID
 * @param {number} id - Revenue head ID
 * @returns {Promise} API response
 */
export const fetchRevenueHeadById = async (id) => {
    try {
        const response = await adminApiClient.get(`/revenue-manager/revenue-heads/${id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching revenue head ${id}:`, error);
        throw error;
    }
};

/**
 * Fetch revenue heads by schedule number
 * @param {number} schedule - Schedule number (1-6)
 * @returns {Promise} API response
 */
export const fetchRevenueHeadsBySchedule = async (schedule) => {
    try {
        const response = await adminApiClient.get(`/revenue-manager/revenue-heads/by-schedule/${schedule}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching revenue heads for schedule ${schedule}:`, error);
        throw error;
    }
};

/**
 * Fetch all revenue head categories
 * @returns {Promise} API response
 */
export const fetchRevenueCategories = async () => {
    try {
        const response = await adminApiClient.get('/revenue-manager/revenue-heads/categories/list');
        return response.data;
    } catch (error) {
        logger.error('Error fetching revenue categories:', error);
        throw error;
    }
};

/**
 * Fetch daily payment items (for daily ticket generation)
 * @returns {Promise} API response
 */
export const fetchDailyPaymentItems = async () => {
    try {
        const response = await adminApiClient.get('/revenue-manager/revenue-heads/daily-payment/items');
        return response.data;
    } catch (error) {
        logger.error('Error fetching daily payment items:', error);
        throw error;
    }
};

/**
 * Create a new revenue head
 * @param {Object} data - Revenue head data
 * @returns {Promise} API response
 */
export const createRevenueHead = async (data) => {
    try {
        const response = await adminApiClient.post('/revenue-manager/revenue-heads', data);
        return response.data;
    } catch (error) {
        logger.error('Error creating revenue head:', error);
        throw error;
    }
};

/**
 * Update an existing revenue head
 * @param {number} id - Revenue head ID
 * @param {Object} data - Updated revenue head data
 * @returns {Promise} API response
 */
export const updateRevenueHead = async (id, data) => {
    try {
        const response = await adminApiClient.put(`/revenue-manager/revenue-heads/${id}`, data);
        return response.data;
    } catch (error) {
        logger.error(`Error updating revenue head ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a revenue head
 * @param {number} id - Revenue head ID
 * @returns {Promise} API response
 */
export const deleteRevenueHead = async (id) => {
    try {
        const response = await adminApiClient.delete(`/revenue-manager/revenue-heads/${id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error deleting revenue head ${id}:`, error);
        throw error;
    }
};

// ==================== DAILY TICKETS ====================

/**
 * Fetch all daily tickets with optional filters
 * @param {Object} params - Filter parameters (date, category, collector_id, status, etc.)
 * @returns {Promise} API response
 */
export const fetchDailyTickets = async (params = {}) => {
    try {
        const response = await adminApiClient.get('/daily-ticket-manager/daily-tickets', { params });
        return response.data;
    } catch (error) {
        logger.error('Error fetching daily tickets:', error);
        throw error;
    }
};

/**
 * Fetch a single daily ticket by ID
 * @param {number} id - Daily ticket ID
 * @returns {Promise} API response
 */
export const fetchDailyTicketById = async (id) => {
    try {
        const response = await adminApiClient.get(`/daily-ticket-manager/daily-tickets/${id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching daily ticket ${id}:`, error);
        throw error;
    }
};

/**
 * Issue a new daily ticket
 * @param {Object} data - Ticket data (revenue_head_id, category, vehicle_type, amount, etc.)
 * @returns {Promise} API response
 */
export const issueDailyTicket = async (data) => {
    try {
        const response = await adminApiClient.post('/daily-ticket-manager/daily-tickets', data);
        return response.data;
    } catch (error) {
        logger.error('Error issuing daily ticket:', error);
        throw error;
    }
};

/**
 * Bulk issue daily tickets (for market stalls, etc.)
 * @param {Object} data - Bulk ticket data
 * @returns {Promise} API response
 */
export const bulkIssueDailyTickets = async (data) => {
    try {
        const response = await adminApiClient.post('/daily-ticket-manager/daily-tickets/bulk-issue', data);
        return response.data;
    } catch (error) {
        logger.error('Error bulk issuing daily tickets:', error);
        throw error;
    }
};

/**
 * Mark a daily ticket as paid
 * @param {number} id - Ticket ID
 * @param {Object} data - Payment details (payment_reference, amount_paid, etc.)
 * @returns {Promise} API response
 */
export const markTicketAsPaid = async (id, data) => {
    try {
        const response = await adminApiClient.put(`/daily-ticket-manager/daily-tickets/${id}/mark-paid`, data);
        return response.data;
    } catch (error) {
        logger.error(`Error marking ticket ${id} as paid:`, error);
        throw error;
    }
};

/**
 * Update a daily ticket
 * @param {number} id - Ticket ID
 * @param {Object} data - Updated ticket data
 * @returns {Promise} API response
 */
export const updateDailyTicket = async (id, data) => {
    try {
        const response = await adminApiClient.put(`/daily-ticket-manager/daily-tickets/${id}`, data);
        return response.data;
    } catch (error) {
        logger.error(`Error updating ticket ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a daily ticket
 * @param {number} id - Ticket ID
 * @returns {Promise} API response
 */
export const deleteDailyTicket = async (id) => {
    try {
        const response = await adminApiClient.delete(`/daily-ticket-manager/daily-tickets/${id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error deleting ticket ${id}:`, error);
        throw error;
    }
};

/**
 * Get daily summary of tickets
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise} API response
 */
export const getDailySummary = async (date = null) => {
    try {
        const params = date ? { date } : {};
        const response = await adminApiClient.get('/daily-ticket-manager/daily-tickets/summary/daily', { params });
        return response.data;
    } catch (error) {
        logger.error('Error fetching daily summary:', error);
        throw error;
    }
};

/**
 * Get collector's summary
 * @param {number} collectorId - Collector/agent user ID
 * @param {string} startDate - Start date (optional)
 * @param {string} endDate - End date (optional)
 * @returns {Promise} API response
 */
export const getCollectorSummary = async (collectorId, startDate = null, endDate = null) => {
    try {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const response = await adminApiClient.get(`/daily-ticket-manager/daily-tickets/summary/collector/${collectorId}`, { params });
        return response.data;
    } catch (error) {
        logger.error(`Error fetching collector ${collectorId} summary:`, error);
        throw error;
    }
};

// ==================== PENALTY ASSESSMENTS ====================

/**
 * Fetch all penalty assessments with optional filters
 * @param {Object} params - Filter parameters (status, payer_id, outstanding_only, search, etc.)
 * @returns {Promise} API response
 */
export const fetchPenaltyAssessments = async (params = {}) => {
    try {
        const response = await adminApiClient.get('/penalty-manager/penalty-assessments', { params });
        return response.data;
    } catch (error) {
        logger.error('Error fetching penalty assessments:', error);
        throw error;
    }
};

/**
 * Fetch a single penalty assessment by ID
 * @param {number} id - Penalty assessment ID
 * @returns {Promise} API response
 */
export const fetchPenaltyAssessmentById = async (id) => {
    try {
        const response = await adminApiClient.get(`/penalty-manager/penalty-assessments/${id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching penalty assessment ${id}:`, error);
        throw error;
    }
};

/**
 * Assess penalty for an invoice
 * @param {Object} data - Assessment data (invoice_id, penalty_rule_id)
 * @returns {Promise} API response
 */
export const assessPenalty = async (data) => {
    try {
        const response = await adminApiClient.post('/penalty-manager/penalty-assessments/assess', data);
        return response.data;
    } catch (error) {
        logger.error('Error assessing penalty:', error);
        throw error;
    }
};

/**
 * Record payment against a penalty assessment
 * @param {number} id - Penalty assessment ID
 * @param {Object} data - Payment data (amount, payment_reference)
 * @returns {Promise} API response
 */
export const recordPenaltyPayment = async (id, data) => {
    try {
        const response = await adminApiClient.post(`/penalty-manager/penalty-assessments/${id}/record-payment`, data);
        return response.data;
    } catch (error) {
        logger.error(`Error recording payment for penalty ${id}:`, error);
        throw error;
    }
};

/**
 * Waive a penalty assessment
 * @param {number} id - Penalty assessment ID
 * @param {Object} data - Waiver data (reason)
 * @returns {Promise} API response
 */
export const waivePenalty = async (id, data) => {
    try {
        const response = await adminApiClient.post(`/penalty-manager/penalty-assessments/${id}/waive`, data);
        return response.data;
    } catch (error) {
        logger.error(`Error waiving penalty ${id}:`, error);
        throw error;
    }
};

/**
 * Send demand notice for a penalty assessment
 * @param {number} id - Penalty assessment ID
 * @returns {Promise} API response
 */
export const sendDemandNotice = async (id) => {
    try {
        const response = await adminApiClient.post(`/penalty-manager/penalty-assessments/${id}/send-demand-notice`);
        return response.data;
    } catch (error) {
        logger.error(`Error sending demand notice for penalty ${id}:`, error);
        throw error;
    }
};

/**
 * Initiate legal action for a penalty assessment
 * @param {number} id - Penalty assessment ID
 * @param {Object} data - Legal action data (court_reference, notes)
 * @returns {Promise} API response
 */
export const initiateLegalAction = async (id, data) => {
    try {
        const response = await adminApiClient.post(`/penalty-manager/penalty-assessments/${id}/initiate-legal-action`, data);
        return response.data;
    } catch (error) {
        logger.error(`Error initiating legal action for penalty ${id}:`, error);
        throw error;
    }
};

/**
 * Process all overdue invoices and assess penalties
 * @param {Object} data - Processing options (grace_days)
 * @returns {Promise} API response
 */
export const processOverdueInvoices = async (data = {}) => {
    try {
        const response = await adminApiClient.post('/penalty-manager/penalty-assessments/process-overdue', data);
        return response.data;
    } catch (error) {
        logger.error('Error processing overdue invoices:', error);
        throw error;
    }
};

/**
 * Bulk send demand notices
 * @returns {Promise} API response
 */
export const bulkSendDemandNotices = async () => {
    try {
        const response = await adminApiClient.post('/penalty-manager/penalty-assessments/bulk-send-notices');
        return response.data;
    } catch (error) {
        logger.error('Error bulk sending demand notices:', error);
        throw error;
    }
};

/**
 * Get penalty summary statistics
 * @returns {Promise} API response
 */
export const getPenaltySummary = async () => {
    try {
        const response = await adminApiClient.get('/penalty-manager/penalty-assessments/summary/overview');
        return response.data;
    } catch (error) {
        logger.error('Error fetching penalty summary:', error);
        throw error;
    }
};

/**
 * Get assessments requiring legal action
 * @param {number} daysThreshold - Days threshold (default: 30)
 * @returns {Promise} API response
 */
export const getAssessmentsRequiringLegalAction = async (daysThreshold = 30) => {
    try {
        const response = await adminApiClient.get('/penalty-manager/penalty-assessments/legal-action/required', {
            params: { days_threshold: daysThreshold }
        });
        return response.data;
    } catch (error) {
        logger.error('Error fetching assessments requiring legal action:', error);
        throw error;
    }
};

/**
 * Get payer's total penalties
 * @param {number} payerId - Payer ID
 * @param {string} payerType - Payer type (individual/corporate, default: individual)
 * @returns {Promise} API response
 */
export const getPayerPenaltyTotal = async (payerId, payerType = 'individual') => {
    try {
        const response = await adminApiClient.get(`/penalty-manager/penalty-assessments/payer/${payerId}/total`, {
            params: { payer_type: payerType }
        });
        return response.data;
    } catch (error) {
        logger.error(`Error fetching penalty total for payer ${payerId}:`, error);
        throw error;
    }
};

// ==================== TARIFFS (Updated) ====================

/**
 * Fetch all tariffs with optional filters
 * @param {Object} params - Filter parameters (revenue_head_id, category, payment_frequency, active_only, etc.)
 * @returns {Promise} API response
 */
export const fetchTariffs = async (params = {}) => {
    try {
        const response = await adminApiClient.get('/tariff-manager/tariffs', { params });
        return response.data;
    } catch (error) {
        logger.error('Error fetching tariffs:', error);
        throw error;
    }
};

/**
 * Fetch a single tariff by ID
 * @param {number} id - Tariff ID
 * @returns {Promise} API response
 */
export const fetchTariffById = async (id) => {
    try {
        const response = await adminApiClient.get(`/tariff-manager/tariffs/${id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error fetching tariff ${id}:`, error);
        throw error;
    }
};

/**
 * Search tariffs
 * @param {string} searchTerm - Search term
 * @param {Object} params - Pagination params (page, paginator)
 * @returns {Promise} API response
 */
export const searchTariffs = async (searchTerm, params = {}) => {
    try {
        const response = await adminApiClient.get(`/tariff-manager/tariffs/search/${searchTerm}`, { params });
        return response.data;
    } catch (error) {
        logger.error(`Error searching tariffs for "${searchTerm}":`, error);
        throw error;
    }
};

/**
 * Create a new tariff
 * @param {Object} data - Tariff data
 * @returns {Promise} API response
 */
export const createTariff = async (data) => {
    try {
        const response = await adminApiClient.post('/tariff-manager/tariffs', data);
        return response.data;
    } catch (error) {
        logger.error('Error creating tariff:', error);
        throw error;
    }
};

/**
 * Update an existing tariff
 * @param {number} id - Tariff ID
 * @param {Object} data - Updated tariff data
 * @returns {Promise} API response
 */
export const updateTariff = async (id, data) => {
    try {
        const response = await adminApiClient.put(`/tariff-manager/tariffs/${id}`, data);
        return response.data;
    } catch (error) {
        logger.error(`Error updating tariff ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a tariff
 * @param {number} id - Tariff ID
 * @returns {Promise} API response
 */
export const deleteTariff = async (id) => {
    try {
        const response = await adminApiClient.delete(`/tariff-manager/tariffs/${id}`);
        return response.data;
    } catch (error) {
        logger.error(`Error deleting tariff ${id}:`, error);
        throw error;
    }
};

export default {
    // Payment Gateways
    fetchEnabledPaymentMethods,

    // Revenue Heads
    fetchRevenueHeads,
    fetchRevenueHeadById,
    fetchRevenueHeadsBySchedule,
    fetchRevenueCategories,
    fetchDailyPaymentItems,
    createRevenueHead,
    updateRevenueHead,
    deleteRevenueHead,

    // Daily Tickets
    fetchDailyTickets,
    fetchDailyTicketById,
    issueDailyTicket,
    bulkIssueDailyTickets,
    markTicketAsPaid,
    updateDailyTicket,
    deleteDailyTicket,
    getDailySummary,
    getCollectorSummary,

    // Penalty Assessments
    fetchPenaltyAssessments,
    fetchPenaltyAssessmentById,
    assessPenalty,
    recordPenaltyPayment,
    waivePenalty,
    sendDemandNotice,
    initiateLegalAction,
    processOverdueInvoices,
    bulkSendDemandNotices,
    getPenaltySummary,
    getAssessmentsRequiringLegalAction,
    getPayerPenaltyTotal,

    // Tariffs
    fetchTariffs,
    fetchTariffById,
    searchTariffs,
    createTariff,
    updateTariff,
    deleteTariff,
};
