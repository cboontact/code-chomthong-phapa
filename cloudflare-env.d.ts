// Kept in source control so `next build` has D1 types. Regenerate with
// `npm run cf-typegen` after changing wrangler.jsonc.
interface D1Result<T = unknown> {
  results?: T[];
  meta: { changes?: number };
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<D1Result<T>>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

interface CloudflareEnv { DB: D1Database; ASSETS: Fetcher; ADMIN_USERNAME: string; ADMIN_PASSWORD: string; ADMIN_DISPLAY_NAME: string; ADMIN2_DISPLAY_NAME: string; ADMIN2_USERNAME: string; ADMIN2_PASSWORD: string; }
