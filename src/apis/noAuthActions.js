import axios from './baseUrl'



export const getLGAs = async ( setLgas , setError) => {

    try{
        const response  = await axios.get(`localgovernments`,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        console.log(response.data?.data)
        setLgas(response.data?.data);
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


export const getCities = async ( setCities , setError) => {

    try{
        const response  = await axios.get(`cities`,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        console.log(response.data?.data)
        setCities(response.data?.data);
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

export const getActiveservices = async (lga_id, setActiveservices, setLoading, setNoServicesMessage) => {
    setLoading(true);

    try {
        const response = await axios.get(`activeeservices?local_government_id=${lga_id}`, {
            headers: { 'Accept': 'application/json' }
        });

        console.log(response.data?.data);

        if (response.status === 404 || (response.data?.status === 'error' && response.data?.code === 0)) {
            setNoServicesMessage('No Services Found for this Local Government Area. Please, select another LGA to proceed.');
            setActiveservices(null);
        } else {
            setActiveservices(response.data?.data);
            setNoServicesMessage('');
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            setNoServicesMessage('No Services Found for this Local Government Area. Please, select another LGA to proceed.');
            setActiveservices(null);
        } else if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            // setError(err.response.data);
        }
    }

    setLoading(false);
}


export const signUp = async ( data, setSuccess, setError, setRegistering ) => {

    setRegistering(true);

    try{
        const response  = await axios.post('register',
            data,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        console.log(response.data)
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data.message);
            setError(err.response.data.message);
        }
    }

    setRegistering(false);
}



export const signIn = async ( data, setSuccess, setError, setLoggingin ) => {

    setLoggingin(true);

    try{
        const response  = await axios.post('login',
            data,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        //console.log(response.data?.data)
        setSuccess(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setLoggingin(false);
}


export const verifyEmailCode = async ( data, setVerified, setError, setVerifying ) => {

    setVerifying(true);

    try{
        const response  = await axios.post('verify-email-code',
            data,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        console.log(response.data?.message)
        setVerified(response.data?.message);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data.message);
            setError(err.response.data.message);
        }
    }

    setVerifying(false);
}


export const forgotPassword = async ( data, setSuccess, setError, setSending ) => {

    setSending(true);

    try{
        const response  = await axios.post('forgot-password',
            data,
            {
                headers: { 'Accept' : 'application/json' }
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

    setSending(false);
}


export const resetPassword = async ( data, setSuccess, setError, setResetting ) => {

    setResetting(true);

    try{
        const response  = await axios.post('reset-password',
            data,
            {
                headers: { 'Accept' : 'application/json' }
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

    setResetting(false);
}


export const updateProfile = async ( token, data, setSuccess, setError, setUpdating ) => {

    setUpdating(true);

    try{
        const response  = await axios.post('personalinformation',
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
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setUpdating(false);
}


export const getEservices = async ( lga_id, setServices, setLoading ) => {

    setLoading(true);

    try{
        const response  = await axios.get(`activeeservices?local_government_id=${lga_id}`,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        console.log(response.data?.data)
        setServices(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            //setError(err.response.data);
        }
    }

    setLoading(false);
}


export const getPublicApplicationStatus = async ( ref_no, setSuccess, setError, setLoading ) => {

    setLoading(true);

    try{
        const response  = await axios.get(`applicationdata/${ref_no}/public-status`,
            {
                headers: { 'Accept' : 'application/json' }
            }
        );    

        console.log(response.data?.data)
        setSuccess(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data?.message);
        }
    }

    setLoading(false);
}


export const OtpResend = async ( data, setSuccess, setError, setResending ) => {

    setResending(true);

    try{
        const response  = await axios.post(`resend-otp`,
            data,
            {
                headers: { 'Accept' : 'application/json' }
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
            setError(err.response.data?.message);
        }
    }

    setResending(false);
}