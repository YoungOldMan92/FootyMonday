const express = require('express');
const Player = require('../models/Player');

const router = express.Router();

// Crea un nuovo giocatore
router.post('/', async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedPlayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
