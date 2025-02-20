import { fft, log, complex, Complex } from 'mathjs';


export interface SpectrumResult {
  freqs: number[],
  fftmag: number[]
}

export function twoSidedSpectrum(x: Array<number>, y: Array<number>): { fftmag: Array<number>, freqs: Array<number> } {
  // compute the two sided spectrum,
  // returns the frequency and the spectrum (magnitude)
  // as an object
  // Determines the sampling rate by taking x as the time array 
  const samplingRate = 1 / (x[1] - x[0]); // potentially average across all diff
  const yfft: Complex[] = fft(y.map((n: number): Complex => complex(n, 0)));
  const fftmag: number[] = yfft.map((c: Complex): number => Math.sqrt(c.re ** 2 + c.im ** 2)); // take the magnitude
  const N: number = fftmag.length;
  const halfN: number = Math.floor(N / 2);
  // construct frequency bins
  const freqs: Array<number> = Array.from({ length: N }, (_: number, i: number): number =>
    i <= halfN ? i * (samplingRate / N) : (i - N) * (samplingRate / N)
  );
  return { fftmag: fftmag, freqs: freqs }
};

export function oneSidedSpectrum(x: Array<number>, y: Array<number>): { fftmag: Array<number>, freqs: Array<number> } {
  // takes the convention where you multiply by 2 the positive spectrum
  const { fftmag, freqs } = twoSidedSpectrum(x, y);
  const indices: Array<number> = freqs.map((f: number, i: number): number => (f >= 0 ? i : -1)).filter(i => i !== -1);
  const osfftmag: Array<number> = indices.map((i: number): number => i === 0 ? fftmag[i] : 2 * fftmag[i]);
  const osfreqs: Array<number> = indices.map((i: number): number => freqs[i]);
  return { fftmag: osfftmag, freqs: osfreqs }
}

export function oneSidedLogSpectrum(x: Array<number>, y: Array<number>): { fftmag: Array<number>, freqs: Array<number> } {
  // takes the log of fft, uncalibrated
  const { fftmag, freqs } = oneSidedSpectrum(x, y);
  return { fftmag: fftmag.map((mag: number): number => log(mag)), freqs: freqs }
}

