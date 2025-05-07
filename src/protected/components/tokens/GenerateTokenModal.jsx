import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { generateBulkTokens } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const GenerateTokenModal = ({ closeModal, agentId }) => {
    const { token } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const payload = { value: parseFloat(amount), quantity: parseInt(quantity) };
        try {
            const response = await generateBulkTokens(token, agentId, payload);
            setTokenData(response.tokens);
            setIsChecked(false);
            setLoading(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to generate tokens. Check Wallet balance!';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-3xl transform transition-all duration-300 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Generate Tokens</h2>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-[#3B78BD] dark:hover:text-[#F0B652] transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[60vh] px-4">
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount to generate tokens"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] focus:border-transparent transition-all duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity of tokens"
                            min="1"
                        />
                    </div>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md border-l-4 border-red-600 dark:border-red-500 mb-4">
                            <div className="text-red-700 dark:text-red-300 text-lg font-semibold mb-2 flex items-center">
                                <FaTimesCircle className="mr-2" />
                                Error!
                            </div>
                            <div className="text-gray-700 dark:text-gray-300">
                                {error}
                            </div>
                        </div>
                    )}
                    {tokenData && (
                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md border-l-4 border-green-600 dark:border-green-500 mb-4">
                            <div className="text-green-700 dark:text-green-300 text-lg font-semibold mb-2 flex items-center">
                                <FaCheckCircle className="mr-2" />
                                Tokens generated successfully!
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-[#3B78BD] to-[#F0B652] text-white">
                                            <th className="p-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">Token</th>
                                            <th className="p-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">Value</th>
                                            <th className="p-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">Current Value</th>
                                            <th className="p-3 text-left font-semibold text-sm uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokenData.map(token => (
                                            <tr
                                                key={token.id}
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <td className="p-3 text-gray-600 dark:text-gray-300">{token.token}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300">₦{Number(token.value).toLocaleString()}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300">₦{Number(token.current_value).toLocaleString()}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(token.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="confirmGenerate"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        className="h-5 w-5 text-[#3B78BD] dark:text-[#F0B652] focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] border-gray-300 dark:border-gray-600 rounded mr-2"
                    />
                    <label htmlFor="confirmGenerate" className="text-gray-700 dark:text-gray-300">Confirm token generation from your wallet by checking this box.</label>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        className="py-2 px-4 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-300 shadow-md"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                    <button
                        className={`py-2 px-4 rounded-lg text-white transition-all duration-300 shadow-md ${loading || !amount || !quantity || !isChecked ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3B78BD] dark:bg-[#F0B652] hover:bg-[#F0B652] dark:hover:bg-[#3B78BD]'}`}
                        onClick={handleSubmit}
                        disabled={loading || !amount || !quantity || !isChecked}
                    >
                        {loading ? 'Processing...' : 'Generate'}
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

export default GenerateTokenModal;