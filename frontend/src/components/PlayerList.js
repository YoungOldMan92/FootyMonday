import React, { useState } from 'react';
import PlayerDetailsModal from './PlayerDetailsModal';

function PlayerList() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const players = [
    {
      id: 1,
      name: 'Mario Rossi',
      attack: 8,
      defense: 7,
      technique: 9,
      stamina: 6,
      speed: 7,
    },
    {
      id: 2,
      name: 'Luigi Bianchi',
      attack: 6,
      defense: 8,
      technique: 7,
      stamina: 8,
      speed: 7,
    },
  ];

  const handleMouseEnter = (player) => {
    setSelectedPlayer(player);
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista Giocatori</h2>
      </div>
      <div className="card-body">
        {players.map((player) => (
          <div
            key={player.id}
            className="player-row"
          >
            {/* Area sensibile limitata al nome */}
            <span
              style={{
                cursor: 'pointer',
                display: 'inline-block', // Solo il testo è sensibile
              }}
              onMouseEnter={() => handleMouseEnter(player)}
              onMouseLeave={handleMouseLeave}
            >
              {player.name}
            </span>
          </div>
        ))}
      </div>
      {/* Modale per il giocatore */}
      {isMouseOver && selectedPlayer && (
        <PlayerDetailsModal
          player={selectedPlayer}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
}

export default PlayerList;
