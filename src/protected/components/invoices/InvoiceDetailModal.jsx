import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { formatDate } from '../../../apis/functions';
import { PaystackButton } from 'react-paystack';
import logo from '../../../assets/abia512_512logo.png';

const InvoiceDetailModal = ({ invoice, token, agentId, onClose, onPaymentSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
        if (!publicKey) {
            setError('Paystack public key is missing. Please contact support.');
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    const handlePaystackSuccess = async (reference) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/auth/verify-inline-paystack', { reference }, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.data.success) {
                alert('Payment verified successfully!');
                onPaymentSuccess();
                onClose();
            } else {
                setError('Payment verification failed.');
            }
        } catch (err) {
            setError('Error verifying payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaystackClose = () => console.log('Payment dialog closed.');

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const paystackProps = publicKey
        ? {
              email: invoice.payer_email || 'example@example.com',
              amount: invoice.amount * 100, // Convert to kobo
              publicKey,
              reference: invoice.reference_number,
              onSuccess: (response) => handlePaystackSuccess(response.reference),
              onClose: handlePaystackClose,
          }
        : null;

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');
        const generateRandomNumber = () => Math.floor(Math.random() * 1000000);
        const randomNumber = generateRandomNumber();
        const watermarkText = `AUTHENTIC ${randomNumber}`;

        const printContent = `
            <div style="position: relative; border: 2px solid #000; border-radius: 8px; padding: 20px; margin: 10px;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.1; font-size: 60px; color: #000; pointer-events: none;">
                    ${watermarkText}
                </div>
                <div style="text-align: center; margin-bottom: 10px;">
                    <img src="${window.location.origin + logo}" alt="Logo" style="width: 50px; height: auto;" />
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td><strong>Reference Number:</strong></td><td>${invoice.reference_number}</td></tr>
                    <tr><td><strong>Amount:</strong></td><td>₦${Number(invoice.amount).toLocaleString()}</td></tr>
                    <tr><td><strong>Status:</strong></td><td>${invoice.status}</td></tr>
                    <tr><td><strong>Created At:</strong></td><td>${formatDate(invoice.created_at)}</td></tr>
                </table>
            </div>
        `;

        printWindow.document.write(`
            <html><head><title>Invoice</title><style>body { font-family: Arial, sans-serif; margin: 0; } table { width: 100%; } td { padding: 5px; }</style></head><body>${printContent}</body></html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '50' }}>
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto relative animate-fadeIn">
                <div ref={printRef} className="mb-6">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="Logo" className="h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] text-center mb-4">Invoice Details</h2>
                    <table className="w-full mb-6 border-collapse">
                        <tbody>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Reference Number:</td>
                                <td className="py-2 px-4">{invoice.reference_number}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Amount:</td>
                                <td className="py-2 px-4">₦{Number(invoice.amount).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Status:</td>
                                <td className="py-2 px-4">{invoice.status}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {invoice.status === 'unpaid' && paystackProps ? (
                    <div>
                        <PaystackButton {...paystackProps} className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-6 rounded transition-all duration-300" />
                    </div>
                ) : (
                    <div className="flex justify-end space-x-4">
                        <button onClick={handlePrint} className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-2 px-6 rounded transition-all duration-300">Print</button>
                        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-6 rounded transition-all duration-300">Close</button>
                    </div>
                )}
                {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
                <button onClick={onClose} className="absolute top-2 right-2 text-red-600 font-bold text-lg">×</button>
                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.6s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;