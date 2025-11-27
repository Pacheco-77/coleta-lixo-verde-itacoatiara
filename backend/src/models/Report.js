const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    enum: [
      'daily',
      'weekly',
      'monthly',
      'annual',
      'custom',
      'collector_performance',
      'route_efficiency',
      'waste_statistics',
      'environmental_impact',
    ],
    required: true,
  },

  // Período do relatório
  period: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },

  // Filtros aplicados
  filters: {
    collectors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    routes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    }],
    neighborhoods: [String],
    wasteTypes: [String],
  },

  // Dados do relatório
  data: {
    // Estatísticas gerais
    summary: {
      totalCollections: Number,
      totalWasteCollected: {
        value: Number,
        unit: String,
      },
      totalKilometers: Number,
      totalRoutes: Number,
      activeCollectors: Number,
      avgCollectionsPerDay: Number,
      avgWastePerCollection: Number,
    },

    // Coletas por tipo de resíduo
    wasteByType: [{
      type: String,
      quantity: Number,
      percentage: Number,
      collections: Number,
    }],

    // Coletas por bairro
    collectionsByNeighborhood: [{
      neighborhood: String,
      collections: Number,
      wasteCollected: Number,
      percentage: Number,
    }],

    // Desempenho de coletores
    collectorPerformance: [{
      collector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      collectorName: String,
      totalCollections: Number,
      totalKilometers: Number,
      totalWaste: Number,
      avgTimePerCollection: Number,
      completionRate: Number,
      rating: Number,
      routesCompleted: Number,
    }],

    // Eficiência de rotas
    routeEfficiency: [{
      route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      },
      routeName: String,
      completionRate: Number,
      avgDuration: Number,
      avgKilometers: Number,
      avgCollections: Number,
      onTimeRate: Number,
    }],

    // Tendências temporais
    trends: {
      daily: [{
        date: Date,
        collections: Number,
        wasteCollected: Number,
        kilometers: Number,
      }],
      weekly: [{
        week: Number,
        year: Number,
        collections: Number,
        wasteCollected: Number,
      }],
      monthly: [{
        month: Number,
        year: Number,
        collections: Number,
        wasteCollected: Number,
      }],
    },

    // Impacto ambiental
    environmentalImpact: {
      co2Saved: Number, // kg de CO2
      treesEquivalent: Number,
      compostProduced: Number, // kg
      energyGenerated: Number, // kWh
      landfillSpaceSaved: Number, // m³
    },

    // Problemas e incidentes
    issues: {
      total: Number,
      byType: [{
        type: String,
        count: Number,
        percentage: Number,
      }],
      bySeverity: [{
        severity: String,
        count: Number,
      }],
    },

    // Qualidade do serviço
    qualityMetrics: {
      avgWasteQuality: Number,
      avgSeparationQuality: Number,
      avgPackagingQuality: Number,
      citizenSatisfaction: Number,
      collectorSatisfaction: Number,
    },

    // Comparação com período anterior
    comparison: {
      collectionsChange: Number, // %
      wasteChange: Number, // %
      kilometersChange: Number, // %
      efficiencyChange: Number, // %
    },
  },

  // Gráficos e visualizações
  charts: [{
    type: {
      type: String,
      enum: ['line', 'bar', 'pie', 'area', 'scatter'],
    },
    title: String,
    data: mongoose.Schema.Types.Mixed,
    config: mongoose.Schema.Types.Mixed,
  }],

  // Insights e recomendações
  insights: [{
    type: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'warning'],
    },
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
  }],

  recommendations: [{
    title: String,
    description: String,
    impact: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    effort: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
  }],

  // Status do relatório
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'archived'],
    default: 'generating',
  },

  // Exportação
  exports: [{
    format: {
      type: String,
      enum: ['pdf', 'excel', 'csv', 'json'],
    },
    url: String,
    generatedAt: Date,
    expiresAt: Date,
  }],

  // Agendamento
  isScheduled: {
    type: Boolean,
    default: false,
  },

  schedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
    },
    dayOfWeek: Number, // 0-6
    dayOfMonth: Number, // 1-31
    time: String, // HH:mm
    recipients: [{
      email: String,
      name: String,
    }],
    lastGenerated: Date,
    nextGeneration: Date,
  },

  // Compartilhamento
  isPublic: {
    type: Boolean,
    default: false,
  },

  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    accessLevel: {
      type: String,
      enum: ['view', 'download', 'edit'],
      default: 'view',
    },
    sharedAt: Date,
  }],

  // Metadados
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  generatedAt: {
    type: Date,
    default: Date.now,
  },

  processingTime: Number, // em segundos

  notes: String,

  tags: [String],

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices
reportSchema.index({ type: 1 });
reportSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
reportSchema.index({ generatedBy: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ isScheduled: 1 });
reportSchema.index({ tags: 1 });

// Virtual: Duração do período
reportSchema.virtual('periodDuration').get(function() {
  const diff = this.period.endDate - this.period.startDate;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // em dias
});

// Virtual: Está expirado (para relatórios agendados)
reportSchema.virtual('isExpired').get(function() {
  if (!this.schedule?.nextGeneration) return false;
  return new Date() > this.schedule.nextGeneration;
});

// Método: Adicionar exportação
reportSchema.methods.addExport = async function(format, url) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Expira em 30 dias

  this.exports.push({
    format,
    url,
    generatedAt: new Date(),
    expiresAt,
  });

  return this.save();
};

// Método: Compartilhar com usuário
reportSchema.methods.shareWith = async function(userId, accessLevel = 'view') {
  const existingShare = this.sharedWith.find(
    s => s.user.toString() === userId.toString()
  );

  if (existingShare) {
    existingShare.accessLevel = accessLevel;
  } else {
    this.sharedWith.push({
      user: userId,
      accessLevel,
      sharedAt: new Date(),
    });
  }

  return this.save();
};

// Método: Adicionar insight
reportSchema.methods.addInsight = async function(type, title, description, priority = 'medium') {
  this.insights.push({
    type,
    title,
    description,
    priority,
  });

  return this.save();
};

// Método: Adicionar recomendação
reportSchema.methods.addRecommendation = async function(title, description, impact, effort) {
  this.recommendations.push({
    title,
    description,
    impact,
    effort,
  });

  return this.save();
};

// Método: Marcar como completo
reportSchema.methods.markAsCompleted = async function(processingTime) {
  this.status = 'completed';
  this.processingTime = processingTime;
  return this.save();
};

// Método estático: Buscar relatórios agendados pendentes
reportSchema.statics.findScheduledPending = function() {
  return this.find({
    isScheduled: true,
    status: 'completed',
    'schedule.nextGeneration': { $lte: new Date() },
  });
};

// Método estático: Buscar relatórios públicos
reportSchema.statics.findPublic = function() {
  return this.find({
    isPublic: true,
    status: 'completed',
    isActive: true,
  }).sort({ generatedAt: -1 });
};

// Método estático: Buscar por período
reportSchema.statics.findByPeriod = function(startDate, endDate) {
  return this.find({
    'period.startDate': { $gte: startDate },
    'period.endDate': { $lte: endDate },
    status: 'completed',
  }).sort({ generatedAt: -1 });
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
