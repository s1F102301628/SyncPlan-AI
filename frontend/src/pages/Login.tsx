import React, { useState } from 'react';
import './Login.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // ここにログイン処理を書く
    console.log('ログインボタン押された！', { username, password });
    alert(`ログイン情報\nユーザー名: ${username}\nパスワード: ${password}`);
  };

  return (
    <div className='login-page'>
    <div className="page-container">
      <div className="container">
        <h1>ログイン</h1>
        <p>作業を続けるには、ログインしてください。</p>
        <p>ユーザー名</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="textbox"
          placeholder="ユーザー名を入力"
        />
        <p>パスワード</p>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="textbox"
          placeholder="パスワードを入力"
        />
        <br />
        <label className="margin">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />{' '}
          パスワードを表示する
        </label>
        <br />
        <button className="button margin" onClick={handleLogin}>
          ログイン
        </button>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
