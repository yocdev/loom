import { PageInfo } from './shuttles/router/types';

export interface ConfigOptions {
  router: {
    /**
     * 包含的页面
     */
    include: string[];

    /**
     * 从包含中排除的页面
     */
    exclude: string[];

    /**
     * 输出路径
     *
     * @default src/__generated__/router-shuttles
     */
    output: string;

    transformPageInfo?: (pageInfo: PageInfo) => PageInfo;

    transformRouterJson?: (v: any) => any;
  };
}
