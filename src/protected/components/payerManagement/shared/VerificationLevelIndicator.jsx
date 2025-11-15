import React from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

const VerificationLevelIndicator = ({ level = 1, maxLevel = 4, size = 'md', showLabel = true }) => {
    const getLevelColor = (level) => {
        if (level >= 4) return 'bg-green-500';
        if (level >= 3) return 'bg-blue-500';
        if (level >= 2) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    const getLevelLabel = (level) => {
        switch (level) {
            case 4: return 'Premium';
            case 3: return 'Enhanced';
            case 2: return 'Standard';
            case 1: return 'Basic';
            default: return 'None';
        }
    };

    const sizeClasses = {
        sm: { circle: 'w-6 h-6', check: 12 },
        md: { circle: 'w-8 h-8', check: 16 },
        lg: { circle: 'w-10 h-10', check: 20 }
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
                {[...Array(maxLevel)].map((_, index) => {
                    const isVerified = index < level;
                    return (
                        <div
                            key={index}
                            className={`${sizeClasses[size].circle} rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                                isVerified
                                    ? `${getLevelColor(level)} border-transparent text-white`
                                    : 'bg-gray-200 border-gray-300 text-gray-400'
                            }`}
                            title={`Level ${index + 1}`}
                        >
                            {isVerified && <AiOutlineCheck size={sizeClasses[size].check} />}
                        </div>
                    );
                })}
            </div>
            {showLabel && (
                <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${getLevelColor(level).replace('bg-', 'text-')}`}>
                        Level {level}
                    </span>
                    <span className="text-xs text-gray-500">
                        {getLevelLabel(level)}
                    </span>
                </div>
            )}
        </div>
    );
};

export default VerificationLevelIndicator;
