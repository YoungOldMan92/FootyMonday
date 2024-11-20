const express = require('express');
const MatchHistory = require('../models/MatchHistory');

const router = express.Router();

// Salva una partita
router.post('/', async (req, res) => {
  try {
    const newMatch = new MatchHistory(req.body);
    const savedMatch = await newMatch.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ottieni lo storico delle partite
router.get('/', async (req, res) => {
  try {
    const matches = await MatchHistory.find();
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
