import axios from './baseUrl'

export const getServiceFormdata = async ( token, action_id, setFormdata , setError, setLoading) => {
    
    setLoading(true);

    try{
        const response  = await axios.get(`formmetadata/${action_id}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(JSON.parse(JSON.parse(response.data?.data?.json_schema))?.fields);
        setFormdata(JSON.parse(JSON.parse(response.data?.data?.json_schema))?.fields);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        } 
    }
    setLoading(false);
}



export const getInitServiceData = async ( token, eservice_id, setInitSteps , setError, setLoading) => {
    
    setLoading(true);

    try{
        const response  = await axios.get(`applicationsteps/${eservice_id}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.steps)
        setInitSteps(response.data?.steps);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }
    setLoading(false);
}


export const fetchDropdownOptions = async ( api, setOptions ) => {

    const endpoint = api.split('/')[2];

    try{
        const response  = await axios.get(endpoint,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        console.log(response.data?.data)
        setOptions(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            console.log('No Response from Server');
        } else {
            console.log(err.response.data);
            //setError(err.response.data);
        }
    }
}


export const submitApplication = async ( token, data, setSuccess, setError, setSubmitting ) => {

    setSubmitting(true);

    try{
        const response  = await axios.post('applicationdata',
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setSubmitting(false);
}


export const updateApplication = async ( token, appid, data, setResubmitted, setError, setSubmitting ) => {

    setSubmitting(true);

    try{
        const response  = await axios.put(`applicationdata/${appid}`,
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setResubmitted(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setSubmitting(false);
}


export const getApplicationByID = async ( token, id, setAppdetail, setSteps, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get(`applicationdata/${id}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setAppdetail(response.data);
        setSteps(response.data?.data?.eservice?.eservices_steps);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }

    setFetching(false);
}


export const userApplications = async ( token, setSuccess, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get('applicationdata',
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setSuccess(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }

    setFetching(false);
}

export const getPaymentGatewayByID = async ( token, id, setPgateway, setError, setLoading ) => {

    setLoading(true);

    try{
        const response  = await axios.get(`paymentgateways/${id}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setPgateway(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }

    setLoading(false);
}


export const initiatePayment = async ( token, data, setInitpay, setError, setInitializing ) => {

    setInitializing(true);

    try{
        const response  = await axios.post('payments/initialize',
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setInitpay(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setInitializing(false);
}


export const paymentConfirm = async ( token, id, setConfirm, setError ) => {


    try{
        const response  = await axios.post(`payments/confirm/${id}`,
            {},
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data);
        setConfirm(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }
}


export const hasPersonalInfo = async (token, setHasInfo, setError, setChecking) => {

    setChecking(true);

    try{
        const response  = await axios.get('personal-information-query',
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setHasInfo(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }

    setChecking(false);
}


export const getUserPayments = async ( token, setPayments, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get('payments',
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setPayments(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }

    setFetching(false);
}


export const updateEserviceStep = async ( token, appID, data, setSuccess, setError, setUpdating ) => {

    setUpdating(true);

    try{
        const response  = await axios.put(`applicationdata/${appID}`,
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setSuccess(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }

    setUpdating(false);
}


export const getLagById = async (token, lga_id, setLga) => {
    try{
        const response  = await axios.get(`localgovernments/${lga_id}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setLga(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            //setError(err.response.data);
        }
    }
}


export const deleteApplication = async (token, appid, setSuccess, setError, setDeleting) => {

    setDeleting(true);
    try{
        const response  = await axios.delete(`applicationdata/${appid}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }
    setDeleting(false);
}

// new ones startb here

export const getWalletHistory = async (token, agentId, setHistory, setError, setLoading) => {
    setLoading(true);

    try {
        const response = await axios.get(`/agents/${agentId}/wallet/history`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setHistory(response.data.history);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
};

export const initiateWalletRefill = async (token, agentId, payload) => {
    try {
        const response = await axios.post(`/agents/${agentId}/wallet/initiate-refill`, payload, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        if (!err?.response) {
            throw new Error('No Response from Server');
        } else {
            console.log(err.response.data);
            throw new Error(err.response.data);
        }
    }
};

export const getUserWallet = async (token, userId, setWallet, setError, setLoading) => {
    setLoading(true);

    try {
        const response = await axios.get(`/agents/${userId}/wallet`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setWallet(response.data.wallet);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
};

export const getEnabledPaymentGateways = async (token, setGateways, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get('/paymentgateway/enabled', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log("Payment gateways response:", response.data);
        setGateways(response.data.data);
        setLoading(false);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data.message);
        }
        setLoading(false);
    }
};


// tokens start here
export const getUserTokens = async (token, agentId, setTokens, setError, setLoading) => {
    setLoading(true);

    try {
        const response = await axios.get(`/agents/${agentId}/tokens`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setTokens(response.data.tokens);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
};

// src/apis/authActions.js
export const getTokenUsageHistory = async (token, agentId, setUsageHistory, setError, setLoading) => {
    setLoading(true);

    try {
        const response = await axios.get(`/agents/${agentId}/tokens/usage-history`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setUsageHistory(response.data.usage_history);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data.message);
        }
    }

    setLoading(false);
};


export const generateToken = async (token, agentId, payload) => {
    try {
        const response = await axios.post(`/agents/${agentId}/tokens/generate`, payload, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        if (!err?.response) {
            throw new Error('No Response from Server');
        } else {
            console.log(err.response.data);
            throw new Error(err.response.data);
        }
    }
};

// summaries

export const getTotalTokens = async (token, agentId, setTotalTokens, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get(`/agents/${agentId}/tokens/total`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        setTotalTokens(response.data.total_tokens);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            setError(err.response.data.message || 'Failed to fetch total tokens');
        }
    } finally {
        setLoading(false);
    }
};

export const getTotalTokenValue = async (token, agentId, setTotalValue, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get(`/agents/${agentId}/tokens/total-value`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        setTotalValue(response.data.total_value);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            setError(err.response.data.message || 'Failed to fetch total token value');
        }
    } finally {
        setLoading(false);
    }
};

export const getTotalTokensUsed = async (token, agentId, setUsedTokens, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get(`/agents/${agentId}/tokens/used/total`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        setUsedTokens(response.data.total_tokens_used);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            setError(err.response.data.message || 'Failed to fetch used tokens');
        }
    } finally {
        setLoading(false);
    }
};

export const getTotalTokenValueUsed = async (token, agentId, setUsedValue, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get(`/agents/${agentId}/tokens/used/total-value`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        setUsedValue(response.data.total_value_used);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            setError(err.response.data.message || 'Failed to fetch used token value');
        }
    } finally {
        setLoading(false);
    }
};


// invoices

export const getInvoiceStatistics = async (token, agentId, setStatistics, setError, setLoading) => {
    setLoading(true);
    setError(null);

    try {
        const response = await axios.get(`/agents/${agentId}/invoices/statistics`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setStatistics(response.data.statistics); // Ensure the correct key is used
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            setError(err.response.data.message || 'Error fetching statistics');
        }
    }

    setLoading(false);
};

export const getUnpaidInvoices = async (token, setUnpaidInvoices, setError, setLoading) => {
    setLoading(true);
    setError(null);

    try {
        const response = await axios.get('/all-unpaid-invoices', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setUnpaidInvoices(response.data.invoices); // Ensure the correct key is used
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            setError(err.response.data.message || 'Error fetching unpaid invoices');
        }
    }

    setLoading(false);
};

export const getPaidInvoicesByAgent = async (token, agentId, setPaidInvoices, setError, setLoading) => {
    setLoading(true);
    setError(null);

    try {
        const response = await axios.get(`/agents/${agentId}/invoices/paid`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setPaidInvoices(response.data.invoices); // Ensure the correct key is used
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            setError(err.response.data.message || 'Error fetching paid invoices');
        }
    }

    setLoading(false);
};

// Get Invoice by ID
export const getInvoiceById = async (token, invoiceId) => {
    try {
        const response = await axios.get(`/invoices/${invoiceId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data.invoice;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export const generateInvoice = async (token, payload, setInvoiceData, setError, setLoading) => {
    setLoading(true);

    try {
        const response = await axios.post('/invoices', payload, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        setInvoiceData(response.data);
    } catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
};

// Pay Invoice by ID
export const payInvoiceById = async (token, id, payload) => {
    try {
        const response = await axios.post(`/invoices/${id}/pay`, payload, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        console.error('Error paying invoice by ID:', err);
        throw err.response ? err.response.data : new Error('No response from server');
    }
};

// Pay Invoice by Reference Number
export const payInvoiceByReference = async (token, payload) => {
    try {
        const response = await axios.post('/invoices/pay', payload, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err) {
        console.error('Error paying invoice by reference:', err);
        throw err.response ? err.response.data : new Error('No response from server');
    }
};


export const getEnabledPaymentGateways2 = async (token, setGateways, setError, setFetching) => {
    setFetching(true);

    try {
        const response = await axios.get('paymentgateway/enabled', {
            headers: { 
                'Accept': 'application/json', 
                'Authorization': `Bearer ${token}` 
            }
        });

        console.log(response.data);
        setGateways(response.data?.data);
        setError(null);  // Clear any previous errors
    } catch (err) {
        if (!err.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data?.message || 'Error fetching payment gateways');
        }
    } finally {
        setFetching(false);
    }
};

export const getUserWallets = async (token, agentId, setWallet, setError, setLoading) => {
    setLoading(true);

    try {
        const response = await axios.get(`agents/${agentId}/wallet`, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        setWallet(response.data.wallet);
    } catch (err) {
        if (!err.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoading(false);
};

// INDIVIDUAL AND CORPORATE MANAGEMENT

export const getIndividuals = async (token, setIndividuals, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get('/individuals', {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        setIndividuals(response.data.data);
    } catch (err) {
        setError(err.response ? err.response.data.message : 'No Response from Server');
    }
    setLoading(false);
};

export const createIndividual = async (token, payload) => {
    try {
        const response = await axios.post('/individuals', payload, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        return response.data.data;
    } catch (err) {
        throw err.response ? err.response.data : new Error('No response from server');
    }
};

export const updateIndividual = async (token, id, payload) => {
    try {
        const response = await axios.put(`/individuals/${id}`, payload, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        return response.data.data;
    } catch (err) {
        throw err.response ? err.response.data : new Error('No response from server');
    }
};

export const getCorporates = async (token, setCorporates, setError, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get('/corporates', {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        setCorporates(response.data.data);
    } catch (err) {
        setError(err.response ? err.response.data.message : 'No Response from Server');
    }
    setLoading(false);
};

export const createCorporate = async (token, payload) => {
    try {
        const response = await axios.post('/corporates', payload, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        return response.data.data;
    } catch (err) {
        throw err.response ? err.response.data : new Error('No response from server');
    }
};

export const updateCorporate = async (token, id, payload) => {
    try {
        const response = await axios.put(`/corporates/${id}`, payload, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        return response.data.data;
    } catch (err) {
        throw err.response ? err.response.data : new Error('No response from server');
    }
};