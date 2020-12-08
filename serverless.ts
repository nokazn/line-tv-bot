import type { Serverless } from 'serverless/aws';
import * as dotenv from 'dotenv';

dotenv.config();

const serverlessConfiguration: Serverless = {
  app: 'line-tvbot',
  org: 'nokazn',
  service: {
    name: 'line-tvbot',
  },
  frameworkVersion: '>=1.72.0',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.ts',
      includeModules: true,
    },
    'serverless-iam-roles-per-function': {
      defaultInjerit: true,
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
    'serverless-prune-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    // eslint-disable-next-line no-template-curly-in-string
    stage: "${opt:state, 'dev'}",
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
  resources: {
    Resources: [],
  },
};

module.exports = serverlessConfiguration;
