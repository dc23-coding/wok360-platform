// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly [key: string]: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
