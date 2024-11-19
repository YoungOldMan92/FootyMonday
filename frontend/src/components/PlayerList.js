import React, { useState } from 'react';

function PlayerList() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Mario Rossi', goals: 10 },
    { id: 2, name: 'Luigi Bianchi', goals: 8 },
  ]);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista Giocatori</h2>
      </div>
      <ul className="list-group list-group-flush">
        {players.map((player) => (
          <li key={player.id} className="list-group-item">
            {player.name} - {player.goals} gol
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;
