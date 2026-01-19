import React from 'react';
import './Login.css';

const LoginPage: React.FC = () => {

  const handleLogin = () => {
    // ローカルログインは廃止し、Google OAuth にリダイレクトする
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className='login-page'>
    <div className="page-container">
      <div className="container">
        <h1>ログイン</h1>
        <p>作業を続けるには、ログインしてください。</p>
        <p>Googleアカウントでログインしてください。</p>
        <button className="button margin" onClick={handleLogin}>
          Googleでログイン
        </button>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
