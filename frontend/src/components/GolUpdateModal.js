import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import axios from 'axios';
import config from '../config';

const GoalLeaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch dei giocatori e dei loro gol
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem('token'); // Recupera il token dal localStorage
        const response = await axios.get(`${config.apiBaseUrl}/players`, {
          headers: {
            Authorization: `Bearer ${token}`, // Aggiunta del token
          },
        });

        const playersData = response.data.players || response.data; // Gestione fallback
        if (Array.isArray(playersData)) {
          const sortedPlayers = playersData.sort((a, b) => b.gol - a.gol);
          setPlayers(sortedPlayers);
        } else {
          console.error('Formato dati non valido:', response.data);
        }
      } catch (error) {
        console.error(
          'Errore nel caricamento della classifica:',
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchPlayers();
  }, []);

  return (
    <Panel header="Classifica Marcatori" style={{ margin: '20px' }}>
      <DataTable value={players} responsiveLayout="scroll">
        <Column field="name" header="Nome" sortable></Column>
        <Column field="ruolo" header="Ruolo" sortable></Column>
        <Column field="gol" header="Gol" sortable></Column>
      </DataTable>
    </Panel>
  );
};

export default GoalLeaderboard;
