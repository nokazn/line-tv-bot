/* eslint-disable import/no-import-module-exports */
import * as path from 'path';
import slsw from 'serverless-webpack';
import nodeExternals from 'webpack-node-externals';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type { Configuration } from 'webpack';

/** @description プロジェクトルートからの相対パスを返す */
const fromProjectRoot = (...paths: string[]) => path.resolve(__dirname, ...paths);

const config: Configuration = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal ? 'eval-cheap-module-source-map' : 'source-map',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '~': fromProjectRoot('./src'),
      '~~': fromProjectRoot('./'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            fromProjectRoot('node_modules'),
            fromProjectRoot('.serverless'),
            fromProjectRoot('.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{t,j}s{,x}',
        enabled: true,
        options: { cache: true },
      },
    }),
  ],
};

module.exports = config;
