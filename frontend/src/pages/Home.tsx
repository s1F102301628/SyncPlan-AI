import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToEvents = () => {
    navigate('/events');
  }

  const goToTalk = () => {
    navigate('/talk')
  }

  const goToSchedule = () => {
    navigate('/schedule')
  }


  return (
    <div>
      <h1>ようこそ SyncPlan-AI へ！</h1>
      <button onClick={goToEvents}>イベント掲載ページへ</button>
      <button onClick={goToTalk}>AIとの対話ページへ</button>
      <button onClick={goToSchedule}>スケジュール一覧ページへ</button>
    </div>
    
  );
};

export default Home;