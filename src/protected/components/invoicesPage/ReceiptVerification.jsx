import React, { useState } from 'react';
import { verifyReceipt } from '../../../apis/authActions';

const ReceiptVerification = ({ onPrint }) => {
    const [referenceNumber, setReferenceNumber] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            await verifyReceipt(
                localStorage.getItem('token'),
                referenceNumber,
                setResult,
                setError,
                setLoading
            );
        } catch (err) {
            setError(err.message || 'Failed to verify receipt');
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Verify Receipt</h3>
            <form onSubmit={handleVerify} className="mb-4 flex gap-4">
                <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter invoice reference number"
                    className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 flex-grow"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652] disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {result && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200 mb-2">{result.message}</p>
                    {result.status === 'success' && result.receipt && (
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Receipt Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Transaction ID:</span> {result.receipt.transaction_id}
                                </div>
                                <div>
                                    <span className="font-medium">Reference Number:</span> {result.receipt.reference_number}
                                </div>
                                <div>
                                    <span className="font-medium">Payer:</span> {result.receipt.payer_name}
                                </div>
                                <div>
                                    <span className="font-medium">Payee:</span> {result.receipt.payee_name}
                                </div>
                                <div>
                                    <span className="font-medium">Amount:</span> ₦{Number(result.receipt.amount).toLocaleString()}
                                </div>
                                <div>
                                    <span className="font-medium">Payment Method:</span> {result.receipt.payment_method}
                                </div>
                                <div>
                                    <span className="font-medium">Paid At:</span> {result.receipt.paid_at}
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span> {result.receipt.status}
                                </div>
                            </div>
                            <button
                                className="mt-4 px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652]"
                                onClick={() => onPrint(result.receipt)}
                            >
                                Print Receipt
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReceiptVerification;