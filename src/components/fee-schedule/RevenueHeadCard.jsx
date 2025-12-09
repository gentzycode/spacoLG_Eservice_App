import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaHashtag } from 'react-icons/fa';
import TariffCard from './TariffCard';

const RevenueHeadCard = ({ revenueHead }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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

    const tariffCount = revenueHead.tariffs?.length || 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Header - Clickable */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                                {revenueHead.name}
                            </h3>
                            <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 text-xs font-mono font-medium bg-gray-100 text-gray-700 rounded">
                                {revenueHead.code}
                            </span>
                        </div>

                        {/* Description */}
                        {revenueHead.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {revenueHead.description}
                            </p>
                        )}

                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                <FaHashtag className="h-3 w-3" />
                                Schedule {revenueHead.schedule_number}
                            </span>

                            {revenueHead.category && (
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                    {revenueHead.category}
                                </span>
                            )}

                            {revenueHead.payment_frequency && (
                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getFrequencyBadgeColor(revenueHead.payment_frequency)}`}>
                                    <FaCalendarAlt className="h-3 w-3" />
                                    {revenueHead.payment_frequency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            )}

                            {tariffCount > 0 && (
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                                    {tariffCount} {tariffCount === 1 ? 'Tariff' : 'Tariffs'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <button className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        {isExpanded ? (
                            <FaChevronUp className="h-5 w-5" />
                        ) : (
                            <FaChevronDown className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Content - Tariffs */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-6 animate-fadeIn">
                    {tariffCount > 0 ? (
                        <>
                            <h4 className="text-lg font-bold text-gray-900 mb-4">
                                Tariffs & Fees
                            </h4>
                            <div className="space-y-3">
                                {revenueHead.tariffs.map((tariff) => (
                                    <TariffCard key={tariff.id} tariff={tariff} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No tariffs available for this revenue head</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RevenueHeadCard;
