import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIndividuals, createIndividual, updateIndividual, getCorporates, createCorporate, updateCorporate } from '../../apis/authActions';
import IndividualModal from '../components/payerManagement/IndividualModal';
import CorporateModal from '../components/payerManagement/CorporateModal';
import { AiOutlineSearch } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';

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
    const itemsPerPage = 10;

    useEffect(() => {
        fetchIndividuals();
        fetchCorporates();
    }, []);

    const fetchIndividuals = async () => {
        await getIndividuals(token, setIndividuals, setError, setLoading);
    };

    const fetchCorporates = async () => {
        await getCorporates(token, setCorporates, setError, setLoading);
    };

    const handleCreateIndividual = async (payload) => {
        try {
            const newIndividual = await createIndividual(token, payload);
            setIndividuals([...individuals, newIndividual]);
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
        individual.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        individual.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        individual.individual_ref.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCorporates = corporates.filter(corporate => 
        corporate.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        corporate.corporate_ref.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageClickIndividuals = ({ selected }) => {
        setCurrentPageIndividuals(selected);
    };

    const handlePageClickCorporates = ({ selected }) => {
        setCurrentPageCorporates(selected);
    };

    return (
        <div className="w-full p-4">
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-700">Payer Management</h1>
                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                        onClick={() => setShowIndividualModal(true)}
                    >
                        Add Individual
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300"
                        onClick={() => setShowCorporateModal(true)}
                    >
                        Add Corporate
                    </button>
                </div>
            </div>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search..."
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
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Individuals</h2>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b p-2">Name</th>
                                        <th className="border-b p-2">Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIndividuals.slice(currentPageIndividuals * itemsPerPage, (currentPageIndividuals + 1) * itemsPerPage).map(individual => (
                                        <tr
                                            key={individual.id}
                                            className="hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSelectedIndividual(individual);
                                                setShowIndividualModal(true);
                                            }}
                                        >
                                            <td className="border-b p-2">{individual.first_name} {individual.last_name}</td>
                                            <td className="border-b p-2 font-bold">{individual.individual_ref}</td>
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
                                pageLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-gray-300'}
                                previousClassName={'mx-2'}
                                previousLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-gray-300'}
                                nextClassName={'mx-2'}
                                nextLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-gray-300'}
                                activeClassName={'bg-blue-500 text-white'}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Corporates</h2>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b p-2">Company Name</th>
                                        <th className="border-b p-2">Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCorporates.slice(currentPageCorporates * itemsPerPage, (currentPageCorporates + 1) * itemsPerPage).map(corporate => (
                                        <tr
                                            key={corporate.id}
                                            className="hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSelectedCorporate(corporate);
                                                setShowCorporateModal(true);
                                            }}
                                        >
                                            <td className="border-b p-2">{corporate.company_name}</td>
                                            <td className="border-b p-2 font-bold">{corporate.corporate_ref}</td>
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
                                pageLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-gray-300'}
                                previousClassName={'mx-2'}
                                previousLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-gray-300'}
                                nextClassName={'mx-2'}
                                nextLinkClassName={'px-3 py-2 bg-gray-200 rounded hover:bg-gray-300'}
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
