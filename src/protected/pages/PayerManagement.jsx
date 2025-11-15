import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getIndividuals, createIndividual, updateIndividual, getCorporates, createCorporate, updateCorporate } from '../../apis/authActions';
import IndividualModal from '../components/payerManagement/IndividualModalEnhanced';
import CorporateModal from '../components/payerManagement/CorporateModal';
import GenerateInvoiceModal from '../components/invoices/GenerateInvoiceModal';
import BulkInvoiceModal from '../components/invoices/BulkInvoiceModal';
import PayInvoiceModal from '../components/invoices/PayInvoiceModal';
import QuickUseTokenModal from '../components/invoices/QuickUseTokenModal';
import PayerInsightsModal from '../components/payerManagement/PayerInsightsModal';
import PayerList from '../components/payerManagement/PayerList';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineClose, AiOutlineUser, AiOutlineTeam, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlinePlus, AiOutlineFileText, AiOutlineDollarCircle, AiOutlineThunderbolt, AiOutlineDownload } from 'react-icons/ai';
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
            return (
                <div className="text-red-500 dark:text-red-400 text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    Something went wrong. Please try refreshing the page.
                </div>
            );
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
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showInsightsModal, setShowInsightsModal] = useState(false);
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [paymentTarget, setPaymentTarget] = useState(null);
    const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
    const [showBulkInvoiceModal, setShowBulkInvoiceModal] = useState(false);
    const [showPayInvoiceModal, setShowPayInvoiceModal] = useState(false);
    const [showQuickUseTokenModal, setShowQuickUseTokenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [currentPageIndividuals, setCurrentPageIndividuals] = useState(0);
    const [currentPageCorporates, setCurrentPageCorporates] = useState(0);
    const [selectedIndividuals, setSelectedIndividuals] = useState([]);
    const [selectedCorporates, setSelectedCorporates] = useState([]);
    const [showStatsCharts, setShowStatsCharts] = useState(false);
    const [activeTab, setActiveTab] = useState('individuals'); // 'individuals' or 'corporates'
    const itemsPerPage = 10;

    const chartRefs = {
        miniDoughnutRef: useRef(null),
        miniBarRef: useRef(null),
    };
    const chartInstances = useRef({});

    // Memoized fetch functions
    const fetchIndividuals = useCallback(() => {
        setLoading(true);
        getIndividuals(token, (data) => {
            setIndividuals(data);
        }, (err) => {
            setError(err.message || 'Failed to fetch individuals');
            console.error('Error fetching individuals:', err);
        }, () => setLoading(false));
    }, [token]);

    const fetchCorporates = useCallback(() => {
        setLoading(true);
        getCorporates(token, (data) => {
            setCorporates(data);
        }, (err) => {
            setError(err.message || 'Failed to fetch corporates');
            console.error('Error fetching corporates:', err);
        }, () => setLoading(false));
    }, [token]);

    // Memoized event handlers
    const handlePaymentModal = useCallback((event) => {
        setSelectedPayer(event.detail);
        setPaymentTarget({
            category: event.detail.individual_ref
                ? { value: 'individual', label: 'Individual' }
                : { value: 'corporate', label: 'Corporate' },
            referenceNumber: event.detail.individual_ref || event.detail.corporate_ref
        });
        setShowPaymentModal(true);
    }, []);

    const handleInsightsModal = useCallback((event) => {
        setSelectedPayer(event.detail);
        setShowInsightsModal(true);
    }, []);

    useEffect(() => {
        fetchIndividuals();
        fetchCorporates();

        // Add event listeners for payment and insights modals
        window.addEventListener('openPaymentModal', handlePaymentModal);
        window.addEventListener('openInsightsModal', handleInsightsModal);

        return () => {
            window.removeEventListener('openPaymentModal', handlePaymentModal);
            window.removeEventListener('openInsightsModal', handleInsightsModal);
            // Cleanup charts
            Object.values(chartInstances.current).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
        };
    }, [fetchIndividuals, fetchCorporates, handlePaymentModal, handleInsightsModal]);

    // Mini charts for stats section
    useEffect(() => {
        if (showStatsCharts && individuals.length > 0 && corporates.length > 0) {
            // Cleanup existing charts
            Object.values(chartInstances.current).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });

            // Mini Doughnut Chart
            if (chartRefs.miniDoughnutRef.current) {
                const ctx = chartRefs.miniDoughnutRef.current.getContext('2d');
                chartInstances.current.miniDoughnut = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Individuals', 'Corporates'],
                        datasets: [{
                            data: [individuals.length, corporates.length],
                            backgroundColor: ['rgb(59, 120, 189)', 'rgb(240, 182, 82)'],
                            borderWidth: 0,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                    },
                });
            }

            // Mini Bar Chart
            if (chartRefs.miniBarRef.current) {
                const ctx = chartRefs.miniBarRef.current.getContext('2d');
                chartInstances.current.miniBar = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Paid', 'Unpaid'],
                        datasets: [{
                            label: 'Status',
                            data: [70, 30],
                            backgroundColor: ['rgb(76, 175, 80)', 'rgb(244, 67, 54)'],
                            borderWidth: 0,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { display: false },
                            x: { display: false }
                        },
                    },
                });
            }
        }
    }, [showStatsCharts, individuals.length, corporates.length]);

    const handleSaveIndividual = useCallback(async (id, payload) => {
        try {
            if (id) {
                await updateIndividual(token, id, payload);
                setIndividuals(prev => prev.map(ind => ind.id === id ? { ...ind, ...payload } : ind));
            } else {
                const newIndividual = await createIndividual(token, payload);
                setIndividuals(prev => [...prev, newIndividual]);
            }
            setShowIndividualModal(false);
            setSelectedPayer(null);
        } catch (err) {
            setError(err.message);
            console.error('Error saving individual:', err);
            throw err;
        }
    }, [token]);

    const handleSaveCorporate = useCallback(async (id, payload) => {
        try {
            if (id) {
                await updateCorporate(token, id, payload);
                setCorporates(prev => prev.map(corp => corp.id === id ? { ...corp, ...payload } : corp));
            } else {
                const newCorporate = await createCorporate(token, payload);
                setCorporates(prev => [...prev, newCorporate]);
            }
            setShowCorporateModal(false);
            setSelectedPayer(null);
        } catch (err) {
            setError(err.message);
            console.error('Error saving corporate:', err);
            throw err;
        }
    }, [token]);

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPageIndividuals(0);
        setCurrentPageCorporates(0);
    }, []);

    const handleFilterChange = useCallback((e) => {
        setFilterType(e.target.value);
        setCurrentPageIndividuals(0);
        setCurrentPageCorporates(0);
    }, []);

    const filteredIndividuals = useMemo(() =>
        individuals.filter(individual =>
            (individual.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             individual.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             individual.individual_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             individual.mobile_number?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterType === 'all' || filterType === 'individual')
        ),
        [individuals, searchTerm, filterType]
    );

    const filteredCorporates = useMemo(() =>
        corporates.filter(corporate =>
            (corporate.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             corporate.corporate_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             corporate.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterType === 'all' || filterType === 'corporate')
        ),
        [corporates, searchTerm, filterType]
    );

    const handlePageClickIndividuals = useCallback(({ selected }) => {
        setCurrentPageIndividuals(selected);
    }, []);

    const handlePageClickCorporates = useCallback(({ selected }) => {
        setCurrentPageCorporates(selected);
    }, []);

    const handleSelectIndividual = useCallback((id) => {
        setSelectedIndividuals(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    }, []);

    const handleSelectCorporate = useCallback((id) => {
        setSelectedCorporates(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    }, []);

    const handleBulkGenerateInvoice = useCallback(() => {
        if (selectedIndividuals.length + selectedCorporates.length === 0) {
            alert('Please select at least one payer');
            return;
        }
        // Open dedicated bulk invoice modal instead of regular generate invoice modal
        setShowBulkInvoiceModal(true);
    }, [selectedIndividuals, selectedCorporates]);

    const exportToPDF = useCallback(() => {
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
    }, [individuals, corporates]);

    const onEditPayer = useCallback((payer) => {
        setSelectedPayer(payer);
        if (payer.individual_ref) {
            setShowIndividualModal(true);
        } else {
            setShowCorporateModal(true);
        }
    }, []);

    const paginatedIndividuals = useMemo(() =>
        filteredIndividuals.slice(currentPageIndividuals * itemsPerPage, (currentPageIndividuals + 1) * itemsPerPage),
        [filteredIndividuals, currentPageIndividuals, itemsPerPage]
    );

    const paginatedCorporates = useMemo(() =>
        filteredCorporates.slice(currentPageCorporates * itemsPerPage, (currentPageCorporates + 1) * itemsPerPage),
        [filteredCorporates, currentPageCorporates, itemsPerPage]
    );

    const individualsPageCount = useMemo(() =>
        Math.ceil(filteredIndividuals.length / itemsPerPage),
        [filteredIndividuals.length, itemsPerPage]
    );

    const corporatesPageCount = useMemo(() =>
        Math.ceil(filteredCorporates.length / itemsPerPage),
        [filteredCorporates.length, itemsPerPage]
    );

    return (
        <ErrorBoundary>
            <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
                {error && (
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <span>{error}</span>
                            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                                <AiOutlineClose size={20} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Payer Management</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage individuals and corporate payers efficiently</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="px-5 py-2.5 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 shadow-md flex items-center space-x-2 font-semibold"
                                onClick={() => setShowGenerateInvoiceModal(true)}
                            >
                                <AiOutlineFileText size={20} />
                                <span>Generate Invoice</span>
                            </button>
                            <button
                                className="px-5 py-2.5 bg-white dark:bg-gray-800 text-[#3B78BD] border-2 border-[#3B78BD] rounded-lg hover:bg-[#3B78BD] hover:text-white transition-all duration-300 shadow-md flex items-center space-x-2 font-semibold"
                                onClick={() => setShowPayInvoiceModal(true)}
                            >
                                <AiOutlineDollarCircle size={20} />
                                <span>Pay Invoice</span>
                            </button>
                        </div>
                    </div>

                    {/* Compact Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 rounded-lg shadow-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Individuals</p>
                                    <h3 className="text-3xl font-bold mt-1">{individuals.length}</h3>
                                </div>
                                <AiOutlineUser size={40} className="opacity-80" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 p-6 rounded-lg shadow-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Corporates</p>
                                    <h3 className="text-3xl font-bold mt-1">{corporates.length}</h3>
                                </div>
                                <AiOutlineTeam size={40} className="opacity-80" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-6 rounded-lg shadow-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Active Payers</p>
                                    <h3 className="text-3xl font-bold mt-1">{individuals.length + corporates.length}</h3>
                                </div>
                                <AiOutlineCheckCircle size={40} className="opacity-80" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-6 rounded-lg shadow-lg text-white cursor-pointer" onClick={() => setShowStatsCharts(!showStatsCharts)}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">View Analytics</p>
                                    <h3 className="text-lg font-semibold mt-1">{showStatsCharts ? 'Hide Charts' : 'Show Charts'}</h3>
                                </div>
                                <AiOutlineDollarCircle size={40} className="opacity-80" />
                            </div>
                        </div>
                    </div>

                    {/* Collapsible Mini Charts */}
                    {showStatsCharts && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fadeIn">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Payer Distribution</h4>
                                <div className="h-32">
                                    <canvas ref={chartRefs.miniDoughnutRef}></canvas>
                                </div>
                                <div className="flex justify-center space-x-4 mt-3 text-xs">
                                    <div className="flex items-center"><div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div> Individuals</div>
                                    <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div> Corporates</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Payment Status</h4>
                                <div className="h-32">
                                    <canvas ref={chartRefs.miniBarRef}></canvas>
                                </div>
                                <div className="flex justify-center space-x-4 mt-3 text-xs">
                                    <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div> Paid (70%)</div>
                                    <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div> Unpaid (30%)</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search and Filter Section */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 flex items-center w-full">
                                <input
                                    type="text"
                                    placeholder="Search by name, reference, or mobile..."
                                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-l-lg focus:ring-2 focus:ring-[#3B78BD] focus:outline-none"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <button className="px-5 py-3 bg-[#3B78BD] text-white rounded-r-lg hover:bg-[#F0B652] transition-all duration-300">
                                    <AiOutlineSearch size={24} />
                                </button>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:flex-initial">
                                    <select
                                        value={filterType}
                                        onChange={handleFilterChange}
                                        className="appearance-none w-full md:w-40 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3B78BD] focus:outline-none pr-10"
                                    >
                                        <option value="all">All Payers</option>
                                        <option value="individual">Individuals</option>
                                        <option value="corporate">Corporates</option>
                                    </select>
                                    <AiOutlineFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none" size={20} />
                                </div>

                                <button
                                    className="px-4 py-3 bg-white dark:bg-gray-800 text-[#3B78BD] border border-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white hover:border-[#F0B652] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    onClick={handleBulkGenerateInvoice}
                                    disabled={selectedIndividuals.length + selectedCorporates.length === 0}
                                >
                                    Bulk Invoice
                                </button>

                                <button
                                    className="px-4 py-3 bg-white dark:bg-gray-800 text-[#3B78BD] border border-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white hover:border-[#F0B652] transition-all duration-300 whitespace-nowrap"
                                    onClick={exportToPDF}
                                >
                                    Export PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabbed Payers Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('individuals')}
                                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                                    activeTab === 'individuals'
                                        ? 'bg-[#3B78BD] text-white border-b-4 border-[#F0B652]'
                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <AiOutlineUser size={24} />
                                <span>Individuals</span>
                                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                                    activeTab === 'individuals'
                                        ? 'bg-white text-[#3B78BD]'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                    {filteredIndividuals.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab('corporates')}
                                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                                    activeTab === 'corporates'
                                        ? 'bg-[#3B78BD] text-white border-b-4 border-[#F0B652]'
                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <AiOutlineTeam size={24} />
                                <span>Corporates</span>
                                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                                    activeTab === 'corporates'
                                        ? 'bg-white text-[#3B78BD]'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                    {filteredCorporates.length}
                                </span>
                            </button>
                        </div>

                        {/* Tab Header with Actions */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        {activeTab === 'individuals' ? 'Individual Payers' : 'Corporate Payers'}
                                    </h2>
                                    {((activeTab === 'individuals' && selectedIndividuals.length > 0) ||
                                      (activeTab === 'corporates' && selectedCorporates.length > 0)) && (
                                        <span className="px-3 py-1 bg-[#F0B652] text-white rounded-full text-sm font-semibold">
                                            {activeTab === 'individuals' ? selectedIndividuals.length : selectedCorporates.length} selected
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPayer(null);
                                            if (activeTab === 'individuals') {
                                                setShowIndividualModal(true);
                                            } else {
                                                setShowCorporateModal(true);
                                            }
                                        }}
                                        className="px-4 py-2 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 flex items-center space-x-2 shadow-md"
                                    >
                                        <AiOutlinePlus size={18} />
                                        <span>Add {activeTab === 'individuals' ? 'Individual' : 'Corporate'}</span>
                                    </button>

                                    <button
                                        onClick={exportToPDF}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-[#3B78BD] border border-[#3B78BD] rounded-lg hover:bg-[#F0B652] hover:text-white hover:border-[#F0B652] transition-all duration-300 flex items-center space-x-2 shadow-md"
                                    >
                                        <AiOutlineDownload size={18} />
                                        <span>Export</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'individuals' ? (
                                <PayerList
                                    title="Individuals"
                                    payers={paginatedIndividuals}
                                    onEdit={onEditPayer}
                                    onSelect={handleSelectIndividual}
                                    selectedPayers={selectedIndividuals}
                                    loading={loading}
                                    type="individual"
                                    pageCount={individualsPageCount}
                                    onPageChange={handlePageClickIndividuals}
                                    currentPage={currentPageIndividuals}
                                />
                            ) : (
                                <PayerList
                                    title="Corporates"
                                    payers={paginatedCorporates}
                                    onEdit={onEditPayer}
                                    onSelect={handleSelectCorporate}
                                    selectedPayers={selectedCorporates}
                                    loading={loading}
                                    type="corporate"
                                    pageCount={corporatesPageCount}
                                    onPageChange={handlePageClickCorporates}
                                    currentPage={currentPageCorporates}
                                />
                            )}
                        </div>
                    </div>

                    {/* Modals */}
                    {showIndividualModal && (
                        <IndividualModal
                            closeModal={() => {
                                setShowIndividualModal(false);
                                setSelectedPayer(null);
                            }}
                            individual={selectedPayer}
                            viewMode={!!selectedPayer}
                            onSave={handleSaveIndividual}
                        />
                    )}

                    {showCorporateModal && (
                        <CorporateModal
                            closeModal={() => {
                                setShowCorporateModal(false);
                                setSelectedPayer(null);
                            }}
                            corporate={selectedPayer}
                            viewMode={!!selectedPayer}
                            onSave={handleSaveCorporate}
                        />
                    )}

                    {showGenerateInvoiceModal && (
                        <GenerateInvoiceModal
                            closeModal={() => setShowGenerateInvoiceModal(false)}
                            paymentTarget={paymentTarget}
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

                    {showBulkInvoiceModal && (
                        <BulkInvoiceModal
                            closeModal={() => {
                                setShowBulkInvoiceModal(false);
                                setSelectedIndividuals([]);
                                setSelectedCorporates([]);
                            }}
                            selectedPayers={activeTab === 'individuals'
                                ? individuals.filter(p => selectedIndividuals.includes(p.id))
                                : corporates.filter(p => selectedCorporates.includes(p.id))}
                            payerType={activeTab === 'individuals' ? 'individual' : 'corporate'}
                        />
                    )}

                    {showInsightsModal && selectedPayer && (
                        <PayerInsightsModal
                            closeModal={() => {
                                setShowInsightsModal(false);
                                setSelectedPayer(null);
                            }}
                            payer={selectedPayer}
                        />
                    )}

                    {/* Payment Modal */}
                    {showPaymentModal && selectedPayer && (
                        <div className="fixed inset-0 bg-gray-900/75 dark:bg-black/85 flex items-center justify-center z-50 p-4 overflow-auto">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Choose Payment Method</h2>
                                    <button
                                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                        onClick={() => setShowPaymentModal(false)}
                                    >
                                        <AiOutlineClose size={24} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        className="p-6 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 shadow-md flex flex-col items-center space-y-2"
                                        onClick={() => {
                                            setShowPaymentModal(false);
                                            setShowGenerateInvoiceModal(true);
                                        }}
                                    >
                                        <AiOutlineFileText size={32} />
                                        <span className="font-semibold">Generate Invoice</span>
                                    </button>
                                    <button
                                        className="p-6 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 shadow-md flex flex-col items-center space-y-2"
                                        onClick={() => {
                                            setShowPaymentModal(false);
                                            setShowPayInvoiceModal(true);
                                        }}
                                    >
                                        <AiOutlineDollarCircle size={32} />
                                        <span className="font-semibold">Pay Invoice</span>
                                    </button>
                                    <button
                                        className="p-6 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 shadow-md flex flex-col items-center space-y-2"
                                        onClick={() => {
                                            setShowPaymentModal(false);
                                            setShowQuickUseTokenModal(true);
                                        }}
                                    >
                                        <AiOutlineThunderbolt size={32} />
                                        <span className="font-semibold">Quick Token</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default PayerManagement;
