import * as path from 'path';
import { transformFileSync } from '@swc/core';
import { existsSync, outputFileSync } from 'fs-extra';
import { Option } from '../types';

const rootPath = path.resolve(__dirname, '../');

const configJsPath = path.resolve(rootPath, './caches/loom.config.js');

const defaultOption = {
  name: '23333',
};

export async function readConfig(): Promise<Option> {
  const workPath = process.cwd();
  const configTsPath = path.resolve(workPath, './loom.config.ts');

  if (!existsSync(configTsPath)) {
    return defaultOption;
  }

  const output = transformFileSync(configTsPath, {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      target: 'es2021',
      keepClassNames: true,
      loose: true,
    },
    module: {
      type: 'commonjs',
      strict: false,
      strictMode: true,
      lazy: false,
      noInterop: false,
    },
    sourceMaps: false,
  });

  try {
    outputFileSync(configJsPath, output.code);
    const { default: config } = await import(configJsPath);

    return { ...defaultOption, ...config };
  } catch (error) {
    console.error(error);
    process.exit();
  }
}
