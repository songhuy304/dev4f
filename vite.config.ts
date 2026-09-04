import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { crx } from '@crxjs/vite-plugin';
import path from 'path';

import manifest from './src/manifest';

export default defineConfig(({ mode, command }) => {
  const isProduction = mode === 'production';
  const isExtensionBuild = command === 'build';

  const plugins: PluginOption[] = [
    react(),
    tailwindcss(),
    isExtensionBuild ? (crx({ manifest }) as PluginOption) : null,
    isProduction ? (compression() as PluginOption) : null,
    process.env.ANALYZER
      ? (visualizer({
          gzipSize: true,
        }) as PluginOption)
      : null,
  ];

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
      ...(isExtensionBuild
        ? {
            rollupOptions: {
              preserveEntrySignatures: 'exports-only',
              input: {
                overlay: path.resolve(__dirname, 'src/overlay/index.html'),
              },
            },
          }
        : {}),
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
    plugins,
  };
});
