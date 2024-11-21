import React, { useState } from 'react';
import GolUpdateModal from './GolUpdateModal';

function TeamDisplay({ teamA, teamB, onAddMatch }) {
  const [showModal, setShowModal] = useState(false);

  if (!teamA || !teamB) {
    return <p className="text-center">Non ci sono squadre da mostrare.</p>;
  }

  const calculateTeamValue = (team) =>
    team.reduce((sum, player) => sum + player.valoreTotale + (player.gol || 0), 0);

  const handleAddMatch = (newMatch) => {
    if (typeof onAddMatch === 'function') {
      onAddMatch(newMatch);
    } else {
      console.error("La funzione onAddMatch non è definita o non è valida.");
    }
  };

  return (
    <div className="team-display">
      <div className="team-card">
        <h3 className="team-title">Squadra A</h3>
        <ul className="player-list">
          {teamA.map((player, index) => (
            <li key={`teamA-${player.id || player.name}-${index}`} className="player-item">
              <strong>{player.name}</strong> <br />
              Ruolo: {player.ruolo || 'Non assegnato'} <br />
            </li>
          ))}
        </ul>
        <p className="team-total">
          <strong>Valore Totale: {calculateTeamValue(teamA)}</strong>
        </p>
      </div>
      <div className="team-card">
        <h3 className="team-title">Squadra B</h3>
        <ul className="player-list">
          {teamB.map((player, index) => (
            <li key={`teamB-${player.id || player.name}-${index}`} className="player-item">
              <strong>{player.name}</strong> <br />
              Ruolo: {player.ruolo || 'Non assegnato'} <br />
            </li>
          ))}
        </ul>
        <p className="team-total">
          <strong>Valore Totale: {calculateTeamValue(teamB)}</strong>
        </p>
      </div>
      <button
        className="btn btn-primary mt-3"
        onClick={() => setShowModal(true)}
      >
        Aggiorna Gol
      </button>

      <GolUpdateModal
        show={showModal}
        onClose={() => setShowModal(false)}
        teamA={teamA}
        teamB={teamB}
        onAddMatch={handleAddMatch} // Passa la funzione handleAddMatch
        onResetTeams={() => {
          // Resetta le squadre
          teamA.length = 0;
          teamB.length = 0;
        }}
      />
    </div>
  );
}

export default TeamDisplay;
