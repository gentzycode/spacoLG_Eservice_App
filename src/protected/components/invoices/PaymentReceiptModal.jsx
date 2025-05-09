import React, { useRef, useState, useEffect } from 'react';
import logo from '../../../assets/logo-bayelsa.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import { FiDownload, FiPrinter, FiX, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentReceiptModal = ({ paymentData, onClose }) => {
    const receiptRef = useRef();
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        return () => setIsVisible(false);
    }, []);

    const generateRandomTransactionId = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const randomLetters = Array.from({ length: 3 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
        const randomNumbers = Array.from({ length: 6 }, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
        return `${randomLetters}-${randomNumbers}`;
    };

    const verificationUrl = `https://yourdomain.com/verify?ref=${paymentData?.reference_number}`;

    const safePaymentData = {
        reference_number: paymentData?.reference_number || 'N/A',
        amount: paymentData?.amount || 0,
        payment_method: paymentData?.payment_method || 'Unknown',
        payer_name: paymentData?.payer_name || 'N/A',
        paid_at: paymentData?.paid_at || new Date().toISOString(),
        status: paymentData?.status || 'Completed',
        purpose: paymentData?.purpose || 'N/A',
        description: paymentData?.description || 'N/A',
        validity_period_days: paymentData?.validity_period_days || null,
        expires_at: paymentData?.expires_at || null,
        payment_type: paymentData?.payment_type || 'N/A',
        is_expired: paymentData?.is_expired || false,
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });
    };

    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            const printWindow = window.open('', '', 'height=800,width=600');
            const content = receiptRef.current;

            // Clone the content to avoid modifying the original
            const clone = content.cloneNode(true);
            const noPrintElements = clone.querySelectorAll('.pr-no-print');
            noPrintElements.forEach(el => el.remove());

            // Add print-specific styles
            const style = document.createElement('style');
            style.innerHTML = `
                body { 
                    margin: 0; 
                    padding: 10px; 
                    background: #ffffff !important; 
                    -webkit-print-color-adjust: exact; 
                    print-color-adjust: exact;
                    font-size: 12px !important;
                }
                .pr-receipt-container {
                    box-shadow: none !important;
                    border: 1px solid #e5e7eb !important;
                    animation: none !important;
                    transform: none !important;
                    max-height: none !important;
                    overflow: visible !important;
                    padding: 15px !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                .pr-header {
                    margin-bottom: 12px !important;
                }
                .pr-logo {
                    height: 40px !important;
                }
                .pr-title {
                    font-size: 18px !important;
                    margin-bottom: 4px !important;
                }
                .pr-details-grid {
                    gap: 6px !important;
                    margin-bottom: 12px !important;
                }
                .pr-detail-item {
                    padding: 8px !important;
                }
                .pr-detail-label {
                    font-size: 10px !important;
                    margin-bottom: 2px !important;
                }
                .pr-detail-value {
                    font-size: 12px !important;
                }
                .pr-amount-section {
                    padding: 12px !important;
                    margin: 12px 0 !important;
                }
                .pr-amount-value {
                    font-size: 20px !important;
                }
                .pr-footer {
                    margin-top: 15px !important;
                    padding-top: 12px !important;
                    flex-direction: row !important;
                    align-items: center !important;
                }
                .pr-qr-code {
                    width: 60px !important;
                    height: 60px !important;
                }
                .pr-watermark {
                    font-size: 80px !important;
                }
                .pr-verification-url {
                    margin-left: 10px !important;
                    text-align: left !important;
                }
            `;
            clone.appendChild(style);

            printWindow.document.body.appendChild(clone);
            printWindow.document.close();
            
            // Wait for content to load before printing
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
                printWindow.onafterprint = () => {
                    printWindow.close();
                    setIsPrinting(false);
                };
            };
        } catch (error) {
            console.error('Print error:', error);
            setIsPrinting(false);
        }
    };

    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const input = receiptRef.current;
            const clone = input.cloneNode(true);
            const noPrintElements = clone.querySelectorAll('.pr-no-print');
            noPrintElements.forEach(el => el.remove());

            // Temporarily append to body for rendering
            document.body.appendChild(clone);
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.width = '500px';

            // Apply print styles for PDF
            const style = document.createElement('style');
            style.innerHTML = `
                .pr-receipt-container {
                    padding: 15px !important;
                    font-size: 12px !important;
                }
                .pr-logo {
                    height: 40px !important;
                }
                .pr-title {
                    font-size: 18px !important;
                }
                .pr-detail-label {
                    font-size: 10px !important;
                }
                .pr-detail-value {
                    font-size: 12px !important;
                }
                .pr-qr-code {
                    width: 60px !important;
                    height: 60px !important;
                }
                .pr-footer {
                    flex-direction: row !important;
                    align-items: center !important;
                }
                .pr-verification-url {
                    margin-left: 10px !important;
                    text-align: left !important;
                }
            `;
            clone.appendChild(style);

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
            });

            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const width = pdf.internal.pageSize.getWidth();
            const height = (canvas.height * width) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save(`payment_receipt_${safePaymentData.reference_number}.pdf`);
        } catch (error) {
            console.error('PDF generation error:', error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const StatusIcon = () => {
        if (safePaymentData.is_expired) {
            return <FiAlertCircle className="pr-status-icon pr-expired" />;
        }
        if (safePaymentData.status === 'Pending') {
            return <FiClock className="pr-status-icon pr-pending" />;
        }
        return <FiCheckCircle className="pr-status-icon pr-completed" />;
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    className="pr-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div 
                        className="pr-receipt-container"
                        ref={receiptRef}
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                    >
                        {/* Watermark */}
                        <div className="pr-watermark">PAID</div>

                        {/* Header Section */}
                        <header className="pr-header">
                            <div className="pr-logo-container">
                                <img src={logo} alt="Bayelsa Logo" className="pr-logo" />
                            </div>
                            <div className="pr-title-container">
                                <h1 className="pr-title">Payment Receipt</h1>
                                <div className="pr-status">
                                    <StatusIcon />
                                    <span className={`pr-status-text ${safePaymentData.is_expired ? 'pr-expired' : safePaymentData.status === 'Pending' ? 'pr-pending' : 'pr-completed'}`}>
                                        {safePaymentData.status} {safePaymentData.is_expired && '(Expired)'}
                                    </span>
                                </div>
                            </div>
                            <div className="pr-reference">
                                <span className="pr-reference-label">Ref:</span>
                                <span className="pr-reference-value">{safePaymentData.reference_number}</span>
                            </div>
                        </header>

                        {/* Receipt Details Section */}
                        <section className="pr-details-section">
                            <div className="pr-details-grid">
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Transaction ID</span>
                                    <span className="pr-detail-value">{generateRandomTransactionId()}</span>
                                </div>
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Payer Name</span>
                                    <span className="pr-detail-value">{safePaymentData.payer_name}</span>
                                </div>
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Payment Type</span>
                                    <span className="pr-detail-value">{safePaymentData.payment_type}</span>
                                </div>
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Description</span>
                                    <span className="pr-detail-value">{safePaymentData.description}</span>
                                </div>
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Payment Date</span>
                                    <span className="pr-detail-value">{formatDate(safePaymentData.paid_at)}</span>
                                </div>
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Payment Method</span>
                                    <span className="pr-detail-value">{safePaymentData.payment_method}</span>
                                </div>
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Purpose</span>
                                    <span className="pr-detail-value">{safePaymentData.purpose}</span>
                                </div>
                            </div>

                            {/* Amount Section */}
                            <div className="pr-amount-section">
                                <div className="pr-amount-label">Total Amount</div>
                                <div className="pr-amount-value">₦{Number(safePaymentData.amount).toLocaleString()}</div>
                            </div>

                            {/* Validity Section */}
                            {safePaymentData.validity_period_days && (
                                <div className="pr-validity-section">
                                    <div className="pr-validity-item">
                                        <span className="pr-validity-label">Validity Period</span>
                                        <span className="pr-validity-value">{safePaymentData.validity_period_days} days</span>
                                    </div>
                                    <div className="pr-validity-item">
                                        <span className="pr-validity-label">Expires On</span>
                                        <span className="pr-validity-value">{formatDate(safePaymentData.expires_at)}</span>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Footer Section - QR Code and Verification URL side by side */}
                        <footer className="pr-footer">
                            <div className="pr-qr-container">
                                <QRCode 
                                    value={verificationUrl} 
                                    size={80} 
                                    level="H" 
                                    includeMargin={true} 
                                    className="pr-qr-code" 
                                />
                            </div>
                            <div className="pr-verification-url">
                                <span>Verification URL:</span>
                                <div>{verificationUrl}</div>
                            </div>
                        </footer>

                        {/* Action Buttons */}
                        <div className="pr-actions pr-no-print">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadPDF}
                                className="pr-button pr-button-download"
                                disabled={isGeneratingPDF}
                            >
                                {isGeneratingPDF ? (
                                    <span className="pr-button-loading">
                                        <span className="pr-spinner"></span>
                                        Generating...
                                    </span>
                                ) : (
                                    <>
                                        <FiDownload className="pr-button-icon" />
                                        Download PDF
                                    </>
                                )}
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrint}
                                className="pr-button pr-button-print"
                                disabled={isPrinting}
                            >
                                {isPrinting ? (
                                    <span className="pr-button-loading">
                                        <span className="pr-spinner"></span>
                                        Printing...
                                    </span>
                                ) : (
                                    <>
                                        <FiPrinter className="pr-button-icon" />
                                        Print Receipt
                                    </>
                                )}
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="pr-button pr-button-close"
                            >
                                <FiX className="pr-button-icon" />
                                Close
                            </motion.button>
                        </div>

                        {/* Close Button */}
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="pr-close-button pr-no-print"
                        >
                            <FiX />
                        </motion.button>
                    </motion.div>

                    {/* Styles */}
                    <style jsx>{`
                        /* Modal Overlay */
                        .pr-modal-overlay {
                            position: fixed;
                            inset: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: rgba(0, 0, 0, 0.7);
                            backdrop-filter: blur(5px);
                            z-index: 1000;
                            padding: 20px;
                            overflow-y: auto;
                        }

                        /* Receipt Container */
                        .pr-receipt-container {
                            position: relative;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
                            width: 100%;
                            max-width: 500px;
                            margin: 20px auto;
                            overflow: hidden;
                            font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                            color: #333;
                        }

                        /* Watermark */
                        .pr-watermark {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) rotate(-30deg);
                            font-size: 100px;
                            font-weight: bold;
                            color: rgba(59, 120, 189, 0.05);
                            pointer-events: none;
                            user-select: none;
                            z-index: 0;
                        }

                        /* Header */
                        .pr-header {
                            position: relative;
                            text-align: center;
                            margin-bottom: 16px;
                            z-index: 1;
                        }

                        .pr-logo-container {
                            margin-bottom: 12px;
                            display: flex;
                            justify-content: center;
                        }

                        .pr-logo {
                            height: 50px;
                            width: auto;
                            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
                        }

                        .pr-title-container {
                            margin-bottom: 10px;
                        }

                        .pr-title {
                            font-size: 20px;
                            font-weight: 700;
                            color: #3B78BD;
                            margin: 0 0 4px 0;
                            letter-spacing: 0.5px;
                        }

                        .pr-status {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 6px;
                            font-size: 13px;
                            margin-bottom: 8px;
                        }

                        .pr-status-icon {
                            font-size: 15px;
                        }

                        .pr-status-text {
                            font-weight: 600;
                        }

                        .pr-completed {
                            color: #22c55e;
                        }

                        .pr-pending {
                            color: #f59e0b;
                        }

                        .pr-expired {
                            color: #ef4444;
                        }

                        .pr-reference {
                            background: #f3f4f6;
                            padding: 5px 10px;
                            border-radius: 20px;
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                            font-size: 12px;
                        }

                        .pr-reference-label {
                            font-weight: 600;
                            color: #6b7280;
                        }

                        .pr-reference-value {
                            font-weight: 600;
                            color: #3B78BD;
                        }

                        /* Details Section */
                        .pr-details-section {
                            position: relative;
                            z-index: 1;
                            margin-bottom: 16px;
                        }

                        .pr-details-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 8px;
                            margin-bottom: 12px;
                        }

                        .pr-detail-item {
                            background: #f9fafb;
                            padding: 10px;
                            border-radius: 6px;
                            border-left: 3px solid #3B78BD;
                        }

                        .pr-full-width {
                            grid-column: span 2;
                        }

                        .pr-detail-label {
                            display: block;
                            font-size: 11px;
                            font-weight: 600;
                            color: #6b7280;
                            margin-bottom: 3px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }

                        .pr-detail-value {
                            display: block;
                            font-size: 13px;
                            font-weight: 500;
                            color: #111827;
                            word-break: break-word;
                        }

                        /* Amount Section */
                        .pr-amount-section {
                            background: linear-gradient(135deg, #3B78BD 0%, #2a5a8f 100%);
                            color: white;
                            padding: 14px;
                            border-radius: 6px;
                            margin: 16px 0;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
                        }

                        .pr-amount-label {
                            font-size: 13px;
                            font-weight: 600;
                        }

                        .pr-amount-value {
                            font-size: 22px;
                            font-weight: 700;
                        }

                        /* Validity Section */
                        .pr-validity-section {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 8px;
                            margin-top: 12px;
                        }

                        .pr-validity-item {
                            background: #f9fafb;
                            padding: 10px;
                            border-radius: 6px;
                        }

                        .pr-validity-label {
                            display: block;
                            font-size: 11px;
                            font-weight: 600;
                            color: #6b7280;
                            margin-bottom: 3px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }

                        .pr-validity-value {
                            display: block;
                            font-size: 13px;
                            font-weight: 500;
                            color: #111827;
                        }

                        /* Footer - QR Code and Verification URL side by side */
                        .pr-footer {
                            position: relative;
                            z-index: 1;
                            display: flex;
                            align-items: center;
                            margin-top: 20px;
                            padding-top: 16px;
                            border-top: 1px dashed #e5e7eb;
                        }

                        .pr-qr-container {
                            flex-shrink: 0;
                        }

                        .pr-qr-code {
                            display: inline-block;
                            padding: 6px;
                            background: white;
                            border: 1px solid #e5e7eb;
                            border-radius: 6px;
                        }

                        .pr-verification-url {
                            margin-left: 10px;
                            font-size: 12px;
                            color: #6b7280;
                            word-break: break-all;
                        }

                        .pr-verification-url span {
                            display: block;
                            font-weight: 600;
                            margin-bottom: 3px;
                        }

                        /* Action Buttons */
                        .pr-actions {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                            justify-content: flex-end;
                            margin-top: 20px;
                        }

                        .pr-button {
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                            padding: 8px 14px;
                            border-radius: 6px;
                            font-size: 13px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            border: none;
                            outline: none;
                        }

                        .pr-button:disabled {
                            opacity: 0.7;
                            cursor: not-allowed;
                        }

                        .pr-button-icon {
                            font-size: 15px;
                        }

                        .pr-button-download {
                            background-color: #3B78BD;
                            color: white;
                        }

                        .pr-button-download:hover:not(:disabled) {
                            background-color: #2a5a8f;
                        }

                        .pr-button-print {
                            background-color: #10b981;
                            color: white;
                        }

                        .pr-button-print:hover:not(:disabled) {
                            background-color: #0d9e6e;
                        }

                        .pr-button-close {
                            background-color: #f3f4f6;
                            color: #6b7280;
                        }

                        .pr-button-close:hover {
                            background-color: #e5e7eb;
                        }

                        .pr-button-loading {
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                        }

                        .pr-spinner {
                            width: 13px;
                            height: 13px;
                            border: 2px solid rgba(255, 255, 255, 0.3);
                            border-radius: 50%;
                            border-top-color: white;
                            animation: spin 1s ease-in-out infinite;
                        }

                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }

                        /* Close Button */
                        .pr-close-button {
                            position: absolute;
                            top: 14px;
                            right: 14px;
                            width: 32px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: #f3f4f6;
                            color: #6b7280;
                            border: none;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 16px;
                            transition: all 0.2s ease;
                            z-index: 2;
                        }

                        .pr-close-button:hover {
                            background-color: #e5e7eb;
                            color: #ef4444;
                        }

                        /* Responsive Styles */
                        @media (max-width: 600px) {
                            .pr-receipt-container {
                                padding: 16px;
                                margin: 16px auto;
                            }

                            .pr-logo {
                                height: 45px;
                            }

                            .pr-title {
                                font-size: 18px;
                            }

                            .pr-details-grid {
                                grid-template-columns: 1fr;
                            }

                            .pr-full-width {
                                grid-column: span 1;
                            }

                            .pr-footer {
                                flex-direction: column;
                                align-items: flex-start;
                            }

                            .pr-verification-url {
                                margin-left: 0;
                                margin-top: 10px;
                            }

                            .pr-actions {
                                justify-content: center;
                            }
                        }

                        /* Print Styles */
                        @media print {
                            body, html {
                                height: auto !important;
                                overflow: visible !important;
                            }
                            
                            .pr-no-print {
                                display: none !important;
                            }

                            .pr-receipt-container {
                                box-shadow: none !important;
                                border: 1px solid #ddd !important;
                                max-width: 100% !important;
                                padding: 15px !important;
                                animation: none !important;
                                transform: none !important;
                                margin: 0 !important;
                                page-break-after: avoid;
                                page-break-inside: avoid;
                            }

                            .pr-watermark {
                                opacity: 0.1 !important;
                                font-size: 80px !important;
                            }

                            .pr-qr-code {
                                display: block !important;
                                width: 60px !important;
                                height: 60px !important;
                            }

                            .pr-footer {
                                flex-direction: row !important;
                                align-items: center !important;
                            }

                            .pr-verification-url {
                                margin-left: 10px !important;
                            }

                            .pr-detail-item {
                                page-break-inside: avoid;
                            }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentReceiptModal;