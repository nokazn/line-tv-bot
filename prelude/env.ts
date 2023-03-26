import { validateEnv } from '../src/schemas/env';

if (process.env.NODE_ENV !== 'production') {
  import('dotenv/config');
}

validateEnv(process.env);
