import { searchFile } from '../../utils/cli-tools';
import path from 'path';
import { existsSync } from 'fs-extra';
import { map } from 'modern-async';
import Case from 'case';

import { genRouterType } from './router-type.gen';
import { defaultOption } from '../../constant.cli';
import { PageInfo, RouterConfigResult } from './types';
import { RouterJsonGen } from './router-json.gen';

export const RouterShuttle = async (routerConfig = defaultOption.router) => {
  const {
    include,
    exclude,
    output = 'src/__generated__/router-shuttle',
    transformPageInfo = (v: PageInfo) => v,
    transformRouterJson = (v: any) => v,
  } = routerConfig || {};

  const filePaths = searchFile(include, exclude);
  console.log(filePaths, 'filePaths');
  const result: RouterConfigResult[] = await map(
    filePaths,
    async (pathItem) => {
      const dir = path.dirname(pathItem);
      const dirAbsolutePath = path.resolve(process.cwd(), dir);

      const folderName = dir.split('/').pop()!;

      const configPath = path.resolve(dirAbsolutePath, 'route.config.ts');

      const isExistConfigFile = Boolean(configPath && existsSync(configPath));

      return {
        folderPath: dir,
        configPath: isExistConfigFile ? configPath : null,
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
