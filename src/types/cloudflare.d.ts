// Minimal Cloudflare Workers ambient types — only what contact-submit uses.
// Real Cloudflare types are not installed; this is the minimum to make tsc pass.
declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  }
}
export {};
