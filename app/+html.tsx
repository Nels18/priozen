import {
  ScrollViewStyleReset,
  useServerDocumentContext,
} from 'expo-router/html';
import type { JSX, ReactNode } from 'react';
import { isDemo } from '@/src/config/demo';

/**
 * Root HTML of every page in the static web export (web only, rendered in
 * Node.js at build time). Expo SDK 58's template (@expo/cli
 * static/template/+html.tsx), plus noindex on the demo. headNodes and
 * bodyNodes carry the app's scripts and styles: without them, pages are empty.
 */
export default function Root({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { bodyAttributes, bodyNodes, htmlAttributes, headNodes } =
    useServerDocumentContext();

  return (
    // French: the app's reference language. Following the language picked by
    // i18next at load time is UX-05.
    <html lang="fr" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* The demo runs on fictitious data: keep it out of search engines. */}
        {isDemo && <meta name="robots" content="noindex, nofollow" />}
        {/* Body scrolling off, so ScrollView behaves as on native. */}
        <ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
