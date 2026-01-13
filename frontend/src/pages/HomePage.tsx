import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <section className="homepage-hero">
        <h1>SyncPlan-AI</h1>
        <p>AIと共に、あなただけの特別な旅をデザインしましょう。計画から管理まで、これひとつで完結。</p>
      </section>

      <section className="homepage-features">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>観光地リスト</h3>
            <p>人気の観光地から、AIが見つけた隠れた名所まで探索できます。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>AIチャット</h3>
            <p>プランの相談から現地の豆知識まで、AIが24時間サポートします。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>スケジュール</h3>
            <p>分単位の細かな計画も、直感的に簡単に管理できます。</p>
          </div>
        </div>
      </section>

      <section className="homepage-cta">
        <h2>さあ、旅の準備を始めましょう</h2>
        <p>SyncPlan-AI はあなたの旅をよりスムーズに、より楽しくします。</p>
        <div className="cta-buttons">
          <Link to="/chat" className="cta-button">AIに相談する</Link>
          <Link to="/destinations" className="cta-button secondary">目的地を探す</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;