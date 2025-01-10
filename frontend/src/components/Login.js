import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import '../Login.css';

function Login({ setLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // Controllo Token al Caricamento
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true); // Imposta login se token esiste
    }
  }, [setLoggedIn]);

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

    if (!validateForm()) return;

    try {
      console.log('Invio dati:', formData);

      const response = await axios.post(`${config.apiBaseUrl}/user/login`, formData);
      const token = response.data.token;

      // Salva il token nel localStorage
      localStorage.setItem('token', token);

      // Aggiorna lo stato e ricarica la pagina
      setLoggedIn(true);
      window.location.reload();
    } catch (err) {
      console.error('Errore nel login:', err.response ? err.response.data : err.message);
      setError('Credenziali non valide. Riprova.');
    }
  };

  return (
    <div className="login-container">
      <Panel header="Accedi" style={{ width: '350px', margin: '0 auto', marginTop: '50px' }}>
        <form onSubmit={handleSubmit}>
          <div className="p-field" style={{ marginBottom: '15px' }}>
            <label htmlFor="username">Username</label>
            <InputText
              id="username"
              name="username"
              placeholder="Inserisci username"
              value={formData.username}
              onChange={handleChange}
              className="p-inputtext"
              required
            />
          </div>
          <div className="p-field" style={{ marginBottom: '15px' }}>
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              name="password"
              placeholder="Inserisci password"
              value={formData.password}
              onChange={handleChange}
              feedback={false}
              toggleMask
              required
            />
          </div>
          {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
          <Button
            label="Accedi"
            icon="pi pi-sign-in"
            className="p-button-primary"
            type="submit"
            style={{ width: '100%' }}
          />
        </form>
      </Panel>
    </div>
  );
}

export default Login;
