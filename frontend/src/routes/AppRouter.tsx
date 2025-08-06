import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Events from "../pages/Events";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        {/* ここにLoginPageやDashboardPageなど追加予定 */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
