import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

function GoalLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/players`);
        const sortedPlayers = response.data
          .sort((a, b) => b.gol - a.gol) // Ordina per gol in ordine decrescente
          .slice(0, 5); // Prendi i primi 5 giocatori
        setLeaderboard(sortedPlayers);
      } catch (error) {
        console.error('Errore durante il caricamento dei giocatori:', error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Classifica Marcatori</h2>
      </div>
      <div className="card-body">
        {leaderboard.map((player, index) => (
          <div
            key={player.id}
            className="leaderboard-row d-flex justify-content-between align-items-center"
          >
            <span>
              <strong className="text-primary">#{index + 1}</strong> {player.name} ({player.ruolo}) -{' '}
              <span className="badge bg-success">{player.gol}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalLeaderboard;
