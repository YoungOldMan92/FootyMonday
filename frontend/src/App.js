import React, { useState, useEffect } from 'react';
import './App.css';
import config from './config';
import PlayerList from './components/PlayerList';
import MatchHistory from './components/MatchHistory';
import GoalLeaderboard from './components/GoalLeaderboard';
import TeamDisplay from './components/TeamDisplay';
import PlayerRadarChart from './components/PlayerRadarChart';
import axios from 'axios';

function App() {
  const [teams, setTeams] = useState({ teamA: [], teamB: [] });
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    // Carica le squadre salvate dal backend al caricamento dell'app
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
  }, []);

  const handleTeamsUpdate = (newTeamA, newTeamB) => {
    // Aggiorna immediatamente lo stato delle squadre
    setTeams({ teamA: newTeamA, teamB: newTeamB });
  };

  const handleAddMatch = (newMatch) => {
    setMatchHistory((prevHistory) => [...prevHistory, newMatch]);
  };

  return (
    <div className="container">
      <header className="mb-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">FootyMonday</a>
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
