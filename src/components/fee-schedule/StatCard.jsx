import React from 'react';

const StatCard = ({ icon: Icon, label, value, sublabel, colorClass = 'border-blue-500' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border-t-4 ${colorClass} p-6 hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                    {sublabel && (
                        <p className="text-xs text-gray-500">{sublabel}</p>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
