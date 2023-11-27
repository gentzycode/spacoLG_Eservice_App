import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJs} from 'chart.js/auto'

const data = {
    labels : [
    'Anambra East',
    'Anambra West',
    'Ayamelum',
    'Ogbaru',
    'Onitsha North',
    'Onitsha South',
    'Oyi',
    'Awka North',
    'Awka South',
    'Anaocha',
    'Dunukofia',
    'Idemili North',
    'Idemili South',
    'Njikoka',
    'Aguata',
    'Ekwusigo',
    'Ihiala',
    'Nnewi North',
    'Nnewi South',
    'Orumba North',
    'Orumba South'],
    datasets : [
        {
            label : 'Count',
            data : [20, 34, 12, 9, 18, 45, 33, 16, 8, 7, 22, 30, 39, 45, 13, 19, 10, 2, 17, 27, 4],
            backgroundColor : ['#0d544c', '#807f7b', '#d2a007'],
            borderColor : '#cccccc',
            borderWidth : 1,
        },
    ],
}


const PieChart = () => {
    return (
        <div className='p-4'>
            <Pie data={data} />
        </div>
    )
}

export default PieChart
