import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';

export default function ScatterChart({ data }) {
  const series = {
    datasets: [
      {
        label: 'average',
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
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              quarter: 'MMM',
            },
          },
          gridLines: { display: false },
        },
      ],
    },
  };

  return <Scatter data={series} options={options} />;
}

ScatterChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
};
