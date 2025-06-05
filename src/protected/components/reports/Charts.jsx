// src/protected/components/reports/Charts.jsx
import React from 'react';
import LineChart from '../../../charts/LineChart';
import BarChart from '../../../charts/BarChart';

const Charts = ({ walletData, tokenData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fadeIn">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652] mb-4">Wallet Transactions Over Time</h3>
                <LineChart data={walletData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652] mb-4">Token Usage Statistics</h3>
                <BarChart data={tokenData} />
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

export default Charts;