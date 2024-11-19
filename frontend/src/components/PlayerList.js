import React, { useState } from 'react';

function PlayerList() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Mario Rossi', role: 'Attaccante', value: 85 },
    { id: 2, name: 'Luigi Bianchi', role: 'Difensore', value: 78 },
  ]);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista Giocatori</h2>
      </div>
      <ul className="list-group list-group-flush">
        {players.map((player) => (
          <li key={player.id} className="list-group-item">
            <span>{player.name}</span>
            <span>
              {player.role} - Valore: {player.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;
