import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

export default function BarChart({title, frequency, xAxisLabels}) {
  const data = {
    labels: xAxisLabels,
    datasets: [
      {
        label: 'Entries',
        data: frequency,
        backgroundColor: '#198CFF',
      },
    ],
  }
  
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }
  
  return (
    <div style={{width: `400px`}}>
      <div className='header'>
        <h1 className='title'>{title}</h1>
      </div>
      <Bar
        data={data}
        options={options}
      />
    </div>
  )
  
}
