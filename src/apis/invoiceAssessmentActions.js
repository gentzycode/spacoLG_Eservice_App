import axios from './adminBaseUrl';

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

// ============================================
// INVOICE V2 API ACTIONS
// ============================================

/**
 * Fetch invoices with filters
 */
export const fetchInvoicesV2 = async (token, filters = {}, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: 'invoice-manager/invoices',
        token,
        params: filters,
        setError,
        setLoading,
    });
};

/**
 * Get invoice statistics
 */
export const getInvoiceV2Statistics = async (token, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: 'invoice-manager/invoices/statistics',
        token,
        setError,
        setLoading,
    });
};

/**
 * Get single invoice by ID
 */
export const getInvoiceV2ById = async (token, invoiceId, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: `invoice-manager/invoices/${invoiceId}`,
        token,
        setError,
        setLoading,
    });
};

/**
 * Create new invoice
 */
export const createInvoiceV2 = async (token, invoiceData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: 'invoice-manager/invoices',
        token,
        data: invoiceData,
        setError,
        setSubmitting,
    });
};

/**
 * Update invoice
 */
export const updateInvoiceV2 = async (token, invoiceId, invoiceData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'put',
        url: `invoice-manager/invoices/${invoiceId}`,
        token,
        data: invoiceData,
        setError,
        setSubmitting,
    });
};

/**
 * Approve invoice
 */
export const approveInvoiceV2 = async (token, invoiceId, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `invoice-manager/invoices/${invoiceId}/approve`,
        token,
        setError,
        setSubmitting,
    });
};

/**
 * Record payment on invoice
 */
export const recordInvoiceV2Payment = async (token, invoiceId, paymentData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `invoice-manager/invoices/${invoiceId}/record-payment`,
        token,
        data: paymentData,
        setError,
        setSubmitting,
    });
};

/**
 * Cancel invoice
 */
export const cancelInvoiceV2 = async (token, invoiceId, reason, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `invoice-manager/invoices/${invoiceId}/cancel`,
        token,
        data: { reason },
        setError,
        setSubmitting,
    });
};

/**
 * Delete invoice
 */
export const deleteInvoiceV2 = async (token, invoiceId, setError, setSubmitting) => {
    return await apiRequest({
        method: 'delete',
        url: `invoice-manager/invoices/${invoiceId}`,
        token,
        setError,
        setSubmitting,
    });
};

// ============================================
// ASSESSMENT API ACTIONS
// ============================================

/**
 * Fetch assessments with filters
 */
export const fetchAssessments = async (token, filters = {}, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: 'assessment-manager/assessments',
        token,
        params: filters,
        setError,
        setLoading,
    });
};

/**
 * Get assessment statistics
 */
export const getAssessmentStatistics = async (token, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: 'assessment-manager/assessments/statistics',
        token,
        setError,
        setLoading,
    });
};

/**
 * Get single assessment by ID
 */
export const getAssessmentById = async (token, assessmentId, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: `assessment-manager/assessments/${assessmentId}`,
        token,
        setError,
        setLoading,
    });
};

/**
 * Create new assessment
 */
export const createAssessment = async (token, assessmentData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: 'assessment-manager/assessments',
        token,
        data: assessmentData,
        setError,
        setSubmitting,
    });
};

/**
 * Update assessment
 */
export const updateAssessment = async (token, assessmentId, assessmentData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'put',
        url: `assessment-manager/assessments/${assessmentId}`,
        token,
        data: assessmentData,
        setError,
        setSubmitting,
    });
};

/**
 * Mark assessment as under review
 */
export const reviewAssessment = async (token, assessmentId, notes, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-manager/assessments/${assessmentId}/review`,
        token,
        data: { review_notes: notes },
        setError,
        setSubmitting,
    });
};

/**
 * Approve assessment
 */
export const approveAssessment = async (token, assessmentId, approvalData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-manager/assessments/${assessmentId}/approve`,
        token,
        data: approvalData,
        setError,
        setSubmitting,
    });
};

/**
 * Reject assessment
 */
export const rejectAssessment = async (token, assessmentId, reason, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-manager/assessments/${assessmentId}/reject`,
        token,
        data: { rejection_reason: reason },
        setError,
        setSubmitting,
    });
};

/**
 * Generate invoice from assessment
 */
export const generateInvoiceFromAssessment = async (token, assessmentId, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-manager/assessments/${assessmentId}/generate-invoice`,
        token,
        setError,
        setSubmitting,
    });
};

/**
 * Delete assessment
 */
export const deleteAssessment = async (token, assessmentId, setError, setSubmitting) => {
    return await apiRequest({
        method: 'delete',
        url: `assessment-manager/assessments/${assessmentId}`,
        token,
        setError,
        setSubmitting,
    });
};

// ============================================
// ASSESSMENT TEMPLATE API ACTIONS
// ============================================

/**
 * Fetch assessment templates with filters
 */
export const fetchAssessmentTemplates = async (token, filters = {}, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: 'assessment-template-manager/templates',
        token,
        params: filters,
        setError,
        setLoading,
    });
};

/**
 * Get template statistics
 */
export const getTemplateStatistics = async (token, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: 'assessment-template-manager/templates/statistics',
        token,
        setError,
        setLoading,
    });
};

/**
 * Get single template by ID
 */
export const getTemplateById = async (token, templateId, setError, setLoading) => {
    return await apiRequest({
        method: 'get',
        url: `assessment-template-manager/templates/${templateId}`,
        token,
        setError,
        setLoading,
    });
};

/**
 * Create new template
 */
export const createAssessmentTemplate = async (token, templateData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: 'assessment-template-manager/templates',
        token,
        data: templateData,
        setError,
        setSubmitting,
    });
};

/**
 * Update template
 */
export const updateAssessmentTemplate = async (token, templateId, templateData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'put',
        url: `assessment-template-manager/templates/${templateId}`,
        token,
        data: templateData,
        setError,
        setSubmitting,
    });
};

/**
 * Activate template
 */
export const activateTemplate = async (token, templateId, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-template-manager/templates/${templateId}/activate`,
        token,
        setError,
        setSubmitting,
    });
};

/**
 * Deactivate template
 */
export const deactivateTemplate = async (token, templateId, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-template-manager/templates/${templateId}/deactivate`,
        token,
        setError,
        setSubmitting,
    });
};

/**
 * Clone template
 */
export const cloneTemplate = async (token, templateId, newCode, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-template-manager/templates/${templateId}/clone`,
        token,
        data: { new_code: newCode },
        setError,
        setSubmitting,
    });
};

/**
 * Preview template calculation
 */
export const previewTemplateCalculation = async (token, templateId, applicationData, setError, setSubmitting) => {
    return await apiRequest({
        method: 'post',
        url: `assessment-template-manager/templates/${templateId}/preview-calculation`,
        token,
        data: { application_data: applicationData },
        setError,
        setSubmitting,
    });
};

/**
 * Delete template
 */
export const deleteAssessmentTemplate = async (token, templateId, setError, setSubmitting) => {
    return await apiRequest({
        method: 'delete',
        url: `assessment-template-manager/templates/${templateId}`,
        token,
        setError,
        setSubmitting,
    });
};
