const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Accesso negato. Token non fornito.' });
  }

  try {
    const decoded = jwt.verify(token, 'secretKey'); // Usa il tuo secret
    req.userId = decoded.userId; // Aggiunge l'ID utente alla richiesta
    next(); // Procedi al prossimo middleware o controller
  } catch (err) {
    res.status(401).json({ error: 'Token non valido.' });
  }
};

module.exports = authenticate;
