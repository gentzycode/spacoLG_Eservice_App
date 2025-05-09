import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIndividuals, createIndividual, updateIndividual, getCorporates, createCorporate, updateCorporate } from '../../apis/authActions';
import IndividualModal from '../components/payerManagement/IndividualModal';
import CorporateModal from '../components/payerManagement/CorporateModal';
import GenerateInvoiceModal from '../components/invoices/GenerateInvoiceModal';
import PayInvoiceModal from '../components/invoices/PayInvoiceModal';
import QuickUseTokenModal from '../components/invoices/QuickUseTokenModal';
import AddIndividualModal from '../components/payerManagement/AddIndividualModal';
import PayerInsightsModal from '../components/payerManagement/PayerInsightsModal';
import PayerList from '../components/payerManagement/PayerList';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="text-red-500 text-center p-4">Something went wrong. Please try refreshing the page.</div>;
        }
        return this.props.children;
    }
}

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
    const [filterType, setFilterType] = useState('all');
    const [currentPageIndividuals, setCurrentPageIndividuals] = useState(0);
    const [currentPageCorporates, setCurrentPageCorporates] = useState(0);
    const [selectedIndividuals, setSelectedIndividuals] = useState([]);
    const [selectedCorporates, setSelectedCorporates] = useState([]);
    const [isIndividualCollapsed, setIsIndividualCollapsed] = useState(false);
    const [isCorporateCollapsed, setIsCorporateCollapsed] = useState(false);
    const itemsPerPage = 5;

    const chartRefs = {
        doughnutRef: useRef(null),
        barRef: useRef(null),
        lineRef: useRef(null),
        pieRef: useRef(null),
    };
    const chartInstances = useRef({});

    useEffect(() => {
        fetchIndividuals();
        fetchCorporates();

        // Add event listeners for payment and insights modals
        const handlePaymentModal = (event) => {
            setSelectedPayer(event.detail);
            setPaymentTarget({
                category: event.detail.individual_ref
                    ? { value: 'individual', label: 'Individual' }
                    : { value: 'corporate', label: 'Corporate' },
                referenceNumber: event.detail.individual_ref || event.detail.corporate_ref
            });
            setShowPaymentModal(true);
        };

        const handleInsightsModal = (event) => {
            setSelectedPayer(event.detail);
            setShowInsightsModal(true);
        };

        window.addEventListener('openPaymentModal', handlePaymentModal);
        window.addEventListener('openInsightsModal', handleInsightsModal);

        return () => {
            window.removeEventListener('openPaymentModal', handlePaymentModal);
            window.removeEventListener('openInsightsModal', handleInsightsModal);
        };
    }, []);

    useEffect(() => {
        // Destroy existing charts
        Object.values(chartInstances.current).forEach(chart => chart?.destroy());

        // Doughnut Chart (Individuals vs. Corporates)
        if (chartRefs.doughnutRef.current) {
            chartInstances.current.doughnut = new Chart(chartRefs.doughnutRef.current.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Individuals', 'Corporates'],
                    datasets: [{
                        data: [individuals.length, corporates.length],
                        backgroundColor: ['#3B78BD', '#F0B652'],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } },
                },
            });
        }

        // Bar Chart (Individuals over Time)
        if (chartRefs.barRef.current) {
            chartInstances.current.bar = new Chart(chartRefs.barRef.current.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                    datasets: [{
                        label: 'Individuals',
                        data: [10, 20, 15, 25],
                        backgroundColor: '#3B78BD',
                    }],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { beginAtZero: true } },
                },
            });
        }

        // Line Chart (Corporates over Time)
        if (chartRefs.lineRef.current) {
            chartInstances.current.line = new Chart(chartRefs.lineRef.current.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                    datasets: [{
                        label: 'Corporates',
                        data: [5, 10, 8, 12],
                        borderColor: '#F0B652',
                        fill: false,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'top' } },
                    scales: { y: { beginAtZero: true } },
                },
            });
        }

        // Pie Chart (Payment Status)
        if (chartRefs.pieRef.current) {
            chartInstances.current.pie = new Chart(chartRefs.pieRef.current.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: ['Paid', 'Unpaid'],
                    datasets: [{
                        data: [70, 30],
                        backgroundColor: ['#4CAF50', '#F44336'],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } },
                },
            });
        }

        // Cleanup on unmount
        return () => {
            Object.values(chartInstances.current).forEach(chart => chart?.destroy());
            chartInstances.current = {};
        };
    }, [individuals, corporates]);

    const fetchIndividuals = () => {
        setLoading(true);
        getIndividuals(token, (data) => {
            setIndividuals(data);
        }, (err) => {
            setError(err.message || 'Failed to fetch individuals');
            console.error('Error fetching individuals:', err);
        }, () => setLoading(false));
    };

    const fetchCorporates = () => {
        setLoading(true);
        getCorporates(token, (data) => {
            setCorporates(data);
        }, (err) => {
            setError(err.message || 'Failed to fetch corporates');
            console.error('Error fetching corporates:', err);
        }, () => setLoading(false));
    };

    const handleCreateIndividual = async (payload) => {
        try {
            const newIndividual = await createIndividual(token, payload);
            setIndividuals([...individuals, newIndividual]);
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

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPageIndividuals(0);
        setCurrentPageCorporates(0);
    };

    const filteredIndividuals = individuals.filter(individual =>
        (individual.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         individual.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         individual.individual_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         individual.mobile_number?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === 'all' || filterType === 'individual')
    );

    const filteredCorporates = corporates.filter(corporate =>
        (corporate.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         corporate.corporate_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         corporate.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === 'all' || filterType === 'corporate')
    );

    const handlePageClickIndividuals = ({ selected }) => {
        setCurrentPageIndividuals(selected);
    };

    const handlePageClickCorporates = ({ selected }) => {
        setCurrentPageCorporates(selected);
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

    const onEditPayer = (payer) => {
        setSelectedPayer(payer);
        if (payer.individual_ref) {
            setShowIndividualModal(true);
        } else {
            setShowCorporateModal(true);
        }
    };

    return (
        <ErrorBoundary>
            <div className="w-full p-6 min-h-screen">
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Payer Management</h1>
                        <div className="flex space-x-3">
                            <button
                                className="px-4 py-2 bg-white text-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => setShowAddIndividualModal(true)}
                            >
                                Add Individual
                            </button>
                            <button
                                className="px-4 py-2 bg-white text-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => {
                                    setSelectedPayer(null);
                                    setShowCorporateModal(true);
                                }}
                            >
                                Add Corporate
                            </button>
                            <button
                                className="px-4 py-2 bg-white text-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => setShowGenerateInvoiceModal(true)}
                            >
                                Generate Invoice
                            </button>
                            <button
                                className="px-4 py-2 bg-white text-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => setShowPayInvoiceModal(true)}
                            >
                                Pay Invoice
                            </button>
                            <button
                                className="px-4 py-2 bg-white text-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                                onClick={() => setShowQuickUseTokenModal(true)}
                            >
                                Quick Use Token
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h4 className="text-md font-semibold text-gray-700 mb-2">Individuals vs. Corporates</h4>
                            <canvas ref={chartRefs.doughnutRef} className="w-40 h-40 mx-auto"></canvas>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h4 className="text-md font-semibold text-gray-700 mb-2">Individuals Over Time</h4>
                            <canvas ref={chartRefs.barRef} className="w-40 h-40 mx-auto"></canvas>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h4 className="text-md font-semibold text-gray-700 mb-2">Corporates Over Time</h4>
                            <canvas ref={chartRefs.lineRef} className="w-40 h-40 mx-auto"></canvas>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h4 className="text-md font-semibold text-gray-700 mb-2">Payment Status</h4>
                            <canvas ref={chartRefs.pieRef} className="w-40 h-40 mx-auto"></canvas>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search by name, reference, or mobile..."
                                className="w-full sm:w-64 p-3 border rounded-l-lg focus:ring-2 focus:ring-[#F0B652] transition-all duration-200"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <button className="px-4 py-3 bg-[#F0B652] text-white rounded-r-lg hover:bg-[#3B78BD] transition-all duration-300">
                                <AiOutlineSearch size={24} />
                            </button>
                        </div>
                        <div className="flex space-x-3">
                            <div className="relative">
                                <select
                                    value={filterType}
                                    onChange={handleFilterChange}
                                    className="appearance-none w-40 p-3 border rounded-lg focus:ring-2 focus:ring-[#F0B652] transition-all duration-200"
                                >
                                    <option value="all">All Payers</option>
                                    <option value="individual">Individuals</option>
                                    <option value="corporate">Corporates</option>
                                </select>
                                <AiOutlineFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
                            </div>
                            <button
                                className="px-4 py-3 bg-white text-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white transition-all duration-300"
                                onClick={handleBulkGenerateInvoice}
                                disabled={selectedIndividuals.length + selectedCorporates.length === 0}
                            >
                                Bulk Generate Invoice
                            </button>
                            <button
                                className="px-4 py-3 bg-white text-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white transition-all duration-300"
                                onClick={exportToPDF}
                            >
                                Export to PDF
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#3B78BD]">Individuals</h2>
                                <button onClick={() => setIsIndividualCollapsed(!isIndividualCollapsed)} className="text-[#3B78BD] hover:text-[#F0B652]">
                                    {isIndividualCollapsed ? 'Expand' : 'Collapse'}
                                </button>
                            </div>
                            {!isIndividualCollapsed && (
                                <PayerList
                                    title="Individuals"
                                    payers={filteredIndividuals.slice(currentPageIndividuals * itemsPerPage, (currentPageIndividuals + 1) * itemsPerPage)}
                                    onEdit={onEditPayer}
                                    onSelect={handleSelectIndividual}
                                    selectedPayers={selectedIndividuals}
                                    loading={loading}
                                    type="individual"
                                    pageCount={Math.ceil(filteredIndividuals.length / itemsPerPage)}
                                    onPageChange={handlePageClickIndividuals}
                                    currentPage={currentPageIndividuals}
                                />
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#3B78BD]">Corporates</h2>
                                <button onClick={() => setIsCorporateCollapsed(!isCorporateCollapsed)} className="text-[#3B78BD] hover:text-[#F0B652]">
                                    {isCorporateCollapsed ? 'Expand' : 'Collapse'}
                                </button>
                            </div>
                            {!isCorporateCollapsed && (
                                <PayerList
                                    title="Corporates"
                                    payers={filteredCorporates.slice(currentPageCorporates * itemsPerPage, (currentPageCorporates + 1) * itemsPerPage)}
                                    onEdit={onEditPayer}
                                    onSelect={handleSelectCorporate}
                                    selectedPayers={selectedCorporates}
                                    loading={loading}
                                    type="corporate"
                                    pageCount={Math.ceil(filteredCorporates.length / itemsPerPage)}
                                    onPageChange={handlePageClickCorporates}
                                    currentPage={currentPageCorporates}
                                />
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

                    {showCorporateModal && (
                        <CorporateModal
                            closeModal={() => {
                                setShowCorporateModal(false);
                                setSelectedPayer(null);
                            }}
                            corporate={selectedPayer}
                            viewMode={true}
                            onSave={selectedPayer ? handleUpdateCorporate : handleCreateCorporate}
                        />
                    )}

                    {showPaymentModal && selectedPayer && (
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
                                                category: selectedPayer.individual_ref
                                                    ? { value: 'individual', label: 'Individual' }
                                                    : { value: 'corporate', label: 'Corporate' },
                                                referenceNumber: selectedPayer.individual_ref || selectedPayer.corporate_ref
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
                </div>

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
        </ErrorBoundary>
    );
};

export default PayerManagement;