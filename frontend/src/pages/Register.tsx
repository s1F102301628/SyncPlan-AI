import React, { useState } from 'react';
import './Login.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // ここに会員登録処理を書く
    console.log('会員登録ボタン押された！', { username, password });
    alert(`会員登録情報\nユーザー名: ${username}\nパスワード: ${password}`);
  };

  return (
    <div className='login-page'>
    <div className="page-container">
      <div className="container">
        <h1>会員登録ページです！</h1>
        <p>作業を続けるには、会員登録してください。</p>
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
          会員登録
        </button>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
