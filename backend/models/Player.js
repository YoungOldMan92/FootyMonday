const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  attack: { type: Number, required: true },
  defense: { type: Number, required: true },
  technique: { type: Number, required: true },
  stamina: { type: Number, required: true },
  speed: { type: Number, required: true },
  valoreTotale: { type: Number, required: true },
  gol: { type: Number, default: 0 },
});

module.exports = mongoose.model('Player', PlayerSchema);
