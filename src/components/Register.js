import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    onRegister(email, password);
  };

  return (
    <>
      <div className="sign__container">
        <h2 className="sign__title">Регистрация</h2>
        <form id="form_login" className="sign__form" name="login" onSubmit={handleSubmit}>
          <input id="input-email" placeholder="Email" className="sign__input" name="email" type="email" value={email} onChange={handleEmailChange} required />
          <input id="input-password" placeholder="Пароль" className="sign__input" name="password" type="password" value={password} onChange={handlePasswordChange} required />
          <button type="submit" form="form_login" className="sign__button">Зарегистрироваться</button>
          <Link to="/sign-in" className="sign__caption">Уже зарегистрированы? Войти</Link>
        </form>
      </div>
    </>
  );
}

export default Register;