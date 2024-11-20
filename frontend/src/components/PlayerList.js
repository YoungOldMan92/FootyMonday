import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import AddPlayerModal from './AddPlayerModal';

function PlayerList({ onTeamsUpdate, setHoveredPlayer }) {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}/players`)
      .then((response) => setPlayers(response.data))
      .catch((err) => console.error("Errore durante il caricamento dei giocatori:", err));
  }, []);

  const togglePlayerSelection = (name) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.name === name ? { ...player, selected: !player.selected } : player
      )
    );
  };

  const deletePlayer = (name) => {
    if (window.confirm("Sei sicuro di voler eliminare questo giocatore?")) {
      axios
        .delete(`${config.apiBaseUrl}/players/${name}`)
        .then(() =>
          setPlayers((prev) => prev.filter((player) => player.name !== name))
        )
        .catch((err) => console.error("Errore durante l'eliminazione del giocatore:", err));
    }
  };

  const createTeams = () => {
    const selectedPlayers = players.filter((player) => player.selected);
    if (selectedPlayers.length < 2) {
      alert("Seleziona almeno 2 giocatori per creare le squadre!");
      return;
    }

    // Mescola casualmente i giocatori selezionati
    const shuffledPlayers = [...selectedPlayers].sort(() => 0.5 - Math.random());

    // Divide i giocatori in due squadre bilanciate
    const teamSize = Math.floor(shuffledPlayers.length / 2);
    const teamA = shuffledPlayers.slice(0, teamSize);
    const teamB = shuffledPlayers.slice(teamSize);

    onTeamsUpdate({ teamA, teamB });
  };

  const updateRoles = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/players/update-roles`);
      alert(response.data.message);
      setPlayers(response.data.updatedPlayers);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dei ruoli:', error);
      alert('Errore durante l\'aggiornamento dei ruoli');
    }
  };

  const filteredPlayers = players.filter((player) =>
    player.name && player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (!sortCriteria) return 0;
    return b[sortCriteria] - a[sortCriteria];
  });

  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista Giocatori</h2>
      </div>
      <div className="card-body">
        <input
          type="text"
          placeholder="Cerca giocatore..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control mb-3"
        />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSortCriteria('attack')}
            className="btn btn-outline-primary btn-sm"
          >
            Ordina per Attacco
          </button>
          <button
            onClick={() => setSortCriteria('defense')}
            className="btn btn-outline-secondary btn-sm"
          >
            Ordina per Difesa
          </button>
          <button
            onClick={createTeams}
            className="btn btn-outline-success btn-sm"
          >
            Crea Squadre
          </button>
          <button
            onClick={updateRoles}
            className="btn btn-outline-info btn-sm"
          >
            Aggiorna Ruoli
          </button>
          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="btn btn-outline-primary btn-sm"
          >
            Aggiungi Giocatore
          </button>
        </div>
      </div>
      <div className="row">
        {sortedPlayers.map((player) => (
          <div
            key={player.name}
            className={`col-md-4 mb-3 ${
              player.selected ? 'selected' : ''
            }`}
            onClick={() => togglePlayerSelection(player.name)}
            onMouseEnter={() => setHoveredPlayer(player)}
            onMouseLeave={() => setHoveredPlayer(null)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className={`card h-100 player-card ${player.selected ? 'selected' : ''}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita di attivare la selezione
                  deletePlayer(player.name);
                }}
                className="delete-button"
                title="Elimina giocatore"
              >
                <i className="bi bi-trash"></i>
              </button>
              <div className="card-body">
                <h5 className="card-title">{player.name}</h5>
                <p className="card-text small-text">
                  <strong>Valore Totale:</strong> {player.valoreTotale || 0}
                </p>
                <p className="card-text small-text">
                  <strong>Ruolo:</strong> {player.ruolo || 'Non assegnato'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddPlayerModal
        show={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onSubmit={(newPlayer) =>
          setPlayers((prev) => [...prev, { ...newPlayer, selected: false }])
        }
      />
    </div>
  );
}

export default PlayerList;
