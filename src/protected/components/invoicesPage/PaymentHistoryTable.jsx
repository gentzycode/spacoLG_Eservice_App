import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { getAgentPaymentHistory } from '../../../apis/authActions';
import { AuthContext } from '../../../context/AuthContext';

const PaymentHistoryTable = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [filters, setFilters] = useState({
        payment_gateway: '',
        start_date: '',
        end_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchPaymentHistory();
        }
    }, [filters, user]);

    const fetchPaymentHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filters.payment_gateway) params.payment_gateway = filters.payment_gateway;
            if (filters.start_date && filters.end_date) {
                params.start_date = filters.start_date;
                params.end_date = filters.end_date;
            }
            await getAgentPaymentHistory(
                localStorage.getItem('token'),
                user.id,
                params,
                setPayments,
                setError,
                setLoading
            );
        } catch (err) {
            setError('Failed to load payment history');
            console.error(err);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="text-center py-4 text-gray-700 dark:text-gray-300">Loading payment history...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Payment History</h3>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <select
                    name="payment_gateway"
                    value={filters.payment_gateway}
                    onChange={handleFilterChange}
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value="">All Payment Methods</option>
                    <option value="Token">Token</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Cash">Cash</option>
                    <option value="Paystack">Paystack</option>
                    <option value="Interswitch">Interswitch</option>
                    <option value="Remita">Remita</option>
                </select>
                <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
            {payments.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-400 text-center py-4">No payment history found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 border-b">Invoice Ref</th>
                                <th className="p-3 border-b">Amount</th>
                                <th className="p-3 border-b">Status</th>
                                <th className="p-3 border-b">Payment Method</th>
                                <th className="p-3 border-b">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="p-3">{payment.invoice_ref || 'N/A'}</td>
                                    <td className="p-3">₦{Number(payment.amount).toLocaleString()}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{payment.payment_method || 'N/A'}</td>
                                    <td className="p-3">{format(new Date(payment.date), 'dd/MM/yyyy')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentHistoryTable;