const express = require('express');
const Player = require('../models/Player');

const router = express.Router();

// Funzione per calcolare la media
function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

// Funzione per calcolare la media delle macro categorie
function calculateMacroAverages(player) {
  return {
    capacitaTecnica: average(Object.values(player.capacitaTecnica || {})),
    resistenzaFisica: average(Object.values(player.resistenzaFisica || {})),
    posizionamentoTattico: average(Object.values(player.posizionamentoTattico || {})),
    capacitaDifensiva: average(Object.values(player.capacitaDifensiva || {})),
    contributoInAttacco: average(Object.values(player.contributoInAttacco || {})),
    mentalitaEComportamento: average(Object.values(player.mentalitaEComportamento || {})),
  };
}

// Funzione per calcolare il valore totale
function calculateTotalValue(player) {
  const macroAverages = calculateMacroAverages(player);
  const totalValue = Object.values(macroAverages).reduce((sum, avg) => sum + avg, 0);
  return Math.round(totalValue);
}

// Funzione per determinare il ruolo del giocatore
function determineRole(player) {
  const offensivo = average([
    player.capacitaTecnica.controlloPalla,
    player.capacitaTecnica.tiro,
    player.contributoInAttacco.creativita,
    player.contributoInAttacco.finalizzazione,
    player.contributoInAttacco.movimentoSenzaPalla,
  ]);

  const difensivo = average([
    player.capacitaDifensiva.contrasto,
    player.capacitaDifensiva.intercettazioni,
    player.capacitaDifensiva.coperturaSpazi,
    player.capacitaTecnica.precisionePassaggi,
    player.posizionamentoTattico.anticipazione,
  ]);

  const tattico = average([
    player.capacitaTecnica.precisionePassaggi,
    player.contributoInAttacco.creativita,
    player.mentalitaEComportamento.leadership,
    player.capacitaTecnica.dribbling,
    player.capacitaTecnica.controlloPalla,
  ]);

  if (offensivo >= difensivo && offensivo >= tattico) {
    return 'Attaccante';
  } else if (difensivo >= offensivo && difensivo >= tattico) {
    return 'Difensore';
  } else {
    return 'Centrocampista';
  }
}

// Crea un nuovo giocatore
router.post('/', async (req, res) => {
  try {
    const playerData = req.body;

    // Calcola il ruolo e il valore totale
    playerData.ruolo = determineRole(playerData);
    playerData.valoreTotale = calculateTotalValue(playerData);

    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    console.error('Errore durante la creazione del giocatore:', err);
    res.status(400).json({ error: err.message });
  }
});

// Aggiorna i ruoli e i valori totali di tutti i giocatori
router.post('/update-roles', async (req, res) => {
  try {
    const players = await Player.find();

    for (const player of players) {
      const ruolo = determineRole(player);
      const valoreTotale = calculateTotalValue(player);

      await Player.findByIdAndUpdate(player._id, { ruolo, valoreTotale });
    }

    res.json({ message: 'Ruoli e valori totali aggiornati con successo!' });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento:', err);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento dei ruoli e dei valori.' });
  }
});

// Funzione per aggiornare i gol dei giocatori
router.post('/update-goals', async (req, res) => {
  try {
    const updates = req.body.updates;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'Formato dei dati non valido. È richiesto un array di aggiornamenti.' });
    }

    for (const update of updates) {
      const { name, additionalGoals } = update;
      if (!name || additionalGoals === undefined) {
        return res.status(400).json({ error: 'Ogni aggiornamento deve contenere un nome e un numero di gol aggiuntivi.' });
      }

      const player = await Player.findOne({ name });
      if (!player) {
        return res.status(404).json({ error: `Giocatore con nome ${name} non trovato.` });
      }

      player.gol += additionalGoals;
      await player.save();
    }

    res.status(200).json({ message: 'Gol aggiornati con successo!' });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento dei gol:', err);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento dei gol.' });
  }
});

// Endpoint per ricalcolare i valori totali
router.post('/recalculate-values', async (req, res) => {
  try {
    const players = await Player.find();

    for (const player of players) {
      const valoreTotale = calculateTotalValue(player);
      await Player.findByIdAndUpdate(player._id, { valoreTotale });
    }

    res.status(200).json({ message: 'Valori totali ricalcolati con successo!' });
  } catch (error) {
    console.error('Errore durante il ricalcolo dei valori:', error);
    res.status(500).json({ error: 'Errore durante il ricalcolo dei valori.' });
  }
});

// Ottieni tutti i giocatori
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina un giocatore
router.delete('/:name', async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({ name: req.params.name });
    if (!deletedPlayer) {
      return res.status(404).json({ error: 'Giocatore non trovato.' });
    }
    res.status(200).json(deletedPlayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
