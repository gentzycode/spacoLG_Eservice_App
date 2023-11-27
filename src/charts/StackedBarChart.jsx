import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

export const options = {
    plugins : {
        title : {
            display : true,
            text : 'Applications statistics'
        },
    },
    responsive : true,
    scales : {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

const labels = ['Local Government Identification', 'Birth Certificate Request', 'Street Registration'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Admin review required',
            data: [2,3,1],
            backgroundColor: '#0d544c'
        },
        {
            label: 'Payment required',
            data: [4,7,2],
            backgroundColor: '#807f7b'
        },
        {
            label: 'Processing certificate',
            data: [1,4,3],
            backgroundColor: '#d2a007'
        },
    ]
}

const StackedBarChart = () => {
    return (
        <div className='p-4'>
            <Bar options={options} data={data} />
        </div>
    )
}

export default StackedBarChart
