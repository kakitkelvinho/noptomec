"use client";

import { Scatter } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import autocolors from 'chartjs-plugin-autocolors';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  autocolors
);

interface PlotData {
  datasets: {
    id: number;
    label: string;
    data: { x: number; y: number }[];
    showLine: boolean;
  }[];
}

interface PlotTraceProps {
  data: PlotData;
}

export default function PlotTrace({ data }: PlotTraceProps): React.ReactElement {
  const options: object = {
    reponsive: true,
    plugins: [autocolors],
    elements: {
      point: { radius: 1, hoverRadius: 4, }
    }
  }
  return (
    <Scatter options={options} data={data} className='m-5 p-5' />
  )
}
