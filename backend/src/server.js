// Carregar variáveis de ambiente
const path = require('path');
const envPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

// Verificar se variáveis críticas estão carregadas
if (!process.env.MONGODB_URI) {
  console.error('❌ ERRO: MONGODB_URI não foi carregado do arquivo .env');
  console.error('   Arquivo .env procurado em:', envPath);
  console.error('   Arquivo existe?', require('fs').existsSync(envPath));
  process.exit(1);
}

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const { initializeSocket } = require('./config/socket');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Importar rotas (serão criadas em seguida)
// const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin');
// const collectorRoutes = require('./routes/collector');
// const citizenRoutes = require('./routes/citizen');
// const publicRoutes = require('./routes/public');

// Inicializar Express
const app = express();
const server = http.createServer(app);

// Conectar ao banco de dados
connectDB();

// Inicializar Socket.io
initializeSocket(server);

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-2fa-token'],
}));

// Compressão de respostas
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting em todas as rotas
app.use('/api/', limiter);

// Rate limiting mais restritivo para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: {
    success: false,
    message: 'Muitas tentativas de login, tente novamente em 15 minutos.',
  },
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API do Sistema de Coleta de Lixo Verde - Itacoatiara-AM',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      collector: '/api/collector',
      citizen: '/api/citizen',
      public: '/api/public',
    },
  });
});

// Importar rotas
const authRoutes = require('./routes/auth');
const citizenRoutes = require('./routes/citizen');
const collectorRoutes = require('./routes/collector');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

// Rotas da API
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/admin', adminRoutes);

// Rota temporária de teste
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente!',
    timestamp: new Date().toISOString(),
  });
});

// Middleware de rota não encontrada
app.use(notFound);

// Middleware de tratamento de erros
app.use(errorHandler);

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Iniciar servidor
server.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando em modo ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 URL: http://localhost:${PORT}`);
  logger.info(`📡 Socket.io inicializado`);
  logger.info(`💾 MongoDB conectado`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  
  // Fechar servidor gracefully
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  
  // Fechar servidor gracefully
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, fechando servidor gracefully...');
  
  server.close(() => {
    logger.info('Servidor fechado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, fechando servidor gracefully...');
  
  server.close(() => {
    logger.info('Servidor fechado');
    process.exit(0);
  });
});

module.exports = { app, server };
