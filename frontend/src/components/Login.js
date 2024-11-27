import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

function Login({ setLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${config.apiBaseUrl}/user/login`, formData);
      const token = response.data.token;

      // Salva il token nel localStorage
      localStorage.setItem('token', token);

      // Imposta lo stato di login
      setLoggedIn(true);

      // Reindirizza l'utente (puoi usare react-router per questo)
      window.location.href = '/';
    } catch (err) {
      setError('Credenziali non valide. Riprova.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Accedi</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
