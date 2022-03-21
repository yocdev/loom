import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import run from '@rollup/plugin-run';
import * as path from 'path';

const dev = process.env.ROLLUP_WATCH === 'true';

const commonPlugins = [resolve(), commonjs({}), typescript(), json()];

export default [
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      banner: '#!/usr/bin/env node',
      paths: {
        '@yocdev/loom': path.resolve(__dirname, './dist'),
      },
    },
    plugins: [...commonPlugins, dev && run()],
    external: ['ts-morph', 'typescript', 'eslint', 'prettier'],
  },
];
