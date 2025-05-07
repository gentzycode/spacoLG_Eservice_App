import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { initiateWalletRefill } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import { motion } from 'framer-motion';

const RefillModal = ({ paymentGateways, closeModal, agentId, onSuccess }) => {
    const { token } = useContext(AuthContext);
    const [selectedGateway, setSelectedGateway] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            amount: parseFloat(amount),
            payment_gateway: selectedGateway,
            payment_type: 'credit_card',
        };
        try {
            const response = await initiateWalletRefill(token, agentId, payload);
            setLoading(false);

            if (selectedGateway === 'Cash') {
                setSuccessMessage(response.message);
            } else {
                window.open(response.payment_url, '_blank');
                closeModal();
            }
        } catch (err) {
            setError('Failed to initiate refill. Please try again.');
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (successMessage) {
            onSuccess();
        } else {
            closeModal();
        }
    };

    useEffect(() => {
        console.log('PaymentGateways prop in RefillModal:', paymentGateways);
    }, [paymentGateways]);

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 font-poppins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl transform"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Refill Wallet</h2>
                    <button
                        className="text-gray-500 dark:text-gray-400 hover:text-[#f06752] dark:hover:text-[#F0B652] transition-colors duration-200"
                        onClick={handleClose}
                    >
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                {successMessage ? (
                    <motion.div
                        className="mb-6 p-4 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {successMessage}
                    </motion.div>
                ) : (
                    <>
                        <motion.p
                            className="mb-6 text-center text-sm font-medium text-gray-600 dark:text-gray-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Currently, you can only refill your wallet using the{' '}
                            <strong>Paystack</strong> payment option. Additional payment methods
                            will be available soon to enhance your experience.
                        </motion.p>
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                                Amount
                            </label>
                            <input
                                type="number"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                                value={amount}
                                onChange={(e) => {
                                    const enteredAmount = parseFloat(e.target.value);
                                    if (enteredAmount <= 500000) {
                                        setAmount(e.target.value);
                                        setError(null);
                                    } else {
                                        setError('Amount cannot exceed 500,000.');
                                    }
                                }}
                                placeholder="Enter amount to refill (max 500,000)"
                            />
                        </div>
                        {error && (
                            <div className="text-[#f06752] dark:text-red-400 mb-4 text-center">
                                {error}
                            </div>
                        )}
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                                Select Payment Gateway
                            </label>
                            <div className="flex space-x-4 flex-wrap justify-center">
                                {paymentGateways && paymentGateways.length > 0 ? (
                                    paymentGateways.map((gateway) => (
                                        <motion.img
                                            key={gateway.id}
                                            src={gateway.logo_url}
                                            alt={gateway.gateway_name}
                                            className={`cursor-pointer p-2 rounded-lg border transition-transform duration-200 ${
                                                selectedGateway === gateway.gateway_name
                                                    ? 'border-[#3B78BD] dark:border-[#F0B652] transform scale-110 shadow-md'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                            onClick={() => setSelectedGateway(gateway.gateway_name)}
                                            style={{ width: 'auto', height: 80 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-300">No payment gateways available</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                />
                                I agree to the terms and conditions
                            </label>
                        </div>
                        {error && (
                            <motion.div
                                className="text-[#f06752] dark:text-red-400 mb-4 text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                {error}
                            </motion.div>
                        )}
                        <div className="flex justify-end space-x-4">
                            <motion.button
                                className="px-5 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-200"
                                onClick={handleClose}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                className="px-5 py-3 bg-[#3B78BD] dark:bg-[#F0B652] text-white rounded-lg hover:bg-[#F0B652] dark:hover:bg-[#3B78BD] transition-all duration-200"
                                onClick={handleSubmit}
                                disabled={loading || !selectedGateway || !termsAccepted}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {loading ? 'Processing...' : 'Refill'}
                            </motion.button>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default RefillModal;