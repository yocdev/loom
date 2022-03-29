import { searchFile } from '../../utils/cli-tools';
import path from 'path';
import Case from 'case';
import { outputFileSync, readFileSync } from 'fs-extra';
import { defaultOption } from '../../constant.cli';
import { IconShuttleConfig } from './types';
import { transform } from '@svgr/core';
import { forEach } from 'modern-async';

export const svgrGen = async (
  config: IconShuttleConfig = defaultOption.icon,
) => {
  const {
    include = [],
    exclude = [],
    output = '',
    filePrefix = 'Icon',
  } = config;
  const filePaths = searchFile(include, exclude);

  await forEach(filePaths, async (svgPath) => {
    const originFilepath = path.resolve(process.cwd(), svgPath);

    const iconName = filePrefix + Case.pascal(path.basename(svgPath, '.svg'));

    const fileName = iconName + '.tsx';
    const outputFilepath = path.resolve(process.cwd(), output, fileName);
    const svgCode = readFileSync(originFilepath).toString();

    const jsCode = transform.sync(
      svgCode,
      {
        icon: false,
        replaceAttrValues: {
          '#ff0000': 'currentcolor',
        },
        typescript: true,
        exportType: 'named',
        namedExport: iconName,
        prettier: true,
        memo: true,
      },
      { componentName: iconName },
    );

    outputFileSync(outputFilepath, jsCode);
  });
};
