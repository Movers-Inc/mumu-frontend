import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VerticalBarChartProps {
  labels: string[];
  data1: number[];
  data2: number[];
}

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({
  labels,
  data1,
  data2
}) => {
  console.log("Labels:", labels);
  console.log("Data1:", data1);
  console.log("Data2:", data2);
  console.log("Labels length:", labels.length);
  console.log("Data1 length:", data1?.length);
  console.log("Data2 length:", data2?.length);
  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        border: {
          display: false
        },
        grid: {
          display: false
        }
      },
      y: {
        border: {
          display: false
        },
        ticks: {
          padding: 10, // Add space between labels and chart
          font: {
            size: 14 // Optional: Adjust font size for better readability
          },
          stepSize: 1, // Ensure the step between values is 1
          callback: (value) => `${value}` // Remove any floating points
        },
        beginAtZero: true // Ensure the chart starts from zero
      }
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "유입",
        data: data1, // 'data1'을 'data'로 수정
        backgroundColor: "#3129a5",
        borderRadius: 10,
        barThickness: 10
      },
      {
        label: "이탈",
        data: data2, // Dataset 2 추가
        backgroundColor: "#E2E2E2",
        borderRadius: 10,
        barThickness: 10
      }
    ]
  };

  return <Bar options={options} data={chartData} />;
};

export default VerticalBarChart;
