import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { generateToken } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const GenerateTokenModal = ({ closeModal, agentId }) => {
    const { token } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null); // Reset error before making the request
        const payload = { value: parseFloat(amount) };
        try {
            const response = await generateToken(token, agentId, payload);
            setTokenData(response.token);
            setIsChecked(false); // Uncheck the checkbox after generating token
            setLoading(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to generate token. Check Wallet balance!';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-900">Generate Token</h2>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={closeModal}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 transition-all duration-200"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount to generate token"
                    />
                </div>
                {error && (
                    <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-600 mb-4">
                        <div className="text-red-700 text-lg font-semibold mb-2 flex items-center">
                            <FaTimesCircle className="mr-2" />
                            Error!
                        </div>
                        <div className="text-gray-700">
                            {error}
                        </div>
                    </div>
                )}
                {tokenData && (
                    <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-600 mb-4">
                        <div className="text-green-700 text-lg font-semibold mb-2 flex items-center">
                            <FaCheckCircle className="mr-2" />
                            Token generated successfully!
                        </div>
                        <div className="text-gray-700">
                            <div><strong>Token:</strong> {tokenData.token}</div>
                            <div><strong>Value:</strong> ₦{Number(tokenData.value).toLocaleString()}</div>
                            <div><strong>Current Value:</strong> ₦{Number(tokenData.current_value).toLocaleString()}</div>
                            <div><strong>Created At:</strong> {new Date(tokenData.created_at).toLocaleString()}</div>
                        </div>
                    </div>
                )}
                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="confirmGenerate"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        className="mr-2"
                    />
                    <label htmlFor="confirmGenerate" className="text-gray-700">Confirm token generation from your wallet by checking this box.</label>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                    <button
                        className={`px-5 py-3 rounded-lg text-white transition-all duration-200 ${loading || !amount || !isChecked ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-900'}`}
                        onClick={handleSubmit}
                        disabled={loading || !amount || !isChecked}
                    >
                        {loading ? 'Processing...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateTokenModal;
