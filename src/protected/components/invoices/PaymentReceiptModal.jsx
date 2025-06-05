import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import QRCodeLib from 'qrcode';
import { useTheme } from '../../../context/ThemeContext';
import './PaymentReceiptModal.css';

// Extend dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Lazy load heavy components correctly
const FiDownload = lazy(() => import('react-icons/fi').then(m => ({ default: m.FiDownload })));
const FiPrinter = lazy(() => import('react-icons/fi').then(m => ({ default: m.FiPrinter })));
const FiX = lazy(() => import('react-icons/fi').then(m => ({ default: m.FiX })));
const FiCheckCircle = lazy(() => import('react-icons/fi').then(m => ({ default: m.FiCheckCircle })));
const FiClock = lazy(() => import('react-icons/fi').then(m => ({ default: m.FiClock })));
const FiAlertCircle = lazy(() => import('react-icons/fi').then(m => ({ default: m.FiAlertCircle })));

// Memoized StatusIcon component with display name
const StatusIcon = React.memo(function StatusIcon({ safePaymentData }) {
    if (safePaymentData.is_expired) {
        return <FiAlertCircle className="pr-status-icon pr-expired" aria-hidden="true" />;
    }
    if (safePaymentData.status === 'Pending') {
        return <FiClock className="pr-status-icon pr-pending" aria-hidden="true" />;
    }
    return <FiCheckCircle className="pr-status-icon pr-completed" aria-hidden="true" />;
});

// Day.js setup for consistent date handling
dayjs.extend(utc);
dayjs.extend(timezone);

