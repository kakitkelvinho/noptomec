"use client";

import { useRef, useState } from 'react';
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
  Colors,
} from 'chart.js';
import Chart from 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  zoomPlugin,
  autocolors,
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

interface Action {
  name: string;
  handler: (chart: Chart) => void;
}

export default function PlotTrace({ data }: PlotTraceProps): React.ReactElement {

  const [showLine, setShowLine] = useState(true);
  const updatedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      showLine: showLine
    }))
  }

  const chartRef = useRef<Chart | null>(null);
  const options: object = {
    reponsive: true,
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true, },
          pinch: { enabled: true, },
          drag: { enabled: true, modifierKey: 'ctrl', },
          mode: 'x',
          scaleMode: 'xy',
        },
        pan: { enabled: true, mode: 'xy' }
      },
      autocolors: { enabled: true, }
    },
    elements: {
      point: { radius: 1, hoverRadius: 4, }
    }
  }

  const actions = [
    {
      name: 'Reset zoom',
      handler(chart: Chart) {
        chart.resetZoom()
      }
    }
  ]

  const handleAction = (action: Action) => {
    if (chartRef.current) {
      action.handler(chartRef.current);
    }
  };

  return (
    <>
      <Scatter options={options} data={updatedData} className='m-5 p-5' ref={(chart) => {
        if (chart) chartRef.current = chart;
      }} />
      <div className="flex items-center justify-normal">
        <button className="mx-4 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-400" onClick={() => handleAction(actions[0])}>Reset Zoom</button>
        <button className="mx-4 px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-400" onClick={() => setShowLine(!showLine)}>Toggle line</button>
      </div>
    </>
  )
}
