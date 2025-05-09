import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GrFormPreviousLink } from 'react-icons/gr';
import { FaPrint, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'; // Added icons for expiration and print
import { verifyReceipt } from '../../apis/noAuthActions';
import ButtonLoader from '../../common/ButtonLoader';
import logo from '../../assets/logo-bayelsa.png';

const ReceiptVerificationComponent = () => {
    const location = useLocation();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Extract the 'ref' query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    const ref = queryParams.get('ref');

    useEffect(() => {
        if (ref) {
            const fetchReceipt = async () => {
                setLoading(true);
                setError(null);
                setSuccess(null);

                try {
                    await verifyReceipt(ref, setSuccess, setError, setLoading);
                } catch (err) {
                    setError('No Response from Server');
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchReceipt();
        } else {
            setError('No reference number provided. Please provide a valid receipt reference to verify.');
        }
    }, [ref]);

    // Function to format dates safely
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toString() !== 'Invalid Date' ? date.toLocaleDateString('en-GB') : 'Invalid Date';
    };

    // Function to handle print/download
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center px-4 md:px-0 bg-gray-100 dark:bg-gray-900 animate-slideIn">
            <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="mb-6">
                    <Link to="/" className="group">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md group-hover:shadow-lg transition-all">
                                <GrFormPreviousLink size={24} className="text-[#3B78BD] dark:text-[#F0B652]" />
                            </div>
                            <span className="text-[#3B78BD] dark:text-[#F0B652] font-medium group-hover:underline">
                                Back to Home
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="h-10" />
                </div>

                <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-6">
                    Receipt Verification
                </h1>

                {loading && (
                    <div className="flex justify-center">
                        <ButtonLoader />
                    </div>
                )}

                {error !== null && (
                    <div className="text-center">
                        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                        <Link
                            to="/status-check"
                            className="text-[#3B78BD] dark:text-[#F0B652] hover:underline"
                        >
                            Go to Status Check
                        </Link>
                    </div>
                )}

                {success !== null && (
                    <div className="space-y-6">
                        {success.status === 'success' ? (
                            <div className="w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652]">{success.message}</h2>
                                    <button
                                        onClick={handlePrint}
                                        className="flex items-center space-x-2 text-[#3B78BD] dark:text-[#F0B652] hover:underline"
                                    >
                                        <FaPrint size={20} />
                                        <span>Print Receipt</span>
                                    </button>
                                </div>
                                <table className="w-full border-collapse">
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Transaction ID:</td>
                                            <td className="py-2 px-4">{success.receipt.transaction_id || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Invoice Reference:</td>
                                            <td className="py-2 px-4">{success.receipt.reference_number || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Purpose:</td>
                                            <td className="py-2 px-4">{success.receipt.purpose || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Description:</td>
                                            <td className="py-2 px-4">{success.receipt.description || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Amount:</td>
                                            <td className="py-2 px-4">
                                                ₦{success.receipt.amount ? Number(success.receipt.amount).toLocaleString() : 'N/A'}
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Payment Method:</td>
                                            <td className="py-2 px-4">{success.receipt.payment_method || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Payer:</td>
                                            <td className="py-2 px-4">{success.receipt.payer_name || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Date Paid:</td>
                                            <td className="py-2 px-4">{formatDate(success.receipt.paid_at)}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Payment Type:</td>
                                            <td className="py-2 px-4">{success.receipt.payment_type || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Validity Period:</td>
                                            <td className="py-2 px-4">
                                                {success.receipt.validity_period_days ? `${success.receipt.validity_period_days} days` : 'N/A'}
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Expires On:</td>
                                            <td className="py-2 px-4">{formatDate(success.receipt.expires_at)}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100">Status:</td>
                                            <td className={`py-2 px-4 text-${success.receipt.status === 'paid' ? '[#F0B652]' : '[#3B78BD]'} font-semibold`}>
                                                {success.receipt.status || 'N/A'}
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="font-bold text-[#3B78BD] dark:text-[#F0B652] py-2 px-4 bg-gray-100 flex items-center space-x-2">
                                                <span>Expired:</span>
                                                {success.receipt.is_expired ? (
                                                    <FaExclamationTriangle className="text-red-500" />
                                                ) : (
                                                    <FaCheckCircle className="text-green-500" />
                                                )}
                                            </td>
                                            <td className={`py-2 px-4 ${success.receipt.is_expired ? 'text-red-500' : 'text-green-500'} font-semibold`}>
                                                {success.receipt.is_expired ? 'Yes' : 'No'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {success.support_message && (
                                    <p className="mt-4 text-gray-600 dark:text-gray-300">{success.support_message}</p>
                                )}
                            </div>
                        ) : success.status === 'error' ? (
                            <div className="text-center">
                                <p className="text-red-500 dark:text-red-400 mb-4">{success.message}</p>
                                {success.error && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Error: {success.error}</p>
                                )}
                                {success.message.includes('reference number') && (
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        Reference Number: <strong>{success.message.match(/'(\w+)'/)[1]}</strong>
                                    </p>
                                )}
                                <Link
                                    to="/status-check"
                                    className="text-[#3B78BD] dark:text-[#F0B652] hover:underline mt-4 block"
                                >
                                    Go to Status Check
                                </Link>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    For assistance, contact support with the reference number above.
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            <style>
                {`
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
                    @media print {
                        .no-print { display: none; }
                        .print-receipt { display: block; }
                    }
                `}
            </style>
        </div>
    );
};

export default ReceiptVerificationComponent;