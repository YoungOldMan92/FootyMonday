import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from 'axios';
import config from '../config';

function PlayerManagementModal({ show, onClose, setPlayers }) {
  const [players, setLocalPlayers] = useState([]);

  useEffect(() => {
    // Carica la lista dei giocatori dal backend quando il modale viene aperto
    if (show) {
      const fetchPlayers = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${config.apiBaseUrl}/players`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLocalPlayers(response.data);
        } catch (error) {
          console.error('Errore durante il caricamento dei giocatori:', error.response?.data || error.message);
        }
      };

      fetchPlayers();
    }
  }, [show]);

  const handleDeletePlayer = async (playerName) => {
    if (window.confirm(`Sei sicuro di voler eliminare ${playerName}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${config.apiBaseUrl}/players/${playerName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Aggiorna la lista locale dei giocatori
        setLocalPlayers((prevPlayers) => prevPlayers.filter((p) => p.name !== playerName));

        // Aggiorna la lista dei giocatori nell'app principale
        setPlayers((prevPlayers) => prevPlayers.filter((p) => p.name !== playerName));
      } catch (error) {
        console.error('Errore durante la cancellazione:', error.response?.data || error.message);
        alert('Errore durante la cancellazione del giocatore. Riprova più tardi.');
      }
    }
  };

  console.log('Stato show ricevuto:', show);


  return (
    <Dialog
      header="Gestione Giocatori"
      visible={show}
      style={{ width: '50vw' }}
      onHide={onClose}
      footer={
        <div>
          <Button label="Chiudi" icon="pi pi-times" onClick={onClose} />
        </div>
      }
    >
      <div>
        {players.length === 0 ? (
          <p>Nessun giocatore disponibile.</p>
        ) : (
          <ul>
            {players.map((player) => (
              <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{player.name} - {player.ruolo}</span>
                <Button
                  label="Elimina"
                  icon="pi pi-trash"
                  className="p-button-danger"
                  onClick={() => handleDeletePlayer(player.name)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
}

export default PlayerManagementModal;
