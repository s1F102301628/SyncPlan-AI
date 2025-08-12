

// function App() {
//   return <AppRouter />;
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import DestinationList from './pages/DestinationList.tsx';
import ChatPage from './pages/ChatPage.tsx';
import SchedulePage from './pages/SchedulePage.tsx';
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