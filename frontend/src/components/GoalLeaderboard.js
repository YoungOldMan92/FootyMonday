import React from 'react';

function GoalLeaderboard() {
  const leaderboard = [
    { id: 1, name: 'Mario Rossi', role: 'Attaccante', value: 85 },
    { id: 2, name: 'Luigi Bianchi', role: 'Difensore', value: 78 },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Classifica Giocatori</h2>
      </div>
      <table className="table table-no-border">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Ruolo</th>
            <th>Valore Totale</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.role}</td>
              <td>{player.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GoalLeaderboard;
