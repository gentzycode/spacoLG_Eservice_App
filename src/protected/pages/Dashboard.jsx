import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import UserDashboard from '../components/dashboards/UserDashboard';

const Dashboard = () => {

    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState(null);

    const goToApplications = () => {
        navigate('/application')
    }

    useEffect(() => {
        setUsername(user?.username);
    }, [])

    return (
        <UserDashboard username={username} goToApplications={goToApplications} />
    )
}

export default Dashboard
