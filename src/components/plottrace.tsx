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

export default function PlotTrace({ data }) {
  const options = { 
    reponsive: true,
    plugins: [autocolors],
    elements: {
      point: {radius:1, hoverRadius:4,}
    }
  }
  return (
    <Scatter options={options} data={data} />
  )
}
