"use client";

import { timetracePlot } from "@/components/timetracePlot";
import JsonUpload from "@/components/jsonupload";
import { genSine } from "@/utils/gentestdata";
import { oneSidedSpectrum } from "@/utils/signalprocessing";
import  PlotTimeTrace from "@/components/plottimetrace";


export default function DataViewer() {
  const { x, y } = genSine(20);
  const points = x.map((xi, i) => ({x: xi, y: y[i]}));

  const testData = {
    datasets: [
      {
        label: "Test data",
        data: points, 
     }
    ]
  };

  return  (
    <>
    <h1>Data Viewer</h1>
    <JsonUpload />
    </>
  );
}
