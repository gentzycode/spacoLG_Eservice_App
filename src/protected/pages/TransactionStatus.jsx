// src/protected/pages/TransactionStatus.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const TransactionStatus = () => {
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const query = new URLSearchParams(location.search);
    const reference = query.get('reference');
    const errorMsg = query.get('error');

    useEffect(() => {
        if (reference) {
            const fetchTransactionStatus = async () => {
                try {
                    const response = await axios.get(`/api/transaction-status/${reference}`);
                    setStatus(response.data.status);
                } catch (err) {
                    setError('Failed to fetch transaction status');
                }
            };
            fetchTransactionStatus();
        } else if (errorMsg) {
            setError(errorMsg);
        }
    }, [reference, errorMsg]);

    return (
        <div className="container mx-auto my-10 p-5">
            <h1 className="text-2xl font-bold mb-4">Transaction Status</h1>
            {error && <p className="text-red-500">{error}</p>}
            {status && <p className={`text-${status === 'Success' ? 'green' : 'red'}-500`}>{`Transaction ${status}`}</p>}
        </div>
    );
};

export default TransactionStatus;
