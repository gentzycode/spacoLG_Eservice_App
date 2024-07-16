// src/utils/pollTransactionStatus.js
import axios from 'axios';

const pollTransactionStatus = async (token, transactionReference) => {
    try {
        const response = await axios.get(`/api/transaction-status/${transactionReference}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.status;
    } catch (error) {
        console.error('Failed to fetch transaction status:', error);
        return null;
    }
};

export default pollTransactionStatus;
