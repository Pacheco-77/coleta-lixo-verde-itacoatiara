const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  
  description: String,

  // Coletor atribuído
  collector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Veículo
  vehicle: {
    id: String,
    plate: String,
    type: String,
  },

  // Data e horário
  scheduledDate: {
    type: Date,
    required: true,
  },
  
  startTime: {
    type: String, // HH:mm
    required: true,
  },
  
  endTime: String, // HH:mm

  // Pontos de coleta na rota
  points: [{
    point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CollectionPoint',
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    estimatedArrival: String, // HH:mm
    actualArrival: String, // HH:mm
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped'],
      default: 'pending',
    },
    notes: String,
  }],

  // Informações da rota
  routeInfo: {
    totalDistance: {
      type: Number, // em km
      default: 0,
    },
    estimatedDuration: {
      type: Number, // em minutos
      default: 0,
    },
    actualDuration: Number, // em minutos
    optimized: {
      type: Boolean,
      default: false,
    },
    optimizationAlgorithm: String,
  },

  // Áreas/Bairros cobertos
  neighborhoods: [{
    type: String,
  }],

  // Status da rota
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'draft',
  },

  // Execução da rota
  execution: {
    startedAt: Date,
    completedAt: Date,
    pausedAt: Date,
    resumedAt: Date,
    
    startLocation: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    
    endLocation: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },

    // Tracking em tempo real
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    lastLocationUpdate: Date,

    // Métricas
    totalKilometers: {
      type: Number,
      default: 0,
    },
    totalCollections: {
      type: Number,
      default: 0,
    },
    totalWasteCollected: {
      value: Number,
      unit: String,
    },
    averageTimePerPoint: Number, // em minutos
    
    // Paradas
    breaks: [{
      startedAt: Date,
      endedAt: Date,
      duration: Number, // em minutos
      reason: String,
    }],

    // Incidentes
    incidents: [{
      type: {
        type: String,
        enum: ['vehicle_issue', 'traffic', 'weather', 'access_denied', 'other'],
      },
      description: String,
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: [Number],
      },
      reportedAt: Date,
      resolvedAt: Date,
    }],
  },

  // Recorrência
  isRecurring: {
    type: Boolean,
    default: false,
  },
  
  recurringSchedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly'],
    },
    daysOfWeek: [Number], // 0-6 (Domingo-Sábado)
    startDate: Date,
    endDate: Date,
  },

  // Notas e observações
  notes: String,
  
  // Feedback do coletor
  collectorFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    submittedAt: Date,
    issues: [{
      type: String,
      description: String,
    }],
  },

  // Histórico de alterações
  changeHistory: [{
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changes: String,
    reason: String,
  }],

  // Metadados
  isActive: {
    type: Boolean,
    default: true,
  },
  
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal',
  },

  // Auditoria
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices
routeSchema.index({ collector: 1 });
routeSchema.index({ scheduledDate: 1 });
routeSchema.index({ status: 1 });
routeSchema.index({ 'execution.currentLocation': '2dsphere' });

// Virtual: Progresso da rota
routeSchema.virtual('progress').get(function() {
  if (this.points.length === 0) return 0;
  const completed = this.points.filter(p => p.status === 'completed').length;
  return Math.round((completed / this.points.length) * 100);
});

// Virtual: Está atrasada
routeSchema.virtual('isDelayed').get(function() {
  if (this.status !== 'in_progress') return false;
  
  const now = new Date();
  const scheduled = new Date(this.scheduledDate);
  const [hours, minutes] = this.endTime.split(':');
  scheduled.setHours(parseInt(hours), parseInt(minutes));
  
  return now > scheduled;
});

// Virtual: Tempo restante estimado
routeSchema.virtual('estimatedTimeRemaining').get(function() {
  if (this.status !== 'in_progress') return 0;
  
  const completedPoints = this.points.filter(p => p.status === 'completed').length;
  const remainingPoints = this.points.length - completedPoints;
  
  if (this.execution.averageTimePerPoint) {
    return remainingPoints * this.execution.averageTimePerPoint;
  }
  
  return 0;
});

