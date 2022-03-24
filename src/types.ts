import { RouterShuttleConfig } from './shuttles/router/types';
import { IconShuttleConfig } from './shuttles/icon/types';

export interface ConfigOptions {
  router?: RouterShuttleConfig;

  icon?: IconShuttleConfig | IconShuttleConfig[];
}
