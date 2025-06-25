# SyncPlan-AI

React + Node.js + TypeScript で構成されたチーム実習開発用Webアプリケーション。

---

## 🔧 開発環境のセットアップ

### 1. 必要な環境

- Node.js v18.x 以上
- npm（または yarn）

確認コマンド：
```bash
node -v
npm -v
```
- インストールがされていない場合：Node.js公式からダウンロードする。 https://nodejs.org/ja/

- GitHubからレポジトリをクローンする。

### 2. 必要なパッケージのインストール

パッケージインストールコマンド:
```bash
cd frontend
npm install
npm install react-router-dom
npm install --save-dev @types/react-router-dom
cd ..  
cd backend
npm install
```
- frontendとbackendフォルダそれぞれでパッケージをインストール。

### 3. 動作確認

確認コマンド:
```bash
cd frontend
npm run dev
cd ..
cd backend
npm run dev
```
- Webにてそれぞれエラーが起きず起動できればおｋ。