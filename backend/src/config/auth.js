const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Configurações JWT
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_EXPIRE || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
};

// Gerar token JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      id: userId, 
      role: role 
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
};

// Gerar refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );
};

// Verificar token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};

// Verificar refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret);
  } catch (error) {
    throw new Error('Refresh token inválido ou expirado');
  }
};

// Gerar secret para 2FA
const generate2FASecret = (email) => {
  const secret = speakeasy.generateSecret({
    name: `${process.env.TWO_FACTOR_APP_NAME} (${email})`,
    length: 32,
  });
  
  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};

// Gerar QR Code para 2FA
const generate2FAQRCode = async (otpauthUrl) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error('Erro ao gerar QR Code');
  }
};

// Verificar token 2FA
const verify2FAToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2, // Permite 2 intervalos de tempo antes e depois
  });
};

// Gerar token de recuperação de senha
const generatePasswordResetToken = () => {
  return jwt.sign(
    { purpose: 'password-reset' },
    jwtConfig.secret,
    { expiresIn: '1h' }
  );
};

// Configurações de segurança
const securityConfig = {
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos em ms
  passwordMinLength: 8,
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
};

// Validar força da senha
const validatePasswordStrength = (password) => {
  const { passwordRequirements } = securityConfig;
  const errors = [];

  if (password.length < passwordRequirements.minLength) {
    errors.push(`Senha deve ter no mínimo ${passwordRequirements.minLength} caracteres`);
  }

  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }

  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }

  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }

  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  jwtConfig,
  securityConfig,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generate2FASecret,
  generate2FAQRCode,
  verify2FAToken,
  generatePasswordResetToken,
  validatePasswordStrength,
};
