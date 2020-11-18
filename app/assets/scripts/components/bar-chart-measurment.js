import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default function BarChart ({fequency, data}) {
  const width = 600
  const height = 400

  const ref = useRef();

  useEffect(() => {
      const svg = d3.select(ref.current)
          .attr("width", width)
          .attr("height", height)
  }, []);

  useEffect(() => {
      draw();
  }, [data]);

  const draw = () => {
      
      const svg = d3.select(ref.current);
      var selection = svg.selectAll("rect").data(data);
      var yScale = d3.scaleLinear()
                          .domain([0, d3.max(data)])
                          .range([0, height-100]);
      
      selection
          .transition().duration(300)
              .attr("height", (d) => yScale(d))
              .attr("y", (d) => height - yScale(d))

      selection
          .enter()
          .append("rect")
          .attr("x", (d, i) => i * 45)
          .attr("y", (d) => height)
          .attr("width", 40)
          .attr("height", 0)
          .attr("fill", "orange")
          .transition().duration(300)
              .attr("height", (d) => yScale(d))
              .attr("y", (d) => height - yScale(d))
      
      selection
          .exit()
          .transition().duration(300)
              .attr("y", (d) => height)
              .attr("height", 0)
          .remove()
  }


  return (
      <div className="chart">
          <svg ref={ref}>
          </svg>
      </div>
      
  )
  
}