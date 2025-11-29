const User = require('../models/User');
const { 
  generateToken, 
  generateRefreshToken,
  generate2FASecret,
  generate2FAQRCode,
  verify2FAToken,
  validatePasswordStrength 
} = require('../config/auth');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public (para cidadãos) / Admin (para coletores)
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, address } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email já está em uso', 409);
    }

    // Validar força da senha
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new AppError('Senha fraca', 400, { errors: passwordValidation.errors });
    }

    // Apenas admin pode criar coletores
    if (role === 'collector' || role === 'admin') {
      if (!req.user || req.user.role !== 'admin') {
        throw new AppError('Apenas administradores podem criar coletores', 403);
      }
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'citizen',
      address,
      createdBy: req.user?._id,
    });

    // Gerar tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Salvar refresh token
    user.refreshToken = refreshToken;
    await user.save();

    logger.logAuth('User registered', user._id, true);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: user.toSafeObject(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    console.log('🚀 LOGIN START:', { email: req.body.email });
    
    const { email, password, twoFactorToken } = req.body;

    // Buscar usuário com senha
    const user = await User.findOne({ email }).select('+password');
    console.log('📦 USER FOUND:', { found: !!user });
    
    // DEBUG: Log temporário
    console.log('🔍 DEBUG LOGIN:', {
      email,
      userFound: !!user,
      hasPassword: user ? !!user.password : false,
      passwordLength: password ? password.length : 0,
      isLocked: user ? user.isLocked : false,
    });
    
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar se conta está bloqueada
    if (user.isLocked) {
      throw new AppError('Conta temporariamente bloqueada', 403, {
        lockUntil: user.lockUntil,
      });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    
    // DEBUG: Log resultado
    console.log('🔍 DEBUG comparePassword:', {
      email,
      isPasswordValid,
      hashPreview: user.password ? user.password.substring(0, 20) + '...' : 'N/A',
    });
    
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      logger.logAuth('Login failed - invalid password', user._id, false);
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar 2FA se habilitado
    if (user.twoFactorAuth?.enabled) {
      if (!twoFactorToken) {
        return res.status(200).json({
          success: true,
          message: 'Token 2FA necessário',
          requires2FA: true,
        });
      }

      const is2FAValid = verify2FAToken(twoFactorToken, user.twoFactorAuth.secret);
      
      if (!is2FAValid) {
        logger.logAuth('Login failed - invalid 2FA', user._id, false);
        throw new AppError('Token 2FA inválido', 401);
      }
    }

    // Resetar tentativas de login
    await user.resetLoginAttempts();

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Salvar refresh token
    user.refreshToken = refreshToken;
    await user.save();

    logger.logAuth('Login successful', user._id, true);

    console.log('✅ LOGIN SUCCESS:', { userId: user._id, role: user.role });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: user.toSafeObject(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error.message, error.stack);
    next(error);
  }
};

// @desc    Logout de usuário
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    logger.logAuth('Logout', req.userId, true);

    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const user = req.user;

    // Gerar novos tokens
    const token = generateToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    // Atualizar refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      message: 'Token atualizado com sucesso',
      data: {
        token,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter usuário atual
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar perfil
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, preferences, notifications } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Atualizar campos permitidos
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (notifications) user.notifications = { ...user.notifications, ...notifications };

    user.updatedBy = req.userId;
    await user.save();

    logger.info(`Profile updated: User ${req.userId}`);

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Alterar senha
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select('+password');
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verificar senha atual
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      throw new AppError('Senha atual incorreta', 401);
    }

    // Validar nova senha
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new AppError('Nova senha fraca', 400, { errors: passwordValidation.errors });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    logger.logAuth('Password changed', user._id, true);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Habilitar 2FA
// @route   POST /api/auth/enable-2fa
// @access  Private (Admin only)
const enable2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (user.role !== 'admin') {
      throw new AppError('2FA disponível apenas para administradores', 403);
    }

    if (user.twoFactorAuth?.enabled) {
      throw new AppError('2FA já está habilitado', 400);
    }

    // Gerar secret 2FA
    const { secret, otpauthUrl } = generate2FASecret(user.email);
    
    // Gerar QR Code
    const qrCode = await generate2FAQRCode(otpauthUrl);

    // Salvar secret (ainda não habilitado)
    user.twoFactorAuth = {
      enabled: false,
      secret,
    };
    await user.save();

    logger.logAuth('2FA setup initiated', user._id, true);

    res.json({
      success: true,
      message: '2FA configurado. Escaneie o QR Code e confirme com um token',
      data: {
        qrCode,
        secret,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirmar e ativar 2FA
// @route   POST /api/auth/verify-2fa
// @access  Private (Admin only)
const verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (!user.twoFactorAuth?.secret) {
      throw new AppError('2FA não foi configurado', 400);
    }

    // Verificar token
    const isValid = verify2FAToken(token, user.twoFactorAuth.secret);
    
    if (!isValid) {
      throw new AppError('Token 2FA inválido', 401);
    }

    // Ativar 2FA
    user.twoFactorAuth.enabled = true;
    await user.save();

    logger.logAuth('2FA enabled', user._id, true);

    res.json({
      success: true,
      message: '2FA ativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Desabilitar 2FA
// @route   POST /api/auth/disable-2fa
// @access  Private (Admin only)
const disable2FA = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findById(req.userId).select('+password');
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new AppError('Senha incorreta', 401);
    }

    // Verificar token 2FA
    if (user.twoFactorAuth?.enabled) {
      const isValid = verify2FAToken(token, user.twoFactorAuth.secret);
      
      if (!isValid) {
        throw new AppError('Token 2FA inválido', 401);
      }
    }

    // Desabilitar 2FA
    user.twoFactorAuth = {
      enabled: false,
      secret: null,
    };
    await user.save();

    logger.logAuth('2FA disabled', user._id, true);

    res.json({
      success: true,
      message: '2FA desabilitado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  enable2FA,
  verify2FA,
  disable2FA,
};
