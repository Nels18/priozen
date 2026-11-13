interface BuildEnv {
  /** EXPO_PUBLIC_USE_MOCKS: "true" / "false", or unset. */
  useMocks: string | undefined;
  /** NODE_ENV: "development", "production" or "test". */
  nodeEnv: string | undefined;
}

/** MSW answers the API calls: in development, unless EXPO_PUBLIC_USE_MOCKS says otherwise. */
export const getIsMocksEnabled = ({ useMocks, nodeEnv }: BuildEnv): boolean =>
  useMocks ? useMocks === 'true' : nodeEnv === 'development';

/**
 * Public demo: a production build running on the mocks (deploy-web-demo.yml).
 * It must not be indexed and must say its data is fictitious.
 */
export const getIsDemo = (env: BuildEnv): boolean =>
  getIsMocksEnabled(env) && env.nodeEnv === 'production';

// Read once: Expo inlines EXPO_PUBLIC_* and NODE_ENV at build time.
const buildEnv: BuildEnv = {
  useMocks: process.env.EXPO_PUBLIC_USE_MOCKS,
  nodeEnv: process.env.NODE_ENV,
};

export const isMocksEnabled = getIsMocksEnabled(buildEnv);
export const isDemo = getIsDemo(buildEnv);
