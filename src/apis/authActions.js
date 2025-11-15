import axios from './baseUrl';

// Common error messages
const ERROR_MESSAGES = {
    NO_RESPONSE: 'No Response from Server',
    FETCH_ERROR: 'Error fetching data',
};

// Utility to create headers
const createHeaders = (token) => ({
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
});

// Centralized error handling
const handleError = (err, setError) => {
    if (!err?.response) {
        setError?.(ERROR_MESSAGES.NO_RESPONSE);
        return;
    }
    const errorData = err.response.data;
    setError?.(errorData.message || errorData || ERROR_MESSAGES.FETCH_ERROR);
};

// Centralized API request wrapper
export const apiRequest = async ({ method, url, token, data, params, setError, setLoading, setFetching, setSubmitting }) => {
    const setState = setLoading || setFetching || setSubmitting;
    try {
        setState?.(true);
        const response = await axios({
            method,
            url,
            data,
            params,
            headers: createHeaders(token),
        });
        return response.data;
    } catch (err) {
        handleError(err, setError);
        throw err.response ? err.response.data : new Error(ERROR_MESSAGES.NO_RESPONSE);
    } finally {
        setState?.(false);
    }
};

// Existing functions (unchanged)
export const getServiceFormdata = async (token, action_id, setFormdata, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `formmetadata/${action_id}`,
        token,
        setError,
        setLoading,
    });

    const parsedSchema = JSON.parse(data?.data?.json_schema || '{}');
    setFormdata(parsedSchema?.fields || []);
};

export const getInitServiceData = async (token, eservice_id, setInitSteps, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `applicationsteps/${eservice_id}`,
        token,
        setError,
        setLoading,
    });

    setInitSteps(data?.steps || []);
};

export const fetchDropdownOptions = async (api, setOptions, setError) => {
    const endpoint = api.split('/')[2];
    const data = await apiRequest({
        method: 'get',
        url: endpoint,
        setError,
    });

    setOptions(data?.data || []);
};

export const submitApplication = async (token, data, setSuccess, setError, setSubmitting) => {
    if (!data || typeof data !== 'object') {
        setError('Invalid application data');
        return;
    }

    const response = await apiRequest({
        method: 'post',
        url: 'applicationdata',
        token,
        data,
        setError,
        setSubmitting,
    });

    setSuccess(response);
};

export const updateApplication = async (token, appid, data, setResubmitted, setError, setSubmitting) => {
    if (!data || typeof data !== 'object') {
        setError('Invalid application data');
        return;
    }

    const response = await apiRequest({
        method: 'put',
        url: `applicationdata/${appid}`,
        token,
        data,
        setError,
        setSubmitting,
    });

    setResubmitted(response);
};

export const getApplicationByID = async (token, id, setAppdetail, setSteps, setError, setFetching) => {
    const data = await apiRequest({
        method: 'get',
        url: `applicationdata/${id}`,
        token,
        setError,
        setFetching,
    });

    setAppdetail(data);
    setSteps(data?.data?.eservice?.eservices_steps || []);
};

export const userApplications = async (token, setSuccess, setError, setFetching) => {
    const data = await apiRequest({
        method: 'get',
        url: 'applicationdata',
        token,
        setError,
        setFetching,
    });

    setSuccess(data?.data || []);
};

export const getPaymentGatewayByID = async (token, id, setPgateway, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `paymentgateways/${id}`,
        token,
        setError,
        setLoading,
    });

    setPgateway(data?.data || {});
};

export const initiatePayment = async (token, data, setInitpay, setError, setInitializing) => {
    const response = await apiRequest({
        method: 'post',
        url: 'payments/initialize',
        token,
        data,
        setError,
        setSubmitting: setInitializing,
    });

    setInitpay(response);
};

export const paymentConfirm = async (token, id, setConfirm, setError, setLoading) => {
    const response = await apiRequest({
        method: 'post',
        url: `payments/confirm/${id}`,
        token,
        data: {},
        setError,
        setLoading,
    });

    setConfirm(response);
};

export const hasPersonalInfo = async (token, setHasInfo, setError, setChecking) => {
    const data = await apiRequest({
        method: 'get',
        url: 'personal-information-query',
        token,
        setError,
        setLoading: setChecking,
    });

    setHasInfo(data);
};

export const getUserPayments = async (token, setPayments, setError, setFetching) => {
    const data = await apiRequest({
        method: 'get',
        url: 'payments',
        token,
        setError,
        setFetching,
    });

    setPayments(data?.data || []);
};

