// PlayerManagementModal.js
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import config from '../config';
import AddPlayerModal from './AddPlayerModal';

import "../App.css"


function PlayerManagementModal({ show, onClose, players, setPlayers }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Per modificare un giocatore
  const [playerData, setPlayerData] = useState({ name: '', ruolo: '', valoreTotale: 0 }); // Stato del form
  const [isEditing, setIsEditing] = useState(false); // Per distinguere tra aggiunta e modifica
  const [showForm, setShowForm] = useState(false); // Mostra o nasconde il form di aggiunta/modifica
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Stato per il modale di modifica
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Stato per il modale di conferma
  const [playerToDelete, setPlayerToDelete] = useState(null); // Giocatore selezionato per l'eliminazione

  useEffect(() => {
    if (selectedPlayer) {
      setPlayerData({
        name: selectedPlayer.name,
        ruolo: selectedPlayer.ruolo,
        valoreTotale: selectedPlayer.valoreTotale,
        ...selectedPlayer
      });
      setIsEditing(true);
      setShowForm(true);
    } else {
      setPlayerData({ name: '', ruolo: '', valoreTotale: 0 });
      setIsEditing(false);
    }
  }, [selectedPlayer]);

  const handleInputChange = (e, field) => {
    setPlayerData({ ...playerData, [field]: e.target.value });
  };

  const handleEditClick = (player) => {
    setSelectedPlayer(player); // Salva il giocatore selezionato con tutte le sue caratteristiche
    setShowEditModal(true); // Mostra il modale di modifica
  };

  const handleSubmitEdit = async () => {
    if (!selectedPlayer.name || !selectedPlayer.ruolo) {
      alert('Nome e ruolo sono obbligatori!');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${config.apiBaseUrl}/players/${encodeURIComponent(selectedPlayer.name)}`, // Usa il nome come identificatore
        selectedPlayer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Aggiorna la lista locale dei giocatori
      setPlayers((prev) =>
        prev.map((player) =>
          player.name === selectedPlayer.name ? selectedPlayer : player
        )
      );
  
      setShowEditModal(false); // Chiudi il modale
      setSuccessMessage('Giocatore modificato con successo!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Errore durante la modifica:', error);
      alert('Errore durante la modifica del giocatore. Riprova.');
    }
  };
  
  const handleDeleteClick = (player) => {
    setPlayerToDelete(player); // Salva il giocatore da eliminare
    setShowConfirmModal(true); // Mostra il modale di conferma
  };

  const confirmDelete = async () => {
    if (!playerToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiBaseUrl}/players/${playerToDelete.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Aggiorna la lista dei giocatori eliminando quello selezionato
      setPlayers((prev) => prev.filter((p) => p.name !== playerToDelete.name));

      setSuccessMessage('Giocatore eliminato con successo.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Errore durante la cancellazione:', error);
      alert('Errore durante la cancellazione del giocatore. Riprova.');
    } finally {
      setShowConfirmModal(false); // Chiudi il modale di conferma
      setPlayerToDelete(null); // Resetta il giocatore selezionato
    }
  };

  return (
    <Dialog
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="pi pi-users" style={{ fontSize: '24px', color: '#007bff' }}></i>
          <h4 style={{ margin: 0 }}>Gestione Giocatori</h4>
        </div>
      }
      visible={show}
      style={{ width: '60vw', borderRadius: '10px' }}
      onHide={onClose}
    >

      <div style={{ marginBottom: '20px' }}>
      <Button
        label="Aggiungi Giocatore"
        icon="pi pi-plus"
        onClick={() => setShowAddPlayerModal(true)}
      />
      </div>

      <div className="player-card-grid-management">
        {players && players.length > 0 ? (
          players.map((player, index) => (
            <div key={player.id || index} className="player-card no-animation">
              <div className="player-card-actions">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-warning p-button-text"
                  onClick={() => handleEditClick(player)}
                  tooltip="Modifica Giocatore"
                  tooltipOptions={{ position: 'top' }}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-text"
                  onClick={() => handleDeleteClick(player)}
                  tooltip="Elimina Giocatore"
                  tooltipOptions={{ position: 'top' }}
                />
              </div>
              <div className="player-card-header">
                <h4>{player.name}</h4>
                <p>{player.ruolo}</p>
              </div>
              <div className="player-card-value">
                {player.valoreTotale}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>Nessun giocatore disponibile</p>
        )}
      </div>

      <AddPlayerModal
        show={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        setPlayers={setPlayers}
      />

      {successMessage && (
        <div
          style={{
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
          }}
        >
          <i className="pi pi-check-circle" style={{ marginRight: '10px' }}></i>
          {successMessage}
        </div>
      )}

      <Dialog
        header="Conferma Eliminazione"
        visible={showConfirmModal}
        style={{ width: '30vw' }}
        onHide={() => setShowConfirmModal(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              className="btn btn-secondary modal-close-button"
              onClick={() => setShowConfirmModal(false)}
            >
              <i className="pi pi-times" style={{ marginRight: '5px' }}></i>
              Annulla
            </button>
            <button
              className="btn btn-danger modal-confirm-button"
              onClick={confirmDelete}
            >
              <i className="pi pi-check" style={{ marginRight: '5px' }}></i>
              Conferma
            </button>
          </div>
        }
      >
        <p>Sei sicuro di voler eliminare il giocatore <strong>{playerToDelete?.name}</strong>?</p>
      </Dialog>

      <Dialog
        header="Modifica Giocatore"
        visible={showEditModal}
        style={{ width: '50vw' }}
        onHide={() => setShowEditModal(false)}
        footer={
          <div>
            <Button
              label="Annulla"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => setShowEditModal(false)}
            />
            <Button
              label="Salva Modifiche"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleSubmitEdit}
            />
          </div>
        }
      >
        {selectedPlayer && (
          <form>
            <div className="p-field">
              <label htmlFor="name">Nome</label>
              <InputText
                id="name"
                value={selectedPlayer.name}
                onChange={(e) =>
                  setSelectedPlayer({ ...selectedPlayer, name: e.target.value })
                }
              />
            </div>
            <div className="p-field">
              <label htmlFor="ruolo">Ruolo</label>
              <InputText
                id="ruolo"
                value={selectedPlayer.ruolo}
                onChange={(e) =>
                  setSelectedPlayer({ ...selectedPlayer, ruolo: e.target.value })
                }
              />
            </div>

            <h5>Caratteristiche Tecniche</h5>
            {["controlloPalla", "dribbling", "precisionePassaggi", "tiro"].map((field) => (
              <div key={field} className="p-field">
                <label htmlFor={field}>{field}</label>
                <InputText
                  id={field}
                  type="number"
                  value={selectedPlayer.capacitaTecnica[field]}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      capacitaTecnica: {
                        ...selectedPlayer.capacitaTecnica,
                        [field]: parseInt(e.target.value, 10),
                      },
                    })
                  }
                />
              </div>
            ))}

            <h5>Resistenza Fisica</h5>
            {["stamina", "velocita", "resistenzaSforzo"].map((field) => (
              <div key={field} className="p-field">
                <label htmlFor={field}>{field}</label>
                <InputText
                  id={field}
                  type="number"
                  value={selectedPlayer.resistenzaFisica[field]}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      resistenzaFisica: {
                        ...selectedPlayer.resistenzaFisica,
                        [field]: parseInt(e.target.value, 10),
                      },
                    })
                  }
                />
              </div>
            ))}

            <h5>Posizionamento Tattico</h5>
            {["anticipazione", "copertura", "adattabilitaTattica"].map((field) => (
              <div key={field} className="p-field">
                <label htmlFor={field}>{field}</label>
                <InputText
                  id={field}
                  type="number"
                  value={selectedPlayer.posizionamentoTattico[field]}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      posizionamentoTattico: {
                        ...selectedPlayer.posizionamentoTattico,
                        [field]: parseInt(e.target.value, 10),
                      },
                    })
                  }
                />
              </div>
            ))}

            <h5>Capacità Difensiva</h5>
            {["contrasto", "intercettazioni", "coperturaSpazi"].map((field) => (
              <div key={field} className="p-field">
                <label htmlFor={field}>{field}</label>
                <InputText
                  id={field}
                  type="number"
                  value={selectedPlayer.capacitaDifensiva[field]}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      capacitaDifensiva: {
                        ...selectedPlayer.capacitaDifensiva,
                        [field]: parseInt(e.target.value, 10),
                      },
                    })
                  }
                />
              </div>
            ))}

            <h5>Contributo in Attacco</h5>
            {["creativita", "movimentoSenzaPalla", "finalizzazione"].map((field) => (
              <div key={field} className="p-field">
                <label htmlFor={field}>{field}</label>
                <InputText
                  id={field}
                  type="number"
                  value={selectedPlayer.contributoInAttacco[field]}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      contributoInAttacco: {
                        ...selectedPlayer.contributoInAttacco,
                        [field]: parseInt(e.target.value, 10),
                      },
                    })
                  }
                />
              </div>
            ))}

            <h5>Mentalità e Comportamento</h5>
            {["leadership", "gestioneStress", "sportivita"].map((field) => (
              <div key={field} className="p-field">
                <label htmlFor={field}>{field}</label>
                <InputText
                  id={field}
                  type="number"
                  value={selectedPlayer.mentalitaEComportamento[field]}
                  onChange={(e) =>
                    setSelectedPlayer({
                      ...selectedPlayer,
                      mentalitaEComportamento: {
                        ...selectedPlayer.mentalitaEComportamento,
                        [field]: parseInt(e.target.value, 10),
                      },
                    })
                  }
                />
              </div>
            ))}
          </form>
        )}
      </Dialog>

    </Dialog>
  );
}

export default PlayerManagementModal;
