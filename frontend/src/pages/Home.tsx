import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToEvents = () => {
    navigate('/events');
  }
  return (
    <div>
      <h1>ようこそ SyncPlan-AI へ！</h1>
      <button onClick={goToEvents}>イベントページへ</button>
    </div>
    
  );
};

export default Home;