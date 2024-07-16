import React from 'react';

const GatewayResponseModal = ({ response, closeModal }) => {
    const responseData = JSON.parse(response).data;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl transition-all duration-300 overflow-y-auto" style={{ maxHeight: '80%' }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Gateway Response</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={closeModal}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <table className="table-auto w-full border-collapse">
                    <tbody>
                        {Object.keys(responseData).map((key) => (
                            <tr key={key} className="border border-gray-300">
                                <td className="p-2 font-bold text-gray-700 border border-gray-300">{key.replace(/_/g, ' ')}</td>
                                <td className="p-2 text-gray-600 border border-gray-300">{responseData[key]?.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end space-x-4 mt-4">
                    <button className="p-2 bg-green-500 text-white rounded hover:bg-green-700 transition-all duration-300" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default GatewayResponseModal;