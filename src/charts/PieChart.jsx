import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJs} from 'chart.js/auto'

const PieChart = ({ chartData = null }) => {
    // Default data if no chartData provided
    const defaultData = {
        labels: ['Tenement Rate', 'Business Permits', 'Other Services'],
        datasets: [
            {
                label: 'Revenue %',
                data: [45, 30, 25],
                backgroundColor: ['#0d544c', '#3B78BD', '#F0B652'],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    // Use provided chart data or defaults
    const data = chartData ? {
        labels: chartData.map(item => item.name),
        datasets: [
            {
                label: 'Revenue %',
                data: chartData.map(item => item.percentage),
                backgroundColor: chartData.map(item => item.color),
                borderColor: '#ffffff',
                borderWidth: 2,
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
                        return `${context.label}: ${context.parsed}%`;
                    }
                },
                backgroundColor: 'rgba(13, 84, 76, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#0d544c',
                borderWidth: 1,
            },
        },
    };

    return (
        <div style={{ height: '200px' }}>
            <Pie data={data} options={options} />
        </div>
    )
}

export default PieChart
