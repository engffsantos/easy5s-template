import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { PillarScore } from '../../types';
import { pillarNames, pillarColors } from '../../data/mockData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface PillarChartProps {
  scores: PillarScore[];
  height?: number | string;
  width?: number | string;
}

const PillarChart: React.FC<PillarChartProps> = ({ scores, height = 300, width = '100%' }) => {
  const data = {
    labels: scores.map(score => pillarNames[score.pillar]),
    datasets: [
      {
        label: 'Pontuação',
        data: scores.map(score => score.score),
        backgroundColor: 'rgba(0, 86, 164, 0.2)', // Primary color with opacity
        borderColor: 'rgba(0, 86, 164, 1)', // Primary color
        borderWidth: 2,
        pointBackgroundColor: scores.map(score => pillarColors[score.pillar]),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 86, 164, 1)',
        pointLabelFontSize: 14,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          callback: (value: number) => value.toString(),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const pillar = scores[index].pillar;
            return `${pillarNames[pillar]}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height, width }}>
      <Radar data={data} options={options as any} />
    </div>
  );
};

export default PillarChart;