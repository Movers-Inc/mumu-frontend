import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Bubble {
  name: string;
  value: number;
  detail: string;
}

const PackedBubbleChart: React.FC<{ data: Bubble[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 1000; // Chart width
    const height = 400; // Chart height

    const colors = ["#FF5E3A", "#FF8527", "#FFAF74", "#FFE2CC", "#E2E2E2", "#F0F0F0"];

    const sortedData = data
      .slice()
      .sort((a, b) => b.value - a.value)
      .map((d, i) => ({ ...d, color: colors[i % colors.length] }));

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.value)!])
      .range([30, 120]);

    const nodes = sortedData.map((d) => ({
      ...d,
      radius: radiusScale(d.value),
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() * 2 - 1) * 0.5,
      vy: (Math.random() * 2 - 1) * 0.5,
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force("collide", d3.forceCollide((d) => d.radius + 10))
      .on("tick", () => {
        nodes.forEach((node) => {
          if (node.x - node.radius <= 0 || node.x + node.radius >= width) {
            node.vx *= -1;
          }
          if (node.y - node.radius <= 0 || node.y + node.radius >= height) {
            node.vy *= -1;
          }
          node.x += node.vx;
          node.y += node.vy;
        });
      });

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 -80 ${width} ${height + 100}`)
      .style("background", "#FBFBFC")
      .style("overflow", "visible");

    const bubbleGroup = svg
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    bubbleGroup
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color)
      .attr("stroke", "none");

    // Add name label
    bubbleGroup
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.3em") // Position above the center
      .attr("fill", "#FFFFFF")
      .style("font-size", "28px")
      .style("font-family", "Arial");

    // Add detail label
    bubbleGroup
      .append("text")
      .text((d) => d.detail)
      .attr("text-anchor", "middle")
      .attr("dy", "1em") // Position below the name
      .attr("fill", "#FFFFFF")
      .style("font-size", "20px")
      .style("font-family", "Arial");

    simulation.on("tick", () => {
      bubbleGroup.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });
  }, [data]); // Add `data` as a dependency to update on data change.

  return (
    <div style={{ overflow: "visible", position: "relative" }}>
      <svg ref={svgRef} />
    </div>
  );
};

export default PackedBubbleChart;
