import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import axios from 'axios';
import config from '../config';

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch dello storico delle partite
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token'); // Recupera il token dal localStorage
        const response = await axios.get(`${config.apiBaseUrl}/matches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatches(response.data.matches);
      } catch (error) {
        console.error('Errore nel caricamento dello storico partite:', error);
        setError('Non è stato possibile caricare lo storico delle partite.');
      }
    };

    fetchMatches();
  }, []);

  return (
    <Panel header="Storico delle Partite" style={{ margin: '20px' }}>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <DataTable value={matches} responsiveLayout="scroll">
        <Column field="data" header="Data" sortable></Column>
        <Column field="teamA" header="Squadra A" sortable></Column>
        <Column field="teamB" header="Squadra B" sortable></Column>
        <Column field="risultato" header="Risultato" sortable></Column>
      </DataTable>
    </Panel>
  );
};

export default MatchHistory;
