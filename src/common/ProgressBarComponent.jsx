import React, { useEffect, useState } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';

const ProgressBarComponent = () => {
    const [counter, setCounter] = useState(0);

    const updateCounter = () => {
        setCounter(prev => (prev < 100 ? prev + 5 : prev));
    };

    useEffect(() => {
        if (counter < 100) {
            const timeout = setTimeout(updateCounter, 100);
            return () => clearTimeout(timeout);
        }
    }, [counter]);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 mt-8 font-poppins">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fadeIn">
                <h3 className="text-lg font-semibold text-[#3B78BD] dark:text-[#F0B652] mb-4">Progress Overview</h3>
                <ProgressBar
                    completed={counter}
                    bgColor="#3B78BD"
                    height="20px"
                    borderRadius="10px"
                    baseBgColor="#e5e7eb"
                    labelColor="#ffffff"
                    animateOnRender={true}
                    className="transition-all duration-300"
                />
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProgressBarComponent;