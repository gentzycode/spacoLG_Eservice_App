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
        if (token && user?.id) {
            fetchData();
        }
    }, [token, user?.id]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl transition-all duration-300 overflow-y-auto animate-fadeIn" style={{ maxHeight: '80vh' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Token Usage History</h2>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-[#3B78BD] dark:hover:text-[#F0B652] transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center my-5">
                        <svg className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                        </svg>
                    </div>
                ) : error ? (
                    <div className="text-center py-6 text-[#f06752] dark:text-red-400">{error}</div>
                ) : usageHistory.length === 0 ? (
                    <div className="text-center py-6 text-gray-600 dark:text-gray-300">No usage history found for this token.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#3B78BD] to-[#F0B652] text-white">
                                    <th className="p-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">Date Used</th>
                                    <th className="p-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">Amount Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usageHistory.map((history, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{history.date_used}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">₦{Number(history.amount_used).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        className="py-2 px-4 bg-[#3B78BD] dark:bg-[#F0B652] text-white rounded-lg hover:bg-[#F0B652] dark:hover:bg-[#3B78BD] transition-all duration-300 shadow-md"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                </div>
            </div>
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

export default TokenUsageHistoryModal;