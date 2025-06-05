import React, { useState } from 'react';
import { format } from 'date-fns';
import { getPayerInvoices } from '../../../apis/authActions';
import InvoiceTable from './InvoiceTable';

const PayerInvoices = ({ onPay, onPrint, onView }) => {
    const [referenceNumber, setReferenceNumber] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

    const handleSearch = async (e, page = 1) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const params = { page, per_page: 10 };
            const response = await getPayerInvoices(
                localStorage.getItem('token'),
                referenceNumber,
                params,
                setError,
                setLoading
            );
            setInvoices(response.invoices?.data || []);
            setActivityLog(response.activity_log || []);
            setPagination({
                current_page: response.invoices?.current_page || 1,
                last_page: response.invoices?.last_page || 1,
            });
        } catch (err) {
            setError(err.message || 'Failed to load payer invoices');
            setInvoices([]);
            setActivityLog([]);
        }
    };

    const handlePageChange = (page) => {
        handleSearch({ preventDefault: () => {} }, page);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Payer Invoices</h3>
            <form onSubmit={handleSearch} className="mb-4 flex gap-4">
                <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter payer reference number"
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 flex-grow"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652] disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <InvoiceTable
                invoices={invoices}
                loading={loading}
                error={null}
                onPay={onPay}
                onPrint={onPrint}
                onView={onView}
            />
            {pagination.last_page > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded ${page === pagination.current_page ? 'bg-[#3B78BD] text-white' : 'bg-gray-200 hover:bg-[#F0B652]'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
            {activityLog.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Activity Log</h4>
                    <ul className="space-y-2">
                        {activityLog.map((log) => (
                            <li key={log.id} className="text-gray-600 dark:text-gray-300">
                                {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')} - {log.action}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PayerInvoices;