import React from 'react';
import Plot from 'react-plotly.js';
import { PlotlyData } from '@/utils/dataconverter';

export default function PlotlyPlot({ data }: { data: PlotlyData[] }): React.ReactElement {
  return (
    <Plot data={data} />
  )
}
