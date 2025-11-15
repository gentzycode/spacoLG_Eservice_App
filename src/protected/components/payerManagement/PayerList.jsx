import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { AiOutlineCopy, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineDollar, AiOutlineInfoCircle } from 'react-icons/ai';
import ComplianceScoreBadge from './shared/ComplianceScoreBadge';
import RiskCategoryBadge from './shared/RiskCategoryBadge';
import VerificationLevelIndicator from './shared/VerificationLevelIndicator';
import PayerCategoryBadge from './shared/PayerCategoryBadge';
import './PayerList.css';

const maskNumber = (number) => {
    return number.replace(/.(?=.{4})/g, '*');
};

const PayerList = ({ title, payers, onEdit, onSelect, selectedPayers, loading, type, pageCount, onPageChange, currentPage }) => {
    const [maskedMobileNumbers, setMaskedMobileNumbers] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const initialMasked = payers.reduce((acc, payer) => {
            acc[payer.id] = true;
            return acc;
        }, {});
        setMaskedMobileNumbers(initialMasked);
    }, [payers]);

    useEffect(() => {
        const updateDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        updateDarkMode();

        const observer = new MutationObserver(updateDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const handleCopyReference = (reference) => {
        navigator.clipboard.writeText(reference);
        alert('Reference number copied to clipboard');
    };

    const toggleMask = (id) => {
        setMaskedMobileNumbers(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const openPaymentModal = (payer) => {
        // Pass payer to parent to handle payment flow
        window.dispatchEvent(new CustomEvent('openPaymentModal', { detail: payer }));
    };

    const openInsightsModal = (payer) => {
        // Pass payer to parent to open insights modal
        window.dispatchEvent(new CustomEvent('openInsightsModal', { detail: payer }));
    };

    return (
        <div className="payer-list-container">
            {loading ? (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F0B652]"></div>
                </div>
            ) : payers.length === 0 ? (
                <p className="text-center py-6 text-gray-600 dark:text-gray-300">{`No ${title.toLowerCase()} available.`}</p>
            ) : (
                <>
                    <ul className="payer-list space-y-4">
                        {payers.map((payer) => {
                            const name = type === 'individual' ? `${payer.first_name} ${payer.last_name}` : payer.company_name;
                            const reference = type === 'individual' ? payer.individual_ref : payer.corporate_ref;
                            const mobile = type === 'individual' ? payer.mobile_number : payer.phone_number;

                            return (
                                <li
                                    key={payer.id}
                                    className="payer-item bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                                    tabIndex="0"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            onEdit(payer);
                                        }
                                    }}
                                >
                                    {/* Top Row: Basic Info */}
                                    <div className="flex items-center mb-3">
                                        <input
                                            type="checkbox"
                                            className="mr-4"
                                            checked={selectedPayers.includes(payer.id)}
                                            onChange={() => onSelect(payer.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="flex-grow ml-4 cursor-pointer" onClick={() => onEdit(payer)}>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{name}</p>
                                                {payer.payer_category && (
                                                    <PayerCategoryBadge category={payer.payer_category} size="sm" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Ref: {reference}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Mobile: {maskedMobileNumbers[payer.id] ? maskNumber(mobile) : mobile}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="tooltip">
                                                <AiOutlineCopy
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] dark:text-[#F0B652] hover:text-[#F0B652] dark:hover:text-[#3B78BD]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopyReference(reference);
                                                    }}
                                                />
                                                <span className="tooltip-text">Copy Reference</span>
                                            </div>
                                            <div className="tooltip">
                                                {maskedMobileNumbers[payer.id] ? (
                                                    <AiOutlineEyeInvisible
                                                        size={20}
                                                        className="cursor-pointer text-[#3B78BD] dark:text-[#F0B652] hover:text-[#F0B652] dark:hover:text-[#3B78BD]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(payer.id);
                                                        }}
                                                    />
                                                ) : (
                                                    <AiOutlineEye
                                                        size={20}
                                                        className="cursor-pointer text-[#3B78BD] dark:text-[#F0B652] hover:text-[#F0B652] dark:hover:text-[#3B78BD]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(payer.id);
                                                        }}
                                                    />
                                                )}
                                                <span className="tooltip-text">{maskedMobileNumbers[payer.id] ? 'Show Number' : 'Hide Number'}</span>
                                            </div>
                                            <div className="tooltip">
                                                <AiOutlineDollar
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] dark:text-[#F0B652] hover:text-[#F0B652] dark:hover:text-[#3B78BD]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPaymentModal(payer);
                                                    }}
                                                />
                                                <span className="tooltip-text">Pay</span>
                                            </div>
                                            <div className="tooltip">
                                                <AiOutlineInfoCircle
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] dark:text-[#F0B652] hover:text-[#F0B652] dark:hover:text-[#3B78BD]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openInsightsModal(payer);
                                                    }}
                                                />
                                                <span className="tooltip-text">Insights</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Enhanced Data */}
                                    <div className="ml-16 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compliance</p>
                                                <ComplianceScoreBadge score={payer.compliance_score || 50} size="sm" showLabel={false} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Risk Category</p>
                                                <RiskCategoryBadge category={payer.risk_category || 'Medium'} size="sm" showIcon={false} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verification</p>
                                                <VerificationLevelIndicator level={payer.verification_level || 1} size="sm" showLabel={false} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment History</p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {payer.total_invoices_generated || 0} invoices | ₦{(payer.total_amount_paid || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={onPageChange}
                        containerClassName={'pagination flex justify-center mt-4 space-x-2'}
                        pageClassName={'mx-1'}
                        pageLinkClassName={'px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-[#F0B652] text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300'}
                        previousClassName={'mx-1'}
                        previousLinkClassName={'px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-[#F0B652] text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300'}
                        nextClassName={'mx-1'}
                        nextLinkClassName={'px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-[#F0B652] text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300'}
                        activeClassName={'bg-[#F0B652] text-white'}
                        forcePage={currentPage}
                    />
                </>
            )}
        </div>
    );
};

export default PayerList;