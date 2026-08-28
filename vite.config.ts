import { defineConfig, type UserConfig, type ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { crx } from '@crxjs/vite-plugin';
import path from 'path';

import manifest from './src/manifest';

export default defineConfig(((env: ConfigEnv) => {
  const isProduction = env.mode === 'production';

  return {
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
        '/images': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      minify: 'terser',
      rollupOptions: {
        preserveEntrySignatures: 'exports-only',
        input: {
          overlay: path.resolve(__dirname, 'src/overlay/index.html'),
        },
      },
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    define: {
      __IS_PRODUCTION__: isProduction,
    },
    plugins: [
      react(),
      tailwindcss(),
      crx({ manifest }),
      isProduction ? compression() : null,
      process.env.ANALYZER
        ? visualizer({
            gzipSize: true,
          })
        : null,
    ].filter(Boolean),
  };
}) as UserConfig);
