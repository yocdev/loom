import { RouterConfigResult, RouterShuttleConfig } from './types';
import { outputFileSync } from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';
import {
  getFileSourceExportPageId,
  getFileSourceExportPageNameText,
} from 'src/utils/cli-tools';

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
  const project = new Project({});
  project.addSourceFilesAtPaths([
    ...(pageConfigList.map((v) => v.configPath).filter(Boolean) as string[]),
    '!node_modules',
  ]);
  project.resolveSourceFileDependencies();

  const pageTypeMapping: any = {};

  const folderPathMapping: any = {};

  pageConfigList.forEach((item) => {
    let pageName = '默认页面名';
    let pageId;

    if (item.configPath) {
      const configSourceFile = project.getSourceFileOrThrow(item.configPath);
      pageName = getFileSourceExportPageNameText(configSourceFile);
      pageId = getFileSourceExportPageId(configSourceFile);
    }
    const { pageType, folderPath } = item;
    const oldValue = {
      pageType,
      folderPath,
      pageName,
      pageId: pageId || pageType,
    };
    const value = transformPageInfo?.(oldValue) ?? oldValue;

    pageTypeMapping[value.pageType] = folderPathMapping[value.folderPath] =
      value;
  });

  const result = transformRouterJson({ pageTypeMapping, folderPathMapping });
  outputFileSync(realOutputPath, JSON.stringify(result, null, 2));
};
