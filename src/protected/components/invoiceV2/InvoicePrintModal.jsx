import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaFileInvoiceDollar, FaCheckCircle, FaCalendarAlt, FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const InvoicePrintModal = ({ invoice, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Generate QR code for invoice verification
    const verificationUrl = `${window.location.origin}/verify-invoice/${invoice.invoice_number}`;
    const qrData = verificationUrl;

    const getStatusBadge = (status) => {
        const statusColors = {
            draft: 'bg-gray-100 text-gray-800 border-gray-300',
            issued: 'bg-blue-100 text-blue-800 border-blue-300',
            paid: 'bg-green-100 text-green-800 border-green-300',
            partially_paid: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            overdue: 'bg-red-100 text-red-800 border-red-300',
            cancelled: 'bg-red-100 text-red-800 border-red-300',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const statusColors = {
            unpaid: 'bg-red-100 text-red-800 border-red-300',
            partially_paid: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            paid: 'bg-green-100 text-green-800 border-green-300',
        };
        return statusColors[paymentStatus] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    return (
        <>
            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 10mm;
                    }

                    body {
                        margin: 0;
                        padding: 0;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .invoice-print-area {
                        display: block !important;
                    }

                    /* Ensure colors print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    /* Remove modal styling for print */
                    .fixed, .rounded-2xl, .shadow-2xl {
                        position: static !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }
                }

                .gradient-header {
                    background: linear-gradient(135deg, #0d544c 0%, #3B78BD 100%);
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            `}</style>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
                <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl max-h-[95vh] overflow-y-auto">
                    <div className="invoice-print-area bg-white p-8">
                        {/* Header with Gradient */}
                        <div className="gradient-header text-white rounded-t-lg p-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">YENAGOA LOCAL GOVERNMENT</h1>
                                    <h2 className="text-xl font-semibold mb-2">Revenue Department</h2>
                                    <p className="text-sm opacity-90">Bayelsa State, Nigeria</p>
                                </div>
                                <div className="text-right">
                                    <FaFileInvoiceDollar className="inline-block text-5xl mb-2 opacity-80" />
                                    <p className="text-sm font-semibold">OFFICIAL INVOICE</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Number and Status */}
                        <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-gray-200">
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Invoice Number</p>
                                <p className="text-2xl font-bold text-[#0d544c]">{invoice.invoice_number}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-col gap-2 items-end">
                                    <span className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 ${getStatusBadge(invoice.status)}`}>
                                        {invoice.status?.toUpperCase() || 'N/A'}
                                    </span>
                                    <span className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 ${getPaymentStatusBadge(invoice.payment_status)}`}>
                                        {invoice.payment_status?.replace('_', ' ').toUpperCase() || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bill To and Invoice Details Grid */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            {/* Bill To Section */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center">
                                    {invoice.payer_type === 'individual' ? (
                                        <><FaUser className="mr-2 text-[#0d544c]" /> Bill To (Individual)</>
                                    ) : (
                                        <><FaBuilding className="mr-2 text-[#0d544c]" /> Bill To (Corporate)</>
                                    )}
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{invoice.payer_name || 'N/A'}</p>
                                    </div>
                                    {invoice.payer_phone && (
                                        <div className="flex items-start">
                                            <FaPhone className="mr-2 mt-1 text-gray-500 text-sm" />
                                            <p className="text-sm text-gray-700">{invoice.payer_phone}</p>
                                        </div>
                                    )}
                                    {invoice.payer_email && (
                                        <div className="flex items-start">
                                            <FaEnvelope className="mr-2 mt-1 text-gray-500 text-sm" />
                                            <p className="text-sm text-gray-700">{invoice.payer_email}</p>
                                        </div>
                                    )}
                                    {invoice.payer_address && (
                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="mr-2 mt-1 text-gray-500 text-sm" />
                                            <p className="text-sm text-gray-700">{invoice.payer_address}</p>
                                        </div>
                                    )}
                                    {invoice.payer_reference && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase">Reference</p>
                                            <p className="text-sm font-semibold text-gray-900">{invoice.payer_reference}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Invoice Details Section */}
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-[#0d544c]" /> Invoice Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Issue Date</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.issue_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Due Date</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.due_date)}</p>
                                    </div>
                                    {invoice.created_by_name && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Created By</p>
                                            <p className="text-sm font-semibold text-gray-900">{invoice.created_by_name}</p>
                                        </div>
                                    )}
                                    {invoice.created_at && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Created On</p>
                                            <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.created_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Title and Description */}
                        {(invoice.title || invoice.description) && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#0d544c]">
                                {invoice.title && (
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{invoice.title}</h3>
                                )}
                                {invoice.description && (
                                    <p className="text-sm text-gray-700">{invoice.description}</p>
                                )}
                            </div>
                        )}

                        {/* Line Items Table */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 border-b-2 border-gray-200 pb-2">
                                Invoice Items
                            </h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white">
                                        <th className="text-left px-4 py-3 text-sm font-semibold">#</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Description</th>
                                        <th className="text-left px-4 py-3 text-sm font-semibold">Revenue Head</th>
                                        <th className="text-center px-4 py-3 text-sm font-semibold">Category</th>
                                        <th className="text-center px-4 py-3 text-sm font-semibold">Qty</th>
                                        <th className="text-right px-4 py-3 text-sm font-semibold">Unit Price</th>
                                        <th className="text-right px-4 py-3 text-sm font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items && invoice.items.length > 0 ? (
                                        invoice.items.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    <div>
                                                        <p className="font-semibold">{item.description || 'N/A'}</p>
                                                        {(item.monnify_product_code || item.metadata?.monnify_product_code) && (
                                                            <p className="text-xs text-gray-500 mt-1">Code: {item.monnify_product_code || item.metadata?.monnify_product_code}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {item.revenueHead?.name || item.revenue_head_name || item.metadata?.revenue_head_name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        (item.category || item.metadata?.category) === 'One-Off'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {item.category || item.metadata?.category || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                                    {item.quantity || 1}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                    {formatCurrency(item.unit_price)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                                    {formatCurrency(item.subtotal)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                                                No items found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end mb-8">
                            <div className="w-80">
                                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                                            <span className="text-lg font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</span>
                                        </div>
                                        <div className="border-t border-gray-300 pt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Amount Paid:</span>
                                                <span className="text-lg font-semibold text-green-600">{formatCurrency(invoice.amount_paid)}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Balance Due:</span>
                                                <span className="text-lg font-semibold text-red-600">{formatCurrency(invoice.balance)}</span>
                                            </div>
                                        </div>
                                        <div className="border-t-2 border-gray-300 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-bold text-gray-900">TOTAL AMOUNT:</span>
                                                <span className="text-2xl font-bold text-[#0d544c]">{formatCurrency(invoice.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {invoice.notes && (
                            <div className="mb-8 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Notes</h3>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
                            </div>
                        )}

                        {/* Payment Information */}
                        {invoice.payments && invoice.payments.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 border-b-2 border-gray-200 pb-2">
                                    Payment History
                                </h3>
                                <div className="space-y-2">
                                    {invoice.payments.map((payment, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(payment.amount)} - {payment.payment_method || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-600">{formatDate(payment.payment_date)}</p>
                                                {payment.reference && (
                                                    <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                                                )}
                                            </div>
                                            <FaCheckCircle className="text-green-600 text-xl" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer with QR Code */}
                        <div className="border-t-2 border-gray-300 pt-6 mt-8">
                            <div className="flex justify-between items-end">
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Important Information</h3>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <p>• Payment is due by the due date specified above</p>
                                        <p>• Late payments may attract penalties as per LGA regulations</p>
                                        <p>• For inquiries, contact Yenagoa LGA Revenue Department</p>
                                        <p>• Keep this invoice for your records</p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-500">
                                            Generated on: {formatDate(new Date())}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center ml-6">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Scan to Verify</p>
                                    <div className="bg-white p-2 rounded-lg border-2 border-gray-200 inline-block">
                                        <QRCodeSVG
                                            value={qrData}
                                            size={100}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 max-w-[120px]">
                                        Invoice: {invoice.invoice_number}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Official Stamp Area */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-3">Authorized Signature</p>
                                    <div className="border-b-2 border-gray-300 pb-1 mb-2"></div>
                                    <p className="text-xs text-gray-500">Revenue Officer</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-3">Official Stamp</p>
                                    <div className="border-2 border-dashed border-gray-300 h-20 rounded flex items-center justify-center">
                                        <p className="text-xs text-gray-400">LGA Official Stamp</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Watermark for Draft/Cancelled */}
                        {(invoice.status === 'draft' || invoice.status === 'cancelled') && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                <p className="text-9xl font-bold text-gray-500 rotate-[-45deg]">
                                    {invoice.status?.toUpperCase()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons - Not printed */}
                    <div className="no-print p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold"
                        >
                            Close
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoicePrintModal;
