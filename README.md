# line-rv-bot

テレビ番組を LINE に通知する。

## 開発

```bash
# パッケージのインストール
yarn

# ローカルで関数を起動
yarn dev

# デプロイ
yarn deploy
```

## デプロイ

このプログラムは Serverless Framework でデプロイされている。

Serverless Framework でデプロイするのに必要な以下のポリシーをアタッチした IAM ユーザーを作成する。

<details>
<summary>IAM ポリシー</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "AllowCloudFormation",
          "Effect": "Allow",
          "Action": [
              "cloudformation:CreateStack",
              "cloudformation:DeleteStack",
              "cloudformation:DescribeStackEvents",
              "cloudformation:DescribeStackResource",
              "cloudformation:DescribeStackResources",
              "cloudformation:DescribeStacks",
              "cloudformation:ListStackResources",
              "cloudformation:UpdateStack"
          ],
          "Resource": "arn:aws:cloudformation:ap-northeast-1:<アカウントID>:stack/<サービス名>*"
      },
      {
          "Sid": "AllowCloudFormationValidateTemplate",
          "Effect": "Allow",
          "Action": [
              "cloudformation:ValidateTemplate"
          ],
          "Resource": "*"
      },
      {
          "Sid": "AllowRole",
          "Effect": "Allow",
          "Action": [
              "iam:AttachRolePolicy",
              "iam:CreateRole",
              "iam:CreateServiceLinkedRole",
              "iam:DeleteRole",
              "iam:DeleteRolePolicy",
              "iam:DetachRolePolicy",
              "iam:GetRole",
              "iam:PassRole",
              "iam:PutRolePolicy"
          ],
          "Resource": "arn:aws:iam::<アカウントID>:role/*"
      },
      {
          "Sid": "AllowS3",
          "Effect": "Allow",
          "Action": [
              "s3:Get*",
              "s3:List*",
              "s3:Put*",
              "s3:CreateBucket",
              "s3:DeleteBucket",
              "s3:DeleteBucketPolicy",
              "s3:DeleteObject"
          ],
          "Resource": "arn:aws:s3:::<サービス名>*"
      },
      {
          "Sid": "AllowCloudwatch",
          "Effect": "Allow",
          "Action": [
              "logs:DescribeLogGroups",
              "logs:CreateLogGroup",
              "logs:DeleteLogGroup",
              "logs:PutRetentionPolicy"
          ],
          "Resource": "arn:aws:logs:ap-northeast-1:<アカウントID>:*"
      },
      {
          "Sid": "AllowEventBridge",
          "Effect": "Allow",
          "Action": [
              "events:PutRule",
              "events:DescribeRule",
              "events:DeleteRule",
              "events:PutTargets",
              "events:RemoveTargets"
          ],
          "Resource": "arn:aws:events:ap-northeast-1:<アカウントID>:rule/<サービス名>*"
      },
      {
          "Sid": "AllowDynamoDB",
          "Effect": "Allow",
          "Action": [
              "dynamodb:DescribeTable",
              "dynamodb:CreateTable",
              "dynamodb:DeleteTable"
          ],
          "Resource": [
              "arn:aws:events:ap-northeast-1:<アカウントID>:rule/<サービス名>*",
              "arn:aws:dynamodb:ap-northeast-1:<アカウントID>:table/<サービス名>*"
          ]
      },
      {
          "Sid": "AllowAPIGateway",
          "Effect": "Allow",
          "Action": [
              "apigateway:*"
          ],
          "Resource": "arn:aws:apigateway:ap-northeast-1::/restapis*"
      },
      {
          "Sid": "AllowLambda",
          "Effect": "Allow",
          "Action": [
              "lambda:GetFunction",
              "lambda:DeleteFunction",
              "lambda:CreateFunction",
              "lambda:GetFunctionConfiguration",
              "lambda:ListVersionsByFunction",
              "lambda:AddPermission",
              "lambda:RemovePermission",
              "lambda:PublishVersion",
              "lambda:UpdateFunctionCode",
              "lambda:ListAliases",
              "lambda:UpdateFunctionConfiguration"
          ],
          "Resource": "arn:aws:lambda:ap-northeast-1:<アカウントID>:function:<サービス名>*"
      }
  ]
}
```

</details>

上記で作成した IAM ユーザーのアクセスキー ID とシークレットアクセスキーを GitHub Actions 内の環境変数に設定しておく。

### 環境変数

| 変数名 | 説明 |
| -- | -- |
| AWS_ACCESS_KEY_ID | IAM ユーザーのアクセスキー ID |
| AWS_SECRET_ACCESS_KEY | IAM ユーザーのシークレットアクセスキー |
