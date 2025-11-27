import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaCheckCircle, FaTicketAlt, FaCar, FaStore, FaCalendarAlt } from 'react-icons/fa';

const TicketReceipt = ({ ticket, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (datetime) => {
        return new Date(datetime).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Generate QR code as URL to public verification page
    const verificationUrl = `${window.location.origin}/verify-ticket/${ticket.ticket_number}`;
    const qrData = verificationUrl;

    return (
        <>
            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .receipt-print-area, .receipt-print-area * {
                        visibility: visible;
                    }
                    .receipt-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }

                @page {
                    size: A5;
                    margin: 10mm;
                }
            `}</style>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
                <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl max-h-[95vh] overflow-y-auto">
                    <div className="receipt-print-area bg-white p-8">
                        {/* Header */}
                        <div className="text-center border-b-4 border-green-600 pb-6 mb-6">
                            {/* Logo - temporarily removed due to path issues in print
                            <div className="flex items-center justify-center mb-4">
                                <img
                                    src="/src/assets/logo-bayelsa.png"
                                    alt="Bayelsa State Logo"
                                    className="h-20 w-20 object-contain"
                                />
                            </div>
                            */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">YENAGOA LOCAL GOVERNMENT</h1>
                            <h2 className="text-xl font-semibold text-green-700 mb-1">Revenue Collection Receipt</h2>
                            <p className="text-sm text-gray-600">Bayelsa State, Nigeria</p>
                        </div>

                        {/* Receipt Info Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Left Column */}
                            <div>
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Receipt Number</p>
                                    <p className="text-lg font-bold text-gray-900">{ticket.ticket_number}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Date Issued</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatDate(ticket.ticket_date)}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Time</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {ticket.ticket_time ? formatTime(ticket.ticket_time) : 'N/A'}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Collector</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {ticket.collector_name || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - QR Code */}
                            <div className="flex flex-col items-center justify-center">
                                <QRCodeSVG
                                    value={qrData}
                                    size={140}
                                    level="H"
                                    includeMargin={true}
                                    className="border-4 border-gray-200 rounded"
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">Scan to verify</p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-bold text-green-900 uppercase mb-3 flex items-center gap-2">
                                <FaCheckCircle className="text-green-600" />
                                Payment Details
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-green-700 mb-1">Category</p>
                                    <p className="text-sm font-semibold text-gray-900 capitalize">
                                        {ticket.category?.replace('_', ' ')}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-green-700 mb-1">Amount Paid</p>
                                    <p className="text-xl font-bold text-green-600">
                                        ₦{parseFloat(ticket.amount).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-green-700 mb-1">Payment Status</p>
                                    <p className="text-sm font-semibold">
                                        {ticket.payment_status === 'paid' ? (
                                            <span className="text-green-600">✓ PAID</span>
                                        ) : (
                                            <span className="text-yellow-600">PENDING</span>
                                        )}
                                    </p>
                                </div>

                                {ticket.payment_reference && (
                                    <div>
                                        <p className="text-xs text-green-700 mb-1">Payment Reference</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {ticket.payment_reference}
                                        </p>
                                    </div>
                                )}

                                {ticket.paid_at && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-green-700 mb-1">Payment Date</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatDate(ticket.paid_at)} at {formatTime(ticket.paid_at)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category-Specific Details */}
                        {(ticket.vehicle_plate_number || ticket.stall_number) && (
                            <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">
                                    {ticket.category === 'commercial_vehicle' || ticket.category === 'motor_park' ? (
                                        <span className="flex items-center gap-2">
                                            <FaCar className="text-blue-600" />
                                            Vehicle Information
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <FaStore className="text-purple-600" />
                                            Stall Information
                                        </span>
                                    )}
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {ticket.vehicle_plate_number && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Plate Number</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {ticket.vehicle_plate_number}
                                            </p>
                                        </div>
                                    )}

                                    {ticket.vehicle_type && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Vehicle Type</p>
                                            <p className="text-sm font-semibold text-gray-900 capitalize">
                                                {ticket.vehicle_type.replace('_', ' ')}
                                            </p>
                                        </div>
                                    )}

                                    {ticket.vehicle_registration && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Registration</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {ticket.vehicle_registration}
                                            </p>
                                        </div>
                                    )}

                                    {ticket.is_interstate && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Interstate</p>
                                            <p className="text-sm font-semibold text-blue-600">Yes</p>
                                        </div>
                                    )}

                                    {ticket.stall_number && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Stall Number</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {ticket.stall_number}
                                            </p>
                                        </div>
                                    )}

                                    {ticket.market_name && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Market</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {ticket.market_name}
                                            </p>
                                        </div>
                                    )}

                                    {ticket.stall_type && (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Stall Type</p>
                                            <p className="text-sm font-semibold text-gray-900 capitalize">
                                                {ticket.stall_type.replace('_', ' ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {ticket.notes && (
                            <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Notes</h3>
                                <p className="text-sm text-gray-700">{ticket.notes}</p>
                            </div>
                        )}

                        {/* Expiry Notice (if applicable) */}
                        {ticket.revenue_head?.validity_period && (
                            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                                <h3 className="text-sm font-bold text-yellow-900 uppercase mb-2 flex items-center gap-2">
                                    <FaCalendarAlt className="text-yellow-600" />
                                    Validity Period
                                </h3>
                                <p className="text-sm text-yellow-800">
                                    This receipt is valid for {ticket.revenue_head.validity_period} from the date of issue.
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Expires on: <span className="font-semibold">
                                        {(() => {
                                            const issueDate = new Date(ticket.ticket_date);
                                            issueDate.setDate(issueDate.getDate() + parseInt(ticket.revenue_head.validity_period));
                                            return formatDate(issueDate);
                                        })()}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="border-t-2 border-gray-300 pt-4 mt-6">
                            <p className="text-xs text-center text-gray-600 mb-2">
                                This is an official receipt from Yenagoa Local Government Revenue Department
                            </p>
                            <p className="text-xs text-center text-gray-500 mb-1">
                                For enquiries, contact: +234-XXX-XXX-XXXX | revenue@yenagoalga.gov.ng
                            </p>
                            <p className="text-xs text-center text-gray-400">
                                Generated on {formatDate(new Date())} at {formatTime(new Date())}
                            </p>
                        </div>

                        {/* Watermark for Unpaid Tickets */}
                        {ticket.payment_status !== 'paid' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                <p className="text-9xl font-bold text-red-500 transform -rotate-45">
                                    UNPAID
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons - Hidden in Print */}
                    <div className="bg-gray-100 px-8 py-4 flex justify-end gap-3 no-print">
                        <button
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                        >
                            Close
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                            </svg>
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TicketReceipt;
