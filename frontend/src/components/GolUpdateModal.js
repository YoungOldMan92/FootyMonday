import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

function GolUpdateModal({ show, onClose, teamA, teamB }) {
  const [updatedTeamA, setUpdatedTeamA] = useState([...teamA]);
  const [updatedTeamB, setUpdatedTeamB] = useState([...teamB]);

  const handleGoalChange = (team, index, newGoals) => {
    if (team === 'teamA') {
      const newTeam = [...updatedTeamA];
      newTeam[index].gol = newGoals;
      setUpdatedTeamA(newTeam);
    } else {
      const newTeam = [...updatedTeamB];
      newTeam[index].gol = newGoals;
      setUpdatedTeamB(newTeam);
    }
  };

  const saveGoalsToDatabase = async () => {
    const updates = [...updatedTeamA, ...updatedTeamB].map((player) => ({
      name: player.name,
      gol: player.gol,
    }));

    console.log("Dati inviati al backend:", updates); // Debug

    try {
      const response = await axios.post(`${config.apiBaseUrl}/players/update-goals`, { updates });
      console.log("Risposta del backend:", response.data);
      alert('Gol aggiornati con successo!');
      onClose();
    } catch (err) {
      console.error('Errore durante l\'aggiornamento dei gol:', err);
      alert('Errore durante l\'aggiornamento dei gol.');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Aggiorna Gol</h3>
        <div>
          <h4>Squadra A</h4>
          {updatedTeamA.map((player, index) => (
            <div key={player.id || player.name}>
              {player.name}
              <input
                type="number"
                value={player.gol || 0}
                onChange={(e) =>
                  handleGoalChange('teamA', index, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>
        <div>
          <h4>Squadra B</h4>
          {updatedTeamB.map((player, index) => (
            <div key={player.id || player.name}>
              {player.name}
              <input
                type="number"
                value={player.gol || 0}
                onChange={(e) =>
                  handleGoalChange('teamB', index, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>
        <button onClick={saveGoalsToDatabase} className="btn btn-success">
          Salva Gol
        </button>
        <button onClick={onClose} className="btn btn-secondary">
          Chiudi
        </button>
      </div>
    </div>
  );
}

export default GolUpdateModal;
