import React from 'react';
import LineChart from "../../../charts/LineChart";
import BarChart from "../../../charts/BarChart";


const Charts = ({ walletData, tokenData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-3">Wallet Transactions Over Time</h3>
                <LineChart data={walletData} />
            </div>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-3">Token Usage Statistics</h3>
                <BarChart data={tokenData} />
            </div>
        </div>
    );
};

export default Charts;
