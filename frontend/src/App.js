import React, { useState } from 'react';
import './App.css';
import PlayerList from './components/PlayerList';
import MatchHistory from './components/MatchHistory';
import GoalLeaderboard from './components/GoalLeaderboard';
import TeamDisplay from './components/TeamDisplay';

function App() {
  const [teams, setTeams] = useState({ teamA: null, teamB: null });

  const handleTeamsUpdate = (newTeams) => {
    setTeams(newTeams);
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
            <PlayerList onTeamsUpdate={handleTeamsUpdate} />
          </div>
          <div className="col-md-6">
            <GoalLeaderboard />
          </div>
        </div>
        <div className="mt-4">
          <TeamDisplay teamA={teams.teamA} teamB={teams.teamB} />
        </div>
        <div className="mt-4">
          <MatchHistory />
        </div>
      </main>
    </div>
  );
}

export default App;
