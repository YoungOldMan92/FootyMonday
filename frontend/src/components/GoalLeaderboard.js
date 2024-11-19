import React from 'react';

function GoalLeaderboard() {
  const leaderboard = [
    { id: 1, name: 'Mario Rossi', goals: 10 },
    { id: 2, name: 'Luigi Bianchi', goals: 8 },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Classifica Gol</h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Gol</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GoalLeaderboard;
