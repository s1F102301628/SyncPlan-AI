

// function App() {
//   return <AppRouter />;
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DestinationList from './pages/DestinationList';
import ChatPage from './pages/ChatPage';
import SchedulePage from './pages/SchedulePage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationList />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;