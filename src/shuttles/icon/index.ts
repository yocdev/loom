import { forEach } from 'modern-async';
import { IconShuttleConfig } from './types';
import { svgrGen } from './svgr-gen';
import { ConfigOptions } from '../../types';

export const IconShuttle = async (config: ConfigOptions['icon']) => {
  const iconConfig = ([] as Array<IconShuttleConfig | undefined>).concat(
    config,
  );

  await forEach(iconConfig, async (item) => {
    await svgrGen(item);
  });
};
