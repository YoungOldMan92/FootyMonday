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
  
    setIsSaving(true);
  
    const token = localStorage.getItem('token'); // Recupera il token JWT
  
    const matchData = {
      teamA: updatedTeamA,
      teamB: updatedTeamB,
      date: new Date().toISOString(),
    };
  
    try {
      // Prepara gli aggiornamenti dei gol
      const updates = [...updatedTeamA, ...updatedTeamB].map((player) => ({
        playerId: player._id, // Assicurati che ogni giocatore abbia questo campo
        additionalGoals: player.gol,
      }));
  
      try {
        const response = await axios.post(`${config.apiBaseUrl}/players/update-goals`, {
          updates,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Risposta:', response.data);
      } catch (error) {
        console.error('Errore:', error.response ? error.response.data : error.message);
      }

      // Salva la partita
      await axios.post(
        `${config.apiBaseUrl}/matches`,
        matchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
  
      onAddMatch(matchData);
  
      // Resetta le squadre nel database
      await axios.delete(`${config.apiBaseUrl}/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  
      onResetTeams();
      alert('Partita salvata con successo!');
      onClose();
    } catch (err) {
      console.error('Errore durante il salvataggio della partita:', err.message);
      alert(`Errore durante il salvataggio della partita: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Aggiorna Risultati</h3>
        <div className="modal-body">
          <div className="teams-container">
            <div className="team-section team-a">
              <h4>Squadra A</h4>
              {updatedTeamA.map((player, index) => (
                <div key={index} className="player-item">
                  <span className="player-name">{player.name}</span>
                  <input
                    type="number"
                    value={player.gol}
                    onChange={(e) =>
                      handleGoalChange('teamA', index, Number(e.target.value))
                    }
                    className="goal-input"
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
            <div className="team-section team-b">
              <h4>Squadra B</h4>
              {updatedTeamB.map((player, index) => (
                <div key={index} className="player-item">
                  <span className="player-name">{player.name}</span>
                  <input
                    type="number"
                    value={player.gol}
                    onChange={(e) =>
                      handleGoalChange('teamB', index, Number(e.target.value))
                    }
                    className="goal-input"
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={saveMatchToDatabase}
            className="save-btn"
            disabled={isSaving}
          >
            {isSaving ? 'Salvataggio...' : 'Salva Partita'}
          </button>
          <button onClick={onClose} className="close-btn" disabled={isSaving}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

export default GolUpdateModal;
