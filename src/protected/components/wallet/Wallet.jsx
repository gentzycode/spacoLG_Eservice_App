import React from 'react';
import illustration from '../../../assets/illustrator.png';

const Wallet = ({ wallet }) => {
    if (!wallet || wallet.balance === undefined) {
        return <div className="text-center py-6 text-gray-600 dark:text-gray-300">Loading...</div>;
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center transition-all duration-300 border-2 border-transparent bg-gradient-to-r from-[#3B78BD]/20 to-[#F0B652]/20 hover:shadow-xl animate-fadeIn">
            <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">My Wallet 💼</h1>
                <p>
                    <strong className="text-[#3B78BD] dark:text-[#F0B652]">Agent Name:</strong>{' '}
                    <span className="text-gray-700 dark:text-gray-300">{wallet.agent_name}</span>
                </p>
                <p>
                    <strong className="text-[#3B78BD] dark:text-[#F0B652]">Local Government:</strong>{' '}
                    <span className="text-gray-700 dark:text-gray-300">{wallet.local_government}</span>
                </p>
                <p>
                    <strong className="text-[#3B78BD] dark:text-[#F0B652]">Balance:</strong>{' '}
                    <span className="text-xl font-bold text-green-700 dark:text-green-300">
                        ₦{Number(wallet.balance).toLocaleString()}
                    </span>
                </p>
            </div>
            <div className="relative w-1/3">
                <img src={illustration} alt="Wallet Illustration" className="w-full h-full object-cover" />
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

export default Wallet;