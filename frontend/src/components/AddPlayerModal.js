import React from 'react';
import Papa from 'papaparse';

function AddPlayerModal({ show, onClose, onSubmit }) {
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // Legge le intestazioni dal file
      skipEmptyLines: true, // Salta le righe vuote
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          // Passa i giocatori estratti al componente principale
          results.data.forEach((player) => {
            const parsedPlayer = {
              name: player.name,
              attack: Number(player.attack),
              defense: Number(player.defense),
              technique: Number(player.technique),
              stamina: Number(player.stamina),
              speed: Number(player.speed),
              position: player.position || 'N/A',
              experience: Number(player.experience) || 0,
            };
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

  if (!show) return null;

  return (
    <div
      className="modal d-block fade-in"
      tabIndex="-1"
      role="dialog"
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newPlayer = {
            name: formData.get('name'),
            attack: Number(formData.get('attack')),
            defense: Number(formData.get('defense')),
            technique: Number(formData.get('technique')),
            stamina: Number(formData.get('stamina')),
            speed: Number(formData.get('speed')),
            position: formData.get('position'),
            experience: Number(formData.get('experience')),
          };
          onSubmit(newPlayer);
          e.target.reset();
        }}
      >
        {/* Campi manuali */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          <input type="text" name="name" placeholder="Nome" required />
          <input type="text" name="name" placeholder="Nome" required />
          <input type="number" name="controlloPalla" placeholder="Controllo Palla" required min="1" max="10" />
          <input type="number" name="dribbling" placeholder="Dirbbling" required min="1" max="10" />
          <input type="number" name="precisionePassaggi" placeholder="Precisione Passaggi" required min="1" max="10" />
          <input type="number" name="tiro" placeholder="Tiro" required min="1" max="10" />
          <input type="number" name="stamina" placeholder="Stamina" required min="1" max="10" />
          <input type="number" name="velocita" placeholder="Velocità" required min="1" max="10" />
          <input type="number" name="resistenza" placeholder="Resistenza" required min="1" max="10" />
          <input type="number" name="anticipazione" placeholder="Anticipazione" required min="1" max="10" />
          <input type="number" name="coperturaSpazi" placeholder="Copertura degli Spazi" required min="1" max="10" />
          <input type="number" name="adattabilitaTattica" placeholder="Adattabilità Tattica" required min="1" max="10" />
          <input type="number" name="contrasto" placeholder="Contrasto" required min="1" max="10" />
          <input type="number" name="intercettazioni" placeholder="intercettazioni" required min="1" max="10" />
          <input type="number" name="chiusuraSpazi" placeholder="Chiusura degli Spazi" required min="1" max="10" />
          <input type="number" name="creativita" placeholder="Creatività" required min="1" max="10" />
          <input type="number" name="movimentoSenzaPalla" placeholder="Movimento senza Palla" required min="1" max="10" />
          <input type="number" name="finalizzazione" placeholder="Finalizzazione" required min="1" max="10" />
          <input type="number" name="leardeship" placeholder="Leadership" required min="1" max="10" />
          <input type="number" name="gestioneStress" placeholder="Gestione dello Stress" required min="1" max="10" />
          <input type="number" name="sportivita" placeholder="Sportività" required min="1" max="10" />
        </div>

        {/* Campo per caricamento CSV */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="csv-upload" style={{ marginBottom: '10px', display: 'block' }}>
            Carica giocatori tramite CSV:
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ display: 'block', width: '100%' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Aggiungi Giocatore
        </button>
      </form>
    </div>
  );
}

export default AddPlayerModal;
