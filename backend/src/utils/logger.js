const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Criar diretório de logs se não existir
const logDir = process.env.LOG_FILE_PATH || './logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Definir formato customizado
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Configurar transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      customFormat
    ),
  }),
  
  // Arquivo de erro
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: customFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Arquivo combinado
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: customFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Criar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports,
  exitOnError: false,
});

// Stream para Morgan (HTTP logging)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Métodos auxiliares
logger.logRequest = (req) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
};

logger.logError = (error, req = null) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    ...(req && {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user?.id,
    }),
  };
  
  logger.error(JSON.stringify(errorInfo, null, 2));
};

logger.logAuth = (action, userId, success = true) => {
  const level = success ? 'info' : 'warn';
  logger[level](`AUTH: ${action} - User: ${userId} - Success: ${success}`);
};

logger.logDatabase = (operation, collection, success = true) => {
  const level = success ? 'info' : 'error';
  logger[level](`DB: ${operation} on ${collection} - Success: ${success}`);
};

logger.logSocket = (event, userId, data = {}) => {
  logger.info(`SOCKET: ${event} - User: ${userId} - Data: ${JSON.stringify(data)}`);
};

module.exports = logger;
