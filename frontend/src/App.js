import React from 'react';
import PlayerList from './components/PlayerList';
import MatchHistory from './components/MatchHistory';
import GoalLeaderboard from './components/GoalLeaderboard';

function App() {
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
            <PlayerList />
          </div>
          <div className="col-md-6">
            <GoalLeaderboard />
          </div>
        </div>
        <div className="mt-4">
          <MatchHistory />
        </div>
      </main>
    </div>
  );
}

export default App;

