import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import AddPlayerModal from './AddPlayerModal';
import PlayerRadarChart from './PlayerRadarChart';

function PlayerList({ onTeamsUpdate }) {
  const [players, setPlayers] = useState([]);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Stato per la ricerca

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}/players`)
      .then((response) => {
        setPlayers(response.data || []);
      })
      .catch((err) => console.error('Errore durante il caricamento dei giocatori:', err));
  }, []);

  const togglePlayerSelection = (player) => {
    setSelectedPlayers((prev) =>
      prev.includes(player)
        ? prev.filter((p) => p !== player)
        : [...prev, player]
    );
  };

  const createTeams = () => {
    if (selectedPlayers.length < 2 || selectedPlayers.length % 2 !== 0) {
      alert('Seleziona un numero pari di giocatori maggiore o uguale a 2!');
      return;
    }

    const shuffledPlayers = [...selectedPlayers].sort(() => Math.random() - 0.5);
    const half = Math.floor(shuffledPlayers.length / 2);

    const teamA = shuffledPlayers.slice(0, half);
    const teamB = shuffledPlayers.slice(half);

    if (teamA.length === 0 || teamB.length === 0) {
      alert('Errore: una delle squadre è vuota!');
      return;
    }

    onTeamsUpdate(teamA, teamB);
    setShowPlayerModal(false);
  };

  // Funzione per filtrare i giocatori
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (player.ruolo &&
      player.ruolo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <h2>Gestione Squadre</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button
          label="Crea Squadre"
          icon="pi pi-users"
          onClick={() => setShowPlayerModal(true)}
        />
        <Button
          label="Aggiungi Giocatore"
          icon="pi pi-plus"
          onClick={() => setShowAddPlayerModal(true)}
        />
      </div>

      {/* Modale per la selezione dei giocatori */}
      <Dialog
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Seleziona Giocatori</h4>
            <Button
              label="Conferma e Crea Squadre"
              icon="pi pi-check"
              className="p-button-primary"
              onClick={createTeams}
            />
          </div>
        }
        visible={showPlayerModal}
        style={{ width: '80vw' }}
        onHide={() => setShowPlayerModal(false)}
      >
        <div style={{ display: 'flex', gap: '20px', padding: '10px' }}>
          {/* Lista Giocatori */}
          <div style={{ flex: 2, overflowY: 'auto', maxHeight: '500px', padding: '10px' }}>
            {/* Campo di Ricerca */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Cerca per nome o ruolo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              {filteredPlayers.map((player) => (
                <div
                  key={player.name}
                  className={`player-card ${
                    selectedPlayers.includes(player) ? 'selected' : ''
                  }`}
                  onMouseEnter={() => setHoveredPlayer(player)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                  onClick={() => togglePlayerSelection(player)}
                >
                  {/* Header: Nome */}
                  <h4 className="player-card-header">{player.name}</h4>

                  {/* Corpo: Ruolo e Valore */}
                  <div className="player-card-body">
                    <p className="player-role">
                      {player.ruolo === 'Attaccante'
                        ? 'AT'
                        : player.ruolo === 'Centrocampista'
                        ? 'CC'
                        : player.ruolo === 'Difensore'
                        ? 'DF'
                        : 'N/A'}
                    </p>
                    <p className="player-value">{player.valoreTotale || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grafico Radar */}
          <div style={{ flex: 1, position: 'sticky', top: '20px', padding: '20px' }}>
            <PlayerRadarChart player={hoveredPlayer} />
          </div>
        </div>
      </Dialog>

      {/* Modale per aggiungere un nuovo giocatore */}
      <AddPlayerModal
        show={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        setPlayers={setPlayers}
      />
    </div>
  );
}

export default PlayerList;