export const updateEserviceStep = async (token, appID, data, setSuccess, setError, setUpdating) => {
    const response = await apiRequest({
        method: 'put',
        url: `applicationdata/${appID}`,
        token,
        data,
        setError,
        setLoading: setUpdating,
    });

    setSuccess(response?.data || {});
};

export const getLagById = async (token, lga_id, setLga, setLgaLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `localgovernments/${lga_id}`,
        token,
        setLoading: setLgaLoading,
    });

    setLga(data?.data || {});
};

export const deleteApplication = async (token, appid, setSuccess, setError, setDeleting) => {
    const response = await apiRequest({
        method: 'delete',
        url: `applicationdata/${appid}`,
        token,
        setError,
        setLoading: setDeleting,
    });

    setSuccess(response);
};

// Wallet-related functions
export const getWalletHistory = async (token, agentId, setHistory, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/wallet/history`,
        token,
        setError,
        setLoading,
    });

    setHistory(data?.history || []);
};

export const initiateWalletRefill = async (token, agentId, payload) => {
    return await apiRequest({
        method: 'post',
        url: `/agents/${agentId}/wallet/initiate-refill`,
        token,
        data: payload,
    });
};

export const getUserWallet = async (token, userId, setWallet, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${userId}/wallet`,
        token,
        setError,
        setLoading,
    });

    const walletData = {
        ...data?.wallet,
        agent_name: data?.agent_name,
        local_government: data?.local_government,
    };

    setWallet(walletData);
};

// Consolidated getEnabledPaymentGateways
export const getEnabledPaymentGateways = async (token, setGateways, setError, setFetching) => {
    const data = await apiRequest({
        method: 'get',
        url: 'paymentgateway/enabled',
        token,
        setError,
        setFetching,
    });

    setGateways(data?.data || []);
    setError(null);
};

// Token-related functions
export const getUserTokens = async (token, agentId, setTokens, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/tokens`,
        token,
        setError,
        setLoading,
    });

    setTokens(data?.tokens || []);
};

export const getTokenUsageHistory = async (token, agentId, setUsageHistory, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/tokens/usage-history`,
        token,
        setError,
        setLoading,
    });

    setUsageHistory(data?.usage_history || []);
};

export const getUsedTokens = async (token, agentId, setUsedTokens, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/tokens/used`,
        token,
        setError,
        setLoading,
    });

    setUsedTokens(data?.token_usages || []);
};

export const generateToken = async (token, agentId, payload) => {
    return await apiRequest({
        method: 'post',
        url: `/agents/${agentId}/tokens/generate`,
        token,
        data: payload,
    });
};

// Summary functions
export const getTotalTokens = async (token, agentId, setTotalTokens, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/tokens/total`,
        token,
        setError,
        setLoading,
    });

    setTotalTokens(data?.total_tokens || 0);
};

export const getTotalTokenValue = async (token, agentId, setTotalValue, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/tokens/total-value`,
        token,
        setError,
        setLoading,
    });

    setTotalValue(data?.total_value || 0);
};

export const getTotalTokensUsed = async (token, agentId, setUsedTokens, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/tokens/used/total`,
        token,
        setError,
        setLoading,
    });

    setUsedTokens(data?.total_tokens_used || 0);
};

export const getTotalTokenValueUsed = async (token, agentId, setUsedValue, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/tokens/used/total-value`,
        token,
        setError,
        setLoading,
    });

    setUsedValue(data?.total_value_used || 0);
};

// Invoice-related functions
export const getInvoiceStatistics = async (token, agentId, setStatistics, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/invoices/statistics`,
        token,
        setError,
        setLoading,
    });

    setStatistics(data?.statistics || {});
};

export const getUnpaidInvoices = async (token, setUnpaidInvoices, setError, setLoading, page = 1, perPage = 50) => {
    const data = await apiRequest({
        method: 'get',
        url: `/all-unpaid-invoices?page=${page}&per_page=${perPage}`,
        token,
        setError,
        setLoading,
    });

    // Handle paginated response
    const invoices = data?.invoices?.data || data?.invoices || [];
    setUnpaidInvoices(invoices);
    return data?.invoices; // Return full pagination object
};

