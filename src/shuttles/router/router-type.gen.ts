import { RouterConfigResult } from './types';
import { Project, StructureKind } from 'ts-morph';
import { removeSync } from 'fs-extra';

export const genRouterType = async (
  output: string,
  pageConfigList: RouterConfigResult[],
) => {
  const innerList = pageConfigList.filter((v) => v.pageType);

  const project = new Project({});
  project.addSourceFilesAtPaths([
    process.cwd() + '/**/router.config.ts',
    '!node_modules',
  ]);
  project.resolveSourceFileDependencies();
  removeSync(output);

  const routerTypeFile = project.createSourceFile(output, {
    statements: [
      {
        kind: StructureKind.Enum,
        name: 'PageType',
        isExported: true,
      },
      {
        kind: StructureKind.Interface,
        name: 'PageParamsMapping',
        isExported: true,
      },
      // {
      //   kind: StructureKind.Interface,
      //   name: innerList[0].pageType + 'PageParams',
      //   properties: [],
      // },
    ],
  });

  // ...innerList.map((item) => {
  //     return {
  //       kind: StructureKind.Interface,
  //       name: item.pageType + 'PageParams',
  //       isExported: true,
  //     };
  //   }),

  const pageTypeEnum = routerTypeFile.getEnumOrThrow('PageType');

  // const pageParamsMappingInterface =
  //   routerTypeFile.getInterfaceOrThrow('PageParamsMapping');

  innerList.forEach((item) => {
    if (item.configPath && item.pageType) {
      // const configSourceFile = project.getSourceFileOrThrow(item.configPath);
      //
      // pageParamsInterface = configSourceFile.getInterfaceOrThrow('PageParams');
      //
      // const pageParamsInterfaceName = `${
      //   item.pageType
      // }${pageParamsInterface.getName()}`;
      //
      // pageParamsMappingInterface.addProperty({
      //   name: item.pageType,
      //   type: pageParamsInterfaceName,
      // });
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
