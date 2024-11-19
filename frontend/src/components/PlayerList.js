import React, { useState } from 'react';
import PlayerDetailsModal from './PlayerDetailsModal';
import AddPlayerModal from './AddPlayerModal';

function PlayerList() {
  // Stato dei giocatori
  const [players, setPlayers] = useState([
    { id: 1, name: 'Mario Rossi', attack: 8, defense: 7, technique: 9, stamina: 6, speed: 7, selected: false },
    { id: 2, name: 'Luigi Bianchi', attack: 6, defense: 8, technique: 7, stamina: 8, speed: 7, selected: false },
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Giocatore selezionato per il modale
  const [isMouseOver, setIsMouseOver] = useState(false); // Stato del mouse sul nome/modale
  const [searchQuery, setSearchQuery] = useState(''); // Filtro di ricerca
  const [sortCriteria, setSortCriteria] = useState(null); // Criterio di ordinamento
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false); // Stato del modale per aggiungere giocatori

  // Funzione per gestire il mouse sul nome
  const handleMouseEnter = (player) => {
    setSelectedPlayer(player);
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
    setSelectedPlayer(null);
  };

  // Filtra e ordina i giocatori
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (!sortCriteria) return 0; // Nessun ordinamento
    return b[sortCriteria] - a[sortCriteria];
  });

  // Funzione per bilanciare le squadre
  const createTeams = () => {
    const selectedPlayers = players.filter((player) => player.selected);
    if (selectedPlayers.length < 2) {
      alert('Devi selezionare almeno 2 giocatori per creare le squadre!');
      return;
    }

    const sorted = [...selectedPlayers].sort(
      (a, b) => b.attack + b.defense - (a.attack + a.defense)
    );

    const teamA = [];
    const teamB = [];

    sorted.forEach((player, index) => {
      if (index % 2 === 0) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    console.log('Team A:', teamA);
    console.log('Team B:', teamB);
    alert(`Squadre create! Guarda i dettagli nella console.`);
  };

  // Funzione per selezionare/deselezionare un giocatore
  const togglePlayerSelection = (id) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, selected: !player.selected } : player
      )
    );
  };

  // Funzione per aggiungere un nuovo giocatore
  const addPlayer = (newPlayer) => {
    setPlayers([...players, { ...newPlayer, id: players.length + 1, selected: false }]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista Giocatori</h2>

        {/* Barra di ricerca */}
        <input
          type="text"
          placeholder="Cerca giocatore..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginTop: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />

        {/* Pulsanti per ordinamento e creazione squadre */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => setSortCriteria('attack')} className="btn btn-primary btn-sm">
            Ordina per Attacco
          </button>
          <button onClick={() => setSortCriteria('defense')} className="btn btn-secondary btn-sm">
            Ordina per Difesa
          </button>
          <button onClick={createTeams} className="btn btn-success btn-sm">
            Crea Squadre
          </button>
          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="btn btn-primary btn-sm"
          >
            Aggiungi Giocatore
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Mostra i giocatori ordinati e filtrati */}
        {sortedPlayers.map((player) => (
          <div key={player.id} className="player-row">
            <input
              type="checkbox"
              checked={player.selected || false}
              onChange={() => togglePlayerSelection(player.id)}
              style={{ marginRight: '10px' }}
            />
            <span
              style={{
                cursor: 'pointer',
                display: 'inline-block',
              }}
              onMouseEnter={() => handleMouseEnter(player)}
              onMouseLeave={handleMouseLeave}
            >
              {player.name}
            </span>
          </div>
        ))}
      </div>

      {/* Modale per il giocatore */}
      {isMouseOver && selectedPlayer && (
        <PlayerDetailsModal
          player={selectedPlayer}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={handleMouseLeave}
        />
      )}

      {/* Modale per aggiungere un giocatore */}
      <AddPlayerModal
        show={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onSubmit={(newPlayer) => {
          addPlayer(newPlayer);
          setShowAddPlayerModal(false);
        }}
      />
    </div>
  );
}

export default PlayerList;
