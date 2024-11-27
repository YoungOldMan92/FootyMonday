import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nome: '',
    cognome: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    let isValid = true;

    if (!formData.username.trim()) {
      setError('Il campo username è obbligatorio.');
      isValid = false;
    } else if (formData.username.length < 3) {
      setError('Il nome utente deve contenere almeno 3 caratteri.');
      isValid = false;
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Inserisci un indirizzo email valido.');
      isValid = false;
    } else if (!formData.password.trim()) {
      setError('Il campo password è obbligatorio.');
      isValid = false;
    } else if (formData.password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri.');
      isValid = false;
    } else if (!formData.password.match(/[A-Z]/)) {
      setError('La password deve contenere almeno una lettera maiuscola.');
      isValid = false;
    } else if (!formData.password.match(/[0-9]/)) {
      setError('La password deve contenere almeno un numero.');
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
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${config.apiBaseUrl}/user/register`, formData);
      alert(response.data.message);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante la registrazione.');
    }
  };

  return (
    <div>
      <h1>Registrati</h1>
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cognome"
          placeholder="Cognome"
          value={formData.cognome}
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
        <button type="submit">Registrati</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Registrazione completata con successo!</p>}
    </div>
  );
}

export default Register;
