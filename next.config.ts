import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy without a nonce: every page is prerendered and the
 * site holds no user data, while a nonce would force each page to render on
 * the server. Hence `'unsafe-inline'` for scripts (Next.js bootstrap and the
 * age-gate boot script) and no external origin in production. Vercel Web Analytics
 * is same-origin (`/_vercel/insights/*`), covered by `'self'`.
 * Development only: `'unsafe-eval'` for React's dev tooling and the debug
 * build of the analytics script, which is served from va.vercel-scripts.com.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  logging: {
    // Do not mirror the browser console into the terminal: extensions such as
    // wallet providers inject noisy scripts that have nothing to do with the app.
    browserToTerminal: false,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
