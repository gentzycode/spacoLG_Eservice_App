import React from 'react';
import illustration from '../../../assets/illustrator.png';

const Wallet = ({ wallet }) => {
    if (!wallet || wallet.balance === undefined) {
        return <div>Loading...</div>; // Or some other loading indicator
    }

    return (
        <div className="p-6 bg-white rounded-md shadow-lg flex items-center transition-all duration-300" style={{ height: 'auto' }}>
            <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold">My Wallet 💼</h1>
                <p><strong>Agent Name:</strong> {wallet.agent_name}</p>
                <p><strong>Local Government:</strong> {wallet.local_government}</p>
                <p><strong>Balance:</strong> <span className="text-xl font-bold text-green-700">₦{Number(wallet.balance).toLocaleString()}</span></p>
            </div>
            <div className="relative w-1/3" style={{ marginTop: '-50px' }}>
                <img src={illustration} alt="Wallet Illustration" className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

export default Wallet;
