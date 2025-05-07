import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const PayerInsightsModal = ({ payer, closeModal }) => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [activityLog, setActivityLog] = useState([]);

    useEffect(() => {
        const fetchInsights = async () => {
            const mockPaymentHistory = [
                { id: 1, invoiceRef: 'INV001', amount: 5000, date: '2025-04-01', status: 'Paid' },
                { id: 2, invoiceRef: 'INV002', amount: 3000, date: '2025-04-15', status: 'Pending' }
            ];
            const mockActivityLog = [
                { id: 1, action: 'Created', timestamp: '2025-03-01 10:00 AM' },
                { id: 2, action: 'Updated Email', timestamp: '2025-03-15 02:30 PM' }
            ];
            setPaymentHistory(mockPaymentHistory);
            setActivityLog(mockActivityLog);
        };
        fetchInsights();
    }, [payer]);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100 hover:scale-105">
                <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white">Payer Insights: {payer.first_name || payer.company_name}</h2>
                    <button
                        className="text-white hover:text-gray-200 transition-colors duration-200"
                        onClick={(e) => { e.stopPropagation(); closeModal(); }}
                    >
                        <AiOutlineClose size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-2">Payment History</h3>
                    {paymentHistory.length === 0 ? (
                        <p className="text-gray-600">No payment history available.</p>
                    ) : (
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border border-gray-200">Invoice Ref</th>
                                    <th className="p-2 border border-gray-200">Amount</th>
                                    <th className="p-2 border border-gray-200">Date</th>
                                    <th className="p-2 border border-gray-200">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((payment, index) => (
                                    <tr key={payment.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-[#ecf6ec]'}>
                                        <td className="p-2 border border-gray-200">{payment.invoiceRef}</td>
                                        <td className="p-2 border border-gray-200">₦{payment.amount.toLocaleString()}</td>
                                        <td className="p-2 border border-gray-200">{payment.date}</td>
                                        <td className="p-2 border border-gray-200">{payment.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-2">Activity Log</h3>
                    {activityLog.length === 0 ? (
                        <p className="text-gray-600">No activity log available.</p>
                    ) : (
                        <ul className="space-y-2">
                            {activityLog.map((activity) => (
                                <li key={activity.id} className="p-2 bg-gray-50 rounded-lg">
                                    <span className="font-semibold">{activity.action}</span> - {activity.timestamp}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayerInsightsModal;