import React, { useState, useEffect, useContext } from 'react';
import {
    FaPlus, FaCheckCircle, FaSearch, FaFilter, FaTimes, FaSave,
    FaTicketAlt, FaCar, FaStore, FaCalendarAlt, FaMoneyBillWave,
    FaPrint, FaDownload, FaEye, FaEdit, FaTrash, FaCreditCard
} from 'react-icons/fa';
import { MdDirectionsCar, MdLocalTaxi } from 'react-icons/md';
import InitLoader from '../../common/InitLoader';
import TicketReceipt from '../components/TicketReceipt';
import DailyTicketPaymentModal from '../components/DailyTicketPaymentModal';
import {
    fetchDailyTickets,
    fetchDailyPaymentItems,
    issueDailyTicket,
    bulkIssueDailyTickets,
    markTicketAsPaid,
    updateDailyTicket,
    deleteDailyTicket,
    getDailySummary,
    getCollectorSummary,
    fetchEnabledPaymentMethods,
} from '../../apis/revenueActions';
import { verifyMonnifyTransaction, verifyTranzaktPayment } from '../../apis/authActions';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DailyTickets = () => {
    const { token } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [revenueItems, setRevenueItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [createdTicket, setCreatedTicket] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        notes: '',
        payment_reference: '',
        vehicle_plate_number: '',
        vehicle_registration: '',
        stall_number: '',
        market_name: ''
    });
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptTicket, setReceiptTicket] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState('all');

    // Summary statistics
    const [summary, setSummary] = useState({
        total_tickets: 0,
        total_amount: 0,
        paid_tickets: 0,
        paid_amount: 0,
        pending_tickets: 0,
        pending_amount: 0,
        by_category: {}
    });

    // Form state for single ticket
    const [ticketForm, setTicketForm] = useState({
        revenue_head_id: '',
        tariff_id: '',
        category: 'commercial_vehicle',
        vehicle_type: '',
        vehicle_registration: '',
        vehicle_plate_number: '',
        stall_number: '',
        payer_name: '',
        payer_phone: '',
        amount: '',
        notes: ''
    });
    const [availableTariffs, setAvailableTariffs] = useState([]);

    // Form state for bulk tickets
    const [bulkForm, setBulkForm] = useState({
        revenue_head_id: '',
        tariff_id: '',
        category: 'commercial_vehicle',
        quantity: '',
        amount_per_ticket: '',
        starting_number: '',
        notes: ''
    });
    const [bulkAvailableTariffs, setBulkAvailableTariffs] = useState([]);

    const categories = [
        { value: 'commercial_vehicle', label: 'Commercial Vehicle', icon: <FaCar /> },
        { value: 'motor_park', label: 'Motor Park', icon: <MdDirectionsCar /> },
        { value: 'market_stall', label: 'Market Stall', icon: <FaStore /> },
        { value: 'hawker', label: 'Hawker', icon: <FaStore /> },
        { value: 'other', label: 'Other', icon: <FaTicketAlt /> },
    ];

    const vehicleTypes = [
        { value: 'taxi_cab', label: 'Taxi Cab' },
        { value: 'bus', label: 'Bus' },
        { value: 'pick_up_bus', label: 'Pick-up/Bus' },
        { value: 'lorry', label: 'Lorry' },
        { value: 'tipper_lorry', label: 'Tipper/Lorry' },
        { value: 'heavy_duty_trailer', label: 'Heavy Duty Trailer' },
        { value: 'tricycle_keke', label: 'Tricycle (Keke)' },
        { value: 'tricycle', label: 'Tricycle' },
        { value: 'bike', label: 'Motorcycle/Bike' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'light_duty_vehicle', label: 'Light Duty Vehicle' },
        { value: 'motor_saw', label: 'Motor Saw' },
        { value: 'other', label: 'Other' },
    ];

    useEffect(() => {
        loadData();
        loadPaymentMethods();
        checkMonnifyCallback();
        checkTranzaktCallback();
    }, [selectedDate]);

    useEffect(() => {
        filterTickets();
    }, [searchTerm, selectedCategory, statusFilter, tickets]);

    // Check for Monnify payment callback
    const checkMonnifyCallback = async () => {
        const pendingPayment = sessionStorage.getItem('monnify_pending_payment');
        if (!pendingPayment || !token) return;

        try {
            const paymentData = JSON.parse(pendingPayment);
            const { transactionReference, ticket: savedTicket } = paymentData;

            // Remove from sessionStorage
            sessionStorage.removeItem('monnify_pending_payment');

            // Show loading toast
            const verifyingToast = toast.info('Verifying Monnify payment...', { autoClose: false });

            // Verify transaction with Monnify
            const response = await verifyMonnifyTransaction(token, transactionReference);

            toast.dismiss(verifyingToast);

            if (response.status === 'success' && response.data?.paymentStatus === 'PAID') {
                // Mark tickets as paid
                const paymentRef = response.data.transactionReference;

                if (savedTicket.bulk) {
                    let successCount = 0;
                    for (const t of savedTicket.tickets) {
                        try {
                            await markTicketAsPaid(t.id, {
                                payment_reference: `${paymentRef}-${t.id}`
                            });
                            successCount++;
                        } catch (error) {
                            console.error(`Failed to mark ticket ${t.id}:`, error);
                        }
                    }
                    toast.success(`✅ Monnify payment successful! ${successCount} ticket(s) marked as paid.`);
                } else {
                    await markTicketAsPaid(savedTicket.id, {
                        payment_reference: paymentRef
                    });
                    toast.success('✅ Monnify payment successful! Ticket marked as paid.');
                }

                // Refresh data to show updated ticket status immediately
                // Small delay to ensure backend has processed the update
                setTimeout(async () => {
                    await loadData();
                }, 500);
            } else {
                toast.warning('Payment verification pending. Please check back later.');
            }
        } catch (error) {
            console.error('Error verifying Monnify payment:', error);
            toast.error('Failed to verify payment. Please contact support if amount was deducted.');
        }
    };

    // Check for Tranzakt payment callback
    const checkTranzaktCallback = async () => {
        const pendingPayment = sessionStorage.getItem('tranzakt_pending_payment');
        if (!pendingPayment || !token) return;

        try {
            const paymentData = JSON.parse(pendingPayment);
            const { invoiceId, transactionReference, ticket: savedTicket } = paymentData;

            // Remove from sessionStorage
            sessionStorage.removeItem('tranzakt_pending_payment');

            // Show loading toast
            const verifyingToast = toast.info('Verifying Tranzakt payment...', { autoClose: false });

            // Verify transaction with Tranzakt
            const response = await verifyTranzaktPayment(token, invoiceId);

            toast.dismiss(verifyingToast);

            if (response.status === 'success' && response.data?.payment_status === 'Paid') {
                // Mark tickets as paid
                const paymentRef = response.data.reference || transactionReference;

                if (savedTicket.bulk) {
                    let successCount = 0;
                    for (const t of savedTicket.tickets) {
                        try {
                            await markTicketAsPaid(t.id, {
                                payment_reference: `${paymentRef}-${t.id}`
                            });
                            successCount++;
                        } catch (error) {
                            console.error(`Failed to mark ticket ${t.id}:`, error);
                        }
                    }
                    toast.success(`✅ Tranzakt payment successful! ${successCount} ticket(s) marked as paid.`);
                } else {
                    await markTicketAsPaid(savedTicket.id, {
                        payment_reference: paymentRef
                    });
                    toast.success('✅ Tranzakt payment successful! Ticket marked as paid.');
                }

                // Refresh data to show updated ticket status immediately
                // Small delay to ensure backend has processed the update
                setTimeout(async () => {
                    await loadData();
                }, 500);
            } else {
                toast.warning('Payment verification pending. Please check back later.');
            }
        } catch (error) {
            console.error('Error verifying Tranzakt payment:', error);
            toast.error('Failed to verify payment. Please contact support if amount was deducted.');
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [ticketsResponse, itemsResponse, summaryResponse] = await Promise.all([
                fetchDailyTickets({ date: selectedDate }),
                fetchDailyPaymentItems(),
                getDailySummary(selectedDate),
            ]);

            // Backend returns { status, code, data: { data: [...], total, ... } }
            setTickets(ticketsResponse.data?.data || []);
            setRevenueItems(itemsResponse.data || []);
            setSummary(summaryResponse.data || {});
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load daily tickets');
        } finally {
            setLoading(false);
        }
    };

    const loadPaymentMethods = async () => {
        try {
            const response = await fetchEnabledPaymentMethods();
            setPaymentMethods(response.data || []);
        } catch (error) {
            console.error('Error loading payment methods:', error);
            // Set default payment methods as fallback
            setPaymentMethods([
                { id: 1, gateway_name: 'Cash', logo_url: null },
                { id: 2, gateway_name: 'POS', logo_url: null },
                { id: 3, gateway_name: 'Bank Transfer', logo_url: null },
                { id: 4, gateway_name: 'Mobile Money', logo_url: null },
            ]);
        }
    };

    const filterTickets = () => {
        let filtered = [...tickets];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(ticket =>
                ticket.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.vehicle_registration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.payer_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(ticket => ticket.category === selectedCategory);
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(ticket => ticket.payment_status === statusFilter);
        }

        setFilteredTickets(filtered);
    };

    const handleIssueTicket = () => {
        setTicketForm({
            revenue_head_id: '',
            tariff_id: '',
            category: 'commercial_vehicle',
            vehicle_type: '',
            vehicle_registration: '',
            vehicle_plate_number: '',
            stall_number: '',
            payer_name: '',
            payer_phone: '',
            amount: '',
            notes: ''
        });
        setAvailableTariffs([]);
        setShowModal(true);
    };

    const handleRevenueHeadChange = (revenueHeadId) => {
        const selectedRevenue = revenueItems.find(item => item.id === parseInt(revenueHeadId));

        console.log('🎯 Selected Revenue Head:', selectedRevenue);

        if (selectedRevenue) {
            // Set available tariffs from the selected revenue head
            const tariffs = selectedRevenue.active_tariffs || selectedRevenue.tariffs || [];
            console.log('💰 Available Tariffs:', tariffs);
            setAvailableTariffs(tariffs);

            // Auto-select category based on revenue head category
            let autoCategory = 'commercial_vehicle';
            if (selectedRevenue.category === 'Motor Park') {
                autoCategory = 'motor_park';
            } else if (selectedRevenue.category === 'Market') {
                autoCategory = 'market_stall';
            }

            console.log('📂 Auto-selected Category:', autoCategory);

            setTicketForm({
                ...ticketForm,
                revenue_head_id: revenueHeadId,
                tariff_id: '',
                category: autoCategory,
                amount: ''
            });
        }
    };

    const handleTariffChange = (tariffId) => {
        const selectedTariff = availableTariffs.find(t => t.id === parseInt(tariffId));

        console.log('💳 Selected Tariff:', selectedTariff);
        console.log('💵 Amount to populate:', selectedTariff?.amount);

        setTicketForm({
            ...ticketForm,
            tariff_id: tariffId,
            amount: selectedTariff?.amount || ''
        });
    };

    // Bulk ticket handlers
    const handleBulkRevenueHeadChange = (revenueHeadId) => {
        const selectedRevenue = revenueItems.find(item => item.id === parseInt(revenueHeadId));

        if (selectedRevenue) {
            // Set available tariffs from the selected revenue head
            const tariffs = selectedRevenue.active_tariffs || selectedRevenue.tariffs || [];
            setBulkAvailableTariffs(tariffs);

            // Auto-select category based on revenue head category
            let autoCategory = 'commercial_vehicle';
            if (selectedRevenue.category === 'Motor Park') {
                autoCategory = 'motor_park';
            } else if (selectedRevenue.category === 'Market') {
                autoCategory = 'market_stall';
            }

            setBulkForm({
                ...bulkForm,
                revenue_head_id: revenueHeadId,
                tariff_id: '',
                category: autoCategory,
                amount_per_ticket: ''
            });
        }
    };

    const handleBulkTariffChange = (tariffId) => {
        const selectedTariff = bulkAvailableTariffs.find(t => t.id === parseInt(tariffId));

        setBulkForm({
            ...bulkForm,
            tariff_id: tariffId,
            amount_per_ticket: selectedTariff?.amount || ''
        });
    };

    const handleBulkIssue = () => {
        setBulkForm({
            revenue_head_id: '',
            tariff_id: '',
            category: 'commercial_vehicle',
            quantity: '',
            amount_per_ticket: '',
            starting_number: '',
            notes: ''
        });
        setBulkAvailableTariffs([]);
        setShowBulkModal(true);
    };

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await issueDailyTicket({
                ...ticketForm,
                ticket_date: selectedDate
            });
            toast.success('Ticket issued successfully');

            // Store the created ticket and show payment modal
            setCreatedTicket(response.data);
            setShowModal(false);
            setShowPaymentModal(true);

            loadData();
        } catch (error) {
            console.error('Error issuing ticket:', error);
            toast.error(error.response?.data?.message || 'Failed to issue ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBulk = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Build tickets array based on quantity
            const tickets = [];
            const quantity = parseInt(bulkForm.quantity);

            for (let i = 0; i < quantity; i++) {
                tickets.push({
                    revenue_head_id: bulkForm.revenue_head_id,
                    tariff_id: bulkForm.tariff_id,
                    category: bulkForm.category,
                    notes: bulkForm.notes || null
                });
            }

            const response = await bulkIssueDailyTickets({
                tickets: tickets
            });

            const createdTickets = response.data || [];
            const issuedCount = response.issued_count || createdTickets.length || quantity;

            toast.success(`${issuedCount} tickets issued successfully`);

            // Store created tickets for bulk payment modal
            setCreatedTicket({
                bulk: true,
                tickets: createdTickets,
                count: issuedCount,
                totalAmount: createdTickets.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
            });

            setShowBulkModal(false);
            setShowPaymentModal(true); // Show payment modal for bulk tickets

            // Refresh data
            await loadData();
        } catch (error) {
            console.error('Error issuing bulk tickets:', error);
            toast.error(error.response?.data?.message || 'Failed to issue bulk tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPaid = async (ticketId, amount) => {
        try {
            await markTicketAsPaid(ticketId, {
                amount_paid: amount,
                payment_reference: `CASH-${Date.now()}`
            });
            toast.success('Ticket marked as paid');
            loadData();
        } catch (error) {
            console.error('Error marking ticket as paid:', error);
            toast.error('Failed to mark ticket as paid');
        }
    };

    const handlePayNow = async (paymentMethod) => {
        setLoading(true);
        try {
            const reference = `${paymentMethod.toUpperCase()}-${Date.now()}`;

            // Handle bulk payment
            if (createdTicket.bulk) {
                let successCount = 0;
                let failedCount = 0;

                // Mark all tickets as paid
                for (const ticket of createdTicket.tickets) {
                    try {
                        await markTicketAsPaid(ticket.id, {
                            payment_reference: `${reference}-${ticket.id}`
                        });
                        successCount++;
                    } catch (error) {
                        console.error(`Failed to mark ticket ${ticket.id} as paid:`, error);
                        failedCount++;
                    }
                }

                if (successCount > 0) {
                    toast.success(`Payment recorded for ${successCount} ticket(s)`);
                }
                if (failedCount > 0) {
                    toast.error(`Failed to record payment for ${failedCount} ticket(s)`);
                }

                setShowPaymentModal(false);
                loadData();
            } else {
                // Handle single ticket payment
                await markTicketAsPaid(createdTicket.id, {
                    payment_reference: reference
                });
                toast.success('Payment recorded successfully');
                setShowPaymentModal(false);

                // Show receipt after payment
                setReceiptTicket({ ...createdTicket, payment_status: 'paid', payment_reference: reference });
                setShowReceipt(true);

                loadData();
            }
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error('Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    const handlePayLater = () => {
        toast.info('Ticket saved. Payment can be made later.');
        setShowPaymentModal(false);
        setCreatedTicket(null);
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setShowViewModal(true);
    };

    const handlePayForTicket = (ticket) => {
        setCreatedTicket(ticket);
        setShowPaymentModal(true);
    };

    const handleEditTicket = (ticket) => {
        setSelectedTicket(ticket);
        setEditForm({
            notes: ticket.notes || '',
            payment_reference: ticket.payment_reference || '',
            vehicle_plate_number: ticket.vehicle_plate_number || '',
            vehicle_registration: ticket.vehicle_registration || '',
            stall_number: ticket.stall_number || '',
            market_name: ticket.market_name || ''
        });
        setShowEditModal(true);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateDailyTicket(selectedTicket.id, editForm);
            toast.success('Ticket updated successfully');
            setShowEditModal(false);
            loadData();
        } catch (error) {
            console.error('Error updating ticket:', error);
            toast.error(error.response?.data?.message || 'Failed to update ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            return;
        }
        setLoading(true);
        try {
            await deleteDailyTicket(ticketId);
            toast.success('Ticket deleted successfully');
            loadData();
        } catch (error) {
            console.error('Error deleting ticket:', error);
            toast.error(error.response?.data?.message || 'Failed to delete ticket');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintTicket = (ticket) => {
        setReceiptTicket(ticket);
        setShowReceipt(true);
    };

    const handleExportSummary = () => {
        // Implement export functionality
        const csvContent = generateCSV(filteredTickets);
        downloadCSV(csvContent, `daily-tickets-${selectedDate}.csv`);
    };

    const generateCSV = (data) => {
        const headers = ['Ticket Number', 'Category', 'Amount', 'Status', 'Payer Name', 'Vehicle/Stall'];
        const rows = data.map(t => [
            t.ticket_number,
            t.category,
            t.amount,
            t.payment_status,
            t.payer_name || '-',
            t.vehicle_registration || t.stall_number || '-'
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    if (loading && tickets.length === 0) {
        return <InitLoader />;
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Daily Tickets
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Issue and manage daily collection tickets for vehicles, market stalls, and more
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {summary.total_tickets || 0}
                            </p>
                        </div>
                        <FaTicketAlt className="text-blue-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₦{(summary.total_amount || 0).toLocaleString()}
                            </p>
                        </div>
                        <FaMoneyBillWave className="text-green-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Paid Tickets</p>
                            <p className="text-2xl font-bold text-green-600">
                                {summary.paid_tickets || 0}
                            </p>
                        </div>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {summary.pending_tickets || 0}
                            </p>
                        </div>
                        <FaCalendarAlt className="text-orange-500 text-3xl" />
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Date Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-10 text-gray-400" />
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredTickets.length} of {tickets.length} tickets
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportSummary}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                            <FaDownload /> Export
                        </button>
                        <button
                            onClick={handleBulkIssue}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                            <FaPlus /> Bulk Issue
                        </button>
                        <button
                            onClick={handleIssueTicket}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                            <FaPlus /> Issue Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Ticket #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Vehicle/Stall
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Payer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {ticket.ticket_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className="capitalize">{ticket.category?.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {ticket.vehicle_registration || ticket.stall_number || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {ticket.payer_name || '-'}
                                        {ticket.payer_phone && <div className="text-xs">{ticket.payer_phone}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        ₦{parseFloat(ticket.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {ticket.payment_status === 'paid' ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            {/* View Button */}
                                            <button
                                                onClick={() => handleViewTicket(ticket)}
                                                className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                title="View Ticket"
                                            >
                                                <FaEye />
                                            </button>

                                            {/* Payment Button (for unpaid tickets) */}
                                            {ticket.payment_status !== 'paid' && (
                                                <button
                                                    onClick={() => handlePayForTicket(ticket)}
                                                    className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                                                    title="Process Payment"
                                                >
                                                    <FaCreditCard />
                                                </button>
                                            )}

                                            {/* Print Button (for paid tickets) */}
                                            {ticket.payment_status === 'paid' && (
                                                <button
                                                    onClick={() => handlePrintTicket(ticket)}
                                                    className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                                                    title="Print Receipt"
                                                >
                                                    <FaPrint />
                                                </button>
                                            )}

                                            {/* Edit Button - Only for unpaid tickets */}
                                            {ticket.payment_status !== 'paid' && (
                                                <button
                                                    onClick={() => handleEditTicket(ticket)}
                                                    className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                                                    title="Edit Ticket"
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}

                                            {/* Delete Button - Only for unpaid tickets */}
                                            {ticket.payment_status !== 'paid' && (
                                                <button
                                                    onClick={() => handleDeleteTicket(ticket.id)}
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                    title="Delete Ticket"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTickets.length === 0 && (
                    <div className="text-center py-12">
                        <FaTicketAlt className="mx-auto text-gray-400 text-5xl mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No tickets found for {selectedDate}</p>
                    </div>
                )}
            </div>

            {/* Single Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Issue Ticket
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitTicket} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Revenue Head *
                                    </label>
                                    <select
                                        value={ticketForm.revenue_head_id}
                                        onChange={(e) => handleRevenueHeadChange(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select Revenue Head</option>
                                        {revenueItems.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {availableTariffs.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Tariff / Vehicle Type *
                                        </label>
                                        <select
                                            value={ticketForm.tariff_id}
                                            onChange={(e) => handleTariffChange(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="">Select Tariff</option>
                                            {availableTariffs.map(tariff => (
                                                <option key={tariff.id} value={tariff.id}>
                                                    {tariff.description || tariff.vehicle_type || 'Standard'} - ₦{parseFloat(tariff.amount).toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            value={ticketForm.category}
                                            onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                                            required
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-selected based on revenue head</p>
                                    </div>

                                    {ticketForm.category === 'commercial_vehicle' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Vehicle Type *
                                            </label>
                                            <select
                                                value={ticketForm.vehicle_type}
                                                onChange={(e) => setTicketForm({ ...ticketForm, vehicle_type: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="">Select Type</option>
                                                {vehicleTypes.map(vt => (
                                                    <option key={vt.value} value={vt.value}>{vt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {ticketForm.category === 'commercial_vehicle' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Vehicle Registration
                                            </label>
                                            <input
                                                type="text"
                                                value={ticketForm.vehicle_registration}
                                                onChange={(e) => setTicketForm({ ...ticketForm, vehicle_registration: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    )}

                                    {ticketForm.category === 'market_stall' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Stall Number
                                            </label>
                                            <input
                                                type="text"
                                                value={ticketForm.stall_number}
                                                onChange={(e) => setTicketForm({ ...ticketForm, stall_number: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Payer Name
                                        </label>
                                        <input
                                            type="text"
                                            value={ticketForm.payer_name}
                                            onChange={(e) => setTicketForm({ ...ticketForm, payer_name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={ticketForm.payer_phone}
                                            onChange={(e) => setTicketForm({ ...ticketForm, payer_phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Amount *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">₦</span>
                                        <input
                                            type="number"
                                            value={ticketForm.amount}
                                            onChange={(e) => setTicketForm({ ...ticketForm, amount: e.target.value })}
                                            required
                                            step="0.01"
                                            min="0"
                                            readOnly={!!ticketForm.tariff_id}
                                            className={`w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white ${
                                                ticketForm.tariff_id
                                                    ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed'
                                                    : 'bg-white dark:bg-gray-700'
                                            }`}
                                        />
                                    </div>
                                    {ticketForm.tariff_id && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Auto-populated from selected tariff
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={ticketForm.notes}
                                        onChange={(e) => setTicketForm({ ...ticketForm, notes: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaSave /> {loading ? 'Issuing...' : 'Issue Ticket'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Issue Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Bulk Issue Tickets
                                </h2>
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitBulk} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Revenue Head *
                                    </label>
                                    <select
                                        value={bulkForm.revenue_head_id}
                                        onChange={(e) => handleBulkRevenueHeadChange(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select Revenue Head</option>
                                        {revenueItems.filter(i => i.payment_frequency === 'daily').map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} - ₦{item.default_amount}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={bulkForm.category}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-selected based on revenue head</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tariff/Pricing *
                                    </label>
                                    <select
                                        value={bulkForm.tariff_id}
                                        onChange={(e) => handleBulkTariffChange(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select Tariff</option>
                                        {bulkAvailableTariffs.map(tariff => (
                                            <option key={tariff.id} value={tariff.id}>
                                                {tariff.name} - ₦{tariff.amount}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            value={bulkForm.quantity}
                                            onChange={(e) => setBulkForm({ ...bulkForm, quantity: e.target.value })}
                                            required
                                            min="1"
                                            max="100"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Amount Per Ticket
                                        </label>
                                        <input
                                            type="number"
                                            value={bulkForm.amount_per_ticket}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-filled from tariff</p>
                                    </div>
                                </div>

                                {/* Total Preview */}
                                {bulkForm.quantity && bulkForm.amount_per_ticket && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            <span className="font-medium">Total Amount:</span> ₦{(parseFloat(bulkForm.quantity) * parseFloat(bulkForm.amount_per_ticket)).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={bulkForm.notes}
                                        onChange={(e) => setBulkForm({ ...bulkForm, notes: e.target.value })}
                                        rows="2"
                                        placeholder="Any additional notes for these tickets"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkModal(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaSave /> {loading ? 'Issuing...' : 'Issue Tickets'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Options Modal */}
            {showPaymentModal && createdTicket && (
                <DailyTicketPaymentModal
                    ticket={createdTicket}
                    paymentMethods={paymentMethods}
                    onClose={() => {
                        toast.info('Tickets saved. Payment can be made later.');
                        setShowPaymentModal(false);
                        setCreatedTicket(null);
                    }}
                    onPaymentSuccess={() => {
                        setShowPaymentModal(false);
                        if (!createdTicket.bulk) {
                            setReceiptTicket({ ...createdTicket, payment_status: 'paid' });
                            setShowReceipt(true);
                        }
                        loadData();
                        setCreatedTicket(null);
                    }}
                    markTicketAsPaid={markTicketAsPaid}
                />
            )}

            {/* View Ticket Modal */}
            {showViewModal && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaTicketAlt className="text-blue-500" />
                                    Ticket Details
                                </h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            {/* Ticket Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ticket Number</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.ticket_number}</p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date Issued</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {new Date(selectedTicket.ticket_date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {selectedTicket.category?.replace('_', ' ')}
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        ₦{parseFloat(selectedTicket.amount).toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                                    <p className="font-semibold">
                                        {selectedTicket.payment_status === 'paid' ? (
                                            <span className="text-green-600 dark:text-green-400">Paid</span>
                                        ) : (
                                            <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
                                        )}
                                    </p>
                                </div>

                                {selectedTicket.payment_reference && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Reference</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.payment_reference}</p>
                                    </div>
                                )}

                                {selectedTicket.vehicle_plate_number && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vehicle Plate Number</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.vehicle_plate_number}</p>
                                    </div>
                                )}

                                {selectedTicket.vehicle_type && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vehicle Type</p>
                                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                            {selectedTicket.vehicle_type?.replace('_', ' ')}
                                        </p>
                                    </div>
                                )}

                                {selectedTicket.stall_number && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stall Number</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.stall_number}</p>
                                    </div>
                                )}

                                {selectedTicket.collector_name && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Collected By</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.collector_name}</p>
                                    </div>
                                )}

                                {selectedTicket.notes && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedTicket.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 border-t dark:border-gray-700 pt-4">
                                {selectedTicket.payment_status !== 'paid' && (
                                    <button
                                        onClick={() => {
                                            setShowViewModal(false);
                                            handlePayForTicket(selectedTicket);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <FaCreditCard /> Process Payment
                                    </button>
                                )}

                                {selectedTicket.payment_status === 'paid' && (
                                    <button
                                        onClick={() => handlePrintTicket(selectedTicket)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <FaPrint /> Print Receipt
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Ticket Modal */}
            {showEditModal && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaEdit className="text-yellow-500" />
                                    Edit Ticket
                                </h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <span className="font-medium">Ticket #:</span> {selectedTicket.ticket_number}
                                </p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <span className="font-medium">Category:</span> {selectedTicket.category?.replace('_', ' ')}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                                    Edit vehicle/stall information, notes, and payment reference
                                </p>
                            </div>

                            <form onSubmit={handleSubmitEdit}>
                                <div className="space-y-4 mb-6">
                                    {/* Vehicle Fields - Show only for vehicle categories */}
                                    {(selectedTicket.category === 'commercial_vehicle' || selectedTicket.category === 'motor_park') && (
                                        <div className="border-l-4 border-blue-500 pl-4">
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Vehicle Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Plate Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editForm.vehicle_plate_number}
                                                        onChange={(e) => setEditForm({ ...editForm, vehicle_plate_number: e.target.value })}
                                                        placeholder="e.g., ABC-123-XY"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Registration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editForm.vehicle_registration}
                                                        onChange={(e) => setEditForm({ ...editForm, vehicle_registration: e.target.value })}
                                                        placeholder="e.g., REG-12345"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stall Fields - Show only for market stall category */}
                                    {selectedTicket.category === 'market_stall' && (
                                        <div className="border-l-4 border-purple-500 pl-4">
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Stall Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Stall Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editForm.stall_number}
                                                        onChange={(e) => setEditForm({ ...editForm, stall_number: e.target.value })}
                                                        placeholder="e.g., A-101"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Market Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editForm.market_name}
                                                        onChange={(e) => setEditForm({ ...editForm, market_name: e.target.value })}
                                                        placeholder="e.g., Swali Market"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Payment Reference
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.payment_reference}
                                            onChange={(e) => setEditForm({ ...editForm, payment_reference: e.target.value })}
                                            placeholder="e.g., CASH-123456"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            value={editForm.notes}
                                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                            placeholder="Add any additional notes..."
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t dark:border-gray-700 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && receiptTicket && (
                <TicketReceipt
                    ticket={receiptTicket}
                    onClose={() => {
                        setShowReceipt(false);
                        setReceiptTicket(null);
                    }}
                />
            )}
        </div>
    );
};

export default DailyTickets;
