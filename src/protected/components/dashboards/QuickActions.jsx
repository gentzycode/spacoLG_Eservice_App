import React from 'react';
import QuickActionCard from './QuickActionCard';
import { FaRocket } from 'react-icons/fa';

/**
 * QuickActions Component
 *
 * Displays a grid of quick action cards for dashboard shortcuts
 * Adapts to different screen sizes and number of actions
 *
 * @param {Object} props
 * @param {Array} props.actions - Array of quick action objects
 * @param {string} props.title - Section title (optional)
 * @param {string} props.subtitle - Section subtitle (optional)
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onActionClick - Optional global click handler
 */
const QuickActions = ({
    actions = [],
    title = 'Quick Actions',
    subtitle = 'Fast access to frequently used features',
    loading = false,
    onActionClick,
}) => {
    // Loading skeleton
    if (loading) {
        return (
            <div className="w-full animate-pulse">
                <div className="mb-6">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (!actions || actions.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRocket className="text-gray-400 dark:text-gray-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No Quick Actions Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Quick action shortcuts will appear here once configured
                </p>
            </div>
        );
    }

    // Determine grid columns based on number of actions
    const getGridClass = () => {
        if (actions.length === 1) return 'grid-cols-1';
        if (actions.length === 2) return 'grid-cols-1 sm:grid-cols-2';
        if (actions.length === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    };

    return (
        <div className="w-full">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                    <FaRocket className="text-[#3B78BD]" size={24} />
                    <span>{title}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            {/* Quick Actions Grid */}
            <div className={`grid ${getGridClass()} gap-6`}>
                {actions.map((action, index) => (
                    <QuickActionCard
                        key={action.id || index}
                        {...action}
                        onClick={onActionClick}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                        }}
                    />
                ))}
            </div>

            {/* Optional: Show more link if there are many actions */}
            {actions.length > 8 && (
                <div className="mt-6 text-center">
                    <button className="px-6 py-2 text-sm font-medium text-[#3B78BD] hover:text-[#0d544c] transition-colors duration-300">
                        View All Actions ({actions.length})
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuickActions;
