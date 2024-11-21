import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

function GolUpdateModal({ show, onClose, teamA, teamB, onResetTeams, onAddMatch }) {
  const [updatedTeamA, setUpdatedTeamA] = useState([]);
  const [updatedTeamB, setUpdatedTeamB] = useState([]);

  // Inizializza i gol a 0 quando il modale viene aperto
  useEffect(() => {
    if (show) {
      const resetGoals = (team) =>
        team.map((player) => ({
          ...player,
          gol: 0, // Forza l'inizializzazione dei gol a 0
        }));

      setUpdatedTeamA(resetGoals(teamA));
      setUpdatedTeamB(resetGoals(teamB));
    }
  }, [show, teamA, teamB]);

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

  const saveMatchToDatabase = async () => {
    if (typeof onAddMatch !== 'function') {
      console.error("onAddMatch non è una funzione valida.");
      alert('Errore interno. Controlla la configurazione.');
      return;
    }

    const matchData = {
      teamA: updatedTeamA,
      teamB: updatedTeamB,
      date: new Date().toISOString(), // Aggiungi la data corrente
    };

    try {
      // Somma i gol nel database
      const updates = [...updatedTeamA, ...updatedTeamB].map((player) => ({
        name: player.name,
        additionalGoals: player.gol,
      }));

      await axios.post(`${config.apiBaseUrl}/players/update-goals`, { updates });

      // Salva la partita
      await axios.post(`${config.apiBaseUrl}/matches`, matchData);

      onAddMatch(matchData); // Aggiunge la partita al componente MatchHistory
      onResetTeams(); // Resetta le squadre
      alert('Partita salvata con successo!');
      onClose();
    } catch (err) {
      console.error('Errore durante il salvataggio della partita:', err);
      alert('Errore durante il salvataggio della partita.');
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Aggiorna Gol</h3>
        <div className="modal-body">
          <div className="team-section">
            <h4>Squadra A</h4>
            {updatedTeamA.map((player, index) => (
              <div key={`teamA-${player.id || player.name}-${index}`} className="player-item">
                <span className="player-name">{player.name}</span>
                <input
                  type="number"
                  value={player.gol}
                  onChange={(e) =>
                    handleGoalChange('teamA', index, Number(e.target.value))
                  }
                  className="goal-input"
                />
              </div>
            ))}
          </div>
          <div className="team-section">
            <h4>Squadra B</h4>
            {updatedTeamB.map((player, index) => (
              <div key={`teamB-${player.id || player.name}-${index}`} className="player-item">
                <span className="player-name">{player.name}</span>
                <input
                  type="number"
                  value={player.gol}
                  onChange={(e) =>
                    handleGoalChange('teamB', index, Number(e.target.value))
                  }
                  className="goal-input"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={saveMatchToDatabase} className="btn btn-success">
            Salva Partita
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

export default GolUpdateModal;
