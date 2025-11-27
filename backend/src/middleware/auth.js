const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  try {
    // Obter token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    // Buscar usuário
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada',
      });
    }

    // Verificar se conta está bloqueada
    if (user.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Conta temporariamente bloqueada devido a múltiplas tentativas de login',
        lockUntil: user.lockUntil,
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    logger.logAuth('Token validated', user._id, true);
    next();
  } catch (error) {
    logger.error(`Erro na autenticação: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor',
    });
  }
};

// Middleware opcional de autenticação (não retorna erro se não autenticado)
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive && !user.isLocked) {
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;
      }
    } catch (error) {
      // Silenciosamente ignora erros de token
    }

    next();
  } catch (error) {
    next();
  }
};

// Middleware de verificação de 2FA
const require2FA = async (req, res, next) => {
  try {
    const user = req.user;

    // Se 2FA não está habilitado, prosseguir
    if (!user.twoFactorAuth?.enabled) {
      return next();
    }

    // Verificar se token 2FA foi fornecido
    const twoFactorToken = req.headers['x-2fa-token'];
    
    if (!twoFactorToken) {
      return res.status(403).json({
        success: false,
        message: 'Token 2FA necessário',
        code: '2FA_REQUIRED',
      });
    }

    // Verificar token 2FA
    const speakeasy = require('speakeasy');
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret,
      encoding: 'base32',
      token: twoFactorToken,
      window: 2,
    });

    if (!isValid) {
      logger.logAuth('2FA verification failed', user._id, false);
      return res.status(403).json({
        success: false,
        message: 'Token 2FA inválido',
      });
    }

    logger.logAuth('2FA verified', user._id, true);
    next();
  } catch (error) {
    logger.error(`Erro na verificação 2FA: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar 2FA',
    });
  }
};

// Middleware de verificação de refresh token
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token não fornecido',
      });
    }

    // Verificar refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido ou expirado',
      });
    }

    // Buscar usuário e verificar se o refresh token corresponde
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada',
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    logger.error(`Erro na verificação do refresh token: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor',
    });
  }
};

// Middleware para verificar se email foi verificado
const requireEmailVerified = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email não verificado. Por favor, verifique seu email.',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }
  next();
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  require2FA,
  verifyRefreshToken,
  requireEmailVerified,
};
