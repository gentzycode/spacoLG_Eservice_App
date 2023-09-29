import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(JSON.parse(localStorage.getItem('isLoggedIn')) === null){
            navigate('/auth');
        }
    }, [children])

    return children;

}

export default PrivateRoute