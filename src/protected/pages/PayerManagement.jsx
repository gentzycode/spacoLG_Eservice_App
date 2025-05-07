import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIndividuals, createIndividual, updateIndividual, getCorporates, createCorporate, updateCorporate } from '../../apis/authActions';
import IndividualModal from '../components/payerManagement/IndividualModal';
import CorporateModal from '../components/payerManagement/CorporateModal';
import GenerateInvoiceModal from '../components/invoices/GenerateInvoiceModal';
import PayInvoiceModal from '../components/invoices/PayInvoiceModal';
import QuickUseTokenModal from '../components/invoices/QuickUseTokenModal';
import AddIndividualModal from '../components/payerManagement/AddIndividualModal';
import PayerInsightsModal from '../components/payerManagement/PayerInsightsModal';
import { AiOutlineSearch, AiOutlineCopy, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineDollar, AiOutlineClose, AiOutlineInfoCircle } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const maskNumber = (number) => {
    return number.replace(/.(?=.{4})/g, '*');
};

const PayerManagement = () => {
    const { token } = useContext(AuthContext);
    const [individuals, setIndividuals] = useState([]);
    const [corporates, setCorporates] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showIndividualModal, setShowIndividualModal] = useState(false);
    const [showCorporateModal, setShowCorporateModal] = useState(false);
    const [showAddIndividualModal, setShowAddIndividualModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showInsightsModal, setShowInsightsModal] = useState(false);
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [paymentTarget, setPaymentTarget] = useState(null);
    const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
    const [showPayInvoiceModal, setShowPayInvoiceModal] = useState(false);
    const [showQuickUseTokenModal, setShowQuickUseTokenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageIndividuals, setCurrentPageIndividuals] = useState(0);
    const [currentPageCorporates, setCurrentPageCorporates] = useState(0);
    const [maskedMobileNumbers, setMaskedMobileNumbers] = useState({});
    const [selectedIndividuals, setSelectedIndividuals] = useState([]);
    const [selectedCorporates, setSelectedCorporates] = useState([]);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchIndividuals();
        fetchCorporates();
    }, []);

    const fetchIndividuals = () => {
        setLoading(true);
        getIndividuals(token, (data) => {
            setIndividuals(data);
            setMaskedMobileNumbers(data.reduce((acc, individual) => {
                acc[individual.id] = true;
                return acc;
            }, {}));
        }, (err) => {
            setError(err.message || 'Failed to fetch individuals');
            console.error('Error fetching individuals:', err);
        }, () => setLoading(false));
    };

    const fetchCorporates = () => {
        setLoading(true);
        getCorporates(token, (data) => {
            setCorporates(data);
            setMaskedMobileNumbers(data.reduce((acc, corporate) => {
                acc[corporate.id] = true;
                return acc;
            }, {}));
        }, (err) => {
            setError(err.message || 'Failed to fetch corporates');
            console.error('Error fetching corporates:', err);
        }, () => setLoading(false));
    };

    const handleCreateIndividual = async (payload) => {
        try {
            const newIndividual = await createIndividual(token, payload);
            setIndividuals([...individuals, newIndividual]);
            setMaskedMobileNumbers(prev => ({ ...prev, [newIndividual.id]: true }));
            setShowAddIndividualModal(false);
        } catch (err) {
            setError(err.message);
            console.error('Error creating individual:', err);
        }
    };

    const handleUpdateIndividual = async (id, payload) => {
        try {
            const updatedIndividual = await updateIndividual(token, id, payload);
            setIndividuals(individuals.map(ind => ind.id === id ? updatedIndividual : ind));
            setShowIndividualModal(false);
        } catch (err) {
            setError(err.message);
            console.error('Error updating individual:', err);
        }
    };

    const handleCreateCorporate = async (payload) => {
        try {
            const newCorporate = await createCorporate(token, payload);
            setCorporates([...corporates, newCorporate]);
            setMaskedMobileNumbers(prev => ({ ...prev, [newCorporate.id]: true }));
            setShowCorporateModal(false);
        } catch (err) {
            setError(err.message);
            console.error('Error creating corporate:', err);
        }
    };

    const handleUpdateCorporate = async (id, payload) => {
        try {
            const updatedCorporate = await updateCorporate(token, id, payload);
            setCorporates(corporates.map(corp => corp.id === id ? updatedCorporate : corp));
            setShowCorporateModal(false);
        } catch (err) {
            setError(err.message);
            console.error('Error updating corporate:', err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPageIndividuals(0);
        setCurrentPageCorporates(0);
    };

    const filteredIndividuals = individuals.filter(individual =>
        (individual.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         individual.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         individual.individual_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         individual.mobile_number?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredCorporates = corporates.filter(corporate =>
        (corporate.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         corporate.corporate_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         corporate.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handlePageClickIndividuals = ({ selected }) => {
        setCurrentPageIndividuals(selected);
    };

    const handlePageClickCorporates = ({ selected }) => {
        setCurrentPageCorporates(selected);
    };

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
        setPaymentTarget(payer);
        setShowPaymentModal(true);
    };

    const openInsightsModal = (payer) => {
        setSelectedPayer(payer);
        setShowInsightsModal(true);
    };

    const openGenerateInvoiceModal = () => {
        setPaymentTarget(null);
        setShowGenerateInvoiceModal(true);
    };

    const handleSelectIndividual = (id) => {
        setSelectedIndividuals(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleSelectCorporate = (id) => {
        setSelectedCorporates(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleBulkGenerateInvoice = () => {
        if (selectedIndividuals.length + selectedCorporates.length === 0) {
            alert('Please select at least one payer');
            return;
        }
        const firstSelected = individuals.find(p => selectedIndividuals.includes(p.id)) ||
                             corporates.find(p => selectedCorporates.includes(p.id));
        setPaymentTarget({
            category: firstSelected.individual_ref
                ? { value: 'individual', label: 'Individual' }
                : { value: 'corporate', label: 'Corporate' },
            referenceNumber: firstSelected.individual_ref || firstSelected.corporate_ref
        });
        setShowGenerateInvoiceModal(true);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Name', 'Type', 'Reference', 'Mobile Number']],
            body: [
                ...individuals.map(individual => [
                    `${individual.first_name} ${individual.last_name}`,
                    'Individual',
                    individual.individual_ref,
                    individual.mobile_number
                ]),
                ...corporates.map(corporate => [
                    corporate.company_name,
                    'Corporate',
                    corporate.corporate_ref,
                    corporate.phone_number
                ])
            ]
        });
        doc.save('payers.pdf');
    };

    return (
        <div className="w-full p-4 animate-fadeIn">
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Payer Management</h1>
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652] transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={() => setShowAddIndividualModal(true)}
                    >
                        Add Individual
                    </button>
                    <button
                        className="px-4 py-2 bg-[#F0B652] text-white rounded hover:bg-[#6B7280] transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={() => {
                            setSelectedPayer(null);
                            setShowCorporateModal(true);
                        }}
                    >
                        Add Corporate
                    </button>
                    <button
                        className="px-4 py-2 bg-[#6B7280] text-white rounded hover:bg-[#3B78BD] transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={openGenerateInvoiceModal}
                    >
                        Generate Invoice
                    </button>
                    <button
                        className="px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652] transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={() => setShowPayInvoiceModal(true)}
                    >
                        Pay Invoice
                    </button>
                    <button
                        className="px-4 py-2 bg-[#F0B652] text-white rounded hover:bg-[#6B7280] transition-all duration-300 shadow-lg transform hover:scale-105"
                        onClick={() => setShowQuickUseTokenModal(true)}
                    >
                        Quick Use Token
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name, reference, or mobile..."
                        className="w-full sm:w-64 p-2 border rounded-l-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className="px-4 py-2 bg-[#3B78BD] text-white rounded-r-lg hover:bg-[#F0B652] transition-all duration-300">
                        <AiOutlineSearch size={24} />
                    </button>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 bg-[#6B7280] text-white rounded hover:bg-[#3B78BD] transition-all duration-300"
                        onClick={handleBulkGenerateInvoice}
                        disabled={selectedIndividuals.length + selectedCorporates.length === 0}
                    >
                        Bulk Generate Invoice
                    </button>
                    <button
                        className="px-4 py-2 bg-[#3B78BD] text-white rounded hover:bg-[#F0B652] transition-all duration-300"
                        onClick={exportToPDF}
                    >
                        Export to PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Individuals</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">Loading...</div>
                    ) : individuals.length === 0 && !error ? (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">No individuals available.</div>
                    ) : (
                        <div>
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#3B78BD] to-[#F0B652] text-white">
                                        <th className="p-2 border border-gray-200">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIndividuals(filteredIndividuals.map(i => i.id));
                                                    } else {
                                                        setSelectedIndividuals([]);
                                                    }
                                                }}
                                                checked={selectedIndividuals.length === filteredIndividuals.length && filteredIndividuals.length > 0}
                                            />
                                        </th>
                                        <th className="p-2 border border-gray-200">Name</th>
                                        <th className="p-2 border border-gray-200">Reference</th>
                                        <th className="p-2 border border-gray-200">Mobile Number</th>
                                        <th className="p-2 border border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIndividuals.slice(currentPageIndividuals * itemsPerPage, (currentPageIndividuals + 1) * itemsPerPage).map((individual, index) => (
                                        <tr
                                            key={individual.id}
                                            className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-[#ecf6ec]'} hover:bg-gray-100`}
                                            onClick={() => {
                                                setSelectedPayer(individual);
                                                setShowIndividualModal(true);
                                            }}
                                        >
                                            <td className="p-2 border border-gray-200">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIndividuals.includes(individual.id)}
                                                    onChange={() => handleSelectIndividual(individual.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                            <td className="p-2 border border-gray-200">{`${individual.first_name} ${individual.last_name}`}</td>
                                            <td className="p-2 border border-gray-200 font-bold">{individual.individual_ref}</td>
                                            <td className="p-2 border border-gray-200">
                                                {maskedMobileNumbers[individual.id] ? maskNumber(individual.mobile_number) : individual.mobile_number}
                                            </td>
                                            <td className="p-2 border border-gray-200 text-center flex justify-center items-center space-x-2">
                                                <AiOutlineCopy
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopyReference(individual.individual_ref);
                                                    }}
                                                />
                                                {maskedMobileNumbers[individual.id] ? (
                                                    <AiOutlineEyeInvisible
                                                        size={20}
                                                        className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(individual.id);
                                                        }}
                                                    />
                                                ) : (
                                                    <AiOutlineEye
                                                        size={20}
                                                        className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(individual.id);
                                                        }}
                                                    />
                                                )}
                                                <AiOutlineDollar
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPaymentModal(individual);
                                                    }}
                                                />
                                                <AiOutlineInfoCircle
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openInsightsModal(individual);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <ReactPaginate
                                previousLabel={'Previous'}
                                nextLabel={'Next'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(filteredIndividuals.length / itemsPerPage)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClickIndividuals}
                                containerClassName={'pagination flex justify-center mt-4'}
                                pageClassName={'mx-2'}
                                pageLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-[#3B78BD] text-gray-700 hover:text-white transition-all duration-300'}
                                previousClassName={'mx-2'}
                                previousLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-[#3B78BD] text-gray-700 hover:text-white transition-all duration-300'}
                                nextClassName={'mx-2'}
                                nextLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-[#3B78BD] text-gray-700 hover:text-white transition-all duration-300'}
                                activeClassName={'bg-[#3B78BD] text-white'}
                            />
                        </div>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Corporates</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">Loading...</div>
                    ) : corporates.length === 0 && !error ? (
                        <div className="text-center py-6 text-gray-600 dark:text-gray-300">No corporates available.</div>
                    ) : (
                        <div>
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#3B78BD] to-[#F0B652] text-white">
                                        <th className="p-2 border border-gray-200">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedCorporates(filteredCorporates.map(c => c.id));
                                                    } else {
                                                        setSelectedCorporates([]);
                                                    }
                                                }}
                                                checked={selectedCorporates.length === filteredCorporates.length && filteredCorporates.length > 0}
                                            />
                                        </th>
                                        <th className="p-2 border border-gray-200">Company Name</th>
                                        <th className="p-2 border border-gray-200">Reference</th>
                                        <th className="p-2 border border-gray-200">Mobile Number</th>
                                        <th className="p-2 border border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCorporates.slice(currentPageCorporates * itemsPerPage, (currentPageCorporates + 1) * itemsPerPage).map((corporate, index) => (
                                        <tr
                                            key={corporate.id}
                                            className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-[#ecf6ec]'} hover:bg-gray-100`}
                                            onClick={() => {
                                                setSelectedPayer(corporate);
                                                setShowCorporateModal(true);
                                            }}
                                        >
                                            <td className="p-2 border border-gray-200">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCorporates.includes(corporate.id)}
                                                    onChange={() => handleSelectCorporate(corporate.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                            <td className="p-2 border border-gray-200">{corporate.company_name}</td>
                                            <td className="p-2 border border-gray-200 font-bold">{corporate.corporate_ref}</td>
                                            <td className="p-2 border border-gray-200">
                                                {maskedMobileNumbers[corporate.id] ? maskNumber(corporate.phone_number) : corporate.phone_number}
                                            </td>
                                            <td className="p-2 border border-gray-200 text-center flex justify-center items-center space-x-2">
                                                <AiOutlineCopy
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopyReference(corporate.corporate_ref);
                                                    }}
                                                />
                                                {maskedMobileNumbers[corporate.id] ? (
                                                    <AiOutlineEyeInvisible
                                                        size={20}
                                                        className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(corporate.id);
                                                        }}
                                                    />
                                                ) : (
                                                    <AiOutlineEye
                                                        size={20}
                                                        className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(corporate.id);
                                                        }}
                                                    />
                                                )}
                                                <AiOutlineDollar
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPaymentModal(corporate);
                                                    }}
                                                />
                                                <AiOutlineInfoCircle
                                                    size={20}
                                                    className="cursor-pointer text-[#3B78BD] hover:text-[#F0B652]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openInsightsModal(corporate);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <ReactPaginate
                                previousLabel={'Previous'}
                                nextLabel={'Next'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(filteredCorporates.length / itemsPerPage)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClickCorporates}
                                containerClassName={'pagination flex justify-center mt-4'}
                                pageClassName={'mx-2'}
                                pageLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-[#3B78BD] text-gray-700 hover:text-white transition-all duration-300'}
                                previousClassName={'mx-2'}
                                previousLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-[#3B78BD] text-gray-700 hover:text-white transition-all duration-300'}
                                nextClassName={'mx-2'}
                                nextLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-[#3B78BD] text-gray-700 hover:text-white transition-all duration-300'}
                                activeClassName={'bg-[#3B78BD] text-white'}
                            />
                        </div>
                    )}
                </div>
            </div>

            {showAddIndividualModal && (
                <AddIndividualModal
                    closeModal={() => setShowAddIndividualModal(false)}
                    onSave={handleCreateIndividual}
                />
            )}

            {showIndividualModal && selectedPayer && (
                <IndividualModal
                    closeModal={() => {
                        setShowIndividualModal(false);
                        setSelectedPayer(null);
                    }}
                    individual={selectedPayer}
                    viewMode={true}
                    onSave={handleUpdateIndividual}
                />
            )}

            {showCorporateModal && selectedPayer && (
                <CorporateModal
                    closeModal={() => {
                        setShowCorporateModal(false);
                        setSelectedPayer(null);
                    }}
                    corporate={selectedPayer}
                    viewMode={true}
                    onSave={handleUpdateCorporate}
                />
            )}

            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-100 hover:scale-105">
                        <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 rounded-t-lg">
                            <h2 className="text-2xl font-bold text-white">Make Payment</h2>
                            <button className="text-white hover:text-gray-200 transition-colors duration-200" onClick={() => setShowPaymentModal(false)}>
                                <AiOutlineClose size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                className="w-full p-4 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setShowGenerateInvoiceModal(true);
                                    setPaymentTarget({
                                        category: paymentTarget.individual_ref
                                            ? { value: 'individual', label: 'Individual' }
                                            : { value: 'corporate', label: 'Corporate' },
                                        referenceNumber: paymentTarget.individual_ref || paymentTarget.corporate_ref
                                    });
                                }}
                            >
                                Generate Invoice
                            </button>
                            <button
                                className="w-full p-4 bg-[#F0B652] text-white rounded-lg hover:bg-[#6B7280] transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setShowPayInvoiceModal(true);
                                }}
                            >
                                Pay Invoice
                            </button>
                            <button
                                className="w-full p-4 bg-[#6B7280] text-white rounded-lg hover:bg-[#3B78BD] transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setShowQuickUseTokenModal(true);
                                }}
                            >
                                Quick Use Token
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showGenerateInvoiceModal && (
                <GenerateInvoiceModal
                    closeModal={() => setShowGenerateInvoiceModal(false)}
                    defaultCategory={paymentTarget?.category}
                    defaultReferenceNumber={paymentTarget?.referenceNumber}
                />
            )}

            {showPayInvoiceModal && (
                <PayInvoiceModal
                    closeModal={() => setShowPayInvoiceModal(false)}
                />
            )}

            {showQuickUseTokenModal && (
                <QuickUseTokenModal
                    closeModal={() => setShowQuickUseTokenModal(false)}
                />
            )}

            {showInsightsModal && selectedPayer && (
                <PayerInsightsModal
                    payer={selectedPayer}
                    closeModal={() => setShowInsightsModal(false)}
                />
            )}

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
    );
};

export default PayerManagement;