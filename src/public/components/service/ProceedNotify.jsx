import React from 'react';
import { MdArrowForwardIos } from 'react-icons/md';

const ProceedNotify = ({ handleChildUpdate }) => {
    return (
        <div className="space-y-6">
            <div className="mt-6 flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h1 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Don't have an account?</h1>
                <button
                    className="w-[130px] flex justify-around px-3 py-1.5 bg-[#F0B652] rounded-3xl text-white hover:bg-[#3B78BD] transition-all duration-300 items-center text-lg"
                    onClick={() => handleChildUpdate('register')}
                >
                    <span>Proceed</span>
                    <MdArrowForwardIos size={15} />
                </button>
            </div>

            <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Have an account?</h1>
                    <p className="text-gray-500 dark:text-gray-400">You'll continue where you left off</p>
                </div>
                <button
                    className="w-[130px] flex justify-around px-3 py-1.5 bg-[#3B78BD] rounded-3xl text-white hover:bg-[#F0B652] transition-all duration-300 items-center text-lg"
                    onClick={() => handleChildUpdate('login')}
                >
                    <span>Sign in first</span>
                </button>
            </div>
        </div>
    );
};

export default ProceedNotify;