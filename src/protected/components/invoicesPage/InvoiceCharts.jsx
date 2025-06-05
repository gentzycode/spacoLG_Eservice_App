import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const InvoiceCharts = ({ statistics }) => {
    if (!statistics) return null;

    const safeStats = {
        paid_invoices: statistics.paid_invoices || 0,
        unpaid_invoices: statistics.unpaid_invoices || 0,
        paid_amount: statistics.paid_amount || 0,
        total_amount: statistics.total_amount || 0,
    };

    const pieData = {
        labels: ['Paid Invoices', 'Unpaid Invoices'],
        datasets: [
            {
                data: [safeStats.paid_invoices, safeStats.unpaid_invoices],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const barData = {
        labels: ['Total Amount', 'Paid Amount'],
        datasets: [
            {
                label: 'Amount (₦)',
                data: [safeStats.total_amount, safeStats.paid_amount],
                backgroundColor: ['#36A2EB', '#4BC0C0'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#D1D5DB', // Tailwind gray-300
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#D1D5DB',
                },
            },
            x: {
                ticks: {
                    color: '#D1D5DB',
                },
            },
        },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Invoice Status</h3>
                <div className="h-64">
                    <Pie data={pieData} options={options} />
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Invoice Amounts</h3>
                <div className="h-64">
                    <Bar data={barData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default InvoiceCharts;