import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    const userData = JSON.parse(localStorage.getItem('isLoggedIn'));
    
    const [token, setToken] = useState(userData ? userData?.access_token : '');
    const [user, setUser] = useState(userData ? userData?.user : null);

    const [shownav, setShownav] = useState(false);
    const [authObject, setAuthObject] = useState(null);
    const [userid, setUserid] = useState();

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        window.location.reload();
    }

    /**const updateActivenav = (val) => {
        setActivenav(val);
    }*/

    useEffect(() => {
        
        if(localStorage.getItem('isLoggedIn')){
            
            setToken(userData?.access_tokentoken);
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

    /**const changeTheme = () => {
        setDark(!dark);
    }*/


    return(
        <AuthContext.Provider value={{ token, user, shownav,  updateShownav, authObject, storeAuthObject, userid, tempUserid, logout }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider