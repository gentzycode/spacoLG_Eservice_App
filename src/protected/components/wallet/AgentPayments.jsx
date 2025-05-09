import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { getAgentPaymentHistory } from '@/apis/authActions';

const AgentPayments = () => {
    const { token } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        payment_gateway: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        fetchPaymentHistory();
    }, [filters]);

    const fetchPaymentHistory = async () => {
        await getAgentPaymentHistory(token, filters, setPayments, setError, setIsLoading);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4">
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="min-w-[200px]">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">
                        Payment Gateway
                    </label>
                    <select
                        name="payment_gateway"
                        value={filters.payment_gateway}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                    >
                        <option value="">All</option>
                        <option value="E-Wallet">E-Wallet</option>
                        <option value="Token">Token</option>
                        <option value="Cash">Cash</option>
                        <option value="Paystack">Paystack</option>
                        <option value="Interswitch">Interswitch</option>
                        <option value="Remita">Remita</option>
                    </select>
                </div>
                <div className="min-w-[200px]">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">
                        Start Date
                    </label>
                    <input
                        type="date"
                        name="start_date"
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                    />
                </div>
                <div className="min-w-[200px]">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">
                        End Date
                    </label>
                    <input
                        type="date"
                        name="end_date"
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
            )}

            {/* Payments Table */}
            {!isLoading && payments.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-300">No payments found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-[#3B78BD] dark:bg-[#F0B652] text-white">
                                <th className="p-4 text-left">Invoice Reference</th>
                                <th className="p-4 text-left">Payer Type</th>
                                <th className="p-4 text-left">Amount</th>
                                <th className="p-4 text-left">Payment Method</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Paid At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id} className="border-b dark:border-gray-700">
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        {payment.invoice?.reference_number || 'N/A'}
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        {payment.invoice?.payer_type || 'N/A'}
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        ₦{Number(payment.invoice?.amount || payment.amount).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        {payment.invoice?.payment_option_used || 'E-Wallet'}
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        {payment.status}
                                    </td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                        {payment.invoice?.paid_at ? new Date(payment.invoice.paid_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AgentPayments;