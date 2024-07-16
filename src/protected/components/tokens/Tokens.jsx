import React from 'react';
import illustration from '../../../assets/token.png';

const Tokens = ({ totalTokens, totalValue, usedTokens, usedValue }) => {
    return (
        <div className="p-6 bg-white rounded-md shadow-lg flex items-center transition-all duration-300" style={{ height: 'auto' }}>
            <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold">Manage Tokens 🏷️</h1>
                <p><strong>Total Tokens:</strong> <span className="text-1xl font-bold text-green-700">{totalTokens !== null ? totalTokens : 'Loading...'}</span></p>
                <p><strong>Total Value:</strong> <span className="text-1xl font-bold text-green-700">₦{totalValue !== null ? Number(totalValue).toLocaleString() : 'Loading...'}</span></p>
                <p><strong>Used Tokens:</strong> <span className="text-1xl font-bold text-red-700">{usedTokens !== null ? usedTokens : 'Loading...'}</span></p>
                <p><strong>Used Value:</strong> <span className="text-1xl font-bold text-red-700">₦{usedValue !== null ? Number(usedValue).toLocaleString() : 'Loading...'}</span></p>
            </div>
            <div className="relative w-1/3" style={{ marginTop: '-50px' }}>
                <img src={illustration} alt="Tokens Illustration" className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

export default Tokens;
