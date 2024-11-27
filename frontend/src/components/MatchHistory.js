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
        const token = localStorage.getItem('token'); // Recupera il token JWT
        const response = await axios.get(`${config.apiBaseUrl}/matches`, {
          headers: {
            Authorization: `Bearer ${token}`, // Aggiunge il token JWT
          },
        });
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
      <h3 className="text-center mb-4">Storico delle Partite</h3>
      <Carousel>
        {latestMatches.map((match, index) => (
          <Carousel.Item key={index}>
            <div className="match-card p-4 rounded shadow-lg">
              <h4 className="text-center mb-3">Data: {match.date ? new Date(match.date).toLocaleDateString() : 'Data non disponibile'}</h4>
              <div className="teams-container d-flex justify-content-between">
                <div className="team-section p-3" style={{ backgroundColor: '#eaf4fc', borderRadius: '8px' }}>
                  <h5 className="text-primary">Squadra A</h5>
                  <ul className="list-unstyled">
                    {match.teamA.map((player, playerIndex) => (
                      <li key={`teamA-${player.id || player.name}-${playerIndex}`} className="d-flex align-items-center">
                        <span className="me-2">{player.name}</span>
                        <span className="badge bg-success">{player.gol || 0} gol</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="team-section p-3" style={{ backgroundColor: '#fdecea', borderRadius: '8px' }}>
                  <h5 className="text-danger">Squadra B</h5>
                  <ul className="list-unstyled">
                    {match.teamB.map((player, playerIndex) => (
                      <li key={`teamB-${player.id || player.name}-${playerIndex}`} className="d-flex align-items-center">
                        <span className="me-2">{player.name}</span>
                        <span className="badge bg-success">{player.gol || 0} gol</span>
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
