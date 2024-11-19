import React from 'react';

function GoalLeaderboard() {
  const leaderboard = [
    { id: 1, name: 'Mario Rossi', goals: 10 },
    { id: 2, name: 'Luigi Bianchi', goals: 8 },
  ];

  return (
    <div>
      <h2>Classifica Gol</h2>
      <ol>
        {leaderboard.map((player) => (
          <li key={player.id}>
            {player.name} - {player.goals} gol
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GoalLeaderboard;
