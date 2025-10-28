import { createContext, useEffect, useState, useMemo, useCallback } from "react";

export const AuthContext = createContext();

// Helper function to safely parse localStorage
const getStoredData = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        return null;
    }
};

const AuthContextProvider = (props) => {
    // Initialize state with memoized localStorage data (only once)
    const [token, setToken] = useState(() => {
        const userData = getStoredData('isLoggedIn');
        return userData?.access_token || '';
    });

    const [user, setUser] = useState(() => {
        const userData = getStoredData('isLoggedIn');
        return userData?.user || null;
    });

    const [serviceObject, setServiceObject] = useState(() => {
        return getStoredData('selectedService');
    });

    const [shownav, setShownav] = useState(false);
    const [authObject, setAuthObject] = useState(null);
    const [userid, setUserid] = useState();
    const [record, setRecord] = useState(null);

    // Memoized logout function
    const logout = useCallback(() => {
        setToken('');
        setUser(null);
        setServiceObject(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('selectedService');
        window.location.href = '/auth'; // Use href instead of reload for better control
    }, []);

    // Sync with localStorage changes (from other tabs)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'isLoggedIn') {
                const userData = getStoredData('isLoggedIn');
                if (userData) {
                    setToken(userData.access_token || '');
                    setUser(userData.user || null);
                } else {
                    logout();
                }
            }
            if (e.key === 'selectedService') {
                setServiceObject(getStoredData('selectedService'));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [logout]);

    // Memoized callback functions to prevent re-renders
    const updateShownav = useCallback(() => {
        setShownav(prev => !prev);
    }, []);

    const storeAuthObject = useCallback((obj) => {
        setAuthObject(obj);
    }, []);

    const tempUserid = useCallback((id) => {
        setUserid(id);
    }, []);

    const updateServiceObject = useCallback((obj) => {
        setServiceObject(obj);
        if (obj) {
            localStorage.setItem('selectedService', JSON.stringify(obj));
        }
    }, []);

    const updateUser = useCallback((obj) => {
        setUser(obj);
        // Update localStorage as well
        const userData = getStoredData('isLoggedIn');
        if (userData) {
            userData.user = obj;
            localStorage.setItem('isLoggedIn', JSON.stringify(userData));
        }
    }, []);

    const refreshRecord = useCallback((val) => {
        setRecord(val);
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            token,
            user,
            shownav,
            updateShownav,
            authObject,
            storeAuthObject,
            userid,
            tempUserid,
            serviceObject,
            updateServiceObject,
            logout,
            updateUser,
            record,
            refreshRecord,
        }),
        [
            token,
            user,
            shownav,
            updateShownav,
            authObject,
            storeAuthObject,
            userid,
            tempUserid,
            serviceObject,
            updateServiceObject,
            logout,
            updateUser,
            record,
            refreshRecord,
        ]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
