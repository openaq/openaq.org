import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

export default function BarChart({ title, frequency, xAxisLabels }) {
  const data = {
    labels: xAxisLabels,
    datasets: [
      {
        label: 'Measurements',
        data: frequency,
        backgroundColor: '#198CFF',
      },
    ],
  };

  const options = {
    defaultFontFamily:
      "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          gridLines: { display: false },
        },
      ],
    },
  };

  return (
    <div style={{ width: `300px` }}>
      <div className="header">
        <h3 className="title">{title}</h3>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}

BarChart.propTypes = {
  title: PropTypes.string,
  frequency: PropTypes.array,
  xAxisLabels: PropTypes.array,
};
