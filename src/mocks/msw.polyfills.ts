// Web and Node (tests) already provide the globals MSW needs; the React Native
// (Hermes) polyfills live in msw.polyfills.native.ts, which Metro picks instead
// of this file on iOS / Android.
export {};
