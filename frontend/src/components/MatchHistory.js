import React from 'react';

function MatchHistory() {
  const matches = [
    { id: 1, date: '2023-11-01', teamA: 'Squadra A', teamB: 'Squadra B' },
    { id: 2, date: '2023-11-08', teamA: 'Squadra C', teamB: 'Squadra D' },
  ];

  return (
    <div>
      <h2>Storico Partite</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            {match.date}: {match.teamA} vs {match.teamB}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchHistory;
