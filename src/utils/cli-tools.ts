import * as path from 'path';
import { existsSync, outputFileSync, readFileSync, remove } from 'fs-extra';
import { ConfigOptions } from '../types';
import to from 'await-to-js';
import fg from 'fast-glob';
import { defaultOption, rootPath } from '../constant.cli';
import { ts } from 'ts-morph';

export const searchFile = (
  pattern: string | string[] = [],
  exclude: string[] = [],
): string[] => {
  return fg.sync(pattern, { ignore: exclude });
};

export const getConfigByTsFile = async <T>(
  filePath: string,
  defaultConfig?: T,
): Promise<T | undefined> => {
  if (!existsSync(filePath)) {
    return defaultConfig;
  }
  const jscode = ts.transpileModule(
    readFileSync(filePath).toString(),
    {},
  ).outputText;

  const tempJsFilePath = path.resolve(
    rootPath,
    `./caches/temp.config.${Date.now().toString().slice(2)}.js`,
  );

  outputFileSync(tempJsFilePath, jscode);
  const [err, { default: config }] = await to(import(tempJsFilePath));

  if (err) {
    console.error(err);
    process.exit();
    return;
  }

  await remove(tempJsFilePath);

  return { ...defaultConfig, ...config };
};

export async function readConfig(): Promise<ConfigOptions> {
  const workPath = process.cwd();
  const configTsPath = path.resolve(workPath, './loom.config.ts');

  return (await getConfigByTsFile<ConfigOptions>(configTsPath, defaultOption))!;
}
