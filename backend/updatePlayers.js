require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('./models/Player'); // Modello Player
const User = require('./models/User'); // Modello User

async function updatePlayers(userId) {
  try {
    // Connessione a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connesso al database.');

    // Controlla se l'utente esiste
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utente non trovato.');
    }

    // Aggiorna tutti i giocatori con l'userId
    const result = await Player.updateMany({}, { $set: { userId: userId } });
    console.log(`Giocatori aggiornati con successo: ${result.nModified}`);

    // Chiudi la connessione al database
    await mongoose.connection.close();
    console.log('Connessione al database chiusa.');
  } catch (err) {
    console.error('Errore durante l\'aggiornamento:', err);
    // Chiudi la connessione in caso di errore
    await mongoose.connection.close();
  }
}

// Inserisci qui l'ID dell'utente da usare per aggiornare i giocatori
const userId = '6745e3961e6b22286b9afbf7'; // Sostituisci con il tuo userId
updatePlayers(userId);
