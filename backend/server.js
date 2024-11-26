require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connessione al Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso a MongoDB'))
  .catch((err) => console.error('Errore di connessione a MongoDB:', err));

// Endpoint di base
app.get('/', (req, res) => {
  res.send('Server attivo');
});

// Inizializza server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});


app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
