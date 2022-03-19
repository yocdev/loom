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
