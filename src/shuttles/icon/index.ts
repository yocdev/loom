import { forEach } from 'modern-async';
import { IconShuttleConfig } from './types';
import { svgrGen } from './svgr.gen';
import { ConfigOptions } from '../../types';
import { imgGen } from './img.gen';

export const IconShuttle = async (config: ConfigOptions['icon']) => {
  const iconConfig = ([] as Array<IconShuttleConfig | undefined>).concat(
    config,
  );

  await forEach(iconConfig, async (item) => {
    if (!item) return;
    if (item.imageModeOption) {
      await imgGen(item);
    } else {
      await svgrGen(item);
    }

    // await indexFileGen(item);
  });
};
