import React from 'react';
import { AiOutlineStar, AiOutlineUser, AiOutlineRise, AiOutlineWarning, AiOutlineCrown } from 'react-icons/ai';

const PayerCategoryBadge = ({ category = 'Regular', size = 'md', showIcon = true }) => {
    const getCategoryConfig = (category) => {
        switch (category?.toLowerCase()) {
            case 'vip':
                return {
                    color: 'text-purple-700 bg-purple-100 border-purple-300',
                    icon: AiOutlineStar,
                    label: 'VIP'
                };
            case 'hnwi':
                return {
                    color: 'text-amber-700 bg-amber-100 border-amber-300',
                    icon: AiOutlineCrown,
                    label: 'HNWI'
                };
            case 'emerging':
                return {
                    color: 'text-blue-700 bg-blue-100 border-blue-300',
                    icon: AiOutlineRise,
                    label: 'Emerging'
                };
            case 'non-compliant':
                return {
                    color: 'text-red-700 bg-red-100 border-red-300',
                    icon: AiOutlineWarning,
                    label: 'Non-Compliant'
                };
            case 'regular':
            default:
                return {
                    color: 'text-gray-700 bg-gray-100 border-gray-300',
                    icon: AiOutlineUser,
                    label: 'Regular'
                };
        }
    };

    const config = getCategoryConfig(category);
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

export default PayerCategoryBadge;
