import './env';

if (process.env.NODE_ENV !== 'production') {
  import('tsconfig-paths/register');
}
