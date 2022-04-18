import { Project, StructureKind } from 'ts-morph';
import { removeSync } from 'fs-extra';
import { RouterConfigResult } from './types';
import path from 'path';

export const genRouterType = async (
  output: string,
  pageConfigList: RouterConfigResult[],
) => {
  const realOutputPath = path.resolve(output, 'router-type.ts');

  const project = new Project({});
  project.addSourceFilesAtPaths([
    process.cwd() + '/**/route.config.ts',
    '!node_modules',
  ]);
  project.resolveSourceFileDependencies();
  removeSync(realOutputPath);

  const routerTypeFile = project.createSourceFile(realOutputPath, {
    statements: [],
  });

  const pageTypeEnum = routerTypeFile.addEnum({
    name: 'PageType',
    isExported: true,
    members: [],
  });

  pageConfigList.forEach((item) => {
    if (item.configPath && item.pageType) {
      const configSourceFile = project.getSourceFileOrThrow(item.configPath);

      const fileName = path.basename(configSourceFile.getBaseName(), '.ts');
      const routerParamsInterface = configSourceFile.getInterface('PageParams');

      if (!routerParamsInterface) return;

      const exportPageNameStatement = configSourceFile
        .getExportSymbols()
        .find((item) => item.getName() === 'pageName');

      const pageName = (
        exportPageNameStatement?.getValueDeclaration()?.getType().getText() ??
        '"默认页面名"'
      ).slice(1, -1);

      routerTypeFile.addInterface({
        name: item.pageType,
        docs: [
          {
            tags: [
              {
                tagName: 'Page',
                text: pageName,
              },
            ],
          },
        ],
        properties: routerParamsInterface.getProperties().map((item) => {
          return {
            name: item.getName(),
            type: item.getTypeNode()?.getText(),
            docs: item.getJsDocs().map((doc) => {
              return {
                description: doc.getDescription(),
                tags: doc.getTags().map((tag) => {
                  return {
                    tagName: tag.getTagName(),
                    text: tag.getText(),
                  };
                }),
              };
            }),
          };
        }),
      });

      const allPageInterfaces = routerTypeFile
        .getInterfaces()
        .filter((v) => v.getJsDocs()[0]?.getTags()[0]?.getTagName() === 'Page');

      routerTypeFile.addInterface({
        name: 'RouterParamsMapping',
        docs: [
          {
            description: '路由参数映射',
          },
        ],
        properties: allPageInterfaces.map((v) => {
          return {
            name: v.getName(),
            type: v.getName(),
          };
        }),
      });
    }

    if (item.pageType) {
      pageTypeEnum.addMember({
        name: item.pageType,
        value: item.pageType,
        docs: [
          {
            description: item.pageName,
            kind: StructureKind.JSDoc,
          },
        ],
      });
    }
  });

  // asynchronously save all the changes above

  await project.save();
  routerTypeFile.formatText();
};
