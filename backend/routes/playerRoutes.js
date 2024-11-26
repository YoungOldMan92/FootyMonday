const express = require('express');
const Player = require('../models/Player');
const authenticate = require('../middleware/authenticate');


const router = express.Router();

// Crea un nuovo giocatore
router.post('/', authenticate, async (req, res) => {
  try {
    const playerData = { ...req.body, userId: req.userId };
    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    console.error('Errore durante la creazione del giocatore:', err);
    res.status(400).json({ error: err.message });
  }
});

// Aggiorna i ruoli e i valori totali di tutti i giocatori
router.post('/update-roles', authenticate, async (req, res) => {
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
