import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaTicketAlt, FaCar, FaStore, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const VerifyTicket = () => {
    const { ticketNumber } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ticketNumber) {
            verifyTicket();
        }
    }, [ticketNumber]);

    const verifyTicket = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://lga-backend.test'}/api/public/verify-ticket/${ticketNumber}`);

            if (response.data.status === 'success') {
                setTicket(response.data.data);
            } else {
                setError(response.data.message || 'Ticket not found');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError(err.response?.data?.message || 'Failed to verify ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (datetime) => {
        return new Date(datetime).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                    <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Ticket</h2>
                    <p className="text-gray-600">Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
                    <div className="text-center">
                        <FaTimesCircle className="text-6xl text-red-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <p className="text-sm text-gray-500">Ticket Number: {ticketNumber}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return null;
    }

    const isPaid = ticket.payment_status === 'paid';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
                {/* Header */}
                <div className={`${isPaid ? 'bg-green-600' : 'bg-orange-500'} text-white p-6`}>
                    <div className="flex items-center justify-center mb-4">
                        {isPaid ? (
                            <FaCheckCircle className="text-6xl" />
                        ) : (
                            <FaTicketAlt className="text-6xl" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-center">YENAGOA LOCAL GOVERNMENT</h1>
                    <h2 className="text-xl text-center mt-2">Revenue Collection Receipt</h2>
                    <p className="text-center text-sm mt-1 opacity-90">Bayelsa State, Nigeria</p>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center -mt-6 mb-6">
                    <div className={`${isPaid ? 'bg-green-100 border-green-500 text-green-800' : 'bg-orange-100 border-orange-500 text-orange-800'} border-4 rounded-full px-6 py-2 font-bold text-lg`}>
                        {isPaid ? '✓ VERIFIED & PAID' : 'PENDING PAYMENT'}
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Left Column */}
                        <div>
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 uppercase mb-1">Receipt Number</p>
                                <p className="text-lg font-bold text-gray-900">{ticket.ticket_number}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-500 uppercase mb-1">Date Issued</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatDate(ticket.ticket_date)}
                                </p>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
                                <p className="text-sm font-semibold text-gray-900 capitalize">
                                    {ticket.category?.replace('_', ' ')}
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 uppercase mb-1">Amount</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₦{parseFloat(ticket.amount).toLocaleString()}
                                </p>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-500 uppercase mb-1">Payment Status</p>
                                <p className="text-sm font-semibold">
                                    {isPaid ? (
                                        <span className="text-green-600">✓ PAID</span>
                                    ) : (
                                        <span className="text-orange-600">PENDING</span>
                                    )}
                                </p>
                            </div>

                            {ticket.payment_reference && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 uppercase mb-1">Payment Reference</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {ticket.payment_reference}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category-Specific Details */}
                    {(ticket.vehicle_plate_number || ticket.stall_number) && (
                        <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">
                                {ticket.category === 'commercial_vehicle' || ticket.category === 'motor_park' ? (
                                    <span className="flex items-center gap-2">
                                        <FaCar className="text-blue-600" />
                                        Vehicle Information
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <FaStore className="text-purple-600" />
                                        Stall Information
                                    </span>
                                )}
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {ticket.vehicle_plate_number && (
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Plate Number</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {ticket.vehicle_plate_number}
                                        </p>
                                    </div>
                                )}

                                {ticket.vehicle_registration && (
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Registration</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {ticket.vehicle_registration}
                                        </p>
                                    </div>
                                )}

                                {ticket.stall_number && (
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Stall Number</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {ticket.stall_number}
                                        </p>
                                    </div>
                                )}

                                {ticket.market_name && (
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Market</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {ticket.market_name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Validity Period */}
                    {ticket.revenue_head?.validity_period && (
                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-bold text-yellow-900 uppercase mb-2 flex items-center gap-2">
                                <FaCalendarAlt className="text-yellow-600" />
                                Validity Period
                            </h3>
                            <p className="text-sm text-yellow-800">
                                This receipt is valid for {ticket.revenue_head.validity_period} days from the date of issue.
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t-2 border-gray-300 pt-4 mt-6">
                        <p className="text-xs text-center text-gray-600 mb-2">
                            This is an official receipt from Yenagoa Local Government Revenue Department
                        </p>
                        <p className="text-xs text-center text-gray-500 mb-1">
                            For enquiries, contact: +234-XXX-XXX-XXXX | revenue@yenagoalga.gov.ng
                        </p>
                        <p className="text-xs text-center text-gray-400">
                            Verified on {formatDate(new Date())} at {formatTime(new Date())}
                        </p>
                    </div>
                </div>

                {/* Watermark for Unpaid Tickets */}
                {!isPaid && (
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 -mt-64">
                            <p className="text-9xl font-bold text-orange-500 transform -rotate-45">
                                UNPAID
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyTicket;
