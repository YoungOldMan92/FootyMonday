import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Panel } from 'primereact/panel';
import PlayerList from './components/PlayerList';
import GoalLeaderboard from './components/GoalLeaderboard';
import MatchHistory from './components/MatchHistory';
import AddPlayerModal from './components/AddPlayerModal';
import GolUpdateModal from './components/GolUpdateModal';
import PlayerManagementModal from './components/PlayerManagementModal';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import Login from './components/Login';
import axios from 'axios';
import config from './config';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false); // Stato per il modale
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showPlayerManagementModal, setShowPlayerManagementModal] = useState(false);
  const [players, setPlayers] = useState([]); // Stato per la lista dei giocatori



  // Verifica token al caricamento
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get(`${config.apiBaseUrl}/user/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoggedIn(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };


  const start = <h3 style={{ margin: 0 }}>Footy Monday</h3>;
  const end = (
    <Button
      label="Logout"
      icon="pi pi-sign-out"
      className="p-button-danger p-button-outlined"
      onClick={handleLogout}
    />
  );

  if (!loggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Login setLoggedIn={setLoggedIn} />
      </div>
    );
  }

  return (
    <div className="App">

      <div className="main-content" style={{ padding: '20px' }}>
        <Panel header="Footy Monday">
          <PlayerList />
        </Panel>
        <GoalLeaderboard />
        <MatchHistory />
      </div>

      {/* Modale Aggiunta Giocatore */}
      <AddPlayerModal
        show={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
      />
      <PlayerManagementModal
        show={showPlayerManagementModal}
        onClose={() => setShowPlayerManagementModal(false)}
        setPlayers={setPlayers}
      />

    </div>
  );
}

export default App;
