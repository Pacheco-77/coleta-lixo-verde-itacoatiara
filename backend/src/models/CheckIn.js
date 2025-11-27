const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  // Referências
  collector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  collectionPoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollectionPoint',
    required: true,
  },
  
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },

  // Informações do check-in
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now,
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },

  // Distância do ponto real (em metros)
  distanceFromPoint: {
    type: Number,
    default: 0,
  },

  // Validação de localização
  isLocationValid: {
    type: Boolean,
    default: true,
  },

  // Informações da coleta
  wasteCollected: {
    quantity: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ['kg', 'sacos', 'm3'],
        default: 'kg',
      },
    },
    wasteType: String,
    condition: {
      type: String,
      enum: ['good', 'wet', 'mixed', 'contaminated'],
      default: 'good',
    },
  },

  // Tempo gasto no ponto
  duration: {
    type: Number, // em minutos
    default: 0,
  },

  // Fotos da coleta
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['before', 'after', 'waste', 'location'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],

  // Observações
  notes: String,

  // Problemas encontrados
  issues: [{
    type: {
      type: String,
      enum: [
        'access_denied',
        'wrong_address',
        'no_waste',
        'contaminated_waste',
        'excessive_quantity',
        'dangerous_waste',
        'other',
      ],
    },
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  }],

  // Status do check-in
  status: {
    type: String,
    enum: ['completed', 'partial', 'failed', 'skipped'],
    default: 'completed',
  },

  // Assinatura/Confirmação do cidadão
  citizenConfirmation: {
    confirmed: {
      type: Boolean,
      default: false,
    },
    signature: String, // Base64 da assinatura
    confirmedAt: Date,
    citizenName: String,
  },

  // Métricas de qualidade
  qualityMetrics: {
    wasteQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    separationQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    packagingQuality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },

  // Informações do dispositivo
  deviceInfo: {
    platform: String,
    appVersion: String,
    batteryLevel: Number,
    networkType: String,
  },

  // Sincronização
  syncStatus: {
    type: String,
    enum: ['synced', 'pending', 'failed'],
    default: 'synced',
  },
  
  syncedAt: Date,
  
  offlineCreated: {
    type: Boolean,
    default: false,
  },

  // Validação administrativa
  adminValidation: {
    validated: {
      type: Boolean,
      default: false,
    },
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    validatedAt: Date,
    notes: String,
  },

  // Metadados
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
checkInSchema.index({ collector: 1 });
checkInSchema.index({ collectionPoint: 1 });
checkInSchema.index({ route: 1 });
checkInSchema.index({ checkInTime: -1 });
checkInSchema.index({ location: '2dsphere' });
checkInSchema.index({ status: 1 });

// Virtual: Tempo desde o check-in
checkInSchema.virtual('timeSinceCheckIn').get(function() {
  return Math.floor((new Date() - this.checkInTime) / 60000); // em minutos
});

// Virtual: É recente (últimas 24h)
checkInSchema.virtual('isRecent').get(function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.checkInTime > oneDayAgo;
});

// Método: Adicionar foto
checkInSchema.methods.addPhoto = async function(url, type) {
  this.photos.push({
    url,
    type,
    uploadedAt: new Date(),
  });
  return this.save();
};

// Método: Adicionar problema
checkInSchema.methods.addIssue = async function(type, description, severity = 'medium') {
  this.issues.push({
    type,
    description,
    severity,
  });
  return this.save();
};

// Método: Confirmar pelo cidadão
checkInSchema.methods.confirmByCitizen = async function(citizenName, signature) {
  this.citizenConfirmation = {
    confirmed: true,
    signature,
    confirmedAt: new Date(),
    citizenName,
  };
  return this.save();
};

// Método: Validar por admin
checkInSchema.methods.validateByAdmin = async function(adminId, notes = '') {
  this.adminValidation = {
    validated: true,
    validatedBy: adminId,
    validatedAt: new Date(),
    notes,
  };
  return this.save();
};

// Método estático: Buscar check-ins por coletor
checkInSchema.statics.findByCollector = function(collectorId, startDate, endDate) {
  const query = { collector: collectorId };
  
  if (startDate && endDate) {
    query.checkInTime = {
      $gte: startDate,
      $lte: endDate,
    };
  }
  
  return this.find(query)
    .populate('collectionPoint route')
    .sort({ checkInTime: -1 });
};

// Método estático: Buscar check-ins por rota
checkInSchema.statics.findByRoute = function(routeId) {
  return this.find({ route: routeId })
    .populate('collector collectionPoint')
    .sort({ checkInTime: 1 });
};

// Método estático: Estatísticas de check-ins
checkInSchema.statics.getStats = async function(collectorId, startDate, endDate) {
  const match = {
    collector: mongoose.Types.ObjectId(collectorId),
    checkInTime: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalCheckIns: { $sum: 1 },
        totalWasteCollected: { $sum: '$wasteCollected.quantity.value' },
        avgDuration: { $avg: '$duration' },
        completedCheckIns: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },
        failedCheckIns: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
        },
        avgWasteQuality: { $avg: '$qualityMetrics.wasteQuality' },
      },
    },
  ]);
};

// Método estático: Check-ins com problemas
checkInSchema.statics.findWithIssues = function(severity = null) {
  const query = {
    'issues.0': { $exists: true }, // Tem pelo menos um problema
  };
  
  if (severity) {
    query['issues.severity'] = severity;
  }
  
  return this.find(query)
    .populate('collector collectionPoint route')
    .sort({ checkInTime: -1 });
};

// Método estático: Check-ins pendentes de validação
checkInSchema.statics.findPendingValidation = function() {
  return this.find({
    'adminValidation.validated': false,
    status: 'completed',
  })
    .populate('collector collectionPoint')
    .sort({ checkInTime: -1 });
};

const CheckIn = mongoose.model('CheckIn', checkInSchema);

module.exports = CheckIn;
