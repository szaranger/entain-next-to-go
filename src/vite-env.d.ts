/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_GREYHOUND_CATEGORY_ID: string
  readonly VITE_HARNESS_CATEGORY_ID: string
  readonly VITE_HORSE_CATEGORY_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

