const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamA: { type: Array, required: true },
  teamB: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Team', teamSchema);