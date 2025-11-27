const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [200, 'Título deve ter no máximo 200 caracteres'],
  },
  content: {
    type: String,
    required: [true, 'Conteúdo é obrigatório'],
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [300, 'Resumo deve ter no máximo 300 caracteres'],
  },
  image: {
    type: String,
    required: [true, 'Imagem é obrigatória'],
  },
  category: {
    type: String,
    enum: ['noticia', 'evento', 'alerta', 'informacao'],
    default: 'noticia',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices
newsSchema.index({ isActive: 1, publishDate: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ priority: -1 });

// Virtual para verificar se está expirada
newsSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < Date.now();
});

// Método estático: Buscar notícias ativas
newsSchema.statics.findActive = function(limit = 10) {
  return this.find({
    isActive: true,
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gt: Date.now() } }
    ]
  })
  .sort({ priority: -1, publishDate: -1 })
  .limit(limit)
  .populate('author', 'name photo');
};

// Método estático: Buscar por categoria
newsSchema.statics.findByCategory = function(category, limit = 10) {
  return this.find({
    isActive: true,
    category,
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gt: Date.now() } }
    ]
  })
  .sort({ priority: -1, publishDate: -1 })
  .limit(limit)
  .populate('author', 'name photo');
};

// Método: Incrementar visualizações
newsSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

const News = mongoose.model('News', newsSchema);

module.exports = News;
