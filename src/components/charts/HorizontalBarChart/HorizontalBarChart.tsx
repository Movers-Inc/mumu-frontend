import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartOptions,
  Plugin,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement);

interface HorizontalBarChartProps {
  labels: string[]; // 라벨
  data: number[]; // 데이터
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ labels, data }) => {
  const dataValues = data; // Dataset values
  const maxValue = Math.max(...dataValues); // Find the highest value

  // Assign colors based on the value
  const backgroundColors = dataValues.map((value) =>
    value === maxValue ? "#3129a5" : "#E0E4FF"
  );

  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: "y",
    layout: {
      padding: {
        left: 200 , // Add 50px padding to the left
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false, // Hide grid lines on x-axis
        },
        ticks: {
          display: false, // Hide x-axis numbers
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          display: false, // Hide grid lines on y-axis
        },
        ticks: {
          display: false , // Keep Y-axis labels
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
  };

  const chartData : ChartData<'bar'>= {
    labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors, // Assign dynamic colors
        borderRadius: 4, // Rounded corners
        borderSkipped: false, // Ensure all corners are rounded
        barThickness: 30,
      },
    ],
  };

// Custom plugin for left-aligning Y-axis labels
const leftAlignLabelsPlugin: Plugin<"bar"> = {
  id: "leftAlignLabels",
  afterDraw(chart) {
    const { ctx, scales } = chart;
    const yScale = scales.y;

    // Custom alignment for Y-axis labels
    yScale.ticks.forEach((tick, index) => {
      const label = tick.label; // Label might be string | string[] | undefined
      if (typeof label !== "string") return; // Skip non-string labels

      const yPosition = yScale.getPixelForTick(index);

      ctx.save();
      ctx.font = "14px Arial";
      ctx.fillStyle = "#000000"; // Label color
      ctx.textAlign = "left"; // Align to left
      ctx.textBaseline = "middle"; // Vertically centered

      // Adjust the X position to be left-aligned
      const xPosition = yScale.left - 195;
      ctx.fillText(label, xPosition, yPosition); // Render only if it's a string
      ctx.restore();
    });
  },
};

// Plugin to render percentages inside bars
const percentageInsideBarsPlugin: Plugin<"bar"> = {
  id: "percentageInsideBars",
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    const dataset = data.datasets[0]; // Assume one dataset
    const maxValue = Math.max(...dataset.data as number[]); // Find max value for styling
    const total = (dataset.data as number[]).reduce((sum, value) => sum + value, 0);

    dataset.data.forEach((value, index) => {
      const bar = chart.getDatasetMeta(0).data[index]; // Get bar element
      const percentage = ((value as number) / total * 100).toFixed(1) + "%"; // Calculate percentage

      const xPosition = bar.x - 17; // Adjust text position
      const yPosition = bar.y;

      ctx.save();
      ctx.font = "14px Arial";
      ctx.fillStyle = value === maxValue ? "#FFFFFF" : "#222222"; // White for max, black otherwise
      ctx.textAlign = "right" // Adjust alignment
      ctx.textBaseline = "middle";
      ctx.fillText(percentage, xPosition, yPosition); // Render percentage
      ctx.restore();
    });
  },
};

// Plugin to draw dotted lines between labels and bars
const dottedLinePlugin: Plugin<"bar"> = {
  id: "dottedLinePlugin",
  afterDatasetsDraw(chart) {
    const { ctx, scales } = chart;
    const yScale = scales.y;
    const xScale = scales.x;

    ctx.save();
    ctx.setLineDash([2, 2]); // 2px dash and 2px gap
    ctx.strokeStyle = "#CCCCCC"; // Set line color
    ctx.lineWidth = 1; // Set line width

    // Draw dotted lines for each label
    yScale.ticks.forEach((_, index) => {
      const yPosition = yScale.getPixelForTick(index);
      const xStart = yScale.left - 100; // Start near the labels
      const xEnd = xScale.left; // End near the bars

      ctx.beginPath();
      ctx.moveTo(xStart, yPosition);
      ctx.lineTo(xEnd, yPosition);
      ctx.stroke();
    });

    ctx.restore();
  },
};



  return <Bar options={options} data={chartData} plugins={[leftAlignLabelsPlugin, percentageInsideBarsPlugin, dottedLinePlugin]} />;
};

export default HorizontalBarChart;