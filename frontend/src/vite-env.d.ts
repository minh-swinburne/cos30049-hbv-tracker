/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEO4J_URI: string
  readonly VITE_NEO4J_USERNAME: string
  readonly VITE_NEO4J_PASSWORD: string
  readonly VITE_AURA_INSTANCEID: string
  readonly VITE_AURA_INSTANCENAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 