// src/protected/lga_admin/components/Authorizations.jsx
import React from 'react';
import { formatDate } from '../../../apis/functions';

const Authorizations = ({ authorizations, flag, authorizers }) => {
    const getAuthorizerName = (id, authorizersArr) => {
        if (!authorizersArr || !id) return 'N/A';
        const authorizer = authorizersArr.find((auth) => auth?.id === id);
        return authorizer?.user?.username || 'No name';
    };

    return (
        <div className="w-full my-4 space-y-2 animate-fadeIn">
            {authorizations && authorizations.length > 0 ? (
                authorizations.map((auth) => (
                    <div
                        key={auth?.id}
                        className="text-green-600 bg-green-50 p-3 rounded-lg shadow-sm"
                    >
                        {auth?.status} by{' '}
                        <span className="font-bold">{getAuthorizerName(auth?.authorizer_id, authorizers)}</span> on{' '}
                        {formatDate(auth?.updated_at) || 'N/A'}
                    </div>
                ))
            ) : (
                <div className="text-orange-600 bg-orange-50 p-3 rounded-lg shadow-sm">
                    No authorization action yet
                </div>
            )}
            {authorizations.length > 0 && flag === 'P_CERT' && (
                <span className="italic text-gray-500 text-sm">Awaiting other authorizers...</span>
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

export default Authorizations;