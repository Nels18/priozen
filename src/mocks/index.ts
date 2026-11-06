// Must stay the first import: `msw` reads globals such as MessageEvent as
// soon as it loads (via ./utils), and Hermes doesn't provide them on iOS /
// Android. Resolves to msw.polyfills.native.ts there, to a no-op elsewhere.
import './msw.polyfills';

export { startMocks } from './utils';
