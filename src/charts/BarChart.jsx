import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJs} from 'chart.js/auto'

const BarChart = ({ chartData = null }) => {
    // Default data if no chartData provided
    const defaultData = {
        labels: ['Paid', 'Unpaid', 'Pending', 'Failed'],
        datasets: [
            {
                label: 'Invoices',
                data: [0, 0, 0, 0],
                backgroundColor: ['#0d544c', '#F0B652', '#3B78BD', '#f06752'],
                borderColor: '#ffffff',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    // Use provided chart data or defaults
    const data = chartData ? {
        labels: ['Paid', 'Unpaid', 'Pending', 'Failed'],
        datasets: [
            {
                label: 'Invoices',
                data: [
                    chartData.paid || 0,
                    chartData.unpaid || 0,
                    chartData.pending || 0,
                    chartData.failed || 0,
                ],
                backgroundColor: ['#0d544c', '#F0B652', '#3B78BD', '#f06752'],
                borderColor: '#ffffff',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    } : defaultData;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.parsed.y} invoices`;
                    }
                },
                backgroundColor: 'rgba(13, 84, 76, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#0d544c',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        },
    };

    return (
        <div style={{ height: '300px' }}>
            <Bar data={data} options={options} />
        </div>
    )
}

export default BarChart
