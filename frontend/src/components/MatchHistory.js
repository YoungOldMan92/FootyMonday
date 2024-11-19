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
      <div className="card-body">
        <div className="leaderboard">
          {matches.map((match) => (
            <div key={match.id} className="leaderboard-row">
              <div>{match.date} {match.teamA} {match.teamB}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatchHistory;
