import React from 'react';
import illustration from '../../../assets/token.png';

const Tokens = ({ totalTokens, totalValue, usedTokens, usedValue }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center transition-all duration-300 border-2 border-transparent bg-gradient-to-r from-[#3B78BD]/20 to-[#F0B652]/20 hover:shadow-xl animate-fadeIn">
            <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Manage Tokens 🏷️</h1>
                <p>
                    <strong className="text-[#3B78BD] dark:text-[#F0B652]">Total Tokens:</strong>{' '}
                    <span className="text-xl font-bold text-green-700 dark:text-green-300">
                        {totalTokens !== null ? totalTokens : 'Loading...'}
                    </span>
                </p>
                <p>
                    <strong className="text-[#3B78BD] dark:text-[#F0B652]">Total Value:</strong>{' '}
                    <span className="text-xl font-bold text-green-700 dark:text-green-300">
                        ₦{totalValue !== null ? Number(totalValue).toLocaleString() : 'Loading...'}
                    </span>
                </p>
                <p>
                    <strong className="text-[#3B78BD] dark:text-[#F0B652]">Used Tokens:</strong>{' '}
                    <span className="text-xl font-bold text-red-700 dark:text-red-300">
                        {usedTokens !== null ? usedTokens : 'Loading...'}
                    </span>
                </p>
                <p>
                    <strong className="text-[#3B78BD] dark:text-[#F0B652]">Used Value:</strong>{' '}
                    <span className="text-xl font-bold text-red-700 dark:text-red-300">
                        ₦{usedValue !== null ? Number(usedValue).toLocaleString() : 'Loading...'}
                    </span>
                </p>
            </div>
            <div className="relative w-1/3">
                <img src={illustration} alt="Tokens Illustration" className="w-full h-full object-cover" />
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

export default Tokens;