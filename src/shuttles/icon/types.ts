export interface IconShuttleConfig {
  include: string[];
  exclude: string[];

  /**
   * 生成图标文件的前缀
   * @default Icon
   */
  filePrefix?: string;

  output: string;
}
