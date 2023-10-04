import axios from './baseUrl'

export const getServiceFormdata = async ( token, eservice, setFormdata , setError, setLoading) => {
    
    setLoading(true);

    try{
        const response  = await axios.get(`formmetadata/by-name/${eservice}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(JSON.parse(response.data?.data?.metadata).fields)
        setFormdata(response.data?.data);
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

        console.log(response.data?.data?.data)
        setOptions(response.data?.data?.data);
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