import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    const userData = JSON.parse(localStorage.getItem('isLoggedIn'));
    const serviceData = JSON.parse(localStorage.getItem('selectedService'));
    
    const [token, setToken] = useState(userData ? userData?.access_token : '');
    const [user, setUser] = useState(userData ? userData?.user : null);
    const [serviceObject, setServiceObject] = useState(serviceData ? serviceData : null);

    const [shownav, setShownav] = useState(false);
    const [authObject, setAuthObject] = useState(null);
    const [userid, setUserid] = useState();

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('selectedService');
        window.location.reload();
    }

    /**const updateActivenav = (val) => {
        setActivenav(val);
    }*/

    useEffect(() => {
        
        if(localStorage.getItem('isLoggedIn')){
            
            setToken(userData?.access_token);
            setUser(userData?.user);
        }
    }, [])

    const updateShownav = () => {
        setShownav(!shownav);
    }

    const storeAuthObject = (obj) => {
        setAuthObject(obj)
    }

    const tempUserid = (id) => {
        setUserid(id);
    }

    const updateServiceObject = (obj) => {
        setServiceObject(obj);
    }

    const updateUser = (obj) => {
        setUser(obj);
    }

    /**const changeTheme = () => {
        setDark(!dark);
    }*/


    return(
        <AuthContext.Provider value={{ token, user, shownav,  updateShownav, authObject, storeAuthObject, userid, tempUserid, serviceObject, updateServiceObject, logout, updateUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider