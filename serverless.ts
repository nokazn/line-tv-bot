// eslint-disable-next-line import/no-import-module-exports
import type { Serverless } from 'serverless/aws';

const config: Serverless = {
  service: 'line-tv-bot',
  frameworkVersion: '>=1.72.0',
  variablesResolutionMode: '20210326',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.ts',
      includeModules: true,
    },
    'serverless-iam-roles-per-function': {
      defaultInherit: true,
    },
    globalTables: {
      regions: ['ap-northeast-1'],
    },
    prune: {
      automatic: true,
      number: 3,
    },
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-iam-roles-per-function',
    'serverless-create-global-dynamodb-table',
    'serverless-prune-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: process.env.NODE_ENV,
    // eslint-disable-next-line no-template-curly-in-string
    region: "${opt:region, 'ap-northeast-1'}",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      DEBUG: '*',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    tracing: {
      lambda: true,
      apiGateway: false,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['xrax:PutTraceSecments', 'xray:PutTelemetryRecords'],
        Resource: '*',
      },
    ],
    lambdaHashingVersion: 20201221,
  },
  functions: {
    hello: {
      handler: './src/handler.hello',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
          },
        },
      ],
    },
  },
};

module.exports = config;
