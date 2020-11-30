import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

export default function LineChart({ data }) {
  const series = {
    datasets: [
      {
        label: 'average',
        data: data,
        borderColor: '#198CFF',
        fill: false,
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
    maintainAspectRatio: false,
  };

  return <Line data={series} options={options} />;
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
};
