import React from 'react';

function GoalLeaderboard() {
  const leaderboard = [
    { id: 1, name: 'Mario Rossi', role: 'Attaccante', value: 85, gol: 10 },
    { id: 2, name: 'Luigi Bianchi', role: 'Difensore', value: 78, gol: 5 },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Classifica Giocatori</h2>
      </div>
      <div className="card-body">
        <div className="leaderboard">
            {leaderboard.map((player, index) => (
                <div key={player.id} className="leaderboard-row">
                <div></div>
                <div>{index + 1}: {player.name} - {player.gol} gol</div>
                <div></div>
                <div></div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default GoalLeaderboard;