export const getAgentUnpaidInvoices = async (token, agentId, setUnpaidInvoices, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/invoices/unpaid`,
        token,
        setError,
        setLoading,
    });

    setUnpaidInvoices(data?.invoices || []);
};

export const getPaidInvoicesByAgent = async (token, agentId, setPaidInvoices, setError, setLoading, page = 1, perPage = 50) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/invoices/paid?page=${page}&per_page=${perPage}`,
        token,
        setError,
        setLoading,
    });

    // Handle paginated response
    const invoices = data?.invoices?.data || data?.invoices || [];
    setPaidInvoices(invoices);
    return data?.invoices; // Return full pagination object
};

export const getInvoiceById = async (token, invoiceId) => {
    const data = await apiRequest({
        method: 'get',
        url: `/invoices/${invoiceId}`,
        token,
    });

    return data?.invoice || {};
};

export const fetchEserviceItems = async (token, setEserviceItems, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: '/eservice-items',
        token,
        setError,
        setLoading,
    });

    setEserviceItems(data?.data || []);
};

export const generateInvoice = async (token, payload, setInvoiceData, setError, setLoading) => {
    const response = await apiRequest({
        method: 'post',
        url: '/invoices',
        token,
        data: payload,
        setError,
        setLoading,
    });

    setInvoiceData(response);
};

export const payInvoiceById = async (token, id, payload, onSuccess, onError, setIsLoading) => {
    try {
        const response = await apiRequest({
            method: 'post',
            url: `/invoices/${id}/pay`,
            token,
            data: payload,
            setLoading: setIsLoading,
        });

        onSuccess?.(response);
        return response;
    } catch (err) {
        onError?.(err);
        throw err;
    }
};

export const payInvoiceByReference = async (token, payload) => {
    return await apiRequest({
        method: 'post',
        url: '/invoices/pay',
        token,
        data: payload,
    });
};

