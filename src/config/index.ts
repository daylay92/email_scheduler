import * as path from 'path';
import { IConfig } from '../types';

// The root of the project folder
const ROOTPATH = path.join(__dirname, '../../');

// default configurations
export default (): Partial<IConfig> => ({
  PORT: parseInt(process.env.PORT as string, 10) || 4500,
  ROOTPATH,
});
