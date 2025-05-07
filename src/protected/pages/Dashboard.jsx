import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserDashboard from '../components/dashboards/UserDashboard';

const Dashboard = () => {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    const goToApplications = () => {
        navigate('/application');
    };

    useEffect(() => {
        setUsername(user?.username);
    }, [user]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            <UserDashboard 
                username={username} 
                goToApplications={goToApplications}
                primaryColor="#3B78BD"
                accentColor="#F0B652"
                secondaryColor="#f06752"
            />
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;