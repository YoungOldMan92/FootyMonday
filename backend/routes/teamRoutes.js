const express = require('express');
const router = express.Router();
const Team = require('../models/Team'); // Importa il modello

// Salva le squadre nel database
router.post('/', async (req, res) => {
  const { teamA, teamB } = req.body;

  try {
    // Elimina eventuali squadre precedenti
    await Team.deleteMany({});
    const newTeam = new Team({ teamA, teamB });
    await newTeam.save();
    res.status(200).send({ message: 'Squadre salvate con successo.' });
  } catch (err) {
    console.error('Errore durante il salvataggio delle squadre:', err);
    res.status(500).send({ message: 'Errore durante il salvataggio delle squadre.' });
  }
});

// Recupera le squadre dal database
router.get('/', async (req, res) => {
    try {
      const team = await Team.findOne(); // Trova l'unico documento delle squadre
      if (!team) {
        // Se non ci sono squadre, restituisci un array vuoto
        return res.status(200).send({ teams: [] });
      }
      res.status(200).send({ teams: [team.teamA, team.teamB] });
    } catch (err) {
      console.error('Errore durante il recupero delle squadre:', err);
      res.status(500).send({ message: 'Errore durante il recupero delle squadre.' });
    }
  });
  

// Elimina le squadre dal database
router.delete('/', async (req, res) => {
  try {
    await Team.deleteMany({});
    res.status(200).send({ message: 'Squadre eliminate con successo.' });
  } catch (err) {
    console.error('Errore durante l\'eliminazione delle squadre:', err);
    res.status(500).send({ message: 'Errore durante l\'eliminazione delle squadre.' });
  }
});

module.exports = router;
