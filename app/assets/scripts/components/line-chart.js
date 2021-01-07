import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

export default function LineChart({ data, xUnit, yLabel }) {
  const series = {
    datasets: [
      {
        label: 'Average',
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
    tooltips: {
      intersect: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
          },
          gridLines: {
            drawOnChartArea: false,
          },
          scaleLabel: {
            display: !!yLabel,
            labelString: yLabel,
          },
        },
      ],

      xAxes: [
        {
          type: 'time',
          time: {
            tooltipFormat: 'MMM D, YYYY',
            unit: xUnit || 'day',
            displayFormats: {
              day: 'MMM D, YYYY',
            },
          },
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 15,
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
          },
        },
      ],
    },
    maintainAspectRatio: false,
  };

  return <Line data={series} options={options} />;
}

LineChart.propTypes = {
  yLabel: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
  xUnit: PropTypes.string,
};
