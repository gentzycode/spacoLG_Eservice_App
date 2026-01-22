import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaShieldAlt, FaCheckCircle, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../../assets/logo-bayelsa.png';

const InvoicePrintModal = ({ invoice, onClose }) => {
    const [generating, setGenerating] = useState(false);

    const handleDownloadPDF = async () => {
        setGenerating(true);
        try {
            const invoiceElement = document.getElementById('invoice-pdf-content');
            if (!invoiceElement) {
                console.error('Invoice element not found');
                setGenerating(false);
                return;
            }

            const canvas = await html2canvas(invoiceElement, {
                scale: 2.5,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: invoiceElement.scrollWidth,
                windowHeight: invoiceElement.scrollHeight
            });

            const pdfWidth = 210;
            const pdfHeight = 297;
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`Invoice_${invoice.invoice_number}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGenerating(false);
        }
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

    const verificationUrl = `${window.location.origin}/verify-invoice/${invoice.invoice_number}`;

    // Generate security hash for display (first 8 chars of invoice number + timestamp)
    const securityHash = `${invoice.invoice_number}-${Date.now().toString(36).toUpperCase()}`.substring(0, 16);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                #invoice-pdf-content {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .security-pattern {
                    background-image:
                        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(13, 84, 76, 0.02) 10px, rgba(13, 84, 76, 0.02) 20px),
                        repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(59, 120, 189, 0.02) 10px, rgba(59, 120, 189, 0.02) 20px);
                }

                .premium-gradient {
                    background: linear-gradient(135deg, #0a3d35 0%, #0d544c 50%, #165449 100%);
                }

                .accent-gradient {
                    background: linear-gradient(90deg, #0d544c 0%, #3B78BD 100%);
                }

                .security-seal {
                    border: 3px double #0d544c;
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                }

                .holographic-effect {
                    position: relative;
                    overflow: hidden;
                }

                .holographic-effect::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg,
                        transparent 30%,
                        rgba(255, 255, 255, 0.1) 50%,
                        transparent 70%
                    );
                    transform: rotate(45deg);
                }
            `}</style>

            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl max-h-[95vh] overflow-y-auto">
                    <div id="invoice-pdf-content" className="bg-white">
                        {/* Premium Header */}
                        <div className="premium-gradient text-white px-10 py-8 relative overflow-hidden holographic-effect">
                            {/* Security Watermark */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="text-6xl font-bold transform rotate-[-30deg] mt-20">
                                    OFFICIAL DOCUMENT
                                </div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between">
                                    {/* Logo and Title */}
                                    <div className="flex items-center space-x-6">
                                        <div className="bg-white rounded-xl p-3 shadow-lg">
                                            <img src={logo} alt="Bayelsa Logo" className="h-20 w-20 object-contain" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold mb-1 tracking-tight">YENAGOA LOCAL GOVERNMENT</h1>
                                            <p className="text-lg font-semibold text-green-100">Revenue Department</p>
                                            <p className="text-sm text-green-200 mt-1">Bayelsa State, Federal Republic of Nigeria</p>
                                        </div>
                                    </div>

                                    {/* Invoice Type Badge */}
                                    <div className="text-right">
                                        <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-lg px-4 py-2 mb-2">
                                            <p className="text-xs font-semibold text-green-100">OFFICIAL TAX INVOICE</p>
                                        </div>
                                        <div className="flex items-center justify-end space-x-2 text-xs">
                                            <FaShieldAlt className="text-green-300" />
                                            <span className="text-green-200">Digitally Secured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Number Bar with Security Elements */}
                        <div className="accent-gradient px-10 py-4">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-xs opacity-80 mb-1">Invoice Number</p>
                                    <p className="text-2xl font-bold tracking-wider">{invoice.invoice_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs opacity-80 mb-1">Security Code</p>
                                    <p className="text-sm font-mono">{securityHash}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="px-10 py-8 security-pattern">
                            {/* Status and Date Row */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                {/* Billing Information */}
                                <div className="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-1 h-6 bg-gradient-to-b from-[#0d544c] to-[#3B78BD] rounded"></div>
                                        <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide">Bill To</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                                {invoice.payer_type === 'individual' ? 'Individual' : 'Corporate Entity'}
                                            </p>
                                            <p className="font-bold text-lg text-gray-900">{invoice.payer_name || 'N/A'}</p>
                                        </div>
                                        {invoice.payer_phone && (
                                            <p className="text-sm text-gray-600">📞 {invoice.payer_phone}</p>
                                        )}
                                        {invoice.payer_email && (
                                            <p className="text-sm text-gray-600">✉️ {invoice.payer_email}</p>
                                        )}
                                        {invoice.payer_address && (
                                            <p className="text-sm text-gray-600">📍 {invoice.payer_address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Invoice Details */}
                                <div className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-green-50 shadow-sm">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-1 h-6 bg-gradient-to-b from-[#0d544c] to-[#3B78BD] rounded"></div>
                                        <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide">Invoice Details</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Issue Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(invoice.issue_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Due Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(invoice.due_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                                                {invoice.status?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                invoice.payment_status === 'paid' ? 'bg-green-600 text-white' :
                                                invoice.payment_status === 'partially_paid' ? 'bg-yellow-600 text-white' :
                                                'bg-red-600 text-white'
                                            }`}>
                                                {invoice.payment_status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Title/Description */}
                            {(invoice.title || invoice.description) && (
                                <div className="mb-8 border-l-4 border-[#0d544c] bg-gray-50 p-4 rounded-r-lg">
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
                                <div className="overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wide">#</th>
                                                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wide">Description</th>
                                                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wide">Revenue Head</th>
                                                <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-wide">Category</th>
                                                <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-wide">Qty</th>
                                                <th className="text-right px-4 py-4 text-xs font-bold uppercase tracking-wide">Unit Price</th>
                                                <th className="text-right px-4 py-4 text-xs font-bold uppercase tracking-wide">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {invoice.items && invoice.items.length > 0 ? (
                                                invoice.items.map((item, index) => (
                                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">{index + 1}</td>
                                                        <td className="px-4 py-4">
                                                            <p className="font-semibold text-sm text-gray-900">{item.description || 'N/A'}</p>
                                                            {(item.monnify_product_code || item.metadata?.monnify_product_code) && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Code: <span className="font-mono">{item.monnify_product_code || item.metadata?.monnify_product_code}</span>
                                                                </p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-700">
                                                            {item.revenueHead?.name || item.revenue_head_name || item.metadata?.revenue_head_name || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                (item.category || item.metadata?.category) === 'One-Off'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {item.category || item.metadata?.category || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-sm font-bold text-gray-900">
                                                            {item.quantity || 1}
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                                                            {formatCurrency(item.unit_price)}
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-base font-bold text-gray-900">
                                                            {formatCurrency(item.subtotal || item.total_price)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                        No items found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="grid grid-cols-3 gap-8 mb-8">
                                {/* QR Code and Security */}
                                <div className="col-span-2 space-y-4">
                                    {/* Notes */}
                                    {invoice.notes && (
                                        <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-4">
                                            <h4 className="text-xs font-bold text-yellow-900 uppercase mb-2 flex items-center">
                                                <span className="mr-2">⚠️</span> Important Notes
                                            </h4>
                                            <p className="text-sm text-yellow-800 whitespace-pre-wrap">{invoice.notes}</p>
                                        </div>
                                    )}

                                    {/* Payment History */}
                                    {invoice.payments && invoice.payments.length > 0 && (
                                        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                                            <h4 className="text-xs font-bold text-green-900 uppercase mb-3 flex items-center">
                                                <FaCheckCircle className="mr-2" /> Payment History
                                            </h4>
                                            <div className="space-y-2">
                                                {invoice.payments.map((payment, index) => (
                                                    <div key={index} className="flex justify-between items-center text-sm">
                                                        <div>
                                                            <p className="font-semibold text-green-900">
                                                                {formatCurrency(payment.amount)} - {payment.payment_method || 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-green-700">{formatDate(payment.payment_date)}</p>
                                                        </div>
                                                        {payment.reference && (
                                                            <p className="text-xs text-green-600 font-mono">{payment.reference}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Security QR Code */}
                                    <div className="security-seal rounded-lg p-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-white p-3 rounded-lg border-2 border-[#0d544c] shadow-sm">
                                                <QRCodeSVG
                                                    value={verificationUrl}
                                                    size={90}
                                                    level="H"
                                                    includeMargin={false}
                                                    fgColor="#0d544c"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold text-[#0d544c] uppercase mb-2 flex items-center">
                                                    <FaShieldAlt className="mr-2" /> Verification
                                                </h4>
                                                <p className="text-xs text-gray-700 mb-2">
                                                    Scan this QR code to verify the authenticity of this invoice on our secure portal.
                                                </p>
                                                <p className="text-xs text-gray-600 font-mono break-all">{verificationUrl}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signatures - Moved directly under verification */}
                                    <div className="grid grid-cols-2 gap-8 mt-4">
                                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Authorized Signature</p>
                                            <div className="border-b-2 border-gray-400 pb-1 mb-2 h-12"></div>
                                            <p className="text-xs text-gray-600 font-semibold">Revenue Officer</p>
                                            <p className="text-xs text-gray-500">Yenagoa LGA</p>
                                        </div>
                                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Official Stamp</p>
                                            <div className="border-4 border-dashed border-gray-300 h-16 rounded-lg flex items-center justify-center bg-gray-50">
                                                <p className="text-xs text-gray-400 font-semibold">OFFICIAL SEAL</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Amount Card */}
                                <div>
                                    <div className="bg-gradient-to-br from-[#0d544c] to-[#165449] text-white rounded-xl p-6 shadow-lg">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                                <span className="text-xs uppercase tracking-wide opacity-90">Subtotal</span>
                                                <span className="text-lg font-semibold">{formatCurrency(invoice.total_amount)}</span>
                                            </div>

                                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                                <span className="text-xs uppercase tracking-wide opacity-90">Amount Paid</span>
                                                <span className="text-lg font-semibold text-green-300">{formatCurrency(invoice.amount_paid || 0)}</span>
                                            </div>

                                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                                <span className="text-xs uppercase tracking-wide opacity-90">Balance Due</span>
                                                <span className="text-lg font-semibold text-red-300">{formatCurrency(invoice.balance || invoice.total_amount)}</span>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-xs uppercase tracking-wide opacity-90 mb-2">Total Amount</p>
                                                <p className="text-3xl font-bold">{formatCurrency(invoice.total_amount)}</p>
                                                <p className="text-xs opacity-80 mt-1">Nigerian Naira (NGN)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Instructions */}
                                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-xs font-bold text-blue-900 uppercase mb-2">Payment Details</h4>
                                        <p className="text-xs text-blue-800">
                                            Payment can be made via online gateways or at any designated revenue collection point.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Footer */}
                            <div className="border-t-2 border-gray-300 pt-6 mt-8">
                                <div className="bg-gray-100 rounded-lg p-4 text-center">
                                    <p className="text-xs text-gray-600 mb-2">
                                        This is a computer-generated invoice and is valid without signature. For inquiries, contact Yenagoa LGA Revenue Department.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Generated on: {formatDate(new Date())} | Invoice ID: {invoice.invoice_number} | Security: {securityHash}
                                    </p>
                                    <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-gray-500">
                                        <FaShieldAlt className="text-green-600" />
                                        <span>Digitally Secured & Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold"
                            disabled={generating}
                        >
                            Close
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={generating}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Generating PDF...</span>
                                </>
                            ) : (
                                <>
                                    <FaDownload />
                                    <span>Download PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoicePrintModal;
