import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIndividuals, createIndividual, updateIndividual, getCorporates, createCorporate, updateCorporate } from '../../apis/authActions';
import IndividualModal from '../components/payerManagement/IndividualModal';
import CorporateModal from '../components/payerManagement/CorporateModal';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Individuals</h2>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <ul className="space-y-2">
                            {individuals.map(individual => (
                                <li
                                    key={individual.id}
                                    className="p-2 border rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        setSelectedIndividual(individual);
                                        setShowIndividualModal(true);
                                    }}
                                >
                                    <span>{individual.first_name} {individual.last_name}</span>
                                    <span className="font-bold">{individual.individual_ref}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Corporates</h2>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <ul className="space-y-2">
                            {corporates.map(corporate => (
                                <li
                                    key={corporate.id}
                                    className="p-2 border rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        setSelectedCorporate(corporate);
                                        setShowCorporateModal(true);
                                    }}
                                >
                                    <span>{corporate.company_name}</span>
                                    <span className="font-bold">{corporate.corporate_ref}</span>
                                </li>
                            ))}
                        </ul>
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
