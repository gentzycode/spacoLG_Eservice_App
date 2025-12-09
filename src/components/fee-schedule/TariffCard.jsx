import React from 'react';
import { FaBuilding, FaStore, FaCar, FaMoneyBillWave, FaReceipt } from 'react-icons/fa';

const TariffCard = ({ tariff }) => {
    // Determine icon based on category or purpose
    const getIcon = () => {
        const purpose = tariff.purpose?.toLowerCase() || '';
        const category = tariff.category?.toLowerCase() || '';

        if (purpose.includes('building') || purpose.includes('commercial')) return FaBuilding;
        if (purpose.includes('market') || purpose.includes('shop') || purpose.includes('stall')) return FaStore;
        if (purpose.includes('vehicle') || purpose.includes('car') || purpose.includes('motor')) return FaCar;
        if (purpose.includes('permit') || purpose.includes('license')) return FaReceipt;
        return FaMoneyBillWave;
    };

    const Icon = getIcon();

    const formatCurrency = (amount) => {
        if (!amount || amount === '0.00' || amount === 0) {
            return 'To be assessed';
        }
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getFrequencyBadgeColor = (frequency) => {
        const colors = {
            'one-time': 'bg-gray-100 text-gray-700',
            'daily': 'bg-blue-100 text-blue-700',
            'weekly': 'bg-green-100 text-green-700',
            'monthly': 'bg-purple-100 text-purple-700',
            'quarterly': 'bg-yellow-100 text-yellow-700',
            'annually': 'bg-red-100 text-red-700',
        };
        return colors[frequency] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="group bg-white rounded-lg border border-gray-200 p-5 hover:border-[#3B78BD] hover:shadow-md transition-all duration-200">
            <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                        <Icon className="h-6 w-6 text-[#3B78BD]" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title and Price Row */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-base font-semibold text-gray-900 leading-tight">
                            {tariff.purpose || tariff.description}
                        </h4>
                        <div className="flex-shrink-0 text-right">
                            <div className="text-xl font-bold text-[#3B78BD]">
                                {formatCurrency(tariff.amount)}
                            </div>
                            {tariff.duration && tariff.amount && tariff.amount !== '0.00' && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                    per {tariff.duration.toLowerCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {tariff.description && tariff.purpose !== tariff.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {tariff.description}
                        </p>
                    )}

                    {/* Meta Badges */}
                    <div className="flex flex-wrap gap-2">
                        {tariff.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                {tariff.category}
                            </span>
                        )}
                        {tariff.payment_frequency && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getFrequencyBadgeColor(tariff.payment_frequency)}`}>
                                {tariff.payment_frequency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        )}
                        {tariff.has_variable_pricing && (
                            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                                Variable Pricing
                            </span>
                        )}
                    </div>

                    {/* Pricing Metadata */}
                    {tariff.pricing_metadata && Object.keys(tariff.pricing_metadata).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(tariff.pricing_metadata).slice(0, 4).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="text-gray-500">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                        </span>
                                        <span className="font-medium text-gray-700">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TariffCard;
