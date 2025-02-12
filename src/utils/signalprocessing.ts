import { fft } from 'mathjs';

export function twoSidedSpectrum(x, y) {
  // compute the two sided spectrum,
  // returns the frequency and the spectrum (magnitude)
  // as an object
  // Determines the sampling rate by taking x as the time array 
  const samplingRate = 1/(x[1] - x[0]); // potentially average across all diff
  const yfft = fft(y);
  const fftmag = yfft.map(c => Math.sqrt(c.re**2 + c.im**2)); // take the magnitude
  const N = fftmag.length;
  const halfN = Math.floor(N / 2);
  // construct frequency bins
  const freqs = Array.from({ length: N }, (_, i) =>
    i <= halfN ? i * (samplingRate / N) : (i - N) * (samplingRate / N)
  );
  return { fftmag: fftmag, freqs: freqs }
};

export function oneSidedSpectrum(x, y) {
  // takes the convention where you multiply by 2 the positive spectrum
  const { fftmag, freqs } = twoSidedSpectrum(x, y);
  const indices = freqs.map((f, i) => (f >= 0? i : -1)).filter(i => i !== -1);
  const osfftmag = indices.map(i => i===0? fftmag[i] : 2*fftmag[i]);
  const osfreqs = indices.map(i => freqs[i]);
  return { fftmag: osfftmag, freqs: osfreqs }
}

