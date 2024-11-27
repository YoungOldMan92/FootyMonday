const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Richiesta ricevuta nel middleware:', req.headers);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Richiesta senza token o token malformato.');
    return res.status(401).json({ error: 'Accesso negato. Token non valido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    console.log('Middleware: Token decodificato con successo:', decoded);
    req.userId = decoded.userId;
    console.log('userId nel middleware:', req.userId);
    next();
  } catch (err) {
    console.error('Errore durante la verifica del token:', err.message);
    return res.status(401).json({ error: 'Token non valido.' });
  }
};


module.exports = authenticate;
