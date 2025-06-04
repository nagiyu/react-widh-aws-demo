# Next.js × Lambda × LocalStack 開発手順

## 概要

Next.js アプリ（my-next-app）を AWS Lambda で動作させ、LocalStack（Docker）上でローカル開発・検証を行う手順をまとめます。

---

## 1. Next.js 側の準備

### 1-1. `next.config.ts` の修正

```ts
const nextConfig: NextConfig = {
  output: 'standalone',
  /* 他の設定 */
};
export default nextConfig;
```

### 1-2. Lambda ハンドラの作成（`lambda.js`）

```js
const serverlessExpress = require('@vendia/serverless-express');
const path = require('path');
const app = require('./.next/standalone/server.js');
process.chdir(path.resolve(__dirname, '.next/standalone'));
exports.handler = serverlessExpress({ app });
```

### 1-3. 依存パッケージの追加

```sh
npm install @vendia/serverless-express
```

### 1-4. ビルド

```sh
npm run build
```

---

## 2. Lambda デプロイ用パッケージの作成

```sh
zip -r lambda.zip .next/standalone .next/static lambda.js package.json package-lock.json node_modules
```

---

## 3. LocalStack のセットアップ

### 3-1. `docker-compose.yml` の用意（プロジェクトルート）

```yaml
version: "3.8"
services:
  localstack:
    image: localstack/localstack:latest
    container_name: localstack
    ports:
      - "4566:4566"
      - "4571:4571"
    environment:
      - SERVICES=lambda,apigateway,s3
      - DEBUG=1
      - LAMBDA_EXECUTOR=docker
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "./.localstack:/var/lib/localstack"
```

### 3-2. LocalStack の起動

```sh
docker compose up -d
```

---

## 4. Lambda 関数のデプロイ（LocalStack）

LocalStack の Lambda へデプロイするには AWS CLI を使用します。  
（例：`my-next-app` ディレクトリで）

```sh
aws --endpoint-url=http://localhost:4566 lambda create-function \
  --function-name my-next-app \
  --runtime nodejs18.x \
  --handler lambda.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://lambda.zip
```

※ `--role` はダミーでOK（LocalStack用）

---

## 5. API Gateway 連携・動作確認

API Gateway で Lambda をトリガーし、Next.js アプリにアクセスできるように設定します。  
詳細は LocalStack のドキュメントや AWS CLI の `apigateway` コマンドを参照してください。

---

## 補足

- Lambda での動作は Node.js ランタイム（例: nodejs18.x）を想定
- 静的ファイル（.next/static）は Lambda パッケージに含める
- データストレージはローカルJSONファイルを参照
- LocalStack のバージョンや AWS CLI のインストールが必要

---
