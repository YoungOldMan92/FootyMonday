import React from 'react';

function MatchHistory() {
  const matches = [
    { id: 1, date: '2023-11-01', teamA: 'Squadra A', teamB: 'Squadra B' },
    { id: 2, date: '2023-11-08', teamA: 'Squadra C', teamB: 'Squadra D' },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Storico Partite</h2>
      </div>
      <ul className="list-group list-group-flush">
        {matches.map((match) => (
          <li key={match.id} className="list-group-item">
            <strong>{match.date}</strong>: {match.teamA} vs {match.teamB}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchHistory;
