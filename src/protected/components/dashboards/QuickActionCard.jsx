import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus,
    FaUsers,
    FaFileInvoice,
    FaClock,
    FaWallet,
    FaChartBar,
    FaShieldAlt,
    FaCog,
    FaFileAlt,
    FaSearch,
    FaHeadset,
    FaClipboardList,
    FaBolt,
    FaTicketAlt,
} from 'react-icons/fa';

// Icon mapping for dynamic icon rendering
const iconMap = {
    UserPlus: FaUserPlus,
    Users: FaUsers,
    FileInvoice: FaFileInvoice,
    Clock: FaClock,
    Wallet: FaWallet,
    ChartBar: FaChartBar,
    Shield: FaShieldAlt,
    Settings: FaCog,
    FileText: FaFileAlt,
    Search: FaSearch,
    Headset: FaHeadset,
    ClipboardList: FaClipboardList,
    Zap: FaBolt, // Using FaBolt instead of FaZap (which doesn't exist)
    Ticket: FaTicketAlt,
};

/**
 * QuickActionCard Component
 *
 * A beautiful, clickable card that provides quick access to important features
 * with icon, title, description, and optional count badge
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier
 * @param {string} props.title - Card title
 * @param {string} props.description - Brief description
 * @param {string} props.icon - Icon name (from iconMap)
 * @param {string} props.route - Navigation route
 * @param {string} props.color - Card accent color (hex)
 * @param {number|null} props.count - Optional badge count
 * @param {Function} props.onClick - Optional click handler (overrides navigation)
 */
const QuickActionCard = ({
    id,
    title,
    description,
    icon,
    route,
    color = '#3B78BD',
    count = null,
    onClick,
}) => {
    const navigate = useNavigate();

    // Get the icon component from the map
    const IconComponent = iconMap[icon] || FaFileAlt;

    // Handle card click
    const handleClick = () => {
        if (onClick) {
            onClick({ id, title, route });
        } else if (route) {
            navigate(route);
        }
    };

    // Convert hex color to RGB for opacity effects
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : { r: 59, g: 120, b: 189 }; // Default blue
    };

    const rgb = hexToRgb(color);
    const bgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
    const hoverBgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;

    return (
        <div
            onClick={handleClick}
            className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeIn"
            style={{
                '--bg-color': bgColor,
                '--hover-bg-color': hoverBgColor,
            }}
        >
            {/* Background gradient effect on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `linear-gradient(135deg, ${bgColor} 0%, transparent 100%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Icon and Count Badge */}
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: bgColor }}
                    >
                        <IconComponent size={24} style={{ color }} />
                    </div>

                    {/* Count Badge */}
                    {count !== null && count !== undefined && (
                        <div
                            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                            style={{ backgroundColor: color }}
                        >
                            {count > 999 ? '999+' : count}
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-opacity-90">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {description}
                </p>

                {/* Hover Arrow Indicator */}
                <div className="mt-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-semibold" style={{ color }}>
                        Go to {title.toLowerCase()}
                    </span>
                    <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        style={{ color }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>

            {/* Decorative corner accent */}
            <div
                className="absolute top-0 right-0 w-20 h-20 opacity-20 transform rotate-45 translate-x-10 -translate-y-10"
                style={{ backgroundColor: color }}
            />

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default QuickActionCard;
