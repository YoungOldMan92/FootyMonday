import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import AddPlayerModal from './AddPlayerModal';
import MatchHistory from './MatchHistory';

function PlayerList({ onTeamsUpdate, setHoveredPlayer }) {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [matchHistory, setMatchHistory] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);

  useEffect(() => {
    // Fetch players from the backend
    axios
      .get(`${config.apiBaseUrl}/players`)
      .then((response) => setPlayers(response.data))
      .catch((err) => console.error("Errore durante il caricamento dei giocatori:", err));

    // Fetch existing teams from the backend
    axios
      .get(`${config.apiBaseUrl}/teams`)
      .then((response) => {
        if (response.data.teams) {
          setTeamA(response.data.teams[0]);
          setTeamB(response.data.teams[1]);
        }
      })
      .catch((err) => console.error("Errore durante il caricamento delle squadre:", err));
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
    if (selectedPlayers.length < 2 || selectedPlayers.length % 2 !== 0) {
      alert("Seleziona un numero pari di giocatori maggiore o uguale a 2 per creare le squadre!");
      return;
    }

    const calculateTeamValue = (team) =>
      team.reduce((total, player) => total + player.valoreTotale + (player.gol || 0), 0);

    const distributeRoles = (playersByRole) => {
      const shuffled = [...playersByRole].sort(() => 0.5 - Math.random());
      const half = Math.floor(shuffled.length / 2);
      return [shuffled.slice(0, half), shuffled.slice(half)];
    };

    const attackers = selectedPlayers.filter((p) => p.ruolo === 'Attaccante');
    const defenders = selectedPlayers.filter((p) => p.ruolo === 'Difensore');
    const midfielders = selectedPlayers.filter((p) => p.ruolo === 'Centrocampista');

    const [teamAAttackers, teamBAttackers] = distributeRoles(attackers);
    const [teamADefenders, teamBDefenders] = distributeRoles(defenders);
    const [teamAMidfielders, teamBMidfielders] = distributeRoles(midfielders);

    let newTeamA = [...teamAAttackers, ...teamADefenders, ...teamAMidfielders];
    let newTeamB = [...teamBAttackers, ...teamBDefenders, ...teamBMidfielders];

    while (newTeamA.length > newTeamB.length) {
      newTeamB.push(newTeamA.pop());
    }
    while (newTeamB.length > newTeamA.length) {
      newTeamA.push(newTeamB.pop());
    }

    const teamAValue = calculateTeamValue(newTeamA);
    const teamBValue = calculateTeamValue(newTeamB);

    // Aggiorna immediatamente il componente TeamDisplay
    if (typeof onTeamsUpdate === 'function') {
      onTeamsUpdate(newTeamA, newTeamB);
    }

    // Salva le squadre nel backend
    axios
      .post(`${config.apiBaseUrl}/teams`, { teamA: newTeamA, teamB: newTeamB })
      .then(() => {
        console.log('Squadre salvate nel backend.');
      })
      .catch((err) => console.error("Errore durante il salvataggio delle squadre:", err));
  };

  const saveMatchResults = (teamAGoals, teamBGoals) => {
    const latestMatch = { teamA, teamB, teamAGoals, teamBGoals };
    setMatchHistory((prevHistory) => [...prevHistory, latestMatch]);
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

  const recalculateValues = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/players/recalculate-values`);
      alert(response.data.message);

      // Ricarica i giocatori aggiornati
      const updatedPlayers = await axios.get(`${config.apiBaseUrl}/players`);
      setPlayers(updatedPlayers.data);
    } catch (error) {
      console.error('Errore durante il ricalcolo dei valori:', error);
      alert('Errore durante il ricalcolo dei valori. Controlla la console per i dettagli.');
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
            onClick={recalculateValues}
            className="btn btn-outline-warning btn-sm"
          >
            Ricalcola Valori
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
            className={`col-md-4 mb-3 ${player.selected ? 'selected' : ''}`}
            onClick={() => togglePlayerSelection(player.name)}
            onMouseEnter={() => setHoveredPlayer(player)}
            onMouseLeave={() => setHoveredPlayer(null)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className={`card h-100 player-card ${player.selected ? 'selected' : ''}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
        setPlayers={setPlayers}
      />
    </div>
  );
}

export default PlayerList;
