const express = require('express');
const Player = require('../models/Player');
const authenticate = require('../middleware/authenticate');


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
    return Math.round((totalValue / 60) * 100);
  }

// Funzione per determinare il ruolo del giocatore
function determineRole(player) {
    if (player.ruolo) {
      // Se il ruolo è specificato, mantienilo
      return player.ruolo;
    }
  
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
router.post('/', authenticate, async (req, res) => {
  try {
    const calculateAverage = (group) => {
      const values = Object.values(group);
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    };

    const { capacitaTecnica, resistenzaFisica, posizionamentoTattico, capacitaDifensiva, contributoInAttacco, mentalitaEComportamento } = req.body;

    // Calcola le medie per ogni gruppo
    const playerData = {
      ...req.body,
      capacitaTecnica: {
        ...capacitaTecnica,
        media: calculateAverage(capacitaTecnica),
      },
      resistenzaFisica: {
        ...resistenzaFisica,
        media: calculateAverage(resistenzaFisica),
      },
      posizionamentoTattico: {
        ...posizionamentoTattico,
        media: calculateAverage(posizionamentoTattico),
      },
      capacitaDifensiva: {
        ...capacitaDifensiva,
        media: calculateAverage(capacitaDifensiva),
      },
      contributoInAttacco: {
        ...contributoInAttacco,
        media: calculateAverage(contributoInAttacco),
      },
      mentalitaEComportamento: {
        ...mentalitaEComportamento,
        media: calculateAverage(mentalitaEComportamento),
      },
    };

    // Calcola il valore totale
    playerData.valoreTotale =
      playerData.capacitaTecnica.media +
      playerData.resistenzaFisica.media +
      playerData.posizionamentoTattico.media +
      playerData.capacitaDifensiva.media +
      playerData.contributoInAttacco.media +
      playerData.mentalitaEComportamento.media;

    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    console.error('Errore durante la creazione del giocatore:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.post('/update-goals', authenticate, async (req, res) => {

    console.log('Richiesta ricevuta su /update-goals');

  try {
    const updates = req.body.updates; // Array di giocatori con i loro nuovi gol

    

    if (!updates || updates.length === 0) {
      return res.status(400).json({ error: 'Nessun aggiornamento fornito.' });
    }

    for (const update of updates) {
      const { playerId, additionalGoals } = update;

      if (!playerId || additionalGoals === undefined) {
        return res.status(400).json({ error: 'ID giocatore o gol mancanti.' });
      }

      const player = await Player.findById(playerId);
      if (!player) {
        return res.status(404).json({ error: `Giocatore con ID ${playerId} non trovato.` });
      }

      // Aggiorna i gol
      player.gol += additionalGoals;
      await player.save();
      console.log('Giocatore aggiornato', player.name);
    }

    res.status(200).json({ message: 'Gol aggiornati con successo.' });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento dei gol:', err.message);
    res.status(500).json({ error: 'Errore interno del server.' });
  }
});

// Aggiorna i ruoli e i valori totali di tutti i giocatori
router.post('/update-players', authenticate, async (req, res) => {
  try {
    const players = await Player.find({ userId: req.userId });

    for (const player of players) {
      const ruolo = determineRole(player);
      const valoreTotale = calculateTotalValue(player);

      await Player.findByIdAndUpdate(player._id, { ruolo, valoreTotale });
    }

    const updatedPlayers = await Player.find({ userId: req.userId });
    res.json({ message: 'Ruoli e valori totali aggiornati con successo!', updatedPlayers });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento:', err);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento dei ruoli e dei valori.' });
  }
});

// Ottieni tutti i giocatori
router.get('/', authenticate, async (req, res) => {
  try {
    const players = await Player.find({ userId: req.userId });
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina un giocatore
router.delete('/:name', authenticate, async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({ name: req.params.name, userId: req.userId });
    if (!deletedPlayer) {
      return res.status(404).json({ error: 'Giocatore non trovato.' });
    }
    res.status(200).json(deletedPlayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;