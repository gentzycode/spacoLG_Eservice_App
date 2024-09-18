import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIndividuals, createIndividual, updateIndividual, getCorporates, createCorporate, updateCorporate } from '../../apis/authActions';
import IndividualModal from '../components/payerManagement/IndividualModal';
import CorporateModal from '../components/payerManagement/CorporateModal';
import { AiOutlineSearch, AiOutlineCopy, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { saveAs } from 'file-saver';
//import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PayerManagement = () => {
    const { token } = useContext(AuthContext);
    const [individuals, setIndividuals] = useState([]);
    const [corporates, setCorporates] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showIndividualModal, setShowIndividualModal] = useState(false);
    const [showCorporateModal, setShowCorporateModal] = useState(false);
    const [selectedIndividual, setSelectedIndividual] = useState(null);
    const [selectedCorporate, setSelectedCorporate] = useState(null);
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
            setShowIndividualModal(false);
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

    const maskNumber = (number) => {
        return number.replace(/.(?=.{4})/g, '*');
    };

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    const exportToCSV = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileName}.csv`);
    };

    const exportToPDF = (columns, data, fileName) => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [columns],
            body: data.map(row => columns.map(col => row[col.toLowerCase().replace(' ', '_')])),
        });
        doc.save(`${fileName}.pdf`);
    };

    const handleExportIndividuals = (format) => {
        const data = filteredIndividuals.map(ind => ({
            Name: `${ind.first_name} ${ind.last_name}`,
            Reference: ind.individual_ref,
            'Mobile Number': maskedMobileNumbers[ind.id] ? maskNumber(ind.mobile_number) : ind.mobile_number,
        }));
        const columns = ['Name', 'Reference', 'Mobile Number'];
        if (format === 'excel') {
            exportToExcel(data, 'Individuals');
        } else if (format === 'csv') {
            exportToCSV(data, 'Individuals');
        } else if (format === 'pdf') {
            exportToPDF(columns, data, 'Individuals');
        }
    };

    const handleExportCorporates = (format) => {
        const data = filteredCorporates.map(corp => ({
            'Company Name': corp.company_name,
            Reference: corp.corporate_ref,
            'Mobile Number': maskedMobileNumbers[corp.id] ? maskNumber(corp.phone_number) : corp.phone_number,
        }));
        const columns = ['Company Name', 'Reference', 'Mobile Number'];
        if (format === 'excel') {
            exportToExcel(data, 'Corporates');
        } else if (format === 'csv') {
            exportToCSV(data, 'Corporates');
        } else if (format === 'pdf') {
            exportToPDF(columns, data, 'Corporates');
        }
    };

    return (
        <div className="w-full p-4">
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-700">PAYER MANAGEMENT</h1>
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                        onClick={() => setShowIndividualModal(true)}
                    >
                        ADD INDIVIDUAL
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
                        onClick={() => setShowCorporateModal(true)}
                    >
                        ADD CORPORATE
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
                        <div className="flex space-x-2">
                            <button
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-300"
                                onClick={() => handleExportIndividuals('excel')}
                            >
                                Excel
                            </button>
                            <button
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition-all duration-300"
                                onClick={() => handleExportIndividuals('csv')}
                            >
                                CSV
                            </button>
                            <button
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-300"
                                onClick={() => handleExportIndividuals('pdf')}
                            >
                                PDF
                            </button>
                        </div>
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
                        <div className="flex space-x-2">
                            <button
                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-300"
                                onClick={() => handleExportCorporates('excel')}
                            >
                                Excel
                            </button>
                            <button
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition-all duration-300"
                                onClick={() => handleExportCorporates('csv')}
                            >
                                CSV
                            </button>
                            <button
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-300"
                                onClick={() => handleExportCorporates('pdf')}
                            >
                                PDF
                            </button>
                        </div>
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
            {showIndividualModal && (
                <IndividualModal
                    individual={selectedIndividual}
                    onClose={() => {
                        setShowIndividualModal(false);
                        setSelectedIndividual(null);
                    }}
                    onSave={selectedIndividual ? handleUpdateIndividual : handleCreateIndividual}
                />
            )}
            {showCorporateModal && (
                <CorporateModal
                    corporate={selectedCorporate}
                    onClose={() => {
                        setShowCorporateModal(false);
                        setSelectedCorporate(null);
                    }}
                    onSave={selectedCorporate ? handleUpdateCorporate : handleCreateCorporate}
                />
            )}
        </div>
    );
};

export default PayerManagement;
