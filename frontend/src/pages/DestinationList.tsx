import React, { useState, useEffect } from 'react';
import './DestinationList.css';

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  rating: number;
  features: string[];
  category: string;
  price?: string;
}

const DestinationList: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const sampleDestinations: Destination[] = [
      { id: 1, name: "東京タワー", description: "東京のシンボル的な電波塔。夜景が美しいことで知られています。", location: "東京都港区", rating: 4.2, features: ["夜景", "展望台"], category: "観光スポット", price: "1,200円〜" },
      { id: 2, name: "清水寺", description: "京都の歴史的な仏教寺院。「清水の舞台」で有名な本堂は圧巻です。", location: "京都府京都市", rating: 4.5, features: ["世界遺産", "歴史"], category: "文化・歴史", price: "400円" },
      { id: 3, name: "富士山", description: "日本最高峰の美しい山。日本の象徴として世界中に知られています。", location: "静岡県・山梨県", rating: 4.8, features: ["自然", "絶景"], category: "自然", price: "1,000円" },
      { id: 4, name: "沖縄美ら海水族館", description: "巨大な水槽でジンベエザメが泳ぐ姿を見ることができます。", location: "沖縄県本部町", rating: 4.6, features: ["水族館", "体験"], category: "レジャー", price: "2,180円" },
      { id: 5, name: "金閣寺（鹿苑寺）", description: "金箔で覆われた美しい三層の楼閣。庭園も見どころです。", location: "京都府京都市", rating: 4.4, features: ["世界遺産", "写真スポット"], category: "文化・歴史", price: "500円" },
      { id: 6, name: "ユニバーサル・スタジオ・ジャパン", description: "大阪にある人気のテーマパーク。映画の世界を体験できます。", location: "大阪府大阪市", rating: 4.3, features: ["テーマパーク", "グルメ"], category: "レジャー", price: "8,600円〜" }
    ];

    setTimeout(() => {
      setDestinations(sampleDestinations);
      setFilteredDestinations(sampleDestinations);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = destinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          destination.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || destination.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredDestinations(filtered);
  }, [searchTerm, categoryFilter, destinations]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="destinations-page-container">
      <div className="destinations-header">
        <h1>おすすめ観光地</h1>
        <p>日本全国の魅力的な観光スポットをご紹介。あなたの次の旅の目的地を見つけてください。</p>
      </div>

      <div className="destinations-filter">
        <div className="filter-group">
          <label>検索</label>
          <input
            type="text"
            placeholder="観光地名や地域で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>カテゴリー</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="観光スポット">観光スポット</option>
            <option value="文化・歴史">文化・歴史</option>
            <option value="自然">自然</option>
            <option value="レジャー">レジャー</option>
          </select>
        </div>
        <button className="search-btn">検索</button>
      </div>

      <div className="destinations-grid">
        {filteredDestinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <div className="destination-image">
              <div className="destination-badge">{destination.category}</div>
            </div>
            <div className="destination-info">
              <h3 className="destination-title">{destination.name}</h3>
              <p className="destination-location">{destination.location}</p>
              <p className="destination-description">{destination.description}</p>
              <div className="destination-features">
                {destination.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
              <div className="destination-footer">
                <div className="destination-rating">
                  <span className="stars">{renderStars(destination.rating)}</span>
                  <span className="rating-text">{destination.rating}</span>
                </div>
                <button className="view-details-btn">詳細を見る</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="destinations-stats">
        <h2>SyncPlan-AI 観光データ</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{destinations.length}</span>
            <span className="stat-label">観光地</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">47</span>
            <span className="stat-label">都道府県</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.4</span>
            <span className="stat-label">平均評価</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1M+</span>
            <span className="stat-label">年間利用者</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationList;