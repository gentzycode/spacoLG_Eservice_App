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
        getUserWallet(token, user?.id, setWallet, setError, setLoading);
    };

    return (
        <div className="w-full p-4 sm:p-6 lg:p-8 font-poppins bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
            {loading ? (
                <ProgressBarComponent />
            ) : (
                <div className="mt-8">
                    <Wallet wallet={wallet} />
                </div>
            )}
            <div className="w-full flex justify-end my-4">
                <button
                    className="w-[160px] flex justify-center items-center space-x-2 rounded-lg py-2 px-4 bg-[#F0B652] hover:bg-[#3B78BD] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={handleRefillClick}
                >
                    <span>Refill Wallet</span>
                </button>
            </div>
            {showRefillModal && (
                <RefillModal
                    paymentGateways={paymentGateways}
                    closeModal={() => setShowRefillModal(false)}
                    agentId={user?.id}
                    onSuccess={handleSuccess}
                />
            )}
            <WalletHistory token={token} agentId={user?.id} />
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default MyWallet;