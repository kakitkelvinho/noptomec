// Converts arrays imported from json into format that chartjs can use

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
  }
  nonTimeChannels.forEach((channel,i) => data.datasets.push(
    {
      id: i,
      label: channel,
      data: capture[channel].map((y, i)=>({x: x[i], y: y}))
    }
  ));

  return data;  
}
