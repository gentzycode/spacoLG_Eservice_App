import React from 'react';
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';

const RiskCategoryBadge = ({ category = 'Medium', size = 'md', showIcon = true }) => {
    const getRiskConfig = (category) => {
        switch (category?.toLowerCase()) {
            case 'low':
                return {
                    color: 'text-green-700 bg-green-100 border-green-300',
                    icon: AiOutlineCheckCircle,
                    label: 'Low Risk'
                };
            case 'high':
                return {
                    color: 'text-red-700 bg-red-100 border-red-300',
                    icon: AiOutlineWarning,
                    label: 'High Risk'
                };
            case 'medium':
            default:
                return {
                    color: 'text-yellow-700 bg-yellow-100 border-yellow-300',
                    icon: AiOutlineInfoCircle,
                    label: 'Medium Risk'
                };
        }
    };

    const config = getRiskConfig(category);
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18
    };

    return (
        <div className={`rounded-full border-2 ${config.color} ${sizeClasses[size]} font-semibold inline-flex items-center space-x-1.5`}>
            {showIcon && <Icon size={iconSizes[size]} />}
            <span>{config.label}</span>
        </div>
    );
};

export default RiskCategoryBadge;
