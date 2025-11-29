const { body, param, query, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Middleware para processar resultados de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
    
    return res.status(400).json({
      success: false,
      message: 'Erros de validação',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  
  next();
};

// Validações para autenticação
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'),
  
  body('role')
    .optional()
    .isIn(['admin', 'collector', 'citizen']).withMessage('Role inválido'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/).withMessage('Telefone inválido'),
  
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .toLowerCase(),
  
  body('password')
    .notEmpty().withMessage('Senha é obrigatória'),
  
  handleValidationErrors,
];

// Validações para pontos de coleta
const validateCreatePoint = [
  body('address.street')
    .trim()
    .notEmpty().withMessage('Rua é obrigatória'),
  
  body('address.number')
    .trim()
    .notEmpty().withMessage('Número é obrigatório'),
  
  body('address.neighborhood')
    .trim()
    .notEmpty().withMessage('Bairro é obrigatório'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Coordenadas devem ser um array [longitude, latitude]')
    .custom((value) => {
      const [lng, lat] = value;
      if (lng < -180 || lng > 180) {
        throw new Error('Longitude inválida');
      }
      if (lat < -90 || lat > 90) {
        throw new Error('Latitude inválida');
      }
      return true;
    }),
  
  body('wasteType')
    .notEmpty().withMessage('Tipo de resíduo é obrigatório')
    .isIn(['folhas', 'galhos', 'grama', 'flores', 'frutas', 'vegetais', 'outros'])
    .withMessage('Tipo de resíduo inválido'),
  
  body('estimatedQuantity.value')
    .isFloat({ min: 0 }).withMessage('Quantidade deve ser um número positivo'),
  
  body('estimatedQuantity.unit')
    .optional()
    .isIn(['kg', 'sacos', 'm3']).withMessage('Unidade inválida'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
  
  body('citizenName')
    .trim()
    .notEmpty().withMessage('Nome do cidadão é obrigatório'),
  
  body('citizenPhone')
    .trim()
    .notEmpty().withMessage('Telefone do cidadão é obrigatório')
    .matches(/^\+?[\d\s-()]+$/).withMessage('Telefone inválido'),
  
  handleValidationErrors,
];

const validateUpdatePointStatus = [
  body('status')
    .notEmpty().withMessage('Status é obrigatório')
    .isIn(['pending', 'scheduled', 'in_progress', 'collected', 'cancelled'])
    .withMessage('Status inválido'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notas devem ter no máximo 500 caracteres'),
  
  handleValidationErrors,
];

// Validações para rotas
const validateCreateRoute = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome da rota é obrigatório'),
  
  body('collector')
    .notEmpty().withMessage('Coletor é obrigatório')
    .isMongoId().withMessage('ID do coletor inválido'),
  
  body('scheduledDate')
    .notEmpty().withMessage('Data agendada é obrigatória')
    .isISO8601().withMessage('Data inválida'),
  
  body('startTime')
    .notEmpty().withMessage('Horário de início é obrigatório')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário inválido (formato: HH:mm)'),
  
  body('points')
    .isArray({ min: 1 }).withMessage('Deve haver pelo menos um ponto na rota'),
  
  body('points.*.point')
    .isMongoId().withMessage('ID do ponto inválido'),
  
  body('points.*.order')
    .isInt({ min: 1 }).withMessage('Ordem deve ser um número inteiro positivo'),
  
  handleValidationErrors,
];

const validateUpdateRoute = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Nome não pode ser vazio'),
  
  body('scheduledDate')
    .optional()
    .isISO8601().withMessage('Data inválida'),
  
  body('startTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário inválido'),
  
  body('status')
    .optional()
    .isIn(['draft', 'scheduled', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status inválido'),
  
  handleValidationErrors,
];

// Validações para check-in
const validateCheckIn = [
  body('collectionPoint')
    .notEmpty().withMessage('Ponto de coleta é obrigatório')
    .isMongoId().withMessage('ID do ponto inválido'),
  
  body('route')
    .notEmpty().withMessage('Rota é obrigatória')
    .isMongoId().withMessage('ID da rota inválido'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 }).withMessage('Coordenadas devem ser um array [longitude, latitude]'),
  
  body('wasteCollected.quantity.value')
    .isFloat({ min: 0 }).withMessage('Quantidade deve ser um número positivo'),
  
  body('wasteCollected.quantity.unit')
    .optional()
    .isIn(['kg', 'sacos', 'm3']).withMessage('Unidade inválida'),
  
  body('status')
    .optional()
    .isIn(['completed', 'partial', 'failed', 'skipped']).withMessage('Status inválido'),
  
  handleValidationErrors,
];

// Validações para relatórios
const validateCreateReport = [
  body('title')
    .trim()
    .notEmpty().withMessage('Título é obrigatório'),
  
  body('type')
    .notEmpty().withMessage('Tipo de relatório é obrigatório')
    .isIn([
      'daily', 'weekly', 'monthly', 'annual', 'custom',
      'collector_performance', 'route_efficiency', 'waste_statistics', 'environmental_impact'
    ]).withMessage('Tipo de relatório inválido'),
  
  body('period.startDate')
    .notEmpty().withMessage('Data inicial é obrigatória')
    .isISO8601().withMessage('Data inicial inválida'),
  
  body('period.endDate')
    .notEmpty().withMessage('Data final é obrigatória')
    .isISO8601().withMessage('Data final inválida')
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.period.startDate)) {
        throw new Error('Data final deve ser posterior à data inicial');
      }
      return true;
    }),
  
  handleValidationErrors,
];

// Validações para usuários
const validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/).withMessage('Telefone inválido'),
  
  body('role')
    .optional()
    .isIn(['admin', 'collector', 'citizen']).withMessage('Role inválido'),
  
  handleValidationErrors,
];

// Validações para parâmetros de ID
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`${paramName} inválido`),
  
  handleValidationErrors,
];

// Validações para queries de paginação
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limite deve ser entre 1 e 100'),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc', '1', '-1']).withMessage('Ordenação inválida'),
  
  handleValidationErrors,
];

// Validações para filtros de data
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Data inicial inválida'),
  
  query('endDate')
    .optional()
    .isISO8601().withMessage('Data final inválida')
    .custom((endDate, { req }) => {
      if (req.query.startDate && new Date(endDate) < new Date(req.query.startDate)) {
        throw new Error('Data final deve ser posterior à data inicial');
      }
      return true;
    }),
  
  handleValidationErrors,
];

// Validação para coordenadas geográficas
const validateCoordinates = [
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude inválida'),
  
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude inválida'),
  
  query('radius')
    .optional()
    .isFloat({ min: 0 }).withMessage('Raio deve ser um número positivo'),
  
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateCreatePoint,
  validateUpdatePointStatus,
  validateCreateRoute,
  validateUpdateRoute,
  validateCheckIn,
  validateCreateReport,
  validateUpdateUser,
  validateMongoId,
  validatePagination,
  validateDateRange,
  validateCoordinates,
};
