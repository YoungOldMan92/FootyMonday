const express = require('express');
const MatchHistory = require('../models/MatchHistory');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Salva una partita
router.post('/', authenticate, async (req, res) => {
  try {
    const matchData = { ...req.body, userId: req.userId };
    const newMatch = new MatchHistory(matchData);
    const savedMatch = await newMatch.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ottieni lo storico delle partite
router.get('/', authenticate, async (req, res) => {
  try {
    const matches = await MatchHistory.find({ userId: req.userId });
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
