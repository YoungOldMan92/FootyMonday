const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Modello utente
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Rotta per registrazione
router.post('/register', async (req, res) => {
  const { username, email, nome, cognome, password } = req.body;

  // Verifica che tutti i campi siano forniti
  if (!username || !email || !nome || !cognome || !password) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
  }

  try {
    // Controlla se l'username o l'email esistono già
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username o email già in uso.' });
    }

    // Crea un nuovo utente
    const newUser = new User({ username, email, nome, cognome, password });
    await newUser.save();

    res.status(201).json({ message: 'Registrazione completata con successo.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la registrazione.' });
  }
});

// Rotta per login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password sono obbligatori.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    // Genera un JWT con un segreto
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante il login.' });
  }
});



module.exports = router;
