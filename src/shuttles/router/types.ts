export interface RouterShuttleConfig {
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
}

export interface RouterConfigResult {
  folderPath: string;
  configPath: string | null;
  config: any;
  pageName: string;
  pageType: string;
}

export interface PageInfo {
  pageName: string;
  pageType: string;
  folderPath: string;
}
