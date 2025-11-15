import React, { useContext, useEffect, useState, useCallback, memo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Wallet from '../components/wallet/Wallet';
import WalletHistory from '../components/wallet/WalletHistory';
import { getUserWallet, getEnabledPaymentGateways } from '../../apis/authActions';
import ProgressBarComponent from '../../common/ProgressBarComponent';
import RefillModal from '../components/wallet/RefillModal';
import AgentPayments from '../components/wallet/AgentPayments';
import { componentStyles } from '../../config/theme';

const MyWallet = () => {
    const { token, user } = useContext(AuthContext);

    const [wallet, setWallet] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRefillModal, setShowRefillModal] = useState(false);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [paymentGateways, setPaymentGateways] = useState([]);

    useEffect(() => {
        if (user?.id) {
            getUserWallet(token, user.id, setWallet, setError, setLoading);
        }
    }, [token, user?.id]);

    const fetchPaymentGateways = useCallback(() => {
        getEnabledPaymentGateways(token, setPaymentGateways, setError, setLoading);
    }, [token]);

    const handleRefillClick = useCallback(() => {
        setLoading(true);
        fetchPaymentGateways();
        setShowRefillModal(true);
    }, [fetchPaymentGateways]);

    const handleSuccess = useCallback(() => {
        setShowRefillModal(false);
        if (user?.id) {
            getUserWallet(token, user.id, setWallet, setError, setLoading);
        }
    }, [token, user?.id]);

    const handlePaymentsModalClose = useCallback(() => {
        setShowPaymentsModal(false);
    }, []);

    const handleShowPayments = useCallback(() => {
        setShowPaymentsModal(true);
    }, []);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 font-poppins bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <ProgressBarComponent />
            ) : (
                <div className="mt-8">
                    <Wallet wallet={wallet} />
                </div>
            )}

            <div className="w-full flex justify-end my-4 space-x-4">
                <button
                    className="w-[160px] flex justify-center items-center space-x-2 rounded-lg py-2 px-4 bg-[#F0B652] hover:bg-[#3B78BD] dark:bg-[#3B78BD] dark:hover:bg-[#F0B652] text-white dark:text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRefillClick}
                    disabled={loading}
                    aria-label="Refill wallet"
                >
                    <span>Refill Wallet</span>
                </button>
                <button
                    className="w-[160px] flex justify-center items-center space-x-2 rounded-lg py-2 px-4 bg-[#3B78BD] hover:bg-[#F0B652] dark:bg-[#F0B652] dark:hover:bg-[#3B78BD] text-white dark:text-gray-900 font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleShowPayments}
                    disabled={loading}
                    aria-label="View payments"
                >
                    <span>View Payments</span>
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

            {showPaymentsModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className={`${componentStyles.card} p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fadeIn`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">
                                My Payments
                            </h2>
                            <button
                                onClick={handlePaymentsModalClose}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold text-3xl leading-none transition-colors duration-200"
                                aria-label="Close payments modal"
                            >
                                ×
                            </button>
                        </div>
                        <AgentPayments />
                    </div>
                </div>
            )}

            <WalletHistory token={token} agentId={user?.id} />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default memo(MyWallet);
