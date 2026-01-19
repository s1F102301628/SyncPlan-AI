# Deployment notes — SyncPlan-AI (Backend)

目的: ドメイン取得前でもローカルで動作確認できるようにするための手順と、将来的に本番公開するための切り替え手順をまとめます。

## ローカルでの動作確認（ドメイン不要）
1. `backend/.env` をルートの `.env.example` をコピーして作成し、必要な値を入れる。
   - `GOOGLE_OAUTH_CALLBACK` はデフォルトで `http://localhost:3000/auth/oauth2callback` に設定しています。
2. Google Cloud Console の OAuth クライアントの「Authorized redirect URIs」に `http://localhost:3000/auth/oauth2callback` を追加する。
   - localhost の redirect URI は検証済みドメイン不要で許可されます（ただし、アプリが "Testing" ステータスの場合は、テストユーザーとして登録したアカウントのみアクセスできます）。
3. OAuth テストユーザーとして使用する Google アカウントを OAuth consent screen の Test users に追加する。
4. サーバーを起動して、フロントの「YouTube 同期」ボタンを押すか、直接 `GET /auth/google` にアクセスしてフローを確認する。

## 本番公開（ドメイン取得後）の流れ
1. ドメインを取得して Web ホスティングを用意する（例: `https://syncplan.example`）。
2. 公開サイトにプライバシーポリシーを設置（必須）。
3. Google Cloud Console の OAuth consent screen を開き、
   - App Information（アプリ名・サポートメール）を入力
   - Authorized domains に公開ドメイン（例: `syncplan.example`）を追加（ドメイン所有確認が必要）
   - Scopes に `https://www.googleapis.com/auth/youtube.readonly` などを追加し、利用目的を明確に記載する
4. OAuth の Redirect URI を本番用に変更（例: `https://syncplan.example/auth/oauth2callback`）
5. Google に OAuth 同意画面の検証（verification）を申請する。
   - プライバシーポリシー URL、同意画面スクリーンショット、デモ動画などが必要です。
6. 検証が完了したら、OAuth consent を `In production` に切り替えると、テストユーザー制限が解除されます。

## 簡単チェックリスト（まとめ）
- [ ] `.env` を準備してローカルで動かせることを確認
- [ ] OAuth クライアントに `http://localhost:3000/auth/oauth2callback` を追加
- [ ] テストユーザーを OAuth consent に追加してログインできることを確認
- [ ] ドメイン取得後に `FRONTEND_URL` と `GOOGLE_OAUTH_CALLBACK` を本番用に差し替え
- [ ] 検証に必要な資料（プライバシーポリシー、スクリーンショット、デモ動画）を用意して申請

必要なら、私が次に自動生成するもの:
- プライバシーポリシーのドラフト（簡易版）
- OAuth 同意画面用のスコープ説明文（申請にそのまま使えるテキスト）
- デモ動画用の録画スクリプト

どれを生成しますか？
