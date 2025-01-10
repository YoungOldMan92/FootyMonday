import React, { useState } from 'react';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import config from '../config';

function AddPlayerModal({ show, onClose, setPlayers }) {
  const [playerType, setPlayerType] = useState('regular'); // Stato per RadioBox
  
  const [playerData, setPlayerData] = useState({
    nome: '',
    controlloPalla: '',
    dribbling: '',
    precisionePassaggi: '',
    tiro: '',
    stamina: '',
    velocita: '',
    resistenzaSforzo: '',
    anticipazione: '',
    copertura: '',
    adattabilitaTattica: '',
    contrasto: '',
    intercettazioni: '',
    coperturaSpazi: '',
    creativita: '',
    movimentoSenzaPalla: '',
    finalizzazione: '',
    leadership: '',
    gestioneStress: '',
    sportivita: '',
  });

  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const roles = [
    { label: 'Attaccante', value: 'Attaccante' },
    { label: 'Centrocampista', value: 'Centrocampista' },
    { label: 'Difensore', value: 'Difensore' },
  ];

  const addPlayer = async (data) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${config.apiBaseUrl}/players`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setPlayers((prev) => [...prev, response.data]);
        onClose();
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === 'Esiste già un giocatore con questo nome.') {
            setErrorMessage('Esiste già un giocatore con questo nome! Scegli un nome diverso.');
        } else {
            setErrorMessage('Errore durante il salvataggio del giocatore. Riprova più tardi.');
        }
    }
};


  const handleInputChange = (e, field) => {
    setPlayerData({ ...playerData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newPlayer = {};

    if (playerType === 'regular') {
      newPlayer = {
        name: playerData.nome,
        ruolo: role || 'Non assegnato',
        capacitaTecnica: {
          controlloPalla: parseInt(playerData.controlloPalla, 10),
          dribbling: parseInt(playerData.dribbling, 10),
          precisionePassaggi: parseInt(playerData.precisionePassaggi, 10),
          tiro: parseInt(playerData.tiro, 10),
        },
        resistenzaFisica: {
          stamina: parseInt(playerData.stamina, 10),
          velocita: parseInt(playerData.velocita, 10),
          resistenzaSforzo: parseInt(playerData.resistenzaSforzo, 10),
        },
        posizionamentoTattico: {
          anticipazione: parseInt(playerData.anticipazione, 10),
          copertura: parseInt(playerData.copertura, 10),
          adattabilitaTattica: parseInt(playerData.adattabilitaTattica, 10),
        },
        capacitaDifensiva: {
          contrasto: parseInt(playerData.contrasto, 10),
          intercettazioni: parseInt(playerData.intercettazioni, 10),
          coperturaSpazi: parseInt(playerData.coperturaSpazi, 10),
        },
        contributoInAttacco: {
          creativita: parseInt(playerData.creativita, 10),
          movimentoSenzaPalla: parseInt(playerData.movimentoSenzaPalla, 10),
          finalizzazione: parseInt(playerData.finalizzazione, 10),
        },
        mentalitaEComportamento: {
          leadership: parseInt(playerData.leadership, 10),
          gestioneStress: parseInt(playerData.gestioneStress, 10),
          sportivita: parseInt(playerData.sportivita, 10),
        },
        valoreTotale: 0,
        isGuest: false,
      };
    } else {
      newPlayer = {
        name: `${playerData.nome} - Guest`,
        ruolo: role || 'Non assegnato',
        capacitaTecnica: { controlloPalla: 5, dribbling: 5, precisionePassaggi: 5, tiro: 5 },
        resistenzaFisica: { stamina: 5, velocita: 5, resistenzaSforzo: 5 },
        posizionamentoTattico: { anticipazione: 5, copertura: 5, adattabilitaTattica: 5 },
        capacitaDifensiva: { contrasto: 5, intercettazioni: 5, coperturaSpazi: 5 },
        contributoInAttacco: { creativita: 5, movimentoSenzaPalla: 5, finalizzazione: 5 },
        mentalitaEComportamento: { leadership: 5, gestioneStress: 5, sportivita: 5 },
        valoreTotale: 5,
        isGuest: true,
      };
    }
    console.log('Payload inviato:', newPlayer);
    addPlayer(newPlayer);
  };

  return (
    <Dialog
      header="Aggiungi Nuovo Giocatore"
      visible={show}
      onHide={onClose}
      style={{ width: '50vw' }}
      footer={
        <div>
          <Button label="Annulla" icon="pi pi-times" onClick={onClose} className="p-button-text" />
          <Button label="Aggiungi Giocatore" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      }
    >
      <div className="p-field-radiobutton">
        <RadioButton
          inputId="regular"
          name="playerType"
          value="regular"
          onChange={(e) => setPlayerType(e.value)}
          checked={playerType === 'regular'}
        />
        <label htmlFor="regular" style={{ marginRight: '1rem' }}>Regular</label>

        <RadioButton
          inputId="guest"
          name="playerType"
          value="guest"
          onChange={(e) => setPlayerType(e.value)}
          checked={playerType === 'guest'}
        />
        <label htmlFor="guest">Guest</label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="nome">Nome</label>
          <InputText
            id="nome"
            value={playerData.nome}
            onChange={(e) => handleInputChange(e, 'nome')}
            placeholder="Nome"
            required
          />
        </div>

        {errorMessage && (
          <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
        )}

        {playerType === 'regular' && (
          <div>
            {[
              'controlloPalla',
              'dribbling',
              'precisionePassaggi',
              'tiro',
              'stamina',
              'velocita',
              'resistenzaSforzo',
              'anticipazione',
              'copertura',
              'adattabilitaTattica',
              'contrasto',
              'intercettazioni',
              'coperturaSpazi',
              'creativita',
              'movimentoSenzaPalla',
              'finalizzazione',
              'leadership',
              'gestioneStress',
              'sportivita',
            ].map((field) => (
              <div key={field} className="p-field">
                <label htmlFor={field}>{field}</label>
                <InputText
                  id={field}
                  type="number"
                  min="1"
                  max="10"
                  value={playerData[field]}
                  onChange={(e) => handleInputChange(e, field)}
                />
              </div>
            ))}
          </div>
        )}

        {playerType === 'guest' && (
          <div>
            <label htmlFor="role">Ruolo</label>
            <Dropdown
              id="role"
              value={role}
              options={roles}
              onChange={(e) => setRole(e.value)}
              placeholder="Seleziona Ruolo"
              required
            />
          </div>
        )}
      </form>
    </Dialog>
  );
}

export default AddPlayerModal;
