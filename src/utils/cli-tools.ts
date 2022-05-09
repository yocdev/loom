import * as path from 'path';
import { existsSync, outputFileSync, readFileSync, remove } from 'fs-extra';
import { ConfigOptions } from '../types';
import to from 'await-to-js';
import fg from 'fast-glob';
import { defaultOption, rootPath } from '../constant.cli';
import { ModuleKind, ScriptTarget, SourceFile, ts } from 'ts-morph';
import { last } from 'lodash';

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
  const jscode = ts.transpileModule(readFileSync(filePath).toString(), {
    compilerOptions: {
      target: ScriptTarget.ES2015,
      module: ModuleKind.CommonJS,
    },
  }).outputText;

  const tempJsFilePath = path.resolve(
    rootPath,
    `./caches/temp.config.${Date.now().toString().slice(2)}.js`,
  );

  outputFileSync(tempJsFilePath, jscode);
  const [err, content] = await to(import(tempJsFilePath));
  if (err) {
    console.error(err, 'errr');
    process.exit();
    return;
  }

  await remove(tempJsFilePath);

  return { ...defaultConfig, ...content?.default };
};

export async function readConfig(): Promise<ConfigOptions> {
  const workPath = process.cwd();
  const configTsPath = path.resolve(workPath, './loom.config.ts');

  return (await getConfigByTsFile<ConfigOptions>(configTsPath, defaultOption))!;
}

export function getParentDirName(pathStr: string) {
  const dirname = path.dirname(pathStr);
  return last(dirname.split('/'))!;
}

export const getFileSourceExportPageNameText = (fileSource: SourceFile) => {
  const exportPageNameStatement = fileSource.getExportSymbols().find((item) => {
    return item.getName() === 'pageName';
  });

  return (
    exportPageNameStatement?.getValueDeclaration()?.getType().getText() ??
    '"默认页面名"'
  ).slice(1, -1);
};
