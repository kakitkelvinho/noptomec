// Converts arrays imported from json into format that chartjs can use
import { oneSidedLogSpectrum, SpectrumResult } from "@/utils/signalprocessing";

export interface CaptureData {
  time: Array<number>,
  [key: string]: Array<number>
}

export interface Data {
  datasets: Array<{
    id: number,
    label: string,
    data: { x: number, y: number }[],
    showLine: boolean
  }>
}

export interface PlotlyData {
  x: Array<number>;
  y: Array<number>;
  type: "scattergl" | "bar";
  mode: "lines";
  name: string;
}

export type CaptureArray = Array<CaptureData>;

export function stackConverter(captureArray: CaptureArray): PlotlyData[] {
  const data: PlotlyData[] = [];
  captureArray.forEach((capture: CaptureData): void => {
    const yNames = Object.keys(capture).filter((name: string): boolean => name !== "time");
    const subdata = yNames.map((name: string): PlotlyData => ({
      x: capture.time as number[],
      y: capture[name] as number[],
      type: "scattergl",
      mode: "lines",
      name
    }));
    data.push(...subdata);
  });
  return data;
}

export function stackfftConverter(captureArray: CaptureArray): PlotlyData[] {
  const rawdata: PlotlyData[] = stackConverter(captureArray);
  const data = rawdata.map((item: PlotlyData): PlotlyData => {
    const { freqs, fftmag }: SpectrumResult = oneSidedLogSpectrum(item.x, item.y);
    return ({ ...item, x: freqs, y: fftmag });
  })
  return data;
}

export function captureConverter(capture: CaptureData): Data {
  // Assumes a data with the following format:
  // {
  //    time: [...],
  //    channel1: [...],
  //    channel2: [...],
  //    ...
  // }

  const x: Array<number> = capture.time;
  const nonTimeChannels: Array<string> = Object.keys(capture).filter((i: string): boolean => i !== "time");
  const data: Data = {
    datasets: []
  };
  nonTimeChannels.forEach((channel: string, i: number): void => {
    // maybe something like Object.values.length !== 0
    data.datasets.push(
      {
        id: i,
        label: channel,
        data: capture[channel].map((y: number, i: number): { x: number, y: number } => ({ x: x[i], y: y })),
        showLine: true
      });
  }
  );

  return data;
}

export function spectrumConverter(capture: CaptureData): Data {
  // Same assumption as above
  const x = capture.time;
  const data: Data = { datasets: [] };
  const nonTimeChannels = Object.keys(capture).filter((i: string): boolean => i !== "time");
  nonTimeChannels.forEach((channel: string, i: number): void => {
    const { freqs, fftmag }: SpectrumResult = oneSidedLogSpectrum(x, capture[channel]);
    data.datasets.push(
      {
        id: i,
        label: channel,
        data: fftmag.map((y: number, i: number): { x: number, y: number } => ({ x: freqs[i], y: y })),
        showLine: true,
      })
  });
  return data;
}

export function groupConverter(captureArray: CaptureArray, converter: (capture: CaptureData) => Data): Data {
  const data: Data = { datasets: [] };
  captureArray.forEach((capture: CaptureData): void => {
    data.datasets.push(...converter(capture).datasets);
  })
  return data
}
