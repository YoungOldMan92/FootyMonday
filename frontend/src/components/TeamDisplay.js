import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GolUpdateModal from './GolUpdateModal';
import config from '../config';

function TeamDisplay({ onAddMatch, updatedTeamA, updatedTeamB }) {
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Carica le squadre salvate dal backend all'inizializzazione
    axios
      .get(`${config.apiBaseUrl}/teams`)
      .then((response) => {
        console.log('Dati ricevuti:', response.data);
        if (response.data.teams && response.data.teams.length > 0) {
          setTeamA(response.data.teams[0]);
          setTeamB(response.data.teams[1]);
        } else {
          setTeamA([]);
          setTeamB([]);
        }
      })
      .catch((err) => console.error("Errore durante il caricamento delle squadre:", err));
  }, []);

  // Aggiorna le squadre quando vengono passate da PlayerList
  useEffect(() => {
    if (updatedTeamA && updatedTeamB) {
      setTeamA(updatedTeamA);
      setTeamB(updatedTeamB);
    }
  }, [updatedTeamA, updatedTeamB]);

  const calculateTeamValue = (team) =>
    team.reduce((sum, player) => sum + player.valoreTotale + (player.gol || 0), 0);

  const handleAddMatch = (newMatch) => {
    if (typeof onAddMatch === 'function') {
      onAddMatch(newMatch);
    } else {
      console.error("La funzione onAddMatch non è definita o non è valida.");
    }
  };

  const handleResetTeams = () => {
    setTeamA([]);
    setTeamB([]);
    axios
      .delete(`${config.apiBaseUrl}/teams`)
      .then(() => console.log("Squadre resettate."))
      .catch((err) => console.error("Errore durante il reset delle squadre:", err));
  };

  if (teamA.length === 0 && teamB.length === 0) {
    return <p className="text-center">Non ci sono squadre da mostrare.</p>;
  }

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
        onAddMatch={handleAddMatch}
        onResetTeams={handleResetTeams}
      />
    </div>
  );
}

export default TeamDisplay;
