import path from 'path';
import { RouterShuttleConfig } from './shuttles/router/types';
import { IconShuttleConfig } from './shuttles/icon/types';

export const rootPath = path.resolve(__dirname, '../');

export const defaultOption = {
  router: {
    include: [],
    exclude: [],
    output: '',
  } as RouterShuttleConfig,
  icon: {
    include: [],
    exclude: [],
    output: '',
  } as IconShuttleConfig,
};
