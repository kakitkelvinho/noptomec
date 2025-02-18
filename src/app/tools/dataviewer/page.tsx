"use client";

import React, { useState } from 'react';
import { onUpload } from "@/utils/handleupload";
import { captureConverter, groupConverter } from "@/utils/dataconverter";
import PlotTrace from "@/components/plottrace";

export default function DataViewer() {
  const x = Array.from({ length: 1000 }, (_, i) => i / 999);
  const y = x.map(value => Math.sin(2 * Math.PI * 30 * value));
  const jsonData = {
    time: x,
    channel1: y
  };

  const [files, setFiles] = useState([jsonData,]);

  return (
    <>
      <h1>Data Viewer</h1>
      <input type="file" accept=".json" onChange={e => onUpload(e, setFiles)} />
      <p>Available channels: {Object.keys(files).join(', ')}</p>
      <PlotTrace data={groupConverter(files, captureConverter)} />
    </>
  );
}
