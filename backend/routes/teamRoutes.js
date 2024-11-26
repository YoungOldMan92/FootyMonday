const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const authenticate = require('../middleware/authenticate');

// Salva le squadre nel database
router.post('/', authenticate, async (req, res) => {
  const { teamA, teamB } = req.body;

  try {
    // Elimina eventuali squadre precedenti associate all'utente
    await Team.deleteMany({ userId: req.userId });

    // Salva le nuove squadre
    const newTeam = new Team({ teamA, teamB, userId: req.userId });
    await newTeam.save();
    res.status(200).send({ message: 'Squadre salvate con successo.' });
  } catch (err) {
    console.error('Errore durante il salvataggio delle squadre:', err);
    res.status(500).send({ message: 'Errore durante il salvataggio delle squadre.' });
  }
});

// Recupera le squadre dal database
router.get('/', authenticate, async (req, res) => {
  try {
    const team = await Team.findOne({ userId: req.userId });
    if (!team) {
      return res.status(200).send({ teams: [] });
    }
    res.status(200).send({ teams: [team.teamA, team.teamB] });
  } catch (err) {
    console.error('Errore durante il recupero delle squadre:', err);
    res.status(500).send({ message: 'Errore durante il recupero delle squadre.' });
  }
});

// Elimina le squadre dal database
router.delete('/', authenticate, async (req, res) => {
  try {
    await Team.deleteMany({ userId: req.userId });
    res.status(200).send({ message: 'Squadre eliminate con successo.' });
  } catch (err) {
    console.error('Errore durante l\'eliminazione delle squadre:', err);
    res.status(500).send({ message: 'Errore durante l\'eliminazione delle squadre.' });
  }
});

module.exports = router;
