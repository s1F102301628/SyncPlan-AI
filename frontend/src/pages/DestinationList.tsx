import React, { useState, useEffect } from 'react';
import './DestinationList.css';  // CSS存在確認

interface Destination {
  id: number;
  name: string;
  description: string;
  location: string;
  rating: number;
  features: string[];
  category: string;
  price?: string;
  date?: string;
}

const DestinationList: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchEvents = async () => {
  try {
    const keyword = searchTerm || 'イベント';  // 検索連動
    const response = await fetch(`/api/events?nation=日本&keyword=${keyword}&limit=50`);
    const apiEvents = await response.json();
    console.log('全国イベント:', apiEvents);

    const destinations: Destination[] = apiEvents.map((event: any, index: number) => ({
      id: index + 1,
      name: event.title,
      description: event.description,
      location: event.location,
      rating: 4.5,
      features: [event.category || 'イベント'],
      category: event.category || 'イベント',
      price: event.price || '無料',
      date: event.date
    }));

    setDestinations(destinations);
    setFilteredDestinations(destinations);
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    setLoading(false);
  }
};
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = destinations.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [searchTerm, destinations]);

  const renderStars = (rating: number) => '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>読み込み中...</div>;

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{textAlign: 'center', color: '#333'}}>埼玉県イベント一覧</h1>
      <p style={{textAlign: 'center', color: '#666'}}>オープンデータ取得（全{filteredDestinations.length}件）</p>
      
      <div style={{marginBottom: '30px', display: 'flex', gap: '20px', justifyContent: 'center'}}>
        <input
          style={{padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ddd'}}
          placeholder="イベント名・場所で検索（例:川口）"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
        {filteredDestinations.map((destination) => (
          <div key={destination.id} style={{
            border: '1px solid #ddd', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{margin: '0 0 10px 0', color: '#紫'}}>{destination.name}</h3>  {/* 紫テーマ */}
            <p style={{color: '#666', margin: '5px 0'}}><strong>場所:</strong> {destination.location}</p>
            {destination.date && <p style={{color: '#666', margin: '5px 0'}}><strong>日時:</strong> {destination.date}</p>}
            <p style={{margin: '10px 0'}}>{destination.description}</p>
            <div style={{margin: '10px 0'}}>
              {destination.features.map((f, i) => (
                <span key={i} style={{
                  display: 'inline-block', background: '#紫', color: 'white', padding: '5px 10px',
                  margin: '5px 5px 5px 0', borderRadius: '20px', fontSize: '14px'
                }}>{f}</span>
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px'}}>
              <span style={{fontSize: '18px'}}>{renderStars(destination.rating)} {destination.rating}</span>
              <span style={{color: '#紫', fontWeight: 'bold'}}>{destination.price}</span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDestinations.length === 0 && (
        <p style={{textAlign: 'center', color: '#999', fontSize: '18px'}}>イベントが見つかりません。「埼玉」「川口」で検索試して！</p>
      )}
    </div>
  );
};

export default DestinationList;
