import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../App.css';
import config from '../config';
import Register from './Register'; // Importa il componente Register

function HomePage({ setLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Funzione per chiudere il modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        <Register onClose={handleCloseModal} /> {/* Passa onClose a Register */}
      </Modal>
    </div>
  );
}

export default HomePage;
