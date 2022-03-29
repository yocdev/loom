// 生成索引文件
import { IconShuttleConfig } from './types';
import { defaultOption } from '../../constant.cli';
import path from 'path';
import { outputFileSync, readdirSync } from 'fs-extra';

export const indexFileGen = (
  config: IconShuttleConfig = defaultOption.icon,
) => {
  const { output = '' } = config;
  const absoluteFolderPath = path.resolve(process.cwd(), output);

  const indexFilePath = path.resolve(absoluteFolderPath, 'index.ts');

  const tsxFilePaths = readdirSync(absoluteFolderPath);

  const code = `${tsxFilePaths
    .map((item) => {
      return `export * from "./${path.basename(item, '.tsx')}";`;
    })
    .join('\n')}
  `;

  outputFileSync(indexFilePath, code);
};
