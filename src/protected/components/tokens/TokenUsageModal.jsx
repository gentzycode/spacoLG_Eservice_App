// src/protected/components/tokens/TokenUsageModal.jsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const TokenUsageModal = ({ usage, closeModal }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Token Usage</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {usage.length === 0 ? (
                    <div className="text-center text-gray-500">No usage history found.</div>
                ) : (
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Token ID</th>
                                <th className="border p-2">Amount Used</th>
                                <th className="border p-2">Date Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usage.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="border p-2">{item.token_id}</td>
                                    <td className="border p-2">₦{Number(item.amount_used).toLocaleString()}</td>
                                    <td className="border p-2">{new Date(item.date_used).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-200"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenUsageModal;
