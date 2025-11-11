"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Plugin,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  labels: string[]; // 라벨
  data: number[]; // 데이터
  brandCnt: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, data, brandCnt}) => {

  const palette = ['#3129a5', '#453ec0', '#5a53da', '#736df0', '#8d87ff', '#a8a2ff']


  const chartData: ChartData<"doughnut"> = {
    labels,
    datasets: [
      {
        label: "Dataset",
        data,
        backgroundColor: palette,
        hoverBackgroundColor: palette,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '전체 업종',
        align: 'start',
        position: 'top',
        font: {
          size: 24,
          weight: 'bold',
        },
        color: '#222222',
      },
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 7, // 색깔 표시의 너비
          boxHeight: 7, // 색깔 표시의 높이
          padding: 10, // 텍스트와 아이콘 사이의 간격,
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0, // 데이터 간 빈틈 제거
      },
    },
    radius: '90%', // 외부 반지름 비율 (기본값: 100%)
    cutout: '68%', // 내부 반지름 비율 (기본값: 50%)
  };

  const emphasizeLargestSegmentPlugin: Plugin<'doughnut'> = {
    id: 'emphasizeLargestSegment',
    beforeDraw(chart: ChartJS<'doughnut'>) {
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];
      const data = dataset.data as number[];
      const maxValue = Math.max(...data);
      const maxIndex = data.indexOf(maxValue);

      chart.getDatasetMeta(0).data.forEach((arc, index) => {
        const arcElement = arc as unknown as ArcElement;

        if (index === maxIndex) {
          const { x: rawX, y: rawY } = arcElement.getProps(['x', 'y']);
          const x = rawX ?? 0;
          const y = rawY ?? 0;
          const outerRadius = arcElement.outerRadius ?? 0;
          const innerRadius = arcElement.innerRadius ?? 0;
          const startAngle = arcElement.startAngle;
          const endAngle = arcElement.endAngle;

          ctx.save();
          ctx.beginPath();

          // backgroundColor가 배열일 때만 색상 설정
          if (Array.isArray(dataset.backgroundColor)) {
            ctx.fillStyle = dataset.backgroundColor[index] || '#cccccc';
          } else {
            ctx.fillStyle = '#cccccc'; // 기본 색상
          }

          ctx.moveTo(x, y);
          ctx.arc(x, y, outerRadius + 10, startAngle, endAngle);
          ctx.arc(x, y, innerRadius, endAngle, startAngle, true);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });
    },
  };

  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height, ctx } = chart;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.font = 'regular 16px Arial';
      ctx.fillStyle = '#222222';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('등록 브랜드', centerX, centerY - 15); // 텍스트 추가
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#222222';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${brandCnt}개사`, centerX, centerY + 15); // 텍스트 추가
      ctx.restore();
    },
  };

  const percentagePlugin: Plugin<'doughnut'> = {
    id: 'percentagePlugin',
    afterDatasetDraw(chart) {
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];
      const data = dataset.data as number[];
      const total = data.reduce((sum, value) => sum + value, 0);

      chart.getDatasetMeta(0).data.forEach((arc, index) => {
        const arcElement = arc as unknown as ArcElement;
        const { x: rawX, y: rawY } = arcElement.getProps(['x', 'y']);
        const x = rawX ?? 0;
        const y = rawY ?? 0;
        const startAngle = arcElement.startAngle ?? 0;
        const endAngle = arcElement.endAngle ?? 0;
        const innerRadius = arcElement.innerRadius ?? 0;
        const outerRadius = arcElement.outerRadius ?? 0;
        const radius = (innerRadius + outerRadius) / 2;

        const angle = (startAngle + endAngle) / 2;
        const textX = x + radius * Math.cos(angle);
        const textY = y + radius * Math.sin(angle);

        const percentage = Math.round((data[index] / total) * 100);

        const paddingX = 7;
        const paddingY = 2;
        const fontSize = 12;
        const borderRadius = 20;

        ctx.font = `${fontSize}px Arial`;
        const textWidth = ctx.measureText(`${percentage}%`).width;
        const boxWidth = textWidth + paddingX * 2;
        const boxHeight = fontSize + paddingY * 2;

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineWidth = 1;

        const rectX = textX - boxWidth / 2;
        const rectY = textY - boxHeight / 2;
        ctx.roundRect(rectX, rectY, boxWidth, boxHeight, borderRadius);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, textX, textY);
        ctx.restore();
      });
    },
  };

  return <Doughnut data={chartData} options={options} plugins={[centerTextPlugin, emphasizeLargestSegmentPlugin, percentagePlugin]}/>;
};

export default DoughnutChart;