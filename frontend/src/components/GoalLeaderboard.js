import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import axios from 'axios';
import config from '../config';

const GoalLeaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Stato per la pagina corrente
  const playersPerPage = 5; // Numero di giocatori per pagina

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.apiBaseUrl}/players`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const playersData = response.data.players || response.data;

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

  // Calcolo dei giocatori da visualizzare per pagina
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);

  // Funzioni per la navigazione tra le pagine
  const nextPage = () => {
    if (currentPage < Math.ceil(players.length / playersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Panel header="Classifica Marcatori" style={{ margin: '20px' }}>
      {/* Tabella con giocatori paginati */}
      <DataTable value={currentPlayers} responsiveLayout="scroll">
        <Column field="name" header="Nome" sortable></Column>
        <Column field="ruolo" header="Ruolo" sortable></Column>
        <Column field="gol" header="Gol" sortable></Column>
      </DataTable>

      {/* Paginazione */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '10px' }}>
        <Button
          label="Precedente"
          icon="pi pi-angle-left"
          onClick={prevPage}
          disabled={currentPage === 1}
        />
        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>
          Pagina {currentPage} di {Math.ceil(players.length / playersPerPage)}
        </span>
        <Button
          label="Successivo"
          icon="pi pi-angle-right"
          iconPos="right"
          onClick={nextPage}
          disabled={currentPage === Math.ceil(players.length / playersPerPage)}
        />
      </div>
    </Panel>
  );
};

export default GoalLeaderboard;
