import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIndividuals, createIndividual, updateIndividual, getCorporates, createCorporate, updateCorporate } from '../../apis/authActions';
import IndividualModal from '../components/payerManagement/IndividualModal';
import CorporateModal from '../components/payerManagement/CorporateModal';
import GenerateInvoiceModal from '../components/invoices/GenerateInvoiceModal';
import PayInvoiceModal from '../components/invoices/PayInvoiceModal';
import QuickUseTokenModal from '../components/invoices/QuickUseTokenModal';
import AddIndividualModal from '../components/payerManagement/AddIndividualModal';
import { AiOutlineSearch, AiOutlineCopy, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineDollar, AiOutlineClose } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';

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
    const [selectedIndividual, setSelectedIndividual] = useState(null);
    const [selectedCorporate, setSelectedCorporate] = useState(null);
    const [paymentTarget, setPaymentTarget] = useState(null);
    const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
    const [showPayInvoiceModal, setShowPayInvoiceModal] = useState(false);
    const [showQuickUseTokenModal, setShowQuickUseTokenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageIndividuals, setCurrentPageIndividuals] = useState(0);
    const [currentPageCorporates, setCurrentPageCorporates] = useState(0);
    const [maskedMobileNumbers, setMaskedMobileNumbers] = useState({});
    const itemsPerPage = 10;

    useEffect(() => {
        fetchIndividuals();
        fetchCorporates();
    }, []);

    const fetchIndividuals = async () => {
        await getIndividuals(token, (data) => {
            setIndividuals(data);
            setMaskedMobileNumbers(data.reduce((acc, individual) => {
                acc[individual.id] = true;
                return acc;
            }, {}));
        }, setError, setLoading);
    };

    const fetchCorporates = async () => {
        await getCorporates(token, (data) => {
            setCorporates(data);
            setMaskedMobileNumbers(data.reduce((acc, corporate) => {
                acc[corporate.id] = true;
                return acc;
            }, {}));
        }, setError, setLoading);
    };

    const handleCreateIndividual = async (payload) => {
        try {
            const newIndividual = await createIndividual(token, payload);
            setIndividuals([...individuals, newIndividual]);
            setMaskedMobileNumbers(prevState => ({ ...prevState, [newIndividual.id]: true }));
            setShowAddIndividualModal(false); // Close AddIndividualModal after creation
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateIndividual = async (id, payload) => {
        try {
            const updatedIndividual = await updateIndividual(token, id, payload);
            setIndividuals(individuals.map(ind => ind.id === id ? updatedIndividual : ind));
            setShowIndividualModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateCorporate = async (payload) => {
        try {
            const newCorporate = await createCorporate(token, payload);
            setCorporates([...corporates, newCorporate]);
            setMaskedMobileNumbers(prevState => ({ ...prevState, [newCorporate.id]: true }));
            setShowCorporateModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateCorporate = async (id, payload) => {
        try {
            const updatedCorporate = await updateCorporate(token, id, payload);
            setCorporates(corporates.map(corp => corp.id === id ? updatedCorporate : corp));
            setShowCorporateModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredIndividuals = individuals.filter(individual =>
        individual.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        individual.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        individual.individual_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        individual.mobile_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCorporates = corporates.filter(corporate =>
        corporate.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        corporate.corporate_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        corporate.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
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
        setMaskedMobileNumbers(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const openPaymentModal = (target) => {
        setPaymentTarget(target);
        setShowPaymentModal(true);
    };

    const openGenerateInvoiceModal = () => {
        setPaymentTarget(null); // Reset the paymentTarget
        setShowGenerateInvoiceModal(true);
    };

    return (
        <div className="w-full p-4">
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-700">PAYER MANAGEMENT</h1>
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                        onClick={() => setShowAddIndividualModal(true)}
                    >
                        ADD INDIVIDUAL
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
                        onClick={() => {
                            setSelectedCorporate(null); // Set to null for new entry
                            setShowCorporateModal(true);
                        }}
                    >
                        ADD CORPORATE
                    </button>
                    <button
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all duration-300"
                        onClick={openGenerateInvoiceModal}
                    >
                        GENERATE INVOICE
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                        onClick={() => setShowPayInvoiceModal(true)}
                    >
                        PAY INVOICE
                    </button>
                    <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all duration-300"
                        onClick={() => setShowQuickUseTokenModal(true)}
                    >
                        QUICK USE TOKEN
                    </button>
                </div>
            </div>

            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="SEARCH..."
                    className="w-full p-2 border rounded-l-lg"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className="px-4 py-2 bg-gray-300 rounded-r-lg">
                    <AiOutlineSearch size={24} />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">INDIVIDUALS</h2>
                    </div>
                    {loading ? (
                        <div className="text-center">LOADING...</div>
                    ) : (
                        <div>
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr>
                                        <th className="p-2 bg-gray-100 border border-gray-200">NAME</th>
                                        <th className="p-2 bg-gray-100 border border-gray-200">REFERENCE</th>
                                        <th className="p-2 bg-gray-100 border border-gray-200">MOBILE NUMBER</th>
                                        <th className="p-2 bg-gray-100 border border-gray-200">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIndividuals.slice(currentPageIndividuals * itemsPerPage, (currentPageIndividuals + 1) * itemsPerPage).map((individual, index) => (
                                        <tr
                                            key={individual.id}
                                            className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-[#ecf6ec]'} hover:bg-gray-100`}
                                            onClick={() => {
                                                setSelectedIndividual(individual);
                                                setShowIndividualModal(true);
                                            }}
                                        >
                                            <td className="p-2 border border-gray-200">{`${individual.first_name?.toUpperCase()} ${individual.last_name?.toUpperCase()}`}</td>
                                            <td className="p-2 border border-gray-200 font-bold">{individual.individual_ref?.toUpperCase()}</td>
                                            <td className="p-2 border border-gray-200">
                                                {maskedMobileNumbers[individual.id] ? maskNumber(individual.mobile_number) : individual.mobile_number}
                                            </td>
                                            <td className="p-2 border border-gray-200 text-center flex justify-center items-center space-x-2">
                                                <AiOutlineCopy
                                                    size={20}
                                                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click event
                                                        handleCopyReference(individual.individual_ref);
                                                    }}
                                                />
                                                {maskedMobileNumbers[individual.id] ? (
                                                    <AiOutlineEyeInvisible
                                                        size={20}
                                                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(individual.id);
                                                        }}
                                                    />
                                                ) : (
                                                    <AiOutlineEye
                                                        size={20}
                                                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(individual.id);
                                                        }}
                                                    />
                                                )}
                                                <AiOutlineDollar
                                                    size={20}
                                                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click event
                                                        openPaymentModal(individual);
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
                                pageLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-blue-300'}
                                previousClassName={'mx-2'}
                                previousLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-blue-300'}
                                nextClassName={'mx-2'}
                                nextLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-blue-300'}
                                activeClassName={'bg-blue-500 text-white'}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">CORPORATES</h2>
                    </div>
                    {loading ? (
                        <div className="text-center">LOADING...</div>
                    ) : (
                        <div>
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr>
                                        <th className="p-2 bg-gray-100 border border-gray-200">COMPANY NAME</th>
                                        <th className="p-2 bg-gray-100 border border-gray-200">REFERENCE</th>
                                        <th className="p-2 bg-gray-100 border border-gray-200">MOBILE NUMBER</th>
                                        <th className="p-2 bg-gray-100 border border-gray-200">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCorporates.slice(currentPageCorporates * itemsPerPage, (currentPageCorporates + 1) * itemsPerPage).map((corporate, index) => (
                                        <tr
                                            key={corporate.id}
                                            className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-[#ecf6ec]'} hover:bg-gray-100`}
                                            onClick={() => {
                                                setSelectedCorporate(corporate);
                                                setShowCorporateModal(true);
                                            }}
                                        >
                                            <td className="p-2 border border-gray-200">{corporate.company_name?.toUpperCase()}</td>
                                            <td className="p-2 border border-gray-200 font-bold">{corporate.corporate_ref?.toUpperCase()}</td>
                                            <td className="p-2 border border-gray-200">
                                                {maskedMobileNumbers[corporate.id] ? maskNumber(corporate.phone_number) : corporate.phone_number}
                                            </td>
                                            <td className="p-2 border border-gray-200 text-center flex justify-center items-center space-x-2">
                                                <AiOutlineCopy
                                                    size={20}
                                                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click event
                                                        handleCopyReference(corporate.corporate_ref);
                                                    }}
                                                />
                                                {maskedMobileNumbers[corporate.id] ? (
                                                    <AiOutlineEyeInvisible
                                                        size={20}
                                                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(corporate.id);
                                                        }}
                                                    />
                                                ) : (
                                                    <AiOutlineEye
                                                        size={20}
                                                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMask(corporate.id);
                                                        }}
                                                    />
                                                )}
                                                <AiOutlineDollar
                                                    size={20}
                                                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click event
                                                        openPaymentModal(corporate);
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
                                pageLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-blue-300'}
                                previousClassName={'mx-2'}
                                previousLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-blue-300'}
                                nextClassName={'mx-2'}
                                nextLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-blue-300'}
                                activeClassName={'bg-blue-500 text-white'}
                            />
                        </div>
                    )}
                </div>
            </div>

            {showAddIndividualModal && (
                <AddIndividualModal
                    closeModal={() => setShowAddIndividualModal(false)}
                    onSave={fetchIndividuals}  // Assuming you want to refresh the list after saving
                />
            )}

            {showIndividualModal && selectedIndividual && (
                <AddIndividualModal
                    closeModal={() => {
                        setShowIndividualModal(false);
                        setSelectedIndividual(null);
                    }}
                    individual={selectedIndividual}
                    viewMode={true}  // Set to true to open in view-only mode initially
                    onSave={fetchIndividuals}  // Refresh the list after saving changes
                />
            )}

            {showCorporateModal && (
                <CorporateModal
                    closeModal={() => {
                        setShowCorporateModal(false);
                        setSelectedCorporate(null);
                    }}
                    corporate={selectedCorporate}  // Can be null for new entry
                    viewMode={!!selectedCorporate}  // Opens in view mode if editing an existing corporate
                    onSave={fetchCorporates}  // Assuming you want to refresh the list after saving
                />
            )}

            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Make Payment</h2>
                            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={() => setShowPaymentModal(false)}>
                                <AiOutlineClose size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all duration-300"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setShowGenerateInvoiceModal(true);
                                    setPaymentTarget({
                                        category: paymentTarget.individual_ref
                                            ? { value: 'individual', label: 'Individual' }
                                            : { value: 'corporate', label: 'Corporate' },
                                        referenceNumber: paymentTarget.individual_ref
                                            ? paymentTarget.individual_ref
                                            : paymentTarget.corporate_ref
                                    });
                                }}
                            >
                                Generate Invoice
                            </button>
                            <button
                                className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-all duration-300"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setShowPayInvoiceModal(true);
                                }}
                            >
                                Pay Invoice
                            </button>
                            <button
                                className="w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition-all duration-300"
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
        </div>
    );
};

export default PayerManagement;
