// pages/DestinationList.tsx
import React, { useState, useEffect } from 'react';

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  rating: number;
  imageUrl?: string;
}

const DestinationList: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // サンプルデータ（実際のAPIからデータを取得する場合はここを変更）
    const sampleDestinations: Destination[] = [
      {
        id: 1,
        name: "東京タワー",
        description: "東京のシンボル的な電波塔",
        location: "東京都港区",
        rating: 4.2
      },
      {
        id: 2,
        name: "清水寺",
        description: "京都の歴史的な仏教寺院",
        location: "京都府京都市",
        rating: 4.5
      },
      {
        id: 3,
        name: "富士山",
        description: "日本最高峰の美しい山",
        location: "静岡県・山梨県",
        rating: 4.8
      }
    ];

    setTimeout(() => {
      setDestinations(sampleDestinations);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="page-container">読み込み中...</div>;
  }

  return (
    <div className="page-container">
      <h1>観光地リスト</h1>
      <div className="destinations-grid">
        {destinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <h3>{destination.name}</h3>
            <p className="location">{destination.location}</p>
            <p className="description">{destination.description}</p>
            <div className="rating">
              評価: {destination.rating}/5.0
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationList;