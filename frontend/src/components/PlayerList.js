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
      .then((response) => setPlayers(response.data || [])) // Assicura un array vuoto
      .catch((err) => console.error("Errore durante il caricamento dei giocatori:", err));

    // Fetch existing teams from the backend
    axios
      .get(`${config.apiBaseUrl}/teams`)
      .then((response) => {
        if (response.data.teams) {
          setTeamA(response.data.teams[0] || []);
          setTeamB(response.data.teams[1] || []);
        }
      })
      .catch((err) => console.error("Errore durante il caricamento delle squadre:", err));
  }, []);

  const togglePlayerSelection = (name) => {
    setPlayers((prev) =>
      (prev || []).map((player) =>
        player.name === name ? { ...player, selected: !player.selected } : player
      )
    );
  };

  const deletePlayer = (name) => {
    if (window.confirm("Sei sicuro di voler eliminare questo giocatore?")) {
      axios
        .delete(`${config.apiBaseUrl}/players/${name}`)
        .then(() =>
          setPlayers((prev) => (prev || []).filter((player) => player.name !== name))
        )
        .catch((err) => console.error("Errore durante l'eliminazione del giocatore:", err));
    }
  };

  const createTeams = () => {
    const selectedPlayers = (players || []).filter((player) => player.selected);

    if (selectedPlayers.length < 2 || selectedPlayers.length % 2 !== 0) {
      alert("Seleziona un numero pari di giocatori maggiore o uguale a 2 per creare le squadre!");
      return;
    }

    const calculateTeamValue = (team) =>
      team.reduce((total, player) => total + player.valoreTotale + (player.gol || 0), 0);

    const shufflePlayers = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledPlayers = shufflePlayers([...selectedPlayers]);

    const attackers = shuffledPlayers.filter((player) => player.ruolo === 'Attaccante');
    const defenders = shuffledPlayers.filter((player) => player.ruolo === 'Difensore');
    const midfielders = shuffledPlayers.filter((player) => player.ruolo === 'Centrocampista');

    const distributePlayers = (playersByRole, teamA, teamB) => {
      playersByRole.forEach((player) => {
        const teamAValue = calculateTeamValue(teamA);
        const teamBValue = calculateTeamValue(teamB);

        if (teamAValue <= teamBValue) {
          teamA.push(player);
        } else {
          teamB.push(player);
        }
      });
    };

    let newTeamA = [];
    let newTeamB = [];

    distributePlayers(attackers, newTeamA, newTeamB);
    distributePlayers(defenders, newTeamA, newTeamB);
    distributePlayers(midfielders, newTeamA, newTeamB);

    let teamAValue = calculateTeamValue(newTeamA);
    let teamBValue = calculateTeamValue(newTeamB);
    let iterationLimit = 50;

    while (Math.abs(teamAValue - teamBValue) > 10 && iterationLimit > 0) {
      const candidateToMove =
        teamAValue > teamBValue ? newTeamA.slice(-1)[0] : newTeamB.slice(-1)[0];

      if (teamAValue > teamBValue) {
        newTeamA = newTeamA.slice(0, -1);
        newTeamB = [...newTeamB, candidateToMove];
      } else {
        newTeamB = newTeamB.slice(0, -1);
        newTeamA = [...newTeamA, candidateToMove];
      }

      teamAValue = calculateTeamValue(newTeamA);
      teamBValue = calculateTeamValue(newTeamB);
      iterationLimit--;
    }

    if (typeof onTeamsUpdate === 'function') {
      onTeamsUpdate(newTeamA, newTeamB);
    }

    axios
      .post(`${config.apiBaseUrl}/teams`, { teamA: newTeamA, teamB: newTeamB })
      .then(() => console.log('Squadre salvate nel backend.'))
      .catch((err) => console.error("Errore durante il salvataggio delle squadre:", err));
  };

  const saveMatchResults = (teamAGoals, teamBGoals) => {
    const latestMatch = { teamA, teamB, teamAGoals, teamBGoals };
    setMatchHistory((prevHistory) => [...prevHistory, latestMatch]);
  };

  const updatePlayers = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}/players/update-players`);
      
      if (response.data && response.data.updatedPlayers) {
        setPlayers(response.data.updatedPlayers); // Aggiorna la lista giocatori con i dati restituiti
        alert('Giocatori aggiornati con successo!');
      } else {
        console.warn('API ha restituito dati non validi:', response.data);
        alert('Errore: Non ci sono dati aggiornati. Controlla la risposta dell\'API.');
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dei ruoli:', error);
      alert('Errore durante l\'aggiornamento dei ruoli. Controlla la console per i dettagli.');
    }
  };

  const filteredPlayers = (players || []).filter((player) =>
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
            onClick={createTeams}
            className="btn btn-outline-success btn-sm"
          >
            Crea Squadre
          </button>
          <button
            onClick={updatePlayers}
            className="btn btn-outline-info btn-sm"
          >
            Aggiorna Giocatori
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
