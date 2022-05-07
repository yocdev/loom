import { RouterConfigResult, RouterShuttleConfig } from './types';
import { outputFileSync } from 'fs-extra';
import path from 'path';

export const RouterJsonGen = async (
  {
    output,
    transformPageInfo,
    transformRouterJson = (v) => v,
  }: {
    output: string;
    transformPageInfo: RouterShuttleConfig['transformPageInfo'];
    transformRouterJson: RouterShuttleConfig['transformRouterJson'];
  },
  pageConfigList: RouterConfigResult[],
) => {
  const realOutputPath = path.resolve(output, 'router.json');

  const pageTypeMapping: any = {};

  const folderPathMapping: any = {};

  pageConfigList.forEach((item) => {
    const { pageType, folderPath } = item;
    const oldValue = {
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
