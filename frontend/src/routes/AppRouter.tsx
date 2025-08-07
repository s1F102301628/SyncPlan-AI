import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Events from "../pages/Events";
import Talk from '../pages/Talk';
import Schedule from '../pages/Schedule';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/talk" element={<Talk />} />
        <Route path="/schedule" element={<Schedule />} />
        {/* ここにLoginPageやDashboardPageなど追加予定 */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
