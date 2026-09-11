import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'tesseract');

const workerSrc = require.resolve('tesseract.js/dist/worker.min.js');
const coreDir = dirname(require.resolve('tesseract.js-core/package.json'));

const files = [
  { from: workerSrc, name: 'worker.min.js' },
  {
    from: join(coreDir, 'tesseract-core-lstm.wasm.js'),
    name: 'tesseract-core-lstm.wasm.js',
  },
  {
    from: join(coreDir, 'tesseract-core-lstm.wasm'),
    name: 'tesseract-core-lstm.wasm',
  },
  {
    from: join(coreDir, 'tesseract-core-simd-lstm.wasm.js'),
    name: 'tesseract-core-simd-lstm.wasm.js',
  },
  {
    from: join(coreDir, 'tesseract-core-simd-lstm.wasm'),
    name: 'tesseract-core-simd-lstm.wasm',
  },
  {
    from: join(coreDir, 'tesseract-core-relaxedsimd-lstm.wasm.js'),
    name: 'tesseract-core-relaxedsimd-lstm.wasm.js',
  },
  {
    from: join(coreDir, 'tesseract-core-relaxedsimd-lstm.wasm'),
    name: 'tesseract-core-relaxedsimd-lstm.wasm',
  },
];

mkdirSync(outDir, { recursive: true });

for (const file of files) {
  if (!existsSync(file.from)) {
    throw new Error(`Missing tesseract asset: ${file.from}`);
  }
  copyFileSync(file.from, join(outDir, file.name));
}
