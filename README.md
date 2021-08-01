# Apollo Server + Prisma の素振り

自前で GraphQL サーバーを実装するときのための練習です。  
認証機能のある Todo アプリケーションを想定しています。

## モチベーション

- DB で定義されている型をフロントエンドの UI まで届けたい
- Hasura や AWS AppSync といったマネージドなサービスに依存せず GraphQL サーバーを実装する技術を身に着けておきたい
- Apollo Server と Prisma を試してみたかった

## 環境構築手順

### 依存をインストール

```sh
yarn
```

### .env を作成

.env.example を参考に.env をプロジェクトルートに作成

### Postgres サーバーを起動

```sh
docker-compose up
```

### （初回だけ？）DB の migrate

prisma/shema.prisma で定義されている内容で DB にテーブルが作成される

```sh
npx prisma migrate dev --name init
```

### GraphQL サーバーの起動

```sh
yarn dev
```

## 参考

- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres
- https://zenn.dev/intercept6/articles/3daca0298d32d8022e71
- https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql
- https://www.apollographql.com/docs/apollo-server/getting-started/
