import React from 'react';

function PlayerList() {
  const players = [
    { id: 1, name: 'Mario Rossi', role: 'Attaccante', value: 85 },
    { id: 2, name: 'Luigi Bianchi', role: 'Difensore', value: 78 },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista Giocatori</h2>
      </div>
      <div className="card-body">
        <div className="leaderboard">
          {players.map((player) => (
            <div key={player.id} className="leaderboard-row">
              <div>{player.name} {player.value} {player.role} </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerList;
