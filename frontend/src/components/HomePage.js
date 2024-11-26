import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../App.css';

function HomePage({ setLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    nome: '',
    cognome: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRegisterSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/register', registerData);
      setRegisterSuccess('Registrazione completata! Ora puoi accedere.');
      setRegisterData({ username: '', email: '', nome: '', cognome: '', password: '' });
      setIsModalOpen(false);
    } catch (err) {
      setError('Errore durante la registrazione. Riprova.');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center vh-100">
      {/* Logo */}
      <div className="logo mb-4">
        <h1>FootyMonday</h1>
      </div>

      {/* Form di login */}
      <div className="login-form">
        <h2>Accedi</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          <button type="submit" className="btn btn-primary w-100">Accedi</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Link per aprire il modale */}
        <p className="mt-3">
          Non hai un account?{' '}
          <a href="#" onClick={() => setIsModalOpen(true)}>
            Registrati qui
          </a>
        </p>
      </div>

      {/* Modale di registrazione */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Registrazione"
        className="custom-modal" /* Classe per il contenuto del modale */
        overlayClassName="custom-modal-overlay" /* Classe per lo sfondo */
        >
        <h2>Registrati</h2>
        <form onSubmit={handleRegisterSubmit}>
            <input
            type="text"
            name="username"
            placeholder="Username"
            value={registerData.username}
            onChange={handleRegisterChange}
            required
            className="form-control mb-3"
            />
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
            className="form-control mb-3"
            />
            <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={registerData.nome}
            onChange={handleRegisterChange}
            required
            className="form-control mb-3"
            />
            <input
            type="text"
            name="cognome"
            placeholder="Cognome"
            value={registerData.cognome}
            onChange={handleRegisterChange}
            required
            className="form-control mb-3"
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
            className="form-control mb-3"
            />
            <button type="submit" className="btn btn-success w-100">Registrati</button>
        </form>
        {registerSuccess && <p style={{ color: 'green' }}>{registerSuccess}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="btn btn-secondary mt-3 w-100" onClick={() => setIsModalOpen(false)}>
            Chiudi
        </button>
        </Modal>

    </div>
  );
}

export default HomePage;
