// src/protected/components/reports/ExportButton.jsx
import React from 'react';

const ExportButton = ({ onExport }) => {
    return (
        <div className="flex justify-end animate-fadeIn">
            <button
                className="px-6 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md transition-all duration-300 shadow-lg transform hover:scale-105"
                onClick={onExport}
            >
                Export Data
            </button>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ExportButton;