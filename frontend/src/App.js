import React, { useState, useEffect } from 'react';
import './App.css';
import config from './config';
import PlayerList from './components/PlayerList';
import MatchHistory from './components/MatchHistory';
import GoalLeaderboard from './components/GoalLeaderboard';
import TeamDisplay from './components/TeamDisplay';
import PlayerRadarChart from './components/PlayerRadarChart';
import HomePage from './components/HomePage'; // Nuova home page per login e registrazione
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Stato per il login
  const [teams, setTeams] = useState({ teamA: [], teamB: [] });
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);

  // Effettua il controllo iniziale del login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  // Configura Axios per includere il token JWT nelle richieste
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }, []);

  useEffect(() => {
    if (loggedIn) {
      // Carica le squadre salvate dal backend solo se l'utente è autenticato
      axios
        .get(`${config.apiBaseUrl}/teams`)
        .then((response) => {
          if (response.data.teams && response.data.teams.length > 0) {
            setTeams({
              teamA: response.data.teams[0],
              teamB: response.data.teams[1],
            });
          }
        })
        .catch((err) => console.error('Errore durante il caricamento delle squadre:', err));
    }
  }, [loggedIn]);

  const handleTeamsUpdate = (newTeamA, newTeamB) => {
    // Aggiorna immediatamente lo stato delle squadre
    setTeams({ teamA: newTeamA, teamB: newTeamB });
  };

  const handleAddMatch = (newMatch) => {
    setMatchHistory((prevHistory) => [...prevHistory, newMatch]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Rimuove il token dal localStorage
    setLoggedIn(false); // Reimposta lo stato di autenticazione
    setTeams({ teamA: [], teamB: [] }); // Pulisce i dati utente
    setMatchHistory([]); // Pulisce lo storico
  };

  if (!loggedIn) {
    return <HomePage setLoggedIn={setLoggedIn} />; // Nuova home page
  }

  return (
    <div className="container">
      <header className="mb-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">FootyMonday</a>
          <button className="btn btn-outline-danger ml-auto" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main>
        <div className="row">
          <div className="col-md-6">
            <PlayerList
              onTeamsUpdate={handleTeamsUpdate}
              setHoveredPlayer={setHoveredPlayer}
            />
          </div>
          <div className="col-md-6">
            <GoalLeaderboard />
            <br />
            <PlayerRadarChart player={hoveredPlayer} />
          </div>
        </div>
        <div className="mt-4">
          <TeamDisplay
            teamA={teams.teamA}
            teamB={teams.teamB}
            onAddMatch={handleAddMatch}
          />
        </div>
        <div className="mt-4">
          <MatchHistory history={matchHistory} />
        </div>
      </main>
    </div>
  );
}

export default App;
