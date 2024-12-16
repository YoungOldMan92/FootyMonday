const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  capacitaTecnica: {
    controlloPalla: { type: Number, required: true },
    dribbling: { type: Number, required: true },
    precisionePassaggi: { type: Number, required: true },
    tiro: { type: Number, required: true },
  },
  resistenzaFisica: {
    stamina: { type: Number, required: true },
    velocita: { type: Number, required: true },
    resistenzaSforzo: { type: Number, required: true },
  },
  posizionamentoTattico: {
    anticipazione: { type: Number, required: true },
    copertura: { type: Number, required: true },
    adattabilitaTattica: { type: Number, required: true },
  },
  capacitaDifensiva: {
    contrasto: { type: Number, required: true },
    intercettazioni: { type: Number, required: true },
    coperturaSpazi: { type: Number, required: true },
  },
  contributoInAttacco: {
    creativita: { type: Number, required: true },
    movimentoSenzaPalla: { type: Number, required: true },
    finalizzazione: { type: Number, required: true },
  },
  mentalitaEComportamento: {
    leadership: { type: Number, required: true },
    gestioneStress: { type: Number, required: true },
    sportivita: { type: Number, required: true },
  },
  ruolo: { type: String, default: 'Non assegnato' },
  valoreTotale: { type: Number, required: true },
  gol: { type: Number, default: 0 },
  isGuest: { type: Boolean, default: false },
});

module.exports = mongoose.model('Player', PlayerSchema);
