
"use client";

import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { onUpload } from "@/utils/handleupload";
import { captureConverter, spectrumConverter, groupConverter, CaptureData } from "@/utils/dataconverter";
import DataFetcher from '@/components/datafetcher';
import { FilesContext, FilesProvider } from '@/components/filescontext';

const PlotTrace = dynamic(() => import('@/components/plottrace'), {
  ssr: false,
});

function SpectrumViewer(): React.ReactElement {

  const filesContext = useContext(FilesContext);
  if (!filesContext) throw new Error("useContext must be used within a FilesProvider");
  const { setFiles, files } = filesContext;

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


export default function App(): React.ReactElement {
  return (
    <FilesProvider>
      <SpectrumViewer />
    </FilesProvider>
  )
}
