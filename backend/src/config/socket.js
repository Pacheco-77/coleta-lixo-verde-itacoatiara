const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

let io;

// Inicializar Socket.io
const initializeSocket = (server) => {
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

  io = socketIO(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware de autenticação para Socket.io
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Token não fornecido'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      logger.info(`Socket conectado: User ${decoded.id} (${decoded.role})`);
      next();
    } catch (error) {
      logger.error(`Erro na autenticação do socket: ${error.message}`);
      next(new Error('Autenticação falhou'));
    }
  });

  // Eventos de conexão
  io.on('connection', (socket) => {
    logger.info(`Novo cliente conectado: ${socket.id}`);

    // Entrar em sala específica baseada no role
    socket.join(socket.userRole);
    
    // Se for coletor, entrar em sala específica do coletor
    if (socket.userRole === 'collector') {
      socket.join(`collector_${socket.userId}`);
    }

    // Se for admin, entrar em sala de administradores
    if (socket.userRole === 'admin') {
      socket.join('admins');
    }

    // Evento de check-in de coleta
    socket.on('collection:checkin', (data) => {
      logger.info(`Check-in recebido: ${JSON.stringify(data)}`);
      
      // Emitir para todos os admins
      io.to('admins').emit('collection:updated', {
        pointId: data.pointId,
        collectorId: socket.userId,
        status: 'collected',
        timestamp: new Date(),
        location: data.location,
      });

      // Confirmar para o coletor
      socket.emit('collection:checkin:success', {
        pointId: data.pointId,
        message: 'Check-in realizado com sucesso',
      });
    });

    // Evento de atualização de localização do coletor
    socket.on('collector:location:update', (data) => {
      // Emitir localização para admins
      io.to('admins').emit('collector:location', {
        collectorId: socket.userId,
        location: data.location,
        timestamp: new Date(),
      });
    });

    // Evento de nova rota atribuída
    socket.on('route:assigned', (data) => {
      // Notificar coletor específico
      io.to(`collector_${data.collectorId}`).emit('route:new', {
        routeId: data.routeId,
        points: data.points,
        message: 'Nova rota atribuída',
      });
    });

    // Evento de ponto de coleta adicionado
    socket.on('point:added', (data) => {
      // Notificar todos os coletores e admins
      io.to('collector').emit('point:new', data);
      io.to('admins').emit('point:new', data);
    });

    // Evento de emergência
    socket.on('emergency:alert', (data) => {
      logger.warn(`Alerta de emergência: ${JSON.stringify(data)}`);
      
      // Notificar todos os admins imediatamente
      io.to('admins').emit('emergency:alert', {
        collectorId: socket.userId,
        location: data.location,
        message: data.message,
        timestamp: new Date(),
      });
    });

    // Evento de desconexão
    socket.on('disconnect', (reason) => {
      logger.info(`Cliente desconectado: ${socket.id} - Razão: ${reason}`);
      
      // Notificar admins se for um coletor
      if (socket.userRole === 'collector') {
        io.to('admins').emit('collector:offline', {
          collectorId: socket.userId,
          timestamp: new Date(),
        });
      }
    });

    // Evento de erro
    socket.on('error', (error) => {
      logger.error(`Erro no socket ${socket.id}: ${error.message}`);
    });
  });

  logger.info('Socket.io inicializado com sucesso');
  return io;
};

// Obter instância do Socket.io
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io não foi inicializado');
  }
  return io;
};

// Emitir evento para sala específica
const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

// Emitir evento para usuário específico
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`collector_${userId}`).emit(event, data);
  }
};

// Emitir evento para todos os admins
const emitToAdmins = (event, data) => {
  if (io) {
    io.to('admins').emit(event, data);
  }
};

// Emitir evento para todos os coletores
const emitToCollectors = (event, data) => {
  if (io) {
    io.to('collector').emit(event, data);
  }
};

// Broadcast para todos os clientes conectados
const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToRoom,
  emitToUser,
  emitToAdmins,
  emitToCollectors,
  broadcast,
};
