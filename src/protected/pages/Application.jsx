// src/protected/pages/Application.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Applications from '../components/application/Applications';
import ProfileUpdate from '../../public/components/service/ProfileUpdate';
import NewServiceApplication from '../components/application/NewServiceApplication';
import { hasPersonalInfo } from '../../apis/authActions';

const Application = () => {
    const { token, serviceObject } = useContext(AuthContext);
    const [hasInfo, setHasInfo] = useState(null);
    const [error, setError] = useState(null);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        hasPersonalInfo(token, setHasInfo, setError, setChecking);
    }, [token]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
            {error && <div className="text-center py-4 text-red-600">{error}</div>}
            {checking ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-300">Loading...</div>
            ) : (
                hasInfo !== null ? (
                    hasInfo?.hasPersonalInformation ? (
                        serviceObject !== null ? (
                            <NewServiceApplication serviceObject={serviceObject} />
                        ) : (
                            <Applications />
                        )
                    ) : (
                        <ProfileUpdate />
                    )
                ) : (
                    <div className="text-center py-6 text-gray-600 dark:text-gray-300">Checking profile status...</div>
                )
            )}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Application;