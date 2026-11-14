/// <reference types="vite/client" />

// Environment variables we read through import.meta.env (set in a .env file).
interface ImportMetaEnv {
  /** Base URL of the analytics server, e.g. "https://my-server.example". Empty = local fallback. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
