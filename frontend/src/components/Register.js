import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../App.css';

function Register({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    confirmEmail: '',
    nome: '',
    cognome: '',
    password: '',
    confirmPassword: '',
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
    } else if (formData.email !== formData.confirmEmail) {
      setError('Gli indirizzi email non coincidono.');
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
    } else if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono.');
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
      const { username, email, nome, cognome, password } = formData;
      const response = await axios.post(`${config.apiBaseUrl}/user/register`, {
        username,
        email,
        nome,
        cognome,
        password,
      });
      alert(response.data.message);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante la registrazione.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Registrati</h1>
      <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
          <input
            type="text"
            name="nome"
            className="form-control"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="cognome"
            className="form-control"
            placeholder="Cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="email"
            name="confirmEmail"
            className="form-control"
            placeholder="Conferma Email"
            value={formData.confirmEmail}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Conferma Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12 d-flex justify-content-between align-items-stretch">
          <button type="submit" className="btn btn-primary w-45 h-100">Registrati</button>
          <button
            type="button"
            className="btn btn-secondary w-45 h-100"
            onClick={onClose}
          >
            Chiudi
          </button>
        </div>
        {error && <p className="text-danger text-center mt-3">{error}</p>}
        {success && <p className="text-success text-center mt-3">Registrazione completata con successo!</p>}
      </form>
    </div>
  );
}

export default Register;
