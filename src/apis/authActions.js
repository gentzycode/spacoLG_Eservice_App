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


export const getEnabledPaymentGateways = async ( token, setGateways, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get('paymentgateways/enabled',
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data)
        setGateways(response.data?.data);
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