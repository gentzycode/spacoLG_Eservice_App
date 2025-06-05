import React from 'react';

const PaymentReceiptModal = ({ paymentData, onClose }) => {
    const safePaymentData = {
        transaction_id: paymentData.transaction_id || `TXN-${Math.floor(Math.random() * 1000000)}`,
        reference_number: paymentData.reference_number || paymentData.invoice_ref || 'N/A',
        amount: paymentData.amount || 0,
        payment_method: paymentData.payment_method || 'N/A',
        payer_name: paymentData.payer_name || 'N/A',
        payee_name: paymentData.payee_name || 'N/A',
        paid_at: paymentData.paid_at || paymentData.date || new Date().toISOString().split('T')[0],
        status: paymentData.status || 'paid',
        purpose: paymentData.purpose || 'N/A',
        description: paymentData.description || 'N/A',
        validity_period_days: paymentData.validity_period_days || null,
        expires_at: paymentData.expires_at || null,
        payment_type: paymentData.payment_type || 'N/A',
        is_expired: paymentData.is_expired || false,
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>Receipt</title></head>
                <body>
                    <h2>Payment Receipt</h2>
                    <p><strong>Transaction ID:</strong> ${safePaymentData.transaction_id}</p>
                    <p><strong>Reference Number:</strong> ${safePaymentData.reference_number}</p>
                    <p><strong>Payer Name:</strong> ${safePaymentData.payer_name}</p>
                    <p><strong>Processed By:</strong> ${safePaymentData.payee_name}</p>
                    <p><strong>Amount:</strong> ₦${Number(safePaymentData.amount).toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> ${safePaymentData.payment_method}</p>
                    <p><strong>Paid At:</strong> ${safePaymentData.paid_at}</p>
                    <p><strong>Status:</strong> ${safePaymentData.status}</p>
                    <p><strong>Purpose:</strong> ${safePaymentData.purpose}</p>
                    <p><strong>Description:</strong> ${safePaymentData.description}</p>
                    ${safePaymentData.expires_at ? `<p><strong>Expires At:</strong> ${safePaymentData.expires_at}</p>` : ''}
                    <p><strong>Payment Type:</strong> ${safePaymentData.payment_type}</p>
                    <p><strong>Expired:</strong> ${safePaymentData.is_expired ? 'Yes' : 'No'}</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Payment Receipt</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Transaction ID:</span>
                        <span>{safePaymentData.transaction_id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Reference Number:</span>
                        <span>{safePaymentData.reference_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Payer Name:</span>
                        <span>{safePaymentData.payer_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Processed By:</span>
                        <span>{safePaymentData.payee_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span>
                        <span>₦{Number(safePaymentData.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Payment Method:</span>
                        <span>{safePaymentData.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Paid At:</span>
                        <span>{safePaymentData.paid_at}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                        <span>{safePaymentData.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Purpose:</span>
                        <span>{safePaymentData.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                        <span>{safePaymentData.description}</span>
                    </div>
                    {safePaymentData.expires_at && (
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Expires At:</span>
                            <span>{safePaymentData.expires_at}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Payment Type:</span>
                        <span>{safePaymentData.payment_type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Expired:</span>
                        <span>{safePaymentData.is_expired ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652]"
                        onClick={handlePrint}
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceiptModal;