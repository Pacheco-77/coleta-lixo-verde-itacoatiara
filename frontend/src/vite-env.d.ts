/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_MAP_CENTER_LAT: string
  readonly VITE_MAP_CENTER_LNG: string
  readonly VITE_MAP_DEFAULT_ZOOM: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_CITY: string
  readonly VITE_APP_STATE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
