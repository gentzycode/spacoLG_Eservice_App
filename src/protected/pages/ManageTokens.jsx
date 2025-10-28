import React, { useContext, useEffect, useState, useCallback, memo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Tokens from '../components/tokens/Tokens';
import TokensHistory from '../components/tokens/TokensHistory';
import GenerateTokenModal from '../components/tokens/GenerateTokenModal';
import { getTotalTokens, getTotalTokenValue, getTotalTokensUsed, getTotalTokenValueUsed } from '../../apis/authActions';

const ManageTokens = () => {
    const { token, user } = useContext(AuthContext);
    const [totalTokens, setTotalTokens] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [usedTokens, setUsedTokens] = useState(0);
    const [usedValue, setUsedValue] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const fetchData = useCallback(() => {
        if (user?.id) {
            setLoading(true);
            // Fetch all data in parallel for better performance
            Promise.all([
                getTotalTokens(token, user.id, setTotalTokens, setError, setLoading),
                getTotalTokenValue(token, user.id, setTotalValue, setError, setLoading),
                getTotalTokensUsed(token, user.id, setUsedTokens, setError, setLoading),
                getTotalTokenValueUsed(token, user.id, setUsedValue, setError, setLoading),
            ]).finally(() => setLoading(false));
        }
    }, [token, user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refresh]);

    const handleGenerateClick = useCallback(() => {
        setShowGenerateModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowGenerateModal(false);
        setRefresh(prev => !prev);
    }, []);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 font-poppins bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 max-w-full animate-fadeIn">
            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center my-12">
                    <svg
                        className="animate-spin h-12 w-12 text-[#3B78BD] dark:text-[#F0B652]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-label="Loading"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h-8z"
                        />
                    </svg>
                </div>
            ) : (
                <div className="mt-8">
                    <Tokens
                        totalTokens={totalTokens}
                        totalValue={totalValue}
                        usedTokens={usedTokens}
                        usedValue={usedValue}
                    />
                </div>
            )}

            <div className="w-full flex justify-end my-4">
                <button
                    className="w-[185px] flex justify-center items-center space-x-2 rounded-lg py-2 px-4 bg-[#3B78BD] hover:bg-[#F0B652] dark:bg-[#F0B652] dark:hover:bg-[#3B78BD] text-white dark:text-gray-900 font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleGenerateClick}
                    disabled={loading}
                    aria-label="Generate token"
                >
                    <span>Generate Token</span>
                </button>
            </div>

            {showGenerateModal && (
                <GenerateTokenModal
                    closeModal={handleCloseModal}
                    agentId={user?.id}
                />
            )}

            <TokensHistory token={token} agentId={user?.id} />

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

export default memo(ManageTokens);
