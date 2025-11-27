import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ chartData = null }) => {
    // Default data if no chartData provided
    const defaultLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const defaultValues = [0, 0, 0, 0, 0, 0];

    // Use provided chart data or defaults
    const labels = chartData?.map(item => item.month) || defaultLabels;
    const values = chartData?.map(item => item.revenue / 1000000) || defaultValues; // Convert to millions

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Revenue (₦ Millions)",
                data: values,
                borderColor: "#0d544c",
                backgroundColor: "rgba(13, 84, 76, 0.1)",
                tension: 0.4,
                fill: true,
                pointBackgroundColor: "#0d544c",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

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
                        return `₦${context.parsed.y.toFixed(2)}M`;
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
                    callback: function(value) {
                        return '₦' + value + 'M';
                    }
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
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
