import { RouterConfigResult } from './types';
import { outputFileSync } from 'fs-extra';
import path from 'path';
import { ConfigOptions } from '../../types';

export const RouterJsonGen = async (
  {
    output,
    transformPageInfo,
    transformRouterJson,
  }: {
    output: string;
    transformPageInfo: ConfigOptions['router']['transformPageInfo'];
    transformRouterJson: (v: any) => any;
  },
  pageConfigList: RouterConfigResult[],
) => {
  const realOutputPath = path.resolve(output, 'router.json');

  const pageTypeMapping: any = {};

  const folderPathMapping: any = {};

  pageConfigList.forEach((item) => {
    const { pageName, pageType, folderPath } = item;
    const oldValue = {
      pageName,
      pageType,
      folderPath,
    };
    const value = transformPageInfo?.(oldValue) ?? oldValue;

    pageTypeMapping[value.pageType] = folderPathMapping[value.folderPath] =
      value;
  });

  const result = transformRouterJson({ pageTypeMapping, folderPathMapping });
  outputFileSync(realOutputPath, JSON.stringify(result, null, 2));
};
