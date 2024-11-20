const mongoose = require('mongoose');

const MatchHistorySchema = new mongoose.Schema({
  teamA: { type: Array, required: true },
  teamB: { type: Array, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MatchHistory', MatchHistorySchema);
