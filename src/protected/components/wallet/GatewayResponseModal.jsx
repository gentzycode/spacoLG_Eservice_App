import React from 'react';

const GatewayResponseModal = ({ response, closeModal }) => {
    const responseData = JSON.parse(response).data;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 font-poppins">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl transition-all duration-300 overflow-y-auto" style={{ maxHeight: '80%' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Gateway Response</h2>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-[#f06752] dark:hover:text-[#F0B652] transition-colors duration-200" onClick={closeModal}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <table className="table-auto w-full border-collapse">
                    <tbody>
                        {Object.keys(responseData).map((key) => (
                            <tr key={key} className="border border-gray-300 dark:border-gray-600">
                                <td className="p-2 font-bold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">{key.replace(/_/g, ' ')}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">{responseData[key]?.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end space-x-4 mt-4">
                    <button className="p-2 bg-[#3B78BD] dark:bg-[#F0B652] text-white rounded-lg hover:bg-[#F0B652] dark:hover:bg-[#3B78BD] transition-all duration-300" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default GatewayResponseModal;