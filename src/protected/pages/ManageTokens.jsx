import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Tokens from '../components/tokens/Tokens';
import TokensHistory from '../components/tokens/TokensHistory';
import GenerateTokenModal from '../components/tokens/GenerateTokenModal';
import ProgressBarComponent from '../../common/ProgressBarComponent';
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

    const fetchData = () => {
        if (user) {
            setLoading(true);
            getTotalTokens(token, user.id, setTotalTokens, setError, setLoading);
            getTotalTokenValue(token, user.id, setTotalValue, setError, setLoading);
            getTotalTokensUsed(token, user.id, setUsedTokens, setError, setLoading);
            getTotalTokenValueUsed(token, user.id, setUsedValue, setError, setLoading);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, user, refresh]);

    const handleGenerateClick = () => {
        setShowGenerateModal(true);
    };

    const handleCloseModal = () => {
        setShowGenerateModal(false);
        setRefresh(prev => !prev); // Trigger refresh
    };

    return (
        <div className="w-full">
            {error && <span className='text-red-600'>{error}</span>}
            {loading ? <ProgressBarComponent /> : (
                <div className="mt-8">
                    <Tokens totalTokens={totalTokens} totalValue={totalValue} usedTokens={usedTokens} usedValue={usedValue} />
                </div>
            )}
            <div className="w-full flex justify-end my-4">
                <div
                    className='w-[185px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#0d544c] hover:bg-green-700 text-white cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105'
                    onClick={handleGenerateClick}
                >
                    <span>Generate Token</span>
                </div>
            </div>
            {showGenerateModal && (
                <GenerateTokenModal
                    closeModal={handleCloseModal}
                    agentId={user.id}
                />
            )}
            <TokensHistory token={token} agentId={user.id} />
        </div>
    );
};

export default ManageTokens;
