// src/protected/components/reports/SummaryCards.jsx
import React from 'react';

const SummaryCards = ({ summaries }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn">
            {summaries.map((summary, index) => (
                <div
                    key={index}
                    className={`p-6 rounded-lg shadow-md bg-gradient-to-r ${summary.bgColor} text-${summary.textColor} dark:brightness-90 dark:shadow-xl transform transition-all duration-300 hover:scale-105`}
                >
                    <h3 className="text-lg font-semibold">{summary.title}</h3>
                    <p className="text-2xl font-bold">{summary.value}</p>
                </div>
            ))}
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

export default SummaryCards;