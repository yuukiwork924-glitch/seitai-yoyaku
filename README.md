# れおらぼ整体院 予約システム（PWA）

整体院向けのオンライン予約・顧客管理システム。  
Next.js 14 + Prisma + NextAuth + SQLite で構築。iPhone/Android のブラウザから「ホームに追加」でアプリのように使用可能。

---

## 起動手順

```bash
# 前提: Node.js 20 が必要
# Homebrew: brew install node@20
# PATH追加: export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

cd /Users/leo/seitai-yoyaku
npm install
npx prisma migrate dev   # DB初期化（初回のみ）
npm run dev              # 開発サーバー起動
```

- 顧客側: http://localhost:3000
- 管理者: http://localhost:3000/admin

## デモアカウント

| 役割 | メール | パスワード |
|------|--------|-----------|
| 管理者 | admin@example.com | password123 |
| 顧客（再診） | customer1@example.com | password123 |
| 顧客（初回） | customer2@example.com | password123 |

## 画面一覧

### 顧客側
| URL | 内容 |
|-----|------|
| `/` | トップ（店舗紹介・メニュー・料金） |
| `/reserve` → `/reserve/complete` | 予約フロー（6ステップ） |
| `/login` / `/register` | ログイン・新規登録 |
| `/mypage` | マイページ（次回予約・ポイント残高） |
| `/mypage/history` | 予約履歴 + カルテ閲覧 |
| `/mypage/points` | ポイント残高・履歴 |

### 管理者側
| URL | 内容 |
|-----|------|
| `/admin` | ダッシュボード（今日の予約・月次売上） |
| `/admin/reservations` | 予約管理（週カレンダービュー） |
| `/admin/reservations/[id]` | 詳細・カルテ記入・ステータス変更 |
| `/admin/customers` | 顧客一覧（検索） |
| `/admin/customers/[id]` | 顧客詳細・問診票・施術履歴 |
| `/admin/menus` | メニュー管理 |
| `/admin/staff` / `/admin/staff/[id]` | スタッフ管理・シフト設定 |
| `/admin/settings` | 営業設定・休診日・ポイント設定 |

## 技術スタック

- **フロント**: Next.js 14 App Router + TypeScript + Tailwind CSS
- **DB**: SQLite + Prisma 5
- **認証**: NextAuth.js v4 (Credentials)
- **PWA**: next-pwa (Service Worker)
- **メール通知**: 開発中はコンソールログ（MAIL_MOCK=true）

## 環境変数（.env.local）

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=local-dev-secret-do-not-use-in-prod
MAIL_MOCK=true
```

## よく使うコマンド

```bash
npm run dev          # 開発サーバー
npm run build        # プロダクションビルド
npx prisma studio    # DB管理GUI
npx prisma db seed   # デモデータ再投入
```

## 本番デプロイ（別途確認後に実施）

Vercel / Railway などへのデプロイ、PostgreSQL 切替、SMTP 設定など。  
**有料サービス登録・デプロイは必ず確認してから実施。**
