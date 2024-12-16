import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJs} from 'chart.js/auto'

const data = {
    labels : [
    'Motorcycle Ticket',
    'Park Fee',
    'Business Premises Fee',
    'Fire Service Fee',
    'Lock-up Shop Fees',
    'Security Levy',
    'Environmental Levy',
    'Vehicle Emission Fee',
    'Loading Permit',
    'Offloading Permit',
    'Waste Disposal Fee',
    'Streetlight Levy',
    'Building Plan Approval',
    'Certificate of Occupancy Fee',
    'Signage Fee',
    'Event Permit',
    'Liquor License',
    'Health Inspection Fee',
    'Hawking Permit',
    'Public Space Usage Fee',
    'Road Maintenance Levy'],
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

const BarChart = () => {
  return (
    <div className='p-4'>
      <Bar data={data} />
    </div>
  )
}

export default BarChart
