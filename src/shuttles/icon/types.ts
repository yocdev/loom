export interface IconShuttleConfig {
  include: string[];
  exclude: string[];

  /**
   * 生成图标文件的前缀
   * @default Icon
   */
  filePrefix?: string;

  output: string;

  /**
   * 图片模式
   * @default undefined
   */
  imageModeOption?: {
    onResize: (params: {
      path: string;
      fileName: string;
      folderName: string;
    }) => {
      width: null | number;
      height: null | number;
    };
  };
}
