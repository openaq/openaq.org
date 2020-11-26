import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

export default function BarChart({ data, xAxisLabels }) {
  const series = {
    labels: xAxisLabels,
    datasets: [
      {
        label: 'in average',
        data: data,
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
            maxTicksLimit: 5,
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

  return <Bar data={series} options={options} />;
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  xAxisLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};
