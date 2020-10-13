import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'line-tvbot',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
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
    globalTables: {
      regions: ['us-east-2'],
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
    runtime: 'nodejs12.x',
    // eslint-disable-next-line no-template-curly-in-string
    stage: "${opt:state, 'local'}",
    // eslint-disable-next-line no-template-curly-in-string
    region: "${opt:region, 'us-east-2'}",
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
};

module.exports = serverlessConfiguration;
