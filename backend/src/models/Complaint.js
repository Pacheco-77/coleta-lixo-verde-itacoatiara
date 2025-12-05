const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // Denunciante
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporterName: String,
  reporterEmail: String,
  reporterPhone: String,

  // Tipo de denúncia
  type: {
    type: String,
    enum: [
      'descarte_irregular', // Descarte irregular de lixo verde
      'queimada', // Queimada de material verde
      'acumulo', // Acúmulo excessivo
      'area_publica', // Descarte em área pública
      'terreno_abandonado', // Terreno abandonado com lixo
      'outros' // Outros tipos
    ],
    required: true,
  },

  // Descrição
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },

  // Localização
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: {
      type: String,
      default: 'Itacoatiara',
    },
    state: {
      type: String,
      default: 'AM',
    },
    reference: String,
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere',
    },
  },

  // Evidências
  photos: [{
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    description: String,
  }],

  // Status
  status: {
    type: String,
    enum: ['pendente', 'em-andamento', 'resolvida', 'rejeitada'],
    default: 'pendente',
  },

  priority: {
    type: String,
    enum: ['baixa', 'normal', 'alta', 'urgente'],
    default: 'normal',
  },

  // Atribuição
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedAt: Date,

  // Resolução
  resolution: {
    status: String,
    notes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
    actions: [String], // Ações tomadas
  },

  // Rejeição
  rejection: {
    reason: String,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: Date,
  },

  // Histórico
  timeline: [{
    action: String,
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],

  // Notificações
  notificationsSent: {
    created: {
      sent: Boolean,
      sentAt: Date,
    },
    statusChanged: {
      sent: Boolean,
      sentAt: Date,
    },
    resolved: {
      sent: Boolean,
      sentAt: Date,
    },
  },

  // Metadados
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  
  isPublic: {
    type: Boolean,
    default: true,
  },

  views: {
    type: Number,
    default: 0,
  },

}, {
  timestamps: true,
});

// Índices
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ reporter: 1 });
complaintSchema.index({ type: 1 });
complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ 'address.neighborhood': 1 });

// Método: Adicionar ao timeline
complaintSchema.methods.addToTimeline = async function(action, description, userId) {
  this.timeline.push({
    action,
    description,
    user: userId,
    timestamp: new Date(),
  });
  await this.save();
};

// Método: Atribuir a um responsável
complaintSchema.methods.assignTo = async function(userId) {
  this.assignedTo = userId;
  this.assignedAt = new Date();
  await this.addToTimeline('atribuído', `Denúncia atribuída`, userId);
  await this.save();
};

// Método: Mudar status
complaintSchema.methods.changeStatus = async function(newStatus, userId) {
  const oldStatus = this.status;
  this.status = newStatus;
  await this.addToTimeline('status_mudado', `Status alterado de ${oldStatus} para ${newStatus}`, userId);
  await this.save();
};

// Método: Resolver denúncia
complaintSchema.methods.resolve = async function(notes, actions, userId) {
  this.status = 'resolvida';
  this.resolution = {
    status: 'resolvida',
    notes,
    actions,
    resolvedBy: userId,
    resolvedAt: new Date(),
  };
  await this.addToTimeline('resolvido', 'Denúncia marcada como resolvida', userId);
  await this.save();
};

// Método: Rejeitar denúncia
complaintSchema.methods.reject = async function(reason, userId) {
  this.status = 'rejeitada';
  this.rejection = {
    reason,
    rejectedBy: userId,
    rejectedAt: new Date(),
  };
  await this.addToTimeline('rejeitado', `Denúncia rejeitada: ${reason}`, userId);
  await this.save();
};

// Método estático: Estatísticas
complaintSchema.statics.getStatistics = async function(filters = {}) {
  const match = {};
  
  if (filters.startDate || filters.endDate) {
    match.createdAt = {};
    if (filters.startDate) match.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) match.createdAt.$lte = new Date(filters.endDate);
  }

  if (filters.neighborhood) {
    match['address.neighborhood'] = filters.neighborhood;
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pendentes: {
          $sum: { $cond: [{ $eq: ['$status', 'pendente'] }, 1, 0] }
        },
        emAndamento: {
          $sum: { $cond: [{ $eq: ['$status', 'em-andamento'] }, 1, 0] }
        },
        resolvidas: {
          $sum: { $cond: [{ $eq: ['$status', 'resolvida'] }, 1, 0] }
        },
        rejeitadas: {
          $sum: { $cond: [{ $eq: ['$status', 'rejeitada'] }, 1, 0] }
        },
        avgResolutionTime: {
          $avg: {
            $cond: [
              { $eq: ['$status', 'resolvida'] },
              {
                $divide: [
                  { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24 // Converter para dias
                ]
              },
              null
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        pendentes: 1,
        emAndamento: 1,
        resolvidas: 1,
        rejeitadas: 1,
        avgResolutionTime: { $round: ['$avgResolutionTime', 2] },
        percentualResolvido: {
          $round: [
            { $multiply: [{ $divide: ['$resolvidas', '$total'] }, 100] },
            2
          ]
        }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    pendentes: 0,
    emAndamento: 0,
    resolvidas: 0,
    rejeitadas: 0,
    avgResolutionTime: 0,
    percentualResolvido: 0
  };
};

// Método estático: Por tipo
complaintSchema.statics.getByType = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        pendentes: {
          $sum: { $cond: [{ $eq: ['$status', 'pendente'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        count: 1,
        pendentes: 1
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Método estático: Por bairro
complaintSchema.statics.getByNeighborhood = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$address.neighborhood',
        count: { $sum: 1 },
        pendentes: {
          $sum: { $cond: [{ $eq: ['$status', 'pendente'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        neighborhood: '$_id',
        count: 1,
        pendentes: 1
      }
    },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Complaint', complaintSchema);
