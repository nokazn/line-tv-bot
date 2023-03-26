import dotenv from 'dotenv';
import { validateEnv } from '../src/schemas/env';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import('dotenv/config');
validateEnv(process.env);
