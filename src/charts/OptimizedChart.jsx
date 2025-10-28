import React, { memo, useMemo } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

// Register Chart.js components only once
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Common chart options for optimization
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 750, // Reduced from default 1000ms
    },
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            mode: 'index',
            intersect: false,
        },
    },
    // Disable animations on resize for better performance
    onResize: () => {
        ChartJS.defaults.animation = false;
    },
};

// Optimized Line Chart
export const OptimizedLineChart = memo(({ data, options = {} }) => {
    const chartOptions = useMemo(
        () => ({
            ...commonOptions,
            ...options,
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                },
                ...options.scales,
            },
        }),
        [options]
    );

    const chartData = useMemo(() => data, [data]);

    return <Line data={chartData} options={chartOptions} />;
});

OptimizedLineChart.displayName = 'OptimizedLineChart';

// Optimized Bar Chart
export const OptimizedBarChart = memo(({ data, options = {} }) => {
    const chartOptions = useMemo(
        () => ({
            ...commonOptions,
            ...options,
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                },
                ...options.scales,
            },
        }),
        [options]
    );

    const chartData = useMemo(() => data, [data]);

    return <Bar data={chartData} options={chartOptions} />;
});

OptimizedBarChart.displayName = 'OptimizedBarChart';

// Optimized Pie Chart
export const OptimizedPieChart = memo(({ data, options = {} }) => {
    const chartOptions = useMemo(
        () => ({
            ...commonOptions,
            ...options,
            plugins: {
                ...commonOptions.plugins,
                ...options.plugins,
                legend: {
                    position: 'right',
                    ...options.plugins?.legend,
                },
            },
        }),
        [options]
    );

    const chartData = useMemo(() => data, [data]);

    return <Pie data={chartData} options={chartOptions} />;
});

OptimizedPieChart.displayName = 'OptimizedPieChart';

// Optimized Doughnut Chart
export const OptimizedDoughnutChart = memo(({ data, options = {} }) => {
    const chartOptions = useMemo(
        () => ({
            ...commonOptions,
            ...options,
            plugins: {
                ...commonOptions.plugins,
                ...options.plugins,
                legend: {
                    position: 'right',
                    ...options.plugins?.legend,
                },
            },
            cutout: '70%',
        }),
        [options]
    );

    const chartData = useMemo(() => data, [data]);

    return <Doughnut data={chartData} options={chartOptions} />;
});

OptimizedDoughnutChart.displayName = 'OptimizedDoughnutChart';

// Chart data generator utility
export const generateChartData = (labels, datasets) => {
    return {
        labels,
        datasets: datasets.map((dataset) => ({
            ...dataset,
            borderWidth: dataset.borderWidth || 2,
            tension: dataset.tension || 0.4, // Smooth curves
        })),
    };
};

// Color palette for consistent theming
export const chartColors = {
    primary: '#3B78BD',
    accent: '#F0B652',
    secondary: '#f06752',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6',
};

// Generate gradient for charts (optional)
export const createGradient = (ctx, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
};
