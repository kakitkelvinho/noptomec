
"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { onUpload } from "@/utils/handleupload";
import { captureConverter, spectrumConverter, groupConverter } from "@/utils/dataconverter";
import datafetcher from '@/components/datafetcher';
import DataFetcher from '@/components/datafetcher';
const PlotTrace = dynamic(() => import('@/components/plottrace'), {
  ssr: false,
});

export default function SpectrumViewer(): React.ReactElement {
  const x = Array.from({ length: 1000 }, (_: unknown, i: number): number => i / 999);
  const jsonData = {
    time: x,
    channel1: x.map(value => Math.sin(2 * Math.PI * 30 * value))
  };
  const [files, setFiles] = useState([jsonData,]);


  return (
    <>
      <h1>Spectrum Viewer</h1>
      <div className='flex justify-center items-center'>
        <input type="file" accept=".json" multiple onChange={e => onUpload(e, setFiles)} />
      </div>
      <DataFetcher repo="cavitylockingdata" username="kakitkelvinho" />
      <PlotTrace data={groupConverter(files, captureConverter)} />
      <PlotTrace data={groupConverter(files, spectrumConverter)} />
    </>
  );
}
