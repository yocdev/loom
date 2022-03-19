import { ConfigOptions } from '../../types';
import { getConfigByTsFile, searchFile } from '../../utils/cli-tools';
import path from 'path';
import { existsSync } from 'fs-extra';
import { map } from 'modern-async';
import Case from 'case';

import { genRouterType } from './router-type.gen';
import { defaultOption } from '../../constant.cli';
import { PageInfo, RouterConfigResult } from './types';
import { RouterJsonGen } from './router-json.gen';

export const RouterShuttle = async (
  routerConfig: ConfigOptions['router'] = defaultOption.router,
) => {
  const {
    include,
    exclude,
    output = 'src/__generated__/router-shuttle',
    transformPageInfo = (v: PageInfo) => v,
    transformRouterJson = (v: any) => v,
  } = routerConfig || {};

  const filePaths = searchFile(include, exclude);

  const result: RouterConfigResult[] = await map(
    filePaths,
    async (pathItem) => {
      const dir = path.dirname(pathItem);
      const dirAbsolutePath = path.resolve(process.cwd(), dir);

      const folderName = dir.split('/').pop()!;

      const configPath = path.resolve(dirAbsolutePath, 'route.config.ts');

      const isExistConfigFile = Boolean(configPath && existsSync(configPath));

      const config: any = isExistConfigFile
        ? await getConfigByTsFile(configPath)
        : null;

      return {
        folderPath: dir,
        configPath: isExistConfigFile ? configPath : null,
        config,
        pageName: config ? config.pageName : '页面标题',
        pageType: Case.pascal(folderName),
      };
    },
  );
  genRouterType(output, result);
  RouterJsonGen({ output, transformPageInfo, transformRouterJson }, result);
  // const routerTypeTpl = genRouterType(result);
  //
  // const outputPath = path.resolve(process.cwd(), output);

  // outputFileSync(outputPath, routerTypeTpl);

  // execSync(`
  // eslint --fix ${outputPath}
  // `);
};
