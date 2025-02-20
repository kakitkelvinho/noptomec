"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { onUpload } from "@/utils/handleupload";
import { captureConverter, groupConverter } from "@/utils/dataconverter";
//import PlotTrace from "@/components/plottrace";
const PlotTrace = dynamic(() => import('@/components/plottrace'), {
  ssr: false,
});

export default function DataViewer(): React.ReactElement {
  const x: number[] = Array.from({ length: 1000 }, (_: unknown, i: number): number => i / 999);
  const y: number[] = x.map((value: number) => Math.sin(2 * Math.PI * 30 * value));
  const jsonData = {
    time: x,
    channel1: y
  };

  const [files, setFiles] = useState([jsonData,]);

  return (
    <>
      <h1>Data Viewer</h1>
      <input type="file" accept=".json" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpload(e, setFiles)} />
      <p>Available channels: {Object.keys(files).join(', ')}</p>
      <PlotTrace data={groupConverter(files, captureConverter)} />
    </>
  );
}
