import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Wallet from '../components/wallet/Wallet';
import WalletHistory from '../components/wallet/WalletHistory';
import { getUserWallet, getEnabledPaymentGateways } from '../../apis/authActions';
import ProgressBarComponent from '../../common/ProgressBarComponent';
import RefillModal from '../components/wallet/RefillModal';

const MyWallet = () => {
    const { token, user } = useContext(AuthContext);

    const [wallet, setWallet] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRefillModal, setShowRefillModal] = useState(false);
    const [paymentGateways, setPaymentGateways] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            getUserWallet(token, user.id, setWallet, setError, setLoading);
        }
    }, [token, user]);

    const fetchPaymentGateways = () => {
        getEnabledPaymentGateways(token, setPaymentGateways, setError, setLoading);
    };

    const handleRefillClick = () => {
        setLoading(true);
        fetchPaymentGateways();
        setShowRefillModal(true);
    };

    const handleSuccess = () => {
        setShowRefillModal(false);
        // Reload wallet data after successful transaction
        getUserWallet(token, user?.id, setWallet, setError, setLoading);
    };

    return (
        <div className="w-full">
            {error && <span className='text-red-600'>{error}</span>}
            {loading ? <ProgressBarComponent /> : <div className="mt-8"><Wallet wallet={wallet} /></div>}
            <div className="w-full flex justify-end my-4">
                <div
                    className='w-[160px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#0d544c] hover:bg-green-700 text-white cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105'
                    onClick={handleRefillClick}
                >
                    <span>Refill Wallet</span>
                </div>
            </div>
            {showRefillModal && (
                <RefillModal
                    paymentGateways={paymentGateways}
                    closeModal={() => setShowRefillModal(false)}
                    agentId={user?.id} // Add optional chaining
                    onSuccess={handleSuccess} // Pass the handleSuccess callback
                />
            )}
            <WalletHistory token={token} agentId={user?.id} /> {/* Add optional chaining */}
        </div>
    );
};

export default MyWallet;
