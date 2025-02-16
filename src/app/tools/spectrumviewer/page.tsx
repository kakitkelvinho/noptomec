
"use client";

import React, { useState } from 'react';
import { oneSidedSpectrum } from "@/utils/signalprocessing";
import { onUpload } from "@/utils/handleupload";
import { captureConverter, spectrumConverter, groupConverter } from "@/utils/dataconverter";
import PlotTrace from "@/components/plottrace";
import Form from "next/form";

export default function SpectrumViewer() {
  const x = Array.from({ length: 1000 }, (_, i) => i / 999);
  const [jsonData, setJsonData] = useState({
    time: x,
    channel1: x.map(value => Math.sin(2 * Math.PI * 30 * value))
  });
  const [files, setFiles] = useState([jsonData,]);

  return (
    <>
      <h1>Spectrum Viewer</h1>
      <div className='flex justify-center items-center'>
        <input type="file" accept=".json" multiple onChange={e => onUpload(e, setFiles)} />
      </div>
      <PlotTrace data={groupConverter(files, captureConverter)} />
      <PlotTrace data={groupConverter(files, spectrumConverter)} />
    </>
  );
}
