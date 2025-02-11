import { fft } from 'mathjs';

export function twoSidedSpectrum(x, y, samplingRate=1.0) {
  // compute the two sided spectrum,
  // returns the frequency and the spectrum (magnitude)
  // as an object
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

export function oneSidedSpectrum(x, y, samplingRate=1.0) {
  // takes the convention where you multiply by 2 the positive spectrum
  const { fftmag, freqs } = twoSidedSpectrum(x, y, samplingRate);
  const indices = freqs.map((f, i) => (f >= 0? i : -1)).filter(i => i !== -1);
  const osfftmag = indices.map(i => i===0? fftmag[i] : 2*fftmag[i]);
  const osfreqs = indices.map(i => freqs[i]);
  return { fftmag: osfftmag, freqs: osfreqs }
}

