import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import config from '../config';

function MatchHistory() {
  const [history, setHistory] = useState([]);

  // Recupera le partite dal database all'avvio
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/matches`);
        setHistory(response.data);
      } catch (error) {
        console.error('Errore durante il recupero delle partite:', error);
      }
    };

    fetchMatches();
  }, []);

  if (!history || history.length === 0) {
    return <p className="text-center">Non ci sono partite da mostrare.</p>;
  }

  // Mostra solo le ultime 3 partite
  const latestMatches = history.slice(-3).reverse();

  return (
    <div className="match-history">
      <h3>Storico delle Partite</h3>
      <Carousel>
        {latestMatches.map((match, index) => (
          <Carousel.Item key={index}>
            <div className="match-card">
              <h4>Partita {history.length - index}</h4>
              <p className="match-date">
                Data: {match.date ? new Date(match.date).toLocaleDateString() : 'Data non disponibile'}
              </p>
              <div className="teams-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="team-section" style={{ flex: 1, marginRight: '10px' }}>
                  <h5>Squadra A</h5>
                  <ul>
                    {match.teamA.map((player, playerIndex) => (
                      <li key={`teamA-${player.id || player.name}-${playerIndex}`}>
                        {player.name}: {player.gol || 0} gol
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="team-section" style={{ flex: 1, marginLeft: '10px' }}>
                  <h5>Squadra B</h5>
                  <ul>
                    {match.teamB.map((player, playerIndex) => (
                      <li key={`teamB-${player.id || player.name}-${playerIndex}`}>
                        {player.name}: {player.gol || 0} gol
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default MatchHistory;
