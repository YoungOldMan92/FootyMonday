import React from 'react';
import PlayerList from './components/PlayerList';
import MatchHistory from './components/MatchHistory';
import GoalLeaderboard from './components/GoalLeaderboard';

function App() {
  return (
    <div className="App">
      <header>
        <h1>FootyMonday</h1>
      </header>
      <main>
        <PlayerList />
        <GoalLeaderboard />
        <MatchHistory />
      </main>
    </div>
  );
}

export default App;
