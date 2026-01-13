import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          SyncPlan-AI
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              ホーム
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/destinations" 
              className={`navbar-link ${isActive('/destinations') ? 'active' : ''}`}
            >
              観光地リスト
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/chat" 
              className={`navbar-link ${isActive('/chat') ? 'active' : ''}`}
            >
              AI チャット
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/schedule" 
              className={`navbar-link ${isActive('/schedule') ? 'active' : ''}`}
            >
              スケジュール
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/login" 
              className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
            >
              ログイン
            </Link>
            <Link 
              to="/register" 
              className={`navbar-link ${isActive('/register') ? 'active' : ''}`}
            >
              会員登録
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;