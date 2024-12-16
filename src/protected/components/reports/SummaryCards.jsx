import React from 'react';

const SummaryCards = ({ summaries }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {summaries.map((summary, index) => (
                <div
                    key={index}
                    className={`p-4 rounded shadow ${summary.bgColor}`}
                >
                    <h3 className={`text-lg font-semibold ${summary.textColor}`}>{summary.title}</h3>
                    <p className={`text-2xl font-bold ${summary.textColor}`}>{summary.value}</p>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
