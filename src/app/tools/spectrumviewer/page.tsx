
"use client";

import React, { useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { onUpload } from "@/utils/handleupload";
import { captureConverter, spectrumConverter, groupConverter, stackConverter, stackfftConverter } from "@/utils/dataconverter";
import DataFetcher from '@/components/datafetcher';
import { FilesContext, FilesProvider } from '@/components/filescontext';
import PlotlyPlot from '@/components/plotlyplot';
import { PlotlyData } from '@/utils/dataconverter';

const PlotTrace = dynamic(() => import('@/components/plottrace'), {
  ssr: false,
});

function SpectrumViewer(): React.ReactElement {

  const filesContext = useContext(FilesContext);
  if (!filesContext) throw new Error("useContext must be used within a FilesProvider");
  const { setFiles, files } = filesContext;
  const plotData: PlotlyData[] = useMemo((): PlotlyData[] => stackConverter(files), [files]);
  const plotfftData: PlotlyData[] = useMemo((): PlotlyData[] => stackfftConverter(files), [files]);

  return (
    <>
      <h1>Spectrum Viewer</h1>
      <div className='flex justify-center items-center'>
        <input type="file" accept=".json" multiple onChange={e => onUpload(e, setFiles)} />
      </div>

      <DataFetcher />
      {/* <PlotTrace data={groupConverter(files, captureConverter)} /> */}
      {/* <PlotTrace data={groupConverter(files, spectrumConverter)} /> */}
      <PlotlyPlot data={plotData} />
      <PlotlyPlot data={plotfftData} />
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
