import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJs} from 'chart.js/auto'

const data = {
    labels : [
        'Local Government Identification', 'Birth Certificate Request', 'Street Registration', 'Waste management fees', 'Club/Association Registration'],
    datasets : [
        {
            label : 'Frequency',
            data : [3, 6, 2, 0, 0],
            backgroundColor : ['#0d544c', '#807f7b', '#d2a007'],
            borderColor : '#cccccc',
            borderWidth : 1,
        },
    ],
}

const PublicUserBarChart = () => {
    return (
        <div>
            <Bar data={data} />
        </div>
    )
}

export default PublicUserBarChart