// Método: Iniciar rota
routeSchema.methods.start = async function(location) {
  this.status = 'in_progress';
  this.execution.startedAt = new Date();
  this.execution.startLocation = {
    type: 'Point',
    coordinates: location,
  };
  this.execution.currentLocation = {
    type: 'Point',
    coordinates: location,
  };
  this.execution.lastLocationUpdate = new Date();
  return this.save();
};

// Método: Completar ponto
routeSchema.methods.completePoint = async function(pointId, actualArrival) {
  const pointIndex = this.points.findIndex(p => p.point.toString() === pointId.toString());
  
  if (pointIndex !== -1) {
    this.points[pointIndex].status = 'completed';
    this.points[pointIndex].actualArrival = actualArrival;
    this.execution.totalCollections += 1;
    
    // Calcular tempo médio por ponto
    const completedPoints = this.points.filter(p => p.status === 'completed');
    if (completedPoints.length > 0 && this.execution.startedAt) {
      const totalTime = (new Date() - this.execution.startedAt) / 60000; // em minutos
      this.execution.averageTimePerPoint = totalTime / completedPoints.length;
    }
  }
  
  return this.save();
};

// Método: Atualizar localização
routeSchema.methods.updateLocation = async function(location) {
  this.execution.currentLocation = {
    type: 'Point',
    coordinates: location,
  };
  this.execution.lastLocationUpdate = new Date();
  return this.save();
};

// Método: Adicionar parada
routeSchema.methods.addBreak = async function(reason) {
  this.execution.breaks.push({
    startedAt: new Date(),
    reason,
  });
  this.execution.pausedAt = new Date();
  return this.save();
};

// Método: Retomar após parada
routeSchema.methods.resumeFromBreak = async function() {
  const lastBreak = this.execution.breaks[this.execution.breaks.length - 1];
  if (lastBreak && !lastBreak.endedAt) {
    lastBreak.endedAt = new Date();
    lastBreak.duration = (lastBreak.endedAt - lastBreak.startedAt) / 60000; // em minutos
  }
  this.execution.resumedAt = new Date();
  return this.save();
};

// Método: Completar rota
routeSchema.methods.complete = async function(location) {
  this.status = 'completed';
  this.execution.completedAt = new Date();
  this.execution.endLocation = {
    type: 'Point',
    coordinates: location,
  };
  
  // Calcular duração total
  if (this.execution.startedAt) {
    this.execution.actualDuration = (this.execution.completedAt - this.execution.startedAt) / 60000; // em minutos
  }
  
  return this.save();
};

// Método: Adicionar incidente
routeSchema.methods.addIncident = async function(type, description, location) {
  this.execution.incidents.push({
    type,
    description,
    location: {
      type: 'Point',
      coordinates: location,
    },
    reportedAt: new Date(),
  });
  return this.save();
};

// Método estático: Buscar rotas ativas
routeSchema.statics.findActive = function() {
  return this.find({
    status: { $in: ['scheduled', 'in_progress'] },
    isActive: true,
  }).populate('collector points.point');
};

// Método estático: Buscar rotas por coletor
routeSchema.statics.findByCollector = function(collectorId) {
  return this.find({
    collector: collectorId,
    isActive: true,
  }).sort({ scheduledDate: -1 });
};

// Método estático: Estatísticas de rotas
routeSchema.statics.getStats = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'execution.completedAt': {
          $gte: startDate,
          $lte: endDate,
        },
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRoutes: { $sum: 1 },
        totalKilometers: { $sum: '$execution.totalKilometers' },
        totalCollections: { $sum: '$execution.totalCollections' },
        avgDuration: { $avg: '$execution.actualDuration' },
        avgKilometers: { $avg: '$execution.totalKilometers' },
      },
    },
  ]);
};

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
