import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

export default function LineChart({ data, xUnit, yLabel, yUnit }) {
  const series = {
    datasets: [
      {
        label: 'Average',
        data: data,
        borderColor: '#198CFF',
        fill: false,
        showLine: false,
        pointBackgroundColor: '#198CFF',
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
            callback: function (value, index, values) {
              return index === values.length - 1 && yUnit
                ? `(${yUnit}) ${value}`
                : value;
            },
            fontSize: 14,
          },
          gridLines: {
            drawOnChartArea: false,
          },
          scaleLabel: {
            display: !!yLabel,
            labelString: yLabel,
            fontSize: 14,
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
              day: 'YYYY/MM/DD',
            },
          },
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 15,
            fontSize: 14,
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontSize: 14,
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
  yUnit: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
  xUnit: PropTypes.string,
};
