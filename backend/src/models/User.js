const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter no mínimo 3 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [8, 'Senha deve ter no mínimo 8 caracteres'],
    select: false, // Não retornar senha por padrão
  },
  role: {
    type: String,
    enum: ['admin', 'coletor', 'user'],
    default: 'user',
    required: true,
  },
  cpf: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    match: [/^\d{11}$/, 'CPF deve conter 11 dígitos'],
  },
  photo: {
    type: String, // URL da foto
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Telefone inválido'],
  },
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
    zipCode: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
  },
  
  // Campos específicos para coletores
  collectorInfo: {
    vehicleId: String,
    vehiclePlate: String,
    vehicleType: {
      type: String,
      enum: ['truck', 'van', 'motorcycle', 'other'],
    },
    licenseNumber: String,
    currentRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalCollections: {
      type: Number,
      default: 0,
    },
    totalKilometers: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    lastLocation: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    lastLocationUpdate: Date,
  },

  // Autenticação 2FA (apenas para admins)
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false,
    },
    secret: String,
    backupCodes: [String],
  },

  // Notificações
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: false,
    },
    whatsapp: {
      type: Boolean,
      default: false,
    },
    push: {
      type: Boolean,
      default: true,
    },
  },

  // Preferências
  preferences: {
    language: {
      type: String,
      default: 'pt-BR',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },

  // Segurança
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  
  // Refresh token
  refreshToken: String,

  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  
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
// `email` já tem `unique: true` na definição do campo; evitar definição duplicada de índice
userSchema.index({ role: 1 });
userSchema.index({ 'address.location': '2dsphere' });
userSchema.index({ 'collectorInfo.lastLocation': '2dsphere' });

// Virtual para verificar se conta está bloqueada
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Middleware: Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  // Só fazer hash se a senha foi modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método: Comparar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erro ao comparar senhas');
  }
};

// Método: Incrementar tentativas de login
userSchema.methods.incrementLoginAttempts = async function() {
  // Se já passou o tempo de bloqueio, resetar
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 15 * 60 * 1000; // 15 minutos

  // Bloquear conta após máximo de tentativas
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

// Método: Resetar tentativas de login
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Método: Gerar objeto JSON seguro (sem senha)
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.twoFactorAuth?.secret;
  delete obj.twoFactorAuth?.backupCodes;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.emailVerificationToken;
  return obj;
};

// Método estático: Buscar por email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Método estático: Buscar coletores ativos
userSchema.statics.findActiveCollectors = function() {
  return this.find({
    role: 'coletor',
    isActive: true,
    'collectorInfo.isActive': true,
  });
};

// Método estático: Verificar se é admin específico
userSchema.statics.isSpecificAdmin = function(email) {
  const adminEmails = [
    'wamber.pacheco.12@gmail.com',
    'apgxavier@gmail.com'
  ];
  return adminEmails.includes(email.toLowerCase());
};

// Método: Verificar se é admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Método: Verificar se é coletor
userSchema.methods.isColetor = function() {
  return this.role === 'coletor';
};

// Método: Verificar se é usuário comum
userSchema.methods.isUser = function() {
  return this.role === 'user';
};

const User = mongoose.model('User', userSchema);

module.exports = User;
