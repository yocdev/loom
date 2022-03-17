import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import run from '@rollup/plugin-run';

const dev = process.env.ROLLUP_WATCH === 'true';

const commonPlugins = [resolve(), commonjs({}), typescript(), json()];

export default [
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
    },
    plugins: [...commonPlugins, dev && run()],
    external: ['ts-morph'],
  },
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].esm.js',
      external: ['ts-morph'],
    },
    plugins: [...commonPlugins],
  },
];
