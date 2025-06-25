import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* ここにLoginPageやDashboardPageなど追加予定 */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
