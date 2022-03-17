import path from 'path';
import { ConfigOptions } from './types';

export const rootPath = path.resolve(__dirname, '../');

export const defaultOption: ConfigOptions = {
  router: {
    include: [],
    exclude: [],
    output: '',
  },
};