const PaymentReceiptModal = ({ paymentData, onClose }) => {
    const receiptRef = useRef();
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { theme } = useTheme();

    // Debug incoming paymentData
    console.log('Received paymentData in PaymentReceiptModal:', paymentData);

    useEffect(() => {
        setIsVisible(true);
        return () => setIsVisible(false);
    }, []);

    const validateAndShortenUrl = (url) => {
        const baseUrl = new URL(import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5174');
        if (!url.startsWith(baseUrl.origin)) throw new Error('Invalid URL domain');
        return url.length > 50 ? url : url; // Placeholder for TinyURL shortening
    };

    // Map server response keys to expected keys
    const safePaymentData = {
        reference_number: paymentData?.invoice_ref || paymentData?.reference_number || 'N/A',
        amount: paymentData?.amount || 0,
        payment_method: paymentData?.payment_method || 'Unknown',
        payer_name: paymentData?.payer_name || 'N/A',
        payee_name: paymentData?.payee_name || 'N/A', // Added payee_name
        paid_at: paymentData?.date || paymentData?.paid_at || dayjs().utc().toISOString(),
        status: paymentData?.status || 'Completed',
        purpose: paymentData?.purpose || 'N/A',
        description: paymentData?.description || 'N/A',
        validity_period_days: paymentData?.validity_period_days || null,
        expires_at: paymentData?.expires_at || null,
        payment_type: paymentData?.payment_type || 'N/A',
        is_expired: paymentData?.is_expired || false,
    };

    // Debug safePaymentData after mapping
    console.log('Mapped safePaymentData:', safePaymentData);

    const verificationUrl = validateAndShortenUrl(`${import.meta.env.VITE_FRONTEND_URL}/verify?ref=${safePaymentData.reference_number}`);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).tz('Africa/Lagos').format('DD MMM YYYY');
    };

    const generateQRCodeDataUrl = (value) => {
        try {
            return QRCodeLib.toDataURL(value, { width: 80, margin: 1 });
        } catch (error) {
            console.error('QR Code generation failed:', error);
            return '';
        }
    };

    const renderPrintableContent = async () => {
        const qrCodeDataUrl = await generateQRCodeDataUrl(verificationUrl);
        
        // Use Unicode characters instead of React icons
        const statusIndicator = safePaymentData.is_expired 
            ? '⚠️' // Warning sign for expired
            : safePaymentData.status === 'Pending'
            ? '⏳' // Hourglass for pending
            : '✅'; // Check mark for completed

        return `
            <div class="pr-receipt-container">
                <div class="pr-watermark print-hidden">${theme.watermarkText || 'PAID'}</div>
                <header class="pr-header">
                    <div class="pr-logo-container">
                        <img src="${theme.logo}" alt="${theme.lga} Logo" class="pr-logo" />
                    </div>
                    <div class="pr-title-container">
                        <h1 class="pr-title">${theme.receiptTitle}</h1>
                        <div class="pr-status">
                            <span class="pr-status-icon ${safePaymentData.is_expired ? 'pr-expired' : safePaymentData.status === 'Pending' ? 'pr-pending' : 'pr-completed'}">
                                ${statusIndicator}
                            </span>
                            <span class="pr-status-text ${safePaymentData.is_expired ? 'pr-expired' : safePaymentData.status === 'Pending' ? 'pr-pending' : 'pr-completed'}">
                                ${safePaymentData.status} ${safePaymentData.is_expired ? '(Expired)' : ''}
                            </span>
                        </div>
                    </div>
                    <div class="pr-reference">
                        <span class="pr-reference-label">Ref:</span>
                        <span class="pr-reference-value">${safePaymentData.reference_number}</span>
                    </div>
                </header>
                <section class="pr-details-section">
                    <div class="pr-details-grid">
                        <div class="pr-detail-item">
                            <span class="pr-detail-label">Payer Name</span>
                            <span class="pr-detail-value">${safePaymentData.payer_name}</span>
                        </div>
                        <div class="pr-detail-item">
                            <span class="pr-detail-label">PROCESSED BY</span>
                            <span class="pr-detail-value">${safePaymentData.payee_name}</span>
                        </div>
                        <div class="pr-detail-item">
                            <span class="pr-detail-label">Payment Type</span>
                            <span class="pr-detail-value">${safePaymentData.payment_type}</span>
                        </div>
                        <div class="pr-detail-item">
                            <span class="pr-detail-label">Description</span>
                            <span class="pr-detail-value">${safePaymentData.description}</span>
                        </div>
                        <div class="pr-detail-item">
                            <span class="pr-detail-label">Payment Date</span>
                            <span class="pr-detail-value">${formatDate(safePaymentData.paid_at)}</span>
                        </div>
                        <div class="pr-detail-item">
                            <span class="pr-detail-label">Payment Method</span>
                            <span class="pr-detail-value">${safePaymentData.payment_method}</span>
                        </div>
                        <div class="pr-detail-item">
                            <span class="pr-detail-label">Purpose</span>
                            <span class="pr-detail-value">${safePaymentData.purpose}</span>
                        </div>
                    </div>
                    <div class="pr-amount-section">
                        <div class="pr-amount-label">Total Amount</div>
                        <div class="pr-amount-value">₦${Number(safePaymentData.amount).toLocaleString('en-NG')}</div>
                    </div>
                    ${safePaymentData.validity_period_days ? `
                        <div class="pr-validity-section">
                            <div class="pr-validity-item">
                                <span class="pr-validity-label">Validity Period</span>
                                <span class="pr-validity-value">${safePaymentData.validity_period_days} days</span>
                            </div>
                            <div class="pr-validity-item">
                                <span class="pr-validity-label">Expiry Date</span>
                                <span class="pr-validity-value">${formatDate(safePaymentData.expires_at)}</span>
                            </div>
                        </div>
                    ` : ''}
                </section>
                <footer class="pr-footer">
                    <div class="pr-qr-container">
                        <img src="${qrCodeDataUrl}" class="pr-qr-code" />
                    </div>
                    <div class="pr-verification-url">
                        <span>Verification URL:</span>
                        <div>${verificationUrl}</div>
                    </div>
                </footer>
            </div>
        `;
    };

    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            const printTarget = document.createElement('div');
            printTarget.id = 'print-target';
            printTarget.className = 'pr-receipt-container';
            const htmlContent = await renderPrintableContent();
            printTarget.innerHTML = htmlContent;
            document.body.appendChild(printTarget);

            const canvas = await html2canvas(printTarget, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                onclone: (document) => {
                    const reference = document.querySelector('.pr-reference');
                    if (reference) {
                        reference.style.background = 'transparent';
                        reference.style.zIndex = '10';
                    }
                    const watermark = document.querySelector('.pr-watermark');
                    if (watermark) watermark.style.display = 'none';
                },
            });

            const printWindow = window.open('', '', 'height=800,width=600');
            printWindow.document.write(`
                <html>
                    <head>
                        <link rel="stylesheet" href="/css/receipt-print.css">
                        <style>
                            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            img { max-width: 100%; }
                            .pr-reference { background: transparent !important; position: relative; z-index: 10; }
                            .pr-watermark { display: none !important; }
                        </style>
                    </head>
                    <body>
                        <img src="${canvas.toDataURL('image/png')}" alt="Receipt" style="width: 100%; max-width: 500px;" />
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
                printWindow.onafterprint = () => {
                    printWindow.close();
                    document.body.removeChild(printTarget);
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
            const printTarget = document.createElement('div');
            printTarget.id = 'print-target';
            printTarget.className = 'pr-receipt-container';
            const htmlContent = await renderPrintableContent();
            printTarget.innerHTML = htmlContent;
            document.body.appendChild(printTarget);

            const canvas = await html2canvas(printTarget, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                onclone: (document) => {
                    const reference = document.querySelector('.pr-reference');
                    if (reference) {
                        reference.style.background = 'transparent';
                        reference.style.zIndex = '10';
                    }
                    const watermark = document.querySelector('.pr-watermark');
                    if (watermark) watermark.style.display = 'none';
                },
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true,
                floatPrecision: 16,
            });
            pdf.setProperties({
                title: `Payment Receipt ${safePaymentData.reference_number}`,
                creator: 'LG E-Serv',
            });
            const width = pdf.internal.pageSize.getWidth() - 10;
            const height = (canvas.height * width) / canvas.width;
            pdf.addImage(imgData, 'PNG', 5, 5, width, height);
            pdf.save(`payment_receipt_${safePaymentData.reference_number}.pdf`);

            document.body.removeChild(printTarget);
        } catch (error) {
            console.error('PDF generation error:', error);
        } finally {
            setIsGeneratingPDF(false);
        }
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
                        role="dialog"
                        aria-labelledby="receipt-title"
                    >
                        <div className="pr-watermark">{theme.watermarkText || 'PAID'}</div>

                        <header className="pr-header" role="banner">
                            <div className="pr-logo-container">
                                <img src={theme.logo} alt={`${theme.lga} Logo`} className="pr-logo" />
                            </div>
                            <div className="pr-title-container">
                                <h1 id="receipt-title" className="pr-title">{theme.receiptTitle}</h1>
                                <div className="pr-status" role="status">
                                    <Suspense fallback={<span>Loading...</span>}>
                                        <StatusIcon safePaymentData={safePaymentData} />
                                    </Suspense>
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

                        <section className="pr-details-section" aria-label="Receipt Details">
                            <div className="pr-details-grid">
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">Payer Name</span>
                                    <span className="pr-detail-value">{safePaymentData.payer_name}</span>
                                </div>
                                <div className="pr-detail-item">
                                    <span className="pr-detail-label">PROCESSED BY</span>
                                    <span className="pr-detail-value">{safePaymentData.payee_name}</span>
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

                            <div className="pr-amount-section" aria-label="Total Amount">
                                <div className="pr-amount-label">Total Amount</div>
                                <div className="pr-amount-value">₦{Number(safePaymentData.amount).toLocaleString('en-NG')}</div>
                            </div>

                            {safePaymentData.validity_period_days && (
                                <div className="pr-validity-section" aria-label="Validity Information">
                                    <div className="pr-validity-item">
                                        <span className="pr-detail-label">Validity Period</span>
                                        <span className="pr-detail-value">{safePaymentData.validity_period_days} days</span>
                                    </div>
                                    <div className="pr-validity-item">
                                        <span className="pr-detail-label">Expiry Date</span>
                                        <span className="pr-detail-value">{formatDate(safePaymentData.expires_at)}</span>
                                    </div>
                                </div>
                            )}
                        </section>

                        <footer className="pr-footer" role="contentinfo">
                            <div className="pr-qr-container">
                                <span className="pr-qr-placeholder">QR Code will be included in printed/downloaded receipt</span>
                            </div>
                            <div className="pr-verification-url">
                                <span>Verification URL:</span>
                                <div>{verificationUrl}</div>
                            </div>
                        </footer>

                        <div className="pr-actions pr-no-print">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadPDF}
                                className="pr-button pr-button-download"
                                disabled={isGeneratingPDF}
                                aria-label="Download PDF"
                            >
                                {isGeneratingPDF ? (
                                    <span className="pr-button-loading">
                                        <span className="pr-spinner"></span>
                                        Generating...
                                    </span>
                                ) : (
                                    <Suspense fallback={<span>Loading...</span>}>
                                        <FiDownload className="pr-button-icon" />
                                        Download PDF
                                    </Suspense>
                                )}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrint}
                                className="pr-button pr-button-print"
                                disabled={isPrinting}
                                aria-label="Print Receipt"
                            >
                                {isPrinting ? (
                                    <span className="pr-button-loading">
                                        <span className="pr-spinner"></span>
                                        Printing...
                                    </span>
                                ) : (
                                    <Suspense fallback={<span>Loading...</span>}>
                                        <FiPrinter className="pr-button-icon" />
                                        Print Receipt
                                    </Suspense>
                                )}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="pr-button pr-button-close"
                                aria-label="Close Modal"
                            >
                                <Suspense fallback={<span>Loading...</span>}>
                                    <FiX className="pr-button-icon" />
                                    Close
                                </Suspense>
                            </motion.button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="pr-close-button pr-no-print"
                            aria-label="Close Modal"
                        >
                            <Suspense fallback={<span>Loading...</span>}>
                                <FiX />
                            </Suspense>
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentReceiptModal;