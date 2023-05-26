import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onLogin(email, password).then((data) => {
      if (data) {
        navigate('/');
      }
    });
  };

  return (
      <div className="sign__container">
        <h2 className="sign__title">Вход</h2>
        <form onSubmit={handleSubmit} id="form_login" className="sign__form" name="login">
          <input 
            id="input-email" 
            placeholder="Email" 
            className="sign__input" 
            name="email" 
            type="email" 
            required
            value={email}
            onChange={handleEmailChange} 
          />
          <input 
            id="input-password" 
            placeholder="Пароль" 
            className="sign__input" 
            name="password" 
            type="password" 
            required 
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="submit" form="form_login" className="sign__button">Войти</button>
        </form>
      </div>
  );
}

export default Login;