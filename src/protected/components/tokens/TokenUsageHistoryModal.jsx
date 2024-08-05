// src/protected/components/tokens/TokenUsageHistoryModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getTokenUsageHistory } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';

const TokenUsageHistoryModal = ({ tokenId, closeModal }) => {
    const { token, user } = useContext(AuthContext);
    const [usageHistory, setUsageHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await getTokenUsageHistory(token, user.id, setUsageHistory, setError, setLoading);
        };
        fetchData();
    }, [token, user.id]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl transition-all duration-300 overflow-y-auto" style={{ maxHeight: '80%' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Token Usage History</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {loading ? (
                    <div>Loading usage history...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : usageHistory.length === 0 ? (
                    <div>No usage history found for this token.</div>
                ) : (
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 border border-gray-300">Date Used</th>
                                <th className="p-2 border border-gray-300">Amount Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usageHistory.map((history, index) => (
                                <tr key={index} className="border border-gray-300">
                                    <td className="p-2 text-gray-600 border border-gray-300">{history.date_used}</td>
                                    <td className="p-2 text-gray-600 border border-gray-300">₦{Number(history.amount_used).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="flex justify-end space-x-4 mt-4">
                    <button className="p-2 bg-green-500 text-white rounded hover:bg-green-700 transition-all duration-300" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default TokenUsageHistoryModal;
