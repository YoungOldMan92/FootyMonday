import React, { useState } from 'react';
import PlayerDetailsModal from './PlayerDetailsModal';
import AddPlayerModal from './AddPlayerModal';

function PlayerList() {
  const [players, setPlayers] = useState([
    { id: 1, nome: 'Mario Rossi', attack: 8, defense: 7, technique: 9, stamina: 6, speed: 7, selected: false, valoreTotale: 37 },
    { id: 2, nome: 'Luigi Bianchi', attack: 6, defense: 8, technique: 7, stamina: 8, speed: 7, selected: false, valoreTotale: 36 },
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

  // Funzione per eliminare un giocatore
  const deletePlayer = (id) => {
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== id));
  };

  // Filtra e ordina i giocatori
  const filteredPlayers = players.filter((player) =>
    player.name && player.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    const macroCategories = {
      tecnica: [newPlayer.controlloPalla, newPlayer.dribbling, newPlayer.precisionePassaggi, newPlayer.tiro],
      resistenza: [newPlayer.stamina, newPlayer.velocita, newPlayer.resistenzaSforzo],
      tattica: [newPlayer.anticipazione, newPlayer.copertura, newPlayer.adattabilitaTattica],
      difesa: [newPlayer.contrasto, newPlayer.intercettazioni, newPlayer.coperturaSpazi],
      attacco: [newPlayer.creativita, newPlayer.movimentoSenzaPalla, newPlayer.finalizzazione],
      mentalita: [newPlayer.leadership, newPlayer.gestioneStress, newPlayer.sportivita],
    };
  
    const valoreTotale = Object.values(macroCategories)
      .map((cat) => cat.reduce((sum, val) => sum + val, 0) / cat.length)
      .reduce((sum, val) => sum + val, 0);
  
    setPlayers((prev) => [...prev, { ...newPlayer, id: prev.length + 1, valoreTotale }]);
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
          <div
            key={player.id}
            className="player-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
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
                {player.name} - Valore Totale: {player.valoreTotale || 0}
              </span>
            </div>
            {/* Pulsante per eliminare il giocatore */}
            {player.selected && (
              <button
                onClick={() => deletePlayer(player.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'red',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <i className="bi bi-dash-circle"></i> Rimuovi
              </button>
            )}
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
        onSubmit={addPlayer}
      />
    </div>
  );
}

export default PlayerList;
