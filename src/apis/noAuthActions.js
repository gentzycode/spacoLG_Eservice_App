import axios from './baseUrl';

// Common headers for all requests
const defaultHeaders = { 'Accept': 'application/json' };

// Common error handling logic
const handleError = (err, setError) => {
  if (!err?.response) {
    setError('No Response from Server');
  } else {
    console.log(err.response.data);
    setError(err.response.data?.message || err.response.data);
  }
};

// Common async request wrapper
const makeRequest = async (config, setSuccess, setError, setLoading = null, additionalLogic = null) => {
  if (setLoading) setLoading(true);

  try {
    const response = await axios(config);
    console.log(response.data?.data || response.data);
    
    if (additionalLogic) {
      additionalLogic(response);
    } else {
      setSuccess(response.data?.data || response.data);
    }
  } catch (err) {
    if (additionalLogic && err.response?.status === 404) {
      additionalLogic(err.response);
    } else {
      handleError(err, setError);
    }
  }

  if (setLoading) setLoading(false);
};

export const getLGAs = async (setLgas, setError) => {
  makeRequest({
    method: 'get',
    url: 'localgovernments',
    headers: defaultHeaders
  }, setLgas, setError);
};

export const getCities = async (setCities, setError) => {
  makeRequest({
    method: 'get',
    url: 'cities',
    headers: defaultHeaders
  }, setCities, setError);
};

export const getActiveservices = async (lga_id, setActiveservices, setLoading, setNoServicesMessage) => {
  makeRequest({
    method: 'get',
    url: `activeeservices?local_government_id=${lga_id}`,
    headers: defaultHeaders
  }, setActiveservices, setError => setNoServicesMessage('No Services Found for this Local Government Area. Please, select another LGA to proceed.'), setLoading, (response) => {
    if (response.status === 404 || (response.data?.status === 'error' && response.data?.code === 0)) {
      setNoServicesMessage('No Services Found for this Local Government Area. Please, select another LGA to proceed.');
      setActiveservices(null);
    } else {
      setActiveservices(response.data?.data);
      setNoServicesMessage('');
    }
  });
};

export const signUp = async (data, setSuccess, setError, setRegistering) => {
  makeRequest({
    method: 'post',
    url: 'register',
    data,
    headers: defaultHeaders
  }, setSuccess, setError, setRegistering);
};

export const signIn = async (data, setSuccess, setError, setLoggingin) => {
  makeRequest({
    method: 'post',
    url: 'login',
    data,
    headers: defaultHeaders
  }, setSuccess, setError, setLoggingin);
};

export const verifyEmailCode = async (data, setVerified, setError, setVerifying) => {
  makeRequest({
    method: 'post',
    url: 'verify-email-code',
    data,
    headers: defaultHeaders
  }, setVerified, setError, setVerifying);
};

export const forgotPassword = async (data, setSuccess, setError, setSending) => {
  makeRequest({
    method: 'post',
    url: 'forgot-password',
    data,
    headers: defaultHeaders
  }, setSuccess, setError, setSending);
};

export const resetPassword = async (data, setSuccess, setError, setResetting) => {
  makeRequest({
    method: 'post',
    url: 'reset-password',
    data,
    headers: defaultHeaders
  }, setSuccess, setError, setResetting);
};

export const updateProfile = async (token, data, setSuccess, setError, setUpdating) => {
  makeRequest({
    method: 'post',
    url: 'personalinformation',
    data,
    headers: { ...defaultHeaders, 'Authorization': `Bearer ${token}` }
  }, setSuccess, setError, setUpdating);
};

export const getEservices = async (lga_id, setServices, setLoading) => {
  makeRequest({
    method: 'get',
    url: `activeeservices?local_government_id=${lga_id}`,
    headers: defaultHeaders
  }, setServices, setError => setError('No Response from Server'), setLoading);
};

export const getPublicApplicationStatus = async (ref_no, setSuccess, setError, setLoading) => {
  makeRequest({
    method: 'get',
    url: `applicationdata/${ref_no}/public-status`,
    headers: defaultHeaders
  }, setSuccess, setError, setLoading);
};

export const verifyReceipt = async (ref_no, setSuccess, setError, setLoading) => {
  makeRequest({
    method: 'get',
    url: `verify-receipt?ref=${ref_no}`,
    headers: defaultHeaders
  }, setSuccess, setError, setLoading);
};

export const OtpResend = async (data, setSuccess, setError, setResending) => {
  makeRequest({
    method: 'post',
    url: 'resend-otp',
    data,
    headers: defaultHeaders
  }, setSuccess, setError, setResending);
};