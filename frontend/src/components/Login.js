import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

function Login({ setLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (!formData.username.trim()) {
      setError('Il campo username è obbligatorio.');
      isValid = false;
    } else if (formData.username.length < 3) {
      setError('L’username deve contenere almeno 3 caratteri.');
      isValid = false;
    } else if (!formData.password.trim()) {
      setError('Il campo password è obbligatorio.');
      isValid = false;
    } else if (formData.password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri.');
      isValid = false;
    }

    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

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
<<<<<<< HEAD
          maxLength="10" // Limita la lunghezza a 10 caratteri
          pattern="[A-Za-z0-9]+" // Consente solo lettere e numeri
          title="Il nome può contenere solo lettere e numeri, massimo 10 caratteri"
=======
>>>>>>> f78ac1c92fed7ff391255cb8708050f8b3db3592
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
