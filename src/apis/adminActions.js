import axios from './adminBaseUrl'

export const lgaApplications = async ( token, setSuccess, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get('application-manager/applicationdata',
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
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


export const getStaffByLga = async ( token, lga_id, setLgaStaff, setError, setLoading ) => {

    setLoading(true);

    try{
        const response  = await axios.get(`user-manager/users/lg/${lga_id}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data?.data)
        setLgaStaff(response.data?.data);
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


export const getAdminApplicationByID = async ( token, id, setAppdetail, setSteps, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get(`application-manager/applicationdata/${id}`,
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


export const updateApproval = async ( token, id, data, setSuccess, setError, setApproving, setDisapproving ) => {

    data?.action === 'Approved' ? setApproving(true) : setDisapproving(true);

    try{
        const response  = await axios.put(`application-manager/applicationdata/${id}`,
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
            console.log(err.response.data?.message);
            setError(err.response.data?.message);
        }
    }

    data?.action === 'Approved' ? setApproving(false) : setDisapproving(false);
}


export const getAllUsers = async ( token, setUsers, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get(`user-manager/users`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
        setUsers(response.data?.data);
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


export const getUserById = async ( token, id, setUserinfo, setError, setFetching ) => {

    setFetching(true);

    try{
        const response  = await axios.get(`user-manager/users/${id}`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
        setUserinfo(response.data?.data);
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


export const getAllRoles = async ( token, setRoles, setError ) => {

    try{
        const response  = await axios.get(`role-manager/roles`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
        setRoles(response.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }
}


export const createUser = async ( token, data, setSuccess, setError, setCreating ) => {
    setCreating(true);

    try{
        const response  = await axios.post(`user-manager/users`,
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
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
    setCreating(false);
}


export const updateUser = async ( token, id, data, setSuccess, setError, setCreating ) => {
    setCreating(true);

    try{
        const response  = await axios.put(`user-manager/users/${id}`,
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
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
    setCreating(false);
}


export const getLGAsStaff = async ( token, setLgasstaff, setError, setFetching ) => {
    setFetching(true);

    try{
        const response  = await axios.get(`lg-manager/localgovernmentstaff`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data?.data)
        setLgasstaff(response.data?.data?.data);
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


export const createLgaStaff = async ( token, data, setSuccess, setError, setCreating ) => {
    setCreating(true);

    try{
        const response  = await axios.post(`lg-manager/localgovernmentstaff`,
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
        setSuccess(response?.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }
    setCreating(false);
}


export const updateLgaStaff = async ( token, id, data, setSuccess, setError, setCreating ) => {
    setCreating(true);

    try{
        const response  = await axios.put(`lg-manager/localgovernmentstaff/${id}`,
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
        setSuccess(response?.data?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }
    setCreating(false);
}


export const getAllAuthorizers = async ( token, setAuthorizers, setError, setFetching ) => {
    setFetching(true);

    try{
        const response  = await axios.get(`authorizer-manager/app-authorizers`,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response.data?.data)
        setAuthorizers(response.data?.data);
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


export const createAuthorizer = async ( token, data, setSuccess, setError, setCreating ) => {
    setCreating(true);

    try{
        const response  = await axios.post(`authorizer-manager/app-authorizers`,
            data,
            {
                headers: { 'Accept' : 'application/json', 'Authorization' : `Bearer ${token}` }
            }
        );    

        console.log(response?.data)
        setSuccess(response?.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data?.message);
            setError(err.response.data);
        }
    }
    setCreating(false);
}


export const updateAuthorization = async ( token, id, data, setSuccess, setError, setApproving, setDisapproving ) => {

    data?.action === 'Authorized' ? setApproving(true) : setDisapproving(true);

    try{
        const response  = await axios.post(`authorizer-manager/app-authorizers/${id}/authorize`,
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
            console.log(err.response.data?.message);
            setError(err.response.data?.message);
        }
    }

    data?.action === 'Authorized' ? setApproving(false) : setDisapproving(false);
}
