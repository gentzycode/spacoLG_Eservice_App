import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const PageLoader = ({ message = 'Loading...', fullScreen = true }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
                <div className="text-center">
                    {/* Animated Logo/Icon */}
                    <div className="relative mb-8">
                        {/* Outer rotating ring */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        </div>

                        {/* Animated gradient ring */}
                        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                            <div className="w-32 h-32 border-4 border-transparent border-t-[#0d544c] border-r-[#3B78BD] border-b-[#F0B652] rounded-full"></div>
                        </div>

                        {/* Inner pulsing circle */}
                        <div className="relative flex items-center justify-center w-32 h-32">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#0d544c] to-[#3B78BD] rounded-full flex items-center justify-center animate-pulse-slow">
                                <FaSpinner className="text-white text-3xl animate-spin" />
                            </div>
                        </div>
                    </div>

                    {/* Loading text with animated dots */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            <span>{message}</span>
                            <span className="inline-flex ml-1">
                                <span className="animate-dot-pulse">.</span>
                                <span className="animate-dot-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                                <span className="animate-dot-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                            </span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we fetch your data</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-8 w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#0d544c] via-[#3B78BD] to-[#F0B652] animate-progress"></div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes pulse-slow {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.05); opacity: 0.8; }
                    }
                    @keyframes progress {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(400%); }
                    }
                    @keyframes dot-pulse {
                        0%, 20% { opacity: 0; }
                        50% { opacity: 1; }
                        100% { opacity: 0; }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 2s linear infinite;
                    }
                    .animate-pulse-slow {
                        animation: pulse-slow 2s ease-in-out infinite;
                    }
                    .animate-progress {
                        animation: progress 1.5s ease-in-out infinite;
                    }
                    .animate-dot-pulse {
                        animation: dot-pulse 1.4s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    // Inline loader (for use within components)
    return (
        <div className="flex items-center justify-center py-12">
            <div className="text-center">
                <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center animate-spin">
                        <div className="w-16 h-16 border-4 border-transparent border-t-[#0d544c] border-r-[#3B78BD] rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaSpinner className="text-[#0d544c] text-xl animate-spin" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
            </div>
        </div>
    );
};

export default PageLoader;
