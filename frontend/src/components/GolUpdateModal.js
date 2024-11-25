import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

function GolUpdateModal({ show, onClose, teamA, teamB, onResetTeams, onAddMatch }) {
  const [updatedTeamA, setUpdatedTeamA] = useState([]);
  const [updatedTeamB, setUpdatedTeamB] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (show) {
      const resetGoals = (team) =>
        team.map((player) => ({
          ...player,
          gol: 0,
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

    setIsSaving(true); // Start saving state

    const matchData = {
      teamA: updatedTeamA,
      teamB: updatedTeamB,
      date: new Date().toISOString(),
    };

    try {
      const updates = [...updatedTeamA, ...updatedTeamB].map((player) => ({
        name: player.name,
        additionalGoals: player.gol,
      }));

      await axios.post(`${config.apiBaseUrl}/players/update-goals`, { updates });

      await axios.post(`${config.apiBaseUrl}/matches`, matchData);

      onAddMatch(matchData);

      // Clear temporary teams in backend after saving match
      await axios.delete(`${config.apiBaseUrl}/teams`);

      onResetTeams();
      alert('Partita salvata con successo!');
      onClose();
    } catch (err) {
      console.error('Errore durante il salvataggio della partita:', err);
      alert('Errore durante il salvataggio della partita.');
    } finally {
      setIsSaving(false); // End saving state
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay styled-overlay">
      <div className="modal-content styled-modal">
        <h3 className="modal-title styled-title">Aggiorna Risultati</h3>
        <div className="modal-body styled-body">
          <div className="teams-container styled-teams">
            <div className="team-section styled-team team-a">
              <h4>Squadra A</h4>
              {updatedTeamA.map((player, index) => (
                <div key={`teamA-${player.id || player.name}-${index}`} className="player-item styled-player-item">
                  <span className="player-name styled-player-name">{player.name}</span>
                  <input
                    type="number"
                    value={player.gol}
                    onChange={(e) =>
                      handleGoalChange('teamA', index, Number(e.target.value))
                    }
                    className="goal-input styled-goal-input"
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
            <div className="team-section styled-team team-b">
              <h4>Squadra B</h4>
              {updatedTeamB.map((player, index) => (
                <div key={`teamB-${player.id || player.name}-${index}`} className="player-item styled-player-item">
                  <span className="player-name styled-player-name">{player.name}</span>
                  <input
                    type="number"
                    value={player.gol}
                    onChange={(e) =>
                      handleGoalChange('teamB', index, Number(e.target.value))
                    }
                    className="goal-input styled-goal-input"
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer styled-footer">
          <button
            onClick={saveMatchToDatabase}
            className="btn styled-btn save-btn"
            disabled={isSaving}
          >
            {isSaving ? 'Salvataggio...' : 'Salva Partita'}
          </button>
          <button onClick={onClose} className="btn styled-btn close-btn" disabled={isSaving}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

export default GolUpdateModal;
