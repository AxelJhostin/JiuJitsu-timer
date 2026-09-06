/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL?: string;
  readonly DATABASE_URL_UNPOOLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
