import React, { useState } from 'react';

function MatchHistory({ history, onSaveResults }) {
  const [editingMatchIndex, setEditingMatchIndex] = useState(null);
  const [teamAGoals, setTeamAGoals] = useState(0);
  const [teamBGoals, setTeamBGoals] = useState(0);

  if (!history || history.length === 0) {
    return <p className="text-center">Non ci sono partite da mostrare.</p>;
  }

  const handleEditClick = (index, match) => {
    setEditingMatchIndex(index);
    setTeamAGoals(match.teamAGoals || 0);
    setTeamBGoals(match.teamBGoals || 0);
  };

  const handleSaveClick = () => {
    if (editingMatchIndex !== null) {
      onSaveResults(editingMatchIndex, teamAGoals, teamBGoals);
      setEditingMatchIndex(null);
    }
  };

  return (
    <div className="match-history">
      <h3 className="history-title">Storico delle Partite</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Squadra A</th>
            <th>Gol A</th>
            <th>Squadra B</th>
            <th>Gol B</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {history.map((match, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{match.teamA.map((player) => player.name).join(', ')}</td>
              <td>{match.teamAGoals || 0}</td>
              <td>{match.teamB.map((player) => player.name).join(', ')}</td>
              <td>{match.teamBGoals || 0}</td>
              <td>
                {editingMatchIndex === index ? (
                  <div>
                    <input
                      type="number"
                      value={teamAGoals}
                      onChange={(e) => setTeamAGoals(Number(e.target.value))}
                      placeholder="Gol Squadra A"
                    />
                    <input
                      type="number"
                      value={teamBGoals}
                      onChange={(e) => setTeamBGoals(Number(e.target.value))}
                      placeholder="Gol Squadra B"
                    />
                    <button onClick={handleSaveClick} className="btn btn-primary btn-sm">
                      Salva
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(index, match)}
                    className="btn btn-secondary btn-sm"
                  >
                    Modifica Risultati
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatchHistory;
