import React from 'react';

const ExportButton = ({ onExport }) => {
    return (
        <div className="flex justify-end">
            <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={onExport}
            >
                Export Data
            </button>
        </div>
    );
};

export default ExportButton;
