# 無料デプロイ手順（Neon + Vercel）

完全無料・クレジットカード不要で本番公開できます。

---

## 使うサービス

| サービス | 用途 | 料金 |
|---|---|---|
| [GitHub](https://github.com) | コード管理 | 無料 |
| [Neon](https://neon.tech) | PostgreSQL データベース | 無料枠あり |
| [Vercel](https://vercel.com) | Next.js ホスティング | 無料枠あり |

---

## STEP 1: GitHub にコードをアップロード

```bash
# seitai-yoyaku フォルダで実行
cd /Users/leo/seitai-yoyaku

git init
git add .
git commit -m "initial commit"
```

1. https://github.com/new でリポジトリを作成（名前例: `seitai-yoyaku`）
2. Private でも Public でもOK（Vercel 無料枠は両方対応）
3. GitHub が表示するコマンドを貼り付けて push:

```bash
git remote add origin https://github.com/YOUR_NAME/seitai-yoyaku.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Neon でデータベースを作成

1. https://neon.tech → **Start for free** → GitHub でサインアップ
2. **New Project** を作成（名前例: `seitai-yoyaku`）
3. リージョンは **Asia Pacific (Singapore)** を選択
4. 作成後、**Connection Details** パネルを開く
5. プルダウンを **Prisma** に切り替えると接続文字列が2行表示される:
   - `DATABASE_URL` (pgbouncer=true がついているもの) → コピー
   - `DIRECT_URL` (pgbouncer なしのもの) → コピー

---

## STEP 3: Vercel にデプロイ

1. https://vercel.com → **Start Deploying** → GitHub でサインアップ
2. **Add New Project** → GitHub リポジトリを選択（`seitai-yoyaku`）
3. **Environment Variables** セクションで以下を追加:

| 変数名 | 値 |
|---|---|
| `DATABASE_URL` | Neon の pooled 接続文字列 |
| `DIRECT_URL` | Neon の direct 接続文字列 |
| `NEXTAUTH_SECRET` | ターミナルで `openssl rand -base64 32` を実行した結果 |
| `NEXTAUTH_URL` | `https://あなたのアプリ名.vercel.app`（Deploy 後に確定するURLを後で更新） |
| `MAIL_MOCK` | `true`（最初はモックでOK） |

4. **Deploy** ボタンを押す → 数分でデプロイ完了

---

## STEP 4: データベースの初期化（マイグレーション & シード）

Vercel デプロイ後、ローカルで以下を実行してテーブルを作成します。

`.env.local` の `DATABASE_URL` と `DIRECT_URL` を Neon の接続文字列に書き換えてから:

```bash
cd /Users/leo/seitai-yoyaku

# node のパスを通す（インストール済みの場合）
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

# テーブルを作成
npx prisma migrate deploy

# 初期データを投入
npx prisma db seed
```

---

## STEP 5: NEXTAUTH_URL を更新

1. Vercel ダッシュボード → Project → Settings → Environment Variables
2. `NEXTAUTH_URL` を実際のURL（例: `https://seitai-yoyaku.vercel.app`）に更新
3. Vercel ダッシュボード → Deployments → 最新のデプロイ → **Redeploy**

---

## デプロイ後の確認

| 確認項目 | URL |
|---|---|
| トップページ | `https://xxx.vercel.app/` |
| ログイン | `https://xxx.vercel.app/login` |
| 管理画面 | `https://xxx.vercel.app/admin` |

デモアカウント:
- 管理者: `admin@example.com` / `password123`
- 顧客: `customer1@example.com` / `password123`

---

## コード変更後の更新方法

```bash
git add .
git commit -m "変更内容"
git push
```

push するたびに Vercel が自動でリビルド・デプロイします。

---

## メール通知を本番で使う（オプション）

Gmail のアプリパスワードを使う場合:
1. Google アカウント → セキュリティ → 2段階認証をオン
2. Google アカウント → セキュリティ → アプリパスワードを作成
3. Vercel の環境変数に追加:

| 変数名 | 値 |
|---|---|
| `MAIL_MOCK` | `false` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Gmail アドレス |
| `SMTP_PASS` | アプリパスワード（スペースなし16文字） |
| `SMTP_FROM` | Gmail アドレス |
