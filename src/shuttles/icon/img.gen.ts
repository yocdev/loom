import { searchFile } from '../../utils/cli-tools';
import path from 'path';
import Case from 'case';
import { outputFileSync, readFileSync } from 'fs-extra';
import { defaultOption } from '../../constant.cli';
import { IconShuttleConfig } from './types';
import { forEach } from 'modern-async';
import sharp from 'sharp';

export const imgGen = async (
  config: IconShuttleConfig = defaultOption.icon,
) => {
  const {
    include = [],
    exclude = [],
    output = '',
    filePrefix = 'Icon',
    imageModeOption,
  } = config;
  const filePaths = searchFile(include, exclude);

  if (!imageModeOption) return;

  await forEach(filePaths, async (svgPath) => {
    const originFilepath = path.resolve(process.cwd(), svgPath);

    const iconName = filePrefix + Case.pascal(path.basename(svgPath, '.svg'));

    const originFileName = path.basename(svgPath);
    const originFolderName = path.dirname(svgPath);
    const fileName = iconName + '.png';

    const outputFilepath = path.resolve(process.cwd(), output, fileName);
    const svgCode = readFileSync(originFilepath).toString();
    const roundedCorners = Buffer.from(svgCode);

    const resizeInfo = imageModeOption.onResize?.({
      path: svgPath,
      fileName: originFileName,
      folderName: originFolderName,
    }) || { width: null, height: 128 };

    const buffer = await sharp(roundedCorners)
      .resize(resizeInfo.width, resizeInfo.height)
      .png()
      .toBuffer();

    outputFileSync(outputFilepath, buffer);
  });
};
