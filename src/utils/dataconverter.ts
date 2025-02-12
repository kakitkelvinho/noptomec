// Converts arrays imported from json into format that chartjs can use
import { oneSidedSpectrum, twoSidedSpectrum } from "@/utils/signalprocessing";

export function captureConverter(capture) {
  // Assumes a data with the following format:
  // {
  //    time: [...],
  //    channel1: [...],
  //    channel2: [...],
  //    ...
  // }
  
  const x = capture.time;
  const nonTimeChannels = Object.keys(capture).filter(i => i!=="time");
  const data = {
    datasets:[]
  };
  nonTimeChannels.forEach((channel,i) => {
    // maybe something like Object.values.length !== 0
    data.datasets.push(
    {
      id: i,
      label: channel,
      data: capture[channel].map((y, i)=>({x: x[i], y: y})),
      showLine: true
    });
  }
  );

  return data;  
}

export function spectrumConverter(capture) {
  // Same assumption as above
  const x = capture.time; 
  const data = {datasets:[]};
  const nonTimeChannels = Object.keys(capture).filter(i => i!=="time");
  nonTimeChannels.forEach((channel, i) => {
    let { freqs, fftmag } = oneSidedSpectrum(x, capture[channel]);
    data.datasets.push(
    {
      id: i,
      label: channel,
      data: fftmag.map((y, i) =>({x: freqs[i], y: y})),
      showLine: true,
    })
  });
  return data;
}

export function groupConverter(captureArray, converter) {
  const data = {datasets:[]};
  captureArray.forEach(capture => {
    data.datasets.push(...converter(capture).datasets);
  }) 
  return data
}
