import React from 'react';

const ComplianceScoreBadge = ({ score = 50, size = 'md', showLabel = true }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100 border-green-300';
        if (score >= 60) return 'text-blue-600 bg-blue-100 border-blue-300';
        if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
        return 'text-red-600 bg-red-100 border-red-300';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    return (
        <div className="flex items-center space-x-2">
            <div className={`rounded-full border-2 ${getScoreColor(score)} ${sizeClasses[size]} font-bold inline-flex items-center`}>
                {score}/100
            </div>
            {showLabel && (
                <span className={`text-sm font-medium ${getScoreColor(score).split(' ')[0]}`}>
                    {getScoreLabel(score)}
                </span>
            )}
        </div>
    );
};

export default ComplianceScoreBadge;
