import React from 'react';

function MatchHistory({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-center">Non ci sono partite da mostrare.</p>;
  }

  return (
    <div className="match-history">
      <h3 className="history-title">Storico delle Partite</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Squadra A</th>
            <th>Valore Totale A</th>
            <th>Squadra B</th>
            <th>Valore Totale B</th>
          </tr>
        </thead>
        <tbody>
          {history.map((match, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{match.teamA.map((player) => player.name).join(', ')}</td>
              <td>{match.teamA.reduce((sum, player) => sum + player.valoreTotale, 0)}</td>
              <td>{match.teamB.map((player) => player.name).join(', ')}</td>
              <td>{match.teamB.reduce((sum, player) => sum + player.valoreTotale, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatchHistory;
