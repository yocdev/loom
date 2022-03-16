import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import run from '@rollup/plugin-run';

const dev = process.env.ROLLUP_WATCH === 'true';

const commonPlugins = [
  resolve(),
  commonjs({
    transformMixedEsModules: true,
  }),
  typescript(),
  json(),
];

export default [
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
    },
    plugins: [...commonPlugins, dev && run()],
  },
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].esm.js',
    },
    plugins: [...commonPlugins],
  },
];
