import 'fast-text-encoding';
import 'react-native-url-polyfill/auto';

function defineMockGlobal(name: string): void {
  if (typeof (global as Record<string, unknown>)[name] === 'undefined') {
    (global as Record<string, unknown>)[name] = class {
      type: string;

      constructor(type: string, eventInitDict?: Record<string, unknown>) {
        this.type = type;
        Object.assign(this, eventInitDict);
      }
    };
  }
}

['MessageEvent', 'Event', 'EventTarget', 'BroadcastChannel'].forEach(
  defineMockGlobal,
);
