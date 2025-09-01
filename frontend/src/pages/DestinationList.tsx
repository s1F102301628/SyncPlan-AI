import React, { useState, useEffect } from 'react';

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  rating: number;
  imageUrl?: string;
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
    // より豊富なサンプルデータ（実際のAPIからデータを取得する場合はここを変更）
    const sampleDestinations: Destination[] = [
      {
        id: 1,
        name: "東京タワー",
        description: "東京のシンボル的な電波塔。高さ333mからの眺望は絶景で、特に夜景が美しいことで知られています。展望台からは東京の街並みを一望でき、天気の良い日には富士山も見えます。",
        location: "東京都港区",
        rating: 4.2,
        features: ["夜景", "展望台", "グルメ", "お土産"],
        category: "観光スポット",
        price: "大人 1,200円〜"
      },
      {
        id: 2,
        name: "清水寺",
        description: "京都の歴史的な仏教寺院。「清水の舞台」で有名な本堂は釘を使わない伝統的な木造建築で、ユネスコ世界遺産に登録されています。四季折々の美しさを楽しめます。",
        location: "京都府京都市",
        rating: 4.5,
        features: ["世界遺産", "歴史", "紅葉", "桜"],
        category: "文化・歴史",
        price: "大人 400円"
      },
      {
        id: 3,
        name: "富士山",
        description: "日本最高峰の美しい山。標高3,776mの成層火山で、日本の象徴として世界中に知られています。登山シーズンは7月上旬から9月上旬まで。",
        location: "静岡県・山梨県",
        rating: 4.8,
        features: ["登山", "自然", "温泉", "絶景"],
        category: "自然",
        price: "登山料 1,000円"
      },
      {
        id: 4,
        name: "沖縄美ら海水族館",
        description: "世界最大級の水族館の一つ。巨大な「黒潮の海」水槽では、ジンベエザメやマンタが悠々と泳ぐ姿を見ることができます。沖縄の海の生物を間近で観察できます。",
        location: "沖縄県本部町",
        rating: 4.6,
        features: ["水族館", "ジンベエザメ", "体験", "ファミリー"],
        category: "レジャー",
        price: "大人 2,180円"
      },
      {
        id: 5,
        name: "金閣寺（鹿苑寺）",
        description: "金箔で覆われた美しい三層の楼閣。室町時代に建立された禅寺で、庭園の池に映る金閣の姿は特に美しく、多くの観光客を魅了しています。",
        location: "京都府京都市",
        rating: 4.4,
        features: ["世界遺産", "庭園", "写真スポット", "歴史"],
        category: "文化・歴史",
        price: "大人 500円"
      },
      {
        id: 6,
        name: "ユニバーサル・スタジオ・ジャパン",
        description: "大阪にある人気のテーマパーク。ハリー・ポッターエリアやマリオエリアなど、映画の世界を体験できるアトラクションが充実しています。",
        location: "大阪府大阪市",
        rating: 4.3,
        features: ["テーマパーク", "アトラクション", "ショー", "グルメ"],
        category: "レジャー",
        price: "1デイ・スタジオ・パス 8,600円〜"
      }
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
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
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
        <button className="search-btn">
          検索
        </button>
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
                <button className="view-details-btn">
                  詳細を見る
                </button>
              </div>
              
              {destination.price && (
                <div style={{ marginTop: '1rem', color: '#e74c3c', fontWeight: 'bold' }}>
                  {destination.price}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>該当する観光地が見つかりませんでした</h3>
          <p>検索条件を変更してもう一度お試しください。</p>
        </div>
      )}
    </div>
  );
};

export default DestinationList;