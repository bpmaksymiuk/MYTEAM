import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('src', import.meta.url)) } },
  build: {
    outDir: 'dist',
    target: 'es2020',
    assetsDir: 'assets',
  }
});
