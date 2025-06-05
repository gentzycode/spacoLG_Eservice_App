import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GrFormPreviousLink } from 'react-icons/gr';
import { getPublicApplicationStatus, verifyReceipt } from '@/apis/noAuthActions';
import ButtonLoader from '@/common/ButtonLoader';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import PaymentReceiptModal from '@/protected/components/invoices/PaymentReceiptModal';
import Loader from '@/common/Loader';

const StatusCheckComponent = () => {
    const loc = useLocation();
    const [refno, setRefno] = useState('');
    const [checkType, setCheckType] = useState('application');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showinfo, setShowinfo] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const receiptRef = useRef(null);

    const toggleInfo = () => setShowinfo(!showinfo);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Setting loading to true');
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (checkType === 'application') {
                await getPublicApplicationStatus(refno, setSuccess, setError);
            } else if (checkType === 'payment') {
                await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3-second delay for testing
                await verifyReceipt(refno, setSuccess, setError);
            }
        } catch (err) {
            setError('No Response from Server');
            console.log(err);
        } finally {
            console.log('Setting loading to false');
            setLoading(false);
        }
    };

    const handlePrint = () => {
        if (checkType === 'payment' && success?.receipt) setShowReceiptModal(true);
    };

    const closeReceiptModal = () => setShowReceiptModal(false);

    return (
        <div className="w-full col-span-1 mt-16 my-0 md:my-8 flex justify-center px-4 md:px-0 animate-slideIn">
            <div className={`w-full ${loc.pathname === '/status-check' ? 'md:w-2/3' : ''}`}>
                {loc.pathname === '/status-check' ? (
                    <div className="mt-8">
                        <Link to="/" className="group">
                            <div className="flex items-center space-x-2">
                                <div className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md group-hover:shadow-lg transition-all">
                                    <GrFormPreviousLink size={24} className="text-[#3B78BD] dark:text-[#F0B652]" />
                                </div>
                                <span className="text-[#3B78BD] dark:text-[#F0B652] font-medium group-hover:underline">Back to Home</span>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="mt-2">
                        <div className="bg-white dark:bg-gray-700 rounded-full p-2 w-max cursor-pointer">
                            <GrFormPreviousLink size={24} className="text-[#3B78BD] dark:text-[#F0B652]" />
                        </div>
                    </div>
                )}
                <div className="w-full relative">
                    {loc.pathname === '/status-check' && (
                        <h1 className="mt-10 text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">Check Status</h1>
                    )}
                    {error && <p className="text-red-500 dark:text-red-400 mt-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="w-full my-8 flex flex-col space-y-4">
                            <select
                                className="w-full p-4 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B78BD] transition-all"
                                value={checkType}
                                onChange={(e) => setCheckType(e.target.value)}
                            >
                                <option value="application">Application Status</option>
                                <option value="payment">Payment Receipt Verification</option>
                            </select>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder={checkType === 'application' ? 'Enter application reference' : 'Enter payment reference'}
                                    className="w-full p-4 rounded-l-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B78BD] transition-all"
                                    required
                                    value={refno}
                                    onChange={(e) => setRefno(e.target.value)}
                                />
                                {loading ? (
                                    <button className="flex justify-center rounded-r-md w-[150px] py-4 text-white bg-[#3B78BD] hover:bg-[#F0B652] transition-all duration-300">
                                        <ButtonLoader />
                                    </button>
                                ) : (
                                    <button className="rounded-r-md w-[150px] py-4 text-white bg-[#3B78BD] hover:bg-[#F0B652] transition-all duration-300">
                                        Check
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    <div className="w-full">
                        {success && (
                            <div className="my-4 space-y-6">
                                {checkType === 'application' ? (
                                    <>
                                        <div className="w-full flex space-x-3 items-center">
                                            <span className="text-gray-600 dark:text-gray-300 font-semibold">Status:</span>
                                            <span
                                                className={`uppercase ${
                                                    success?.status?.step?.flag === 'D_CERT' ? 'text-[#F0B652]' : 'text-[#3B78BD]'
                                                } font-semibold`}
                                            >
                                                {success?.status?.step?.step_name}
                                            </span>
                                        </div>
                                        <div className="w-full h-3 rounded-full border border-gray-400 dark:border-gray-600 overflow-hidden">
                                            {success?.status?.step?.flag === 'D_CERT' ? (
                                                <div className="w-full h-full bg-[#F0B652] rounded-full animate-progress"></div>
                                            ) : (
                                                <div
                                                    className={`${
                                                        success?.status?.order_no < 5 ? 'w-[30%]' : 'w-[70%]'
                                                    } h-full bg-[#3B78BD] rounded-full animate-progress`}
                                                ></div>
                                            )}
                                        </div>
                                        <div className="w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
                                            <div className="my-2 flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">LGA:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success?.local_government?.name}</span>
                                            </div>
                                            <div className="my-2 flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Application:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success?.eservice?.name}</span>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <span
                                                className="text-[#3B78BD] dark:text-[#F0B652] cursor-pointer hover:underline"
                                                onClick={toggleInfo}
                                            >
                                                Click to preview the application detail
                                            </span>
                                        </div>
                                        {showinfo && (
                                            <div className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 p-6 text-gray-600 dark:text-gray-300 shadow-md">
                                                <h1 className="flex justify-between items-center uppercase font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                                                    <span className="text-gray-700 dark:text-gray-300">Application Request Preview</span>
                                                    <span
                                                        className="cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 transition-colors"
                                                        onClick={toggleInfo}
                                                    >
                                                        <AiOutlineCloseCircle size={20} />
                                                    </span>
                                                </h1>
                                                {success?.form_submission ? (
                                                    Object.keys(JSON.parse(success.form_submission.data)).map((key, i) =>
                                                        key !== 'user_id' && (
                                                            <div key={i} className="flex space-x-3 py-2">
                                                                <span className="font-semibold capitalize">{key.replace('_', ' ').replace('_', ' ')}:</span>
                                                                <span>
                                                                    {JSON.parse(success.form_submission.data)[key] === 'on'
                                                                        ? 'Yes'
                                                                        : JSON.parse(success.form_submission.data)[key]}
                                                                </span>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div className="text-gray-700 dark:text-gray-400">
                                                        No detail found on this application because registration form has not been completed
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : checkType === 'payment' && success?.receipt ? (
                                    <div ref={receiptRef} className="w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
                                        {success.receipt.is_expired ? (
                                            <div className="mb-4 p-2 bg-red-500 text-white text-center rounded-md font-bold">
                                                EXPIRED
                                            </div>
                                        ) : (
                                            <div className="mb-4 p-2 bg-green-500 text-white text-center rounded-md font-bold">
                                                VALID
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652]">{success.message}</h2>
                                            <button
                                                onClick={handlePrint}
                                                className="bg-[#3B78BD] hover:bg-[#F0B652] text-white py-1 px-3 rounded text-sm transition-all duration-300 no-print"
                                            >
                                                Print
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Transaction ID:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.transaction_id || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Invoice Reference:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.reference_number || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Purpose:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.purpose || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Description:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.description || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Amount:</span>
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    ₦{success.receipt.amount ? Number(success.receipt.amount).toLocaleString() : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Payment Method:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.payment_method || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Payer Name:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.payer_name || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Processed By:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.payee_name || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Date Paid:</span>
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {new Date(success.receipt.paid_at).toLocaleDateString('en-GB') || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Payment Type:</span>
                                                <span className="text-gray-600 dark:text-gray-300">{success.receipt.payment_type || 'N/A'}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Validity Period:</span>
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {success.receipt.validity_period_days ? `${success.receipt.validity_period_days} days` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Expires On:</span>
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {success.receipt.expires_at ? new Date(success.receipt.expires_at).toLocaleDateString('en-GB') : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Expired:</span>
                                                <span className={`text-${success.receipt.is_expired ? 'red-500' : 'green-500'} font-semibold`}>
                                                    {success.receipt.is_expired ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <span className="font-bold text-gray-600 dark:text-gray-300">Status:</span>
                                                <span
                                                    className={`text-${success.receipt.status === 'paid' ? '[#F0B652]' : '[#3B78BD]'} font-semibold`}
                                                >
                                                    {success.receipt.status || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        {success.support_message && <p className="mt-4 text-gray-600 dark:text-gray-300">{success.support_message}</p>}
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-[9999]">
                    <Loader />
                </div>
            )}
            {showReceiptModal && success?.receipt && <PaymentReceiptModal paymentData={success.receipt} onClose={closeReceiptModal} />}
            <style jsx>{`
                @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes progress { from { width: 0; } to { width: inherit; } }
                .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
                .animate-progress { animation: progress 1s ease-out forwards; }
                .no-print { display: block; }
                @media print { .no-print { display: none !important; } body { background: #ffffff !important; -webkit-print-color-adjust: exact; } }
            `}</style>
        </div>
    );
};

export default StatusCheckComponent;