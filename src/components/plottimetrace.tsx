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
  zoomPlugin
);

export default function PlotTimeTrace(data) {
  // Takes data in the form of x and y, similar to matplotlib

  const options = { 
    reponsive: true,
    plugins: {
      autocolors: {}
    } 
  }
  return (
    <Scatter options={options} data={data} />
  )
}
