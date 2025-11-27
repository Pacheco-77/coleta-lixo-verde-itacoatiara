const mongoose = require('mongoose');

const collectionPointSchema = new mongoose.Schema({
  // Informações do cidadão
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  citizenName: {
    type: String,
    required: true,
  },
  citizenPhone: {
    type: String,
    required: true,
  },
  citizenEmail: String,

  // Localização
  address: {
    street: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    complement: String,
    neighborhood: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Itacoatiara',
    },
    state: {
      type: String,
      default: 'AM',
    },
    zipCode: String,
    reference: String, // Ponto de referência
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
      index: '2dsphere',
    },
  },

  // Informações do resíduo
  wasteType: {
    type: String,
    enum: [
      'folhas', // Folhas secas
      'galhos', // Galhos e podas
      'grama', // Grama cortada
      'flores', // Flores e plantas
      'frutas', // Restos de frutas
      'vegetais', // Restos de vegetais
      'outros', // Outros resíduos verdes
    ],
    required: true,
  },
  
  estimatedQuantity: {
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

  description: {
    type: String,
    maxlength: 500,
  },

  images: [{
    url: String,
    uploadedAt: Date,
  }],

  // Status da coleta
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'in_progress', 'collected', 'cancelled'],
    default: 'pending',
  },

  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },

  // Agendamento
  scheduledDate: Date,
  scheduledTimeSlot: {
    start: String, // HH:mm
    end: String, // HH:mm
  },

  // Rota atribuída
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  },
  routeOrder: Number, // Ordem na rota

  // Coleta
  collector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  collectionInfo: {
    collectedAt: Date,
    actualQuantity: {
      value: Number,
      unit: String,
    },
    notes: String,
    photos: [{
      url: String,
      takenAt: Date,
    }],
    duration: Number, // Tempo gasto em minutos
  },

  // Notificações
  notificationsSent: {
    scheduled: {
      sent: Boolean,
      sentAt: Date,
    },
    dayBefore: {
      sent: Boolean,
      sentAt: Date,
    },
    onTheWay: {
      sent: Boolean,
      sentAt: Date,
    },
    completed: {
      sent: Boolean,
      sentAt: Date,
    },
  },

  // Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    submittedAt: Date,
  },

  // Histórico de status
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  }],

  // Cancelamento
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cancelledAt: Date,

  // Metadados
  isActive: {
    type: Boolean,
    default: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringSchedule: {
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
    },
    dayOfWeek: Number, // 0-6 (Domingo-Sábado)
    dayOfMonth: Number, // 1-31
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
collectionPointSchema.index({ location: '2dsphere' });
collectionPointSchema.index({ status: 1 });
collectionPointSchema.index({ citizen: 1 });
collectionPointSchema.index({ collector: 1 });
collectionPointSchema.index({ route: 1 });
collectionPointSchema.index({ scheduledDate: 1 });
collectionPointSchema.index({ 'address.neighborhood': 1 });

// Virtual: Endereço completo
collectionPointSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.number}${addr.complement ? ' - ' + addr.complement : ''}, ${addr.neighborhood}, ${addr.city}-${addr.state}`;
});

// Virtual: Está atrasado
collectionPointSchema.virtual('isOverdue').get(function() {
  if (this.status === 'collected' || this.status === 'cancelled') {
    return false;
  }
  return this.scheduledDate && this.scheduledDate < new Date();
});

// Método: Adicionar ao histórico de status
collectionPointSchema.methods.addStatusHistory = function(status, userId, notes = '') {
  this.statusHistory.push({
    status,
    changedBy: userId,
    changedAt: new Date(),
    notes,
  });
  this.status = status;
};

// Método: Marcar como coletado
collectionPointSchema.methods.markAsCollected = async function(collectorId, actualQuantity, notes = '') {
  this.status = 'collected';
  this.collector = collectorId;
  this.collectionInfo = {
    collectedAt: new Date(),
    actualQuantity,
    notes,
  };
  this.addStatusHistory('collected', collectorId, 'Coleta realizada com sucesso');
  return this.save();
};

// Método: Cancelar coleta
collectionPointSchema.methods.cancel = async function(userId, reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = userId;
  this.cancelledAt = new Date();
  this.addStatusHistory('cancelled', userId, reason);
  return this.save();
};

// Método estático: Buscar pontos pendentes
collectionPointSchema.statics.findPending = function() {
  return this.find({
    status: 'pending',
    isActive: true,
  }).sort({ createdAt: 1 });
};

// Método estático: Buscar pontos por bairro
collectionPointSchema.statics.findByNeighborhood = function(neighborhood) {
  return this.find({
    'address.neighborhood': neighborhood,
    isActive: true,
  });
};

// Método estático: Buscar pontos próximos
collectionPointSchema.statics.findNearby = function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance, // em metros
      },
    },
    isActive: true,
  });
};

// Método estático: Estatísticas por período
collectionPointSchema.statics.getStatsByPeriod = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'collectionInfo.collectedAt': {
          $gte: startDate,
          $lte: endDate,
        },
        status: 'collected',
      },
    },
    {
      $group: {
        _id: null,
        totalCollections: { $sum: 1 },
        totalQuantity: { $sum: '$collectionInfo.actualQuantity.value' },
        avgQuantity: { $avg: '$collectionInfo.actualQuantity.value' },
        byWasteType: {
          $push: {
            type: '$wasteType',
            quantity: '$collectionInfo.actualQuantity.value',
          },
        },
      },
    },
  ]);
};

const CollectionPoint = mongoose.model('CollectionPoint', collectionPointSchema);

module.exports = CollectionPoint;
