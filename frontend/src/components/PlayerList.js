import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import PlayerDetailsModal from './PlayerDetailsModal';
import AddPlayerModal from './AddPlayerModal';

function PlayerList({ onTeamsUpdate }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [matchHistory, setMatchHistory] = useState([]);

  // Carica i giocatori dal backend
  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}/players`)
      .then((response) => setPlayers(response.data))
      .catch((err) => console.error("Errore durante il caricamento dei giocatori:", err));
  }, []);

  // Funzione per creare le squadre
  const createTeams = () => {
    const selectedPlayers = players.filter((player) => player.selected);
    if (selectedPlayers.length < 2) {
      alert('Devi selezionare almeno 2 giocatori per creare le squadre!');
      return;
    }

    const teamSize = Math.floor(selectedPlayers.length / 2);
    const shuffled = [...selectedPlayers].sort(() => 0.5 - Math.random());
    const teamA = shuffled.slice(0, teamSize);
    const teamB = shuffled.slice(teamSize);

    onTeamsUpdate({ teamA, teamB });

    setMatchHistory((prev) => [
      { teams: { teamA: teamA.map((p) => p.name), teamB: teamB.map((p) => p.name) } },
      ...prev.slice(0, 4), // Mantiene solo le ultime 5 partite
    ]);
  };

  // Calcola il valore totale
  const calculateValoreTotale = (player) => {
    const macroCategories = {
      capacitaTecnica: [
        player.controlloPalla,
        player.dribbling,
        player.precisionePassaggi,
        player.tiro,
      ],
      resistenzaFisica: [
        player.stamina,
        player.velocita,
        player.resistenzaSforzo,
      ],
      posizionamentoTattico: [
        player.anticipazione,
        player.copertura,
        player.adattabilitaTattica,
      ],
      capacitaDifensiva: [
        player.contrasto,
        player.intercettazioni,
        player.coperturaSpazi,
      ],
      contributoInAttacco: [
        player.creativita,
        player.movimentoSenzaPalla,
        player.finalizzazione,
      ],
      mentalitaEComportamento: [
        player.leadership,
        player.gestioneStress,
        player.sportivita,
      ],
    };

    const valoreTotale = Object.values(macroCategories)
      .map((cat) => cat.reduce((sum, val) => sum + (Number(val) || 0), 0) / cat.length)
      .reduce((sum, val) => sum + val, 0);

    return Math.round(valoreTotale); // Arrotonda il valore totale
  };

  // Funzione per aggiungere giocatori
  const addPlayer = (newPlayer) => {
    const playerData = {
      name: newPlayer.name,
      capacitaTecnica: {
        controlloPalla: newPlayer.controlloPalla,
        dribbling: newPlayer.dribbling,
        precisionePassaggi: newPlayer.precisionePassaggi,
        tiro: newPlayer.tiro,
      },
      resistenzaFisica: {
        stamina: newPlayer.stamina,
        velocita: newPlayer.velocita,
        resistenzaSforzo: newPlayer.resistenzaSforzo,
      },
      posizionamentoTattico: {
        anticipazione: newPlayer.anticipazione,
        copertura: newPlayer.copertura,
        adattabilitaTattica: newPlayer.adattabilitaTattica,
      },
      capacitaDifensiva: {
        contrasto: newPlayer.contrasto,
        intercettazioni: newPlayer.intercettazioni,
        coperturaSpazi: newPlayer.coperturaSpazi,
      },
      contributoInAttacco: {
        creativita: newPlayer.creativita,
        movimentoSenzaPalla: newPlayer.movimentoSenzaPalla,
        finalizzazione: newPlayer.finalizzazione,
      },
      mentalitaEComportamento: {
        leadership: newPlayer.leadership,
        gestioneStress: newPlayer.gestioneStress,
        sportivita: newPlayer.sportivita,
      },
      valoreTotale: calculateValoreTotale(newPlayer),
      gol: 0, // Inizializza a 0
    };

    console.log("Dati inviati al backend:", playerData); // Debug

    axios
      .post(`${config.apiBaseUrl}/players`, playerData)
      .then((response) => setPlayers((prev) => [...prev, response.data]))
      .catch((err) => console.error("Errore durante l'aggiunta del giocatore:", err));
  };

  // Funzione per eliminare un giocatore
  const deletePlayer = (name) => {
    axios
      .delete(`${config.apiBaseUrl}/players/${name}`)
      .then(() => setPlayers((prev) => prev.filter((player) => player.name !== name)))
      .catch((err) => console.error("Errore durante l'eliminazione del giocatore:", err));
  };

  // Filtra e ordina i giocatori
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setSortCriteria('attack')} className="btn btn-primary btn-sm">
            Ordina per Attacco
          </button>
          <button onClick={() => setSortCriteria('defense')} className="btn btn-secondary btn-sm">
            Ordina per Difesa
          </button>
          <button onClick={createTeams} className="btn btn-success btn-sm">
            Crea Squadre
          </button>
          <button onClick={() => setShowAddPlayerModal(true)} className="btn btn-primary btn-sm">
            Aggiungi Giocatore
          </button>
        </div>
      </div>
      <div className="card-body">
        {sortedPlayers.map((player) => (
          <div key={player.name} className="player-row d-flex justify-content-between align-items-center">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input
                type="checkbox"
                checked={player.selected || false}
                onChange={() => setPlayers((prev) =>
                  prev.map((p) => (p.name === player.name ? { ...p, selected: !p.selected } : p))
                )}
              />
              <span
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => {
                  setSelectedPlayer(player.name); // Passa il nome del giocatore
                  setIsMouseOver(true);
                }}
                onMouseLeave={() => {
                  setIsMouseOver(false);
                  setSelectedPlayer(null);
                }}
              >
                {player.name} - Valore Totale: {player.valoreTotale || 0}
              </span>
            </div>
            {player.selected && (
              <button
                onClick={() => deletePlayer(player.name)}
                className="btn btn-link text-danger"
              >
                <i className="bi bi-dash-circle"></i> Rimuovi
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedPlayer && isMouseOver && (
        <PlayerDetailsModal
          playerName={selectedPlayer} // Passa il nome del giocatore
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
        />
      )}
      <AddPlayerModal
        show={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        onSubmit={addPlayer}
      />
    </div>
  );
}

export default PlayerList;
