import React, { useEffect, useState, useRef } from 'react';
import { formatDate } from '../../../apis/functions';
import { PaystackButton } from 'react-paystack';
import axios from 'axios';
import logo from '../../../assets/abia512_512logo.png';

const InvoiceDetailModal = ({ invoice, token, agentId, onClose, onPaymentSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const printRef = useRef();

    const handlePaystackSuccess = async (reference) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                '/auth/verify-inline-paystack',
                { reference },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                alert('Payment verified successfully!');
                onPaymentSuccess();
                onClose();
            } else {
                setError('Payment verification failed.');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Error verifying payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaystackClose = () => {
        console.log('Payment dialog closed.');
    };

    const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
    const paystackProps = {
        email: invoice.payer_email || 'example@example.com',
        amount: invoice.amount * 100, // Convert to kobo
        publicKey,
        reference: invoice.reference_number,
        onSuccess: (response) => handlePaystackSuccess(response.reference),
        onClose: handlePaystackClose,
    };

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=500,width=300');
        printWindow.document.write('<html><head><title>Invoice</title>');
        printWindow.document.write('<style>@media print { body { margin: 0; font-size: 12px; } table { width: 100%; } }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto relative">
                <div ref={printRef} className="mb-6">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Invoice Details</h2>
                    <table className="w-full mb-6 border-collapse">
                        <tbody>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Reference Number:</td>
                                <td className="py-2 px-4">{invoice.reference_number}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Amount:</td>
                                <td className="py-2 px-4">₦{Number(invoice.amount).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-gray-600 py-2 px-4 bg-gray-100">Status:</td>
                                <td className="py-2 px-4">{invoice.status}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {invoice.status === 'unpaid' ? (
                    <div>
                        <PaystackButton {...paystackProps} className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-all duration-300" />
                    </div>
                ) : (
                    <div className="flex justify-end space-x-4">
                        <button onClick={handlePrint} className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-all duration-300">Print</button>
                        <button onClick={onClose} className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-all duration-300">Close</button>
                    </div>
                )}
                {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
                <button onClick={onClose} className="absolute top-2 right-2 text-red-600 font-bold text-lg">&times;</button>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;