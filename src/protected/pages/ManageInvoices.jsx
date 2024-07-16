import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import InvoiceStatistics from '../components/invoices/InvoiceStatistics';
import InvoiceHistory from '../components/invoices/InvoiceHistory';
import GenerateInvoiceModal from '../components/invoices/GenerateInvoiceModal';
import PayInvoiceModal from '../components/invoices/PayInvoiceModal';
import { getInvoiceStatistics } from '../../apis/authActions';

const ManageInvoices = () => {
    const { token, user } = useContext(AuthContext);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);

    useEffect(() => {
        if (user) {
            getInvoiceStatistics(token, user.id, setStatistics, setError, setLoading);
        }
    }, [token, user]);

    const handleGenerateClick = () => {
        setShowGenerateModal(true);
    };

    const handlePayClick = () => {
        setShowPayModal(true);
    };

    return (
        <div className="w-full">
            {error && <span className='text-red-600'>{error}</span>}
            {loading ? <div>Loading...</div> : (
                <div className="mt-8">
                    <InvoiceStatistics statistics={statistics} />
                    <div className="w-full flex justify-end my-4 space-x-4">
                        <button
                            className='w-[160px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#0d544c] hover:bg-green-700 text-white cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105'
                            onClick={handleGenerateClick}
                        >
                            Generate Invoice
                        </button>
                        <button
                            className='w-[160px] flex justify-center items-center space-x-2 rounded-md py-2 px-4 bg-[#0d544c] hover:bg-green-700 text-white cursor-pointer transition-all duration-300 shadow-lg transform hover:scale-105'
                            onClick={handlePayClick}
                        >
                            Pay Invoice
                        </button>
                    </div>
                    <InvoiceHistory token={token} agentId={user.id} />
                </div>
            )}
            {showGenerateModal && (
                <GenerateInvoiceModal
                    closeModal={() => setShowGenerateModal(false)}
                />
            )}
            {showPayModal && (
                <PayInvoiceModal
                    closeModal={() => setShowPayModal(false)}
                />
            )}
        </div>
    );
};

export default ManageInvoices;