export const getPayerInvoices = async (token, referenceNumber, params, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/payers/${referenceNumber}/invoices`,
        token,
        params,
        setError,
        setLoading,
    });

    return data;
};

export const getRecentInvoices = async (token, setRecentInvoices, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: '/invoices/recent',
        token,
        setError,
        setLoading,
    });

    setRecentInvoices(data?.invoices || []);
};

export const verifyReceipt = async (token, referenceNumber, setResult, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: '/verify-receipt',
        token,
        params: { reference_number: referenceNumber },
        setError,
        setLoading,
    });

    setResult(data);
};

export const updateInvoice = async (token, invoiceId, payload, setError, setLoading) => {
    const response = await apiRequest({
        method: 'put',
        url: `/invoices/${invoiceId}`,
        token,
        data: payload,
        setError,
        setLoading,
    });

    return response;
};

export const deleteInvoice = async (token, invoiceId, setError, setLoading) => {
    const response = await apiRequest({
        method: 'delete',
        url: `/invoices/${invoiceId}`,
        token,
        setError,
        setLoading,
    });

    return response;
};

export const getAgentPaymentHistory = async (token, agentId, params, setPayments, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: `/agents/${agentId}/invoices/paid`,
        token,
        params,
        setError,
        setLoading,
    });

    setPayments(data?.invoices || []);
};

// Individual and Corporate Management
export const getIndividuals = async (token, setIndividuals, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: '/individuals',
        token,
        setError,
        setLoading,
    });

    setIndividuals(data?.data || []);
};

export const createIndividual = async (token, payload) => {
    return await apiRequest({
        method: 'post',
        url: '/individuals',
        token,
        data: payload,
    });
};

export const updateIndividual = async (token, id, payload) => {
    return await apiRequest({
        method: 'put',
        url: `/individuals/${id}`,
        token,
        data: payload,
    });
};

export const getCorporates = async (token, setCorporates, setError, setLoading) => {
    const data = await apiRequest({
        method: 'get',
        url: '/corporates',
        token,
        setError,
        setLoading,
    });

    setCorporates(data?.data || []);
};

export const createCorporate = async (token, payload) => {
    return await apiRequest({
        method: 'post',
        url: '/corporates',
        token,
        data: payload,
    });
};

export const updateCorporate = async (token, id, payload) => {
    return await apiRequest({
        method: 'put',
        url: `/corporates/${id}`,
        token,
        data: payload,
    });
};

export const generateBulkTokens = async (token, agentId, payload) => {
    return await apiRequest({
        method: 'post',
        url: `/agents/${agentId}/tokens/generate-bulk`,
        token,
        data: payload,
    });
};

export const quickUseToken = async (token, agentId, payload) => {
    return await apiRequest({
        method: 'post',
        url: `/agents/${agentId}/tokens/quick-use`,
        token,
        data: payload,
    });
};

export const getEserviceItems = async (token) => {
    const data = await apiRequest({
        method: 'get',
        url: '/eservice-items',
        token,
    });

    return data?.data || [];
};

export const getIdentifiers = async (token) => {
    const data = await apiRequest({
        method: 'get',
        url: '/identifiers',
        token,
    });

    return data?.data || [];
};

export const checkEmailExists = async (email) => {
    const data = await apiRequest({
        method: 'get',
        url: '/check-email',
        params: { email },
    });

    return data?.exists || false;
};

export const checkMobileExists = async (mobile_number) => {
    const data = await apiRequest({
        method: 'get',
        url: '/check-mobile',
        params: { mobile_number },
    });

    return data?.exists || false;
};

export const checkRegistrationNumberExists = async (registration_number) => {
    const data = await apiRequest({
        method: 'get',
        url: '/check-registration-number',
        params: { registration_number },
    });

    return data?.exists || false;
};

// ===================================================================
// MONNIFY PAYMENT GATEWAY FUNCTIONS
// ===================================================================

/**
 * Initialize Monnify online payment (Card/Bank Transfer)
 */
export const initializeMonnifyPayment = async (token, payload) => {
    return await apiRequest({
        method: 'post',
        url: '/monnify/initialize',
        token,
        data: payload,
    });
};

/**
 * Initialize Monnify offline payment (Bank Transfer/USSD)
 */
export const initializeMonnifyOfflinePayment = async (token, payload) => {
    return await apiRequest({
        method: 'post',
        url: '/monnify/initialize-offline',
        token,
        data: payload,
    });
};

/**
 * Verify Monnify transaction
 */
export const verifyMonnifyTransaction = async (token, transactionReference) => {
    return await apiRequest({
        method: 'get',
        url: `/monnify/verify/${transactionReference}`,
        token,
    });
};

/**
 * Generate USSD code for payment
 */
export const generateMonnifyUSSD = async (token, payload) => {
    return await apiRequest({
        method: 'post',
        url: '/monnify/ussd/generate',
        token,
        data: payload,
    });
};

/**
 * Get USSD supported banks
 */
export const getMonnifyUSSDBanks = async (token) => {
    return await apiRequest({
        method: 'get',
        url: '/monnify/ussd/banks',
        token,
    });
};

/**
 * Get offline payment details
 */
export const getMonnifyOfflinePaymentDetails = async (token, paymentReference) => {
    return await apiRequest({
        method: 'get',
        url: `/monnify/offline/${paymentReference}`,
        token,
    });
};

/**
 * Cancel offline payment
 */
export const cancelMonnifyOfflinePayment = async (token, paymentReference) => {
    return await apiRequest({
        method: 'delete',
        url: `/monnify/offline/${paymentReference}/cancel`,
        token,
    });
};

/**
 * Get Monnify payment statistics
 */
export const getMonnifyStatistics = async (token) => {
    return await apiRequest({
        method: 'get',
        url: '/monnify/statistics',
        token,
    });
};

/**
 * Get Monnify transactions with filters
 */
export const getMonnifyTransactions = async (token, params = {}) => {
    return await apiRequest({
        method: 'get',
        url: '/monnify/transactions',
        token,
        params,
    });
};

/**
 * Initiate refund (Super Admin only)
 */
export const initiateMonnifyRefund = async (token, payload) => {
    return await apiRequest({
        method: 'post',
        url: '/monnify/refund',
        token,
        data: payload,
    });
};

/**
 * Get Monnify wallet balance (Super Admin only)
 */
export const getMonnifyWalletBalance = async (token) => {
    return await apiRequest({
        method: 'get',
        url: '/monnify/wallet/balance',
        token,
    });
};

/**
 * Get Monnify dashboard (Super Admin only)
 */
export const getMonnifyDashboard = async (token) => {
    return await apiRequest({
        method: 'get',
        url: '/auth/super-admin/monnify/dashboard',
        token,
    });
};

/**
 * Toggle Monnify mode (Super Admin only)
 */
export const toggleMonnifyMode = async (token, mode) => {
    return await apiRequest({
        method: 'put',
        url: '/auth/super-admin/monnify/mode',
        token,
        data: { mode },
    });
};