import React, { useState } from 'react';

const InputModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    message,
    placeholder = '',
    confirmText = 'Submit',
    cancelText = 'Cancel',
    inputType = 'text',
    required = true,
    multiline = false,
    loading = false
}) => {
    const [value, setValue] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (required && !value.trim()) return;
        onSubmit(value);
        setValue('');
    };

    const handleClose = () => {
        setValue('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
                {message && <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>}

                {multiline ? (
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        autoFocus
                    />
                ) : (
                    <input
                        type={inputType}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || (required && !value.trim())}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputModal;
