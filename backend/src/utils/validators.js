// Validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar telefone brasileiro
const isValidPhone = (phone) => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se tem 10 ou 11 dígitos (com DDD)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Validar CPF
const isValidCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

// Validar CEP
const isValidCEP = (cep) => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

// Validar coordenadas geográficas
const isValidCoordinates = (longitude, latitude) => {
  return (
    typeof longitude === 'number' &&
    typeof latitude === 'number' &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
};

// Validar URL
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validar data
const isValidDate = (date) => {
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate);
};

// Validar se data está no futuro
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// Validar se data está no passado
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

// Validar horário (HH:mm)
const isValidTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Validar MongoDB ObjectId
const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Validar força da senha
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Senha deve ter no mínimo ${minLength} caracteres`);
  }
  if (!hasUpperCase) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  if (!hasLowerCase) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  if (!hasNumbers) {
    errors.push('Senha deve conter pelo menos um número');
  }
  if (!hasSpecialChar) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
  };
};

// Calcular força da senha (0-100)
const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  // Comprimento
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  
  // Complexidade
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;
  
  return Math.min(strength, 100);
};

// Sanitizar string (remover caracteres perigosos)
const sanitizeString = (str) => {
  return str
    .replace(/[<>]/g, '') // Remove < e >
    .trim();
};

// Validar quantidade de resíduo
const isValidWasteQuantity = (value, unit) => {
  const validUnits = ['kg', 'sacos', 'm3'];
  return (
    typeof value === 'number' &&
    value > 0 &&
    validUnits.includes(unit)
  );
};

// Validar tipo de resíduo
const isValidWasteType = (type) => {
  const validTypes = [
    'folhas',
    'galhos',
    'grama',
    'flores',
    'frutas',
    'vegetais',
    'outros',
  ];
  return validTypes.includes(type);
};

// Validar status de coleta
const isValidCollectionStatus = (status) => {
  const validStatuses = [
    'pending',
    'scheduled',
    'in_progress',
    'collected',
    'cancelled',
  ];
  return validStatuses.includes(status);
};

// Validar role de usuário
const isValidUserRole = (role) => {
  const validRoles = ['admin', 'collector', 'citizen'];
  return validRoles.includes(role);
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidCPF,
  isValidCEP,
  isValidCoordinates,
  isValidURL,
  isValidDate,
  isFutureDate,
  isPastDate,
  isValidTime,
  isValidObjectId,
  validatePasswordStrength,
  calculatePasswordStrength,
  sanitizeString,
  isValidWasteQuantity,
  isValidWasteType,
  isValidCollectionStatus,
  isValidUserRole,
};
