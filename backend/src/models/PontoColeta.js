const mongoose = require('mongoose');

const pontoColetaSchema = new mongoose.Schema({
  nomePonto: {
    type: String,
    required: true,
    trim: true,
  },
  logradouro: {
    type: String,
    required: true,
  },
  bairro: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'em_andamento', 'concluido'],
    default: 'pendente',
  },
  coletorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  concluidoEm: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Atualizar updatedAt antes de salvar
pontoColetaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Método para marcar coleta como concluída
pontoColetaSchema.methods.marcarConcluido = async function(coletorId) {
  this.status = 'concluido';
  this.concluidoEm = new Date();
  if (coletorId) {
    this.coletorId = coletorId;
  }
  return this.save();
};

// Método para iniciar coleta
pontoColetaSchema.methods.iniciarColeta = async function(coletorId) {
  this.status = 'em_andamento';
  if (coletorId) {
    this.coletorId = coletorId;
  }
  return this.save();
};

const PontoColeta = mongoose.model('PontoColeta', pontoColetaSchema);

module.exports = PontoColeta;
