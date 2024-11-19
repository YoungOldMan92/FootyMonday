import React from 'react';
import Papa from 'papaparse';

function AddPlayerModal({ show, onClose, onSubmit }) {
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          results.data.forEach((player) => {
            const parsedPlayer = parsePlayerData(player);
            onSubmit(parsedPlayer);
          });
          alert(`${results.data.length} giocatori importati con successo!`);
        }
      },
      error: (error) => {
        alert('Errore nella lettura del file CSV: ' + error.message);
      },
    });
  };

  const parsePlayerData = (data) => ({
    name: data.nome || 'Sconosciuto',
    controlloPalla: Number(data.controlloPalla) || 0,
    dribbling: Number(data.dribbling) || 0,
    precisionePassaggi: Number(data.precisionePassaggi) || 0,
    tiro: Number(data.tiro) || 0,
    stamina: Number(data.stamina) || 0,
    velocita: Number(data.velocita) || 0,
    resistenzaSforzo: Number(data.resistenzaSforzo) || 0,
    anticipazione: Number(data.anticipazione) || 0,
    copertura: Number(data.copertura) || 0,
    adattabilitaTattica: Number(data.adattabilitaTattica) || 0,
    contrasto: Number(data.contrasto) || 0,
    intercettazioni: Number(data.intercettazioni) || 0,
    coperturaSpazi: Number(data.coperturaSpazi) || 0,
    creativita: Number(data.creativita) || 0,
    movimentoSenzaPalla: Number(data.movimentoSenzaPalla) || 0,
    finalizzazione: Number(data.finalizzazione) || 0,
    leadership: Number(data.leadership) || 0,
    gestioneStress: Number(data.gestioneStress) || 0,
    sportivita: Number(data.sportivita) || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const playerData = parsePlayerData(Object.fromEntries(formData.entries()));
    onSubmit(playerData);
    e.target.reset();
    onClose(); // Chiudi il modale dopo l'aggiunta
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block fade-in"
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -20%)',
        zIndex: 1050,
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        maxWidth: '600px',
        width: '90%',
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title">Aggiungi Giocatore</h5>
        <button onClick={onClose} className="btn-close"></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          <input type="text" name="nome" placeholder="Nome" required />
          <input type="number" name="controlloPalla" placeholder="Controllo Palla" required min="1" max="10" />
          <input type="number" name="dribbling" placeholder="Dribbling" required min="1" max="10" />
          <input type="number" name="precisionePassaggi" placeholder="Precisione Passaggi" required min="1" max="10" />
          <input type="number" name="tiro" placeholder="Tiro" required min="1" max="10" />
          <input type="number" name="stamina" placeholder="Stamina" required min="1" max="10" />
          <input type="number" name="velocita" placeholder="Velocità" required min="1" max="10" />
          <input type="number" name="resistenzaSforzo" placeholder="Resistenza Sforzo" required min="1" max="10" />
          <input type="number" name="anticipazione" placeholder="Anticipazione" required min="1" max="10" />
          <input type="number" name="copertura" placeholder="Copertura" required min="1" max="10" />
          <input type="number" name="adattabilitaTattica" placeholder="Adattabilità Tattica" required min="1" max="10" />
          <input type="number" name="contrasto" placeholder="Contrasto" required min="1" max="10" />
          <input type="number" name="intercettazioni" placeholder="Intercettazioni" required min="1" max="10" />
          <input type="number" name="coperturaSpazi" placeholder="Copertura Spazi" required min="1" max="10" />
          <input type="number" name="creativita" placeholder="Creatività" required min="1" max="10" />
          <input type="number" name="movimentoSenzaPalla" placeholder="Movimento Senza Palla" required min="1" max="10" />
          <input type="number" name="finalizzazione" placeholder="Finalizzazione" required min="1" max="10" />
          <input type="number" name="leadership" placeholder="Leadership" required min="1" max="10" />
          <input type="number" name="gestioneStress" placeholder="Gestione Stress" required min="1" max="10" />
          <input type="number" name="sportivita" placeholder="Sportività" required min="1" max="10" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }}>
          Aggiungi
        </button>
      </form>
      <div style={{ marginTop: '15px' }}>
        <label htmlFor="csv-upload">Carica Giocatori tramite CSV:</label>
        <input id="csv-upload" type="file" accept=".csv" onChange={handleCsvUpload} />
      </div>
    </div>
  );
}

export default AddPlayerModal;
