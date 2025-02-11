export function genSine(freq=20) {
  const samplingRate = 1000;
  const duration = 1;
  const x = Array.from({ length: duration * samplingRate }, (_, i) => i / samplingRate);  // time values from 0 to duration
  const y = x.map(value => Math.sin(2 * Math.PI * freq * value)); // sine values
  return { x, y };
}
