import React, { useState } from 'react';
import config from '../config';

function AddPlayerModal({ show, onClose, setPlayers }) {
  const [guestName, setGuestName] = useState('');
  const [guestRole, setGuestRole] = useState('Attaccante'); // Ruolo predefinito

  const addPlayer = async (playerData) => {
    try {
      const token = localStorage.getItem('token'); // Recupera il token JWT

      // Decodifica il token per ottenere l'userId
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(window.atob(base64));
      const userId = decodedToken.userId; // Assumendo che il token abbia un campo 'id'

      // Aggiungi l'userId ai dati del giocatore
      playerData.userId = userId;
      const response = await fetch(`${config.apiBaseUrl}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Aggiunge il token JWT
        },
        body: JSON.stringify(playerData),
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const savedPlayer = await response.json();
      setPlayers((prevPlayers) => [...prevPlayers, savedPlayer]);
    } catch (error) {
      console.error('Errore durante la creazione del giocatore:', error.message);
      alert('Errore durante il salvataggio del giocatore.');
    }
  };

  const parsePlayerData = (data) => ({
    name: data.nome || 'Sconosciuto',
    capacitaTecnica: {
      controlloPalla: Number(data.controlloPalla) || 0,
      dribbling: Number(data.dribbling) || 0,
      precisionePassaggi: Number(data.precisionePassaggi) || 0,
      tiro: Number(data.tiro) || 0,
    },
    resistenzaFisica: {
      stamina: Number(data.stamina) || 0,
      velocita: Number(data.velocita) || 0,
      resistenzaSforzo: Number(data.resistenzaSforzo) || 0,
    },
    posizionamentoTattico: {
      anticipazione: Number(data.anticipazione) || 0,
      copertura: Number(data.copertura) || 0,
      adattabilitaTattica: Number(data.adattabilitaTattica) || 0,
    },
    capacitaDifensiva: {
      contrasto: Number(data.contrasto) || 0,
      intercettazioni: Number(data.intercettazioni) || 0,
      coperturaSpazi: Number(data.coperturaSpazi) || 0,
    },
    contributoInAttacco: {
      creativita: Number(data.creativita) || 0,
      movimentoSenzaPalla: Number(data.movimentoSenzaPalla) || 0,
      finalizzazione: Number(data.finalizzazione) || 0,
    },
    mentalitaEComportamento: {
      leadership: Number(data.leadership) || 0,
      gestioneStress: Number(data.gestioneStress) || 0,
      sportivita: Number(data.sportivita) || 0,
    },
  });

  const handleGenerateGuest = () => {
    if (!guestName.trim()) {
      alert('Inserisci un nome per il giocatore ospite.');
      return;
    }

    const guestPlayerData = {
      name: guestName.trim() + " - Guest",
      capacitaTecnica: { controlloPalla: 5, dribbling: 5, precisionePassaggi: 5, tiro: 5 },
      resistenzaFisica: { stamina: 5, velocita: 5, resistenzaSforzo: 5 },
      posizionamentoTattico: { anticipazione: 5, copertura: 5, adattabilitaTattica: 5 },
      capacitaDifensiva: { contrasto: 5, intercettazioni: 5, coperturaSpazi: 5 },
      contributoInAttacco: { creativita: 5, movimentoSenzaPalla: 5, finalizzazione: 5 },
      mentalitaEComportamento: { leadership: 5, gestioneStress: 5, sportivita: 5 },
      ruolo: guestRole,
      isGuest: true,
    };

    addPlayer(guestPlayerData);
    setGuestName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const playerData = parsePlayerData(Object.fromEntries(formData.entries()));

    addPlayer(playerData); // Invio al backend
    e.target.reset();
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block fade-in"
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -20%)',
        zIndex: 1050,
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        maxWidth: '600px',
        width: '90%',
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title">Aggiungi Giocatore</h5>
        <button onClick={onClose} className="btn-close"></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          <input type="text" name="nome" placeholder="Nome" required  maxLength="10" pattern="[A-Za-z0-9]+" title="Il nome può contenere solo lettere e numeri, massimo 10 caratteri" />
          <input type="number" name="controlloPalla" placeholder="Controllo Palla" required min="1" max="10" />
          <input type="number" name="dribbling" placeholder="Dribbling" required min="1" max="10" />
          <input type="number" name="precisionePassaggi" placeholder="Precisione Passaggi" required min="1" max="10" />
          <input type="number" name="tiro" placeholder="Tiro" required min="1" max="10" />
          <input type="number" name="stamina" placeholder="Stamina" required min="1" max="10" />
          <input type="number" name="velocita" placeholder="Velocità" required min="1" max="10" />
          <input type="number" name="resistenzaSforzo" placeholder="Resistenza Sforzo" required min="1" max="10" />
          <input type="number" name="anticipazione" placeholder="Anticipazione" required min="1" max="10" />
          <input type="number" name="copertura" placeholder="Copertura" required min="1" max="10" />
          <input type="number" name="adattabilitaTattica" placeholder="Adattabilità Tattica" required min="1" max="10" />
          <input type="number" name="contrasto" placeholder="Contrasto" required min="1" max="10" />
          <input type="number" name="intercettazioni" placeholder="Intercettazioni" required min="1" max="10" />
          <input type="number" name="coperturaSpazi" placeholder="Copertura Spazi" required min="1" max="10" />
          <input type="number" name="creativita" placeholder="Creatività" required min="1" max="10" />
          <input type="number" name="movimentoSenzaPalla" placeholder="Movimento Senza Palla" required min="1" max="10" />
          <input type="number" name="finalizzazione" placeholder="Finalizzazione" required min="1" max="10" />
          <input type="number" name="leadership" placeholder="Leadership" required min="1" max="10" />
          <input type="number" name="gestioneStress" placeholder="Gestione Stress" required min="1" max="10" />
          <input type="number" name="sportivita" placeholder="Sportività" required min="1" max="10" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }}>
          Aggiungi
        </button>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Nome Giocatore Ospite"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="form-control"
          />
          <select
            value={guestRole}
            onChange={(e) => setGuestRole(e.target.value)}
            className="form-control mt-2"
          >
            <option value="Attaccante">Attaccante</option>
            <option value="Centrocampista">Centrocampista</option>
            <option value="Difensore">Difensore</option>
          </select>
          <button
            type="button"
            className="btn btn-secondary mt-2"
            style={{ width: '100%' }}
            onClick={handleGenerateGuest}
          >
            Genera Giocatore Ospite
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPlayerModal;
