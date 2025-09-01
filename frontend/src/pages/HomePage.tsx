import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="page-container">
      <h1>SyncPlan-AI へようこそ</h1>
      <p>旅行の計画を立てるためのAIアシスタントです。</p>
      <div className="feature-grid">
        <div className="feature-card">
          <h3>観光地リスト</h3>
          <p>人気の観光地や隠れた名所を探索できます</p>
        </div>
        <div className="feature-card">
          <h3>AIチャット</h3>
          <p>旅行に関する質問をAIに相談できます</p>
        </div>
        <div className="feature-card">
          <h3>スケジュール</h3>
          <p>作成した旅行スケジュールを管理できます</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;