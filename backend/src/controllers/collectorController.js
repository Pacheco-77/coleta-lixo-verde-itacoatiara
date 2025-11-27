const CollectionPoint = require('../models/CollectionPoint');
const Route = require('../models/Route');
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { emitToAdmins, emitToUser } = require('../config/socket');
const { calculateDistance } = require('../utils/helpers');

// @desc    Obter rota atual do coletor
// @route   GET /api/collector/current-route
// @access  Private (Collector)
const getCurrentRoute = async (req, res, next) => {
  try {
    const collector = await User.findById(req.userId);
    
    if (!collector || !collector.collectorInfo?.currentRoute) {
      return res.json({
        success: true,
        data: {
          route: null,
          message: 'Nenhuma rota ativa no momento',
        },
      });
    }

    const route = await Route.findById(collector.collectorInfo.currentRoute)
      .populate('collectionPoints')
      .populate('assignedCollector', 'name phone collectorInfo');

    if (!route) {
      throw new AppError('Rota não encontrada', 404);
    }

    // Calcular rota otimizada
    const optimizedPoints = route.collectionPoints.sort((a, b) => {
      // Ordenar por urgência e depois por proximidade
      if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
      if (a.urgency !== 'urgent' && b.urgency === 'urgent') return 1;
      return 0;
    });

    res.json({
      success: true,
      data: {
        route: {
          ...route.toObject(),
          optimizedPoints,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Realizar check-in em ponto de coleta
// @route   POST /api/collector/checkin/:pointId
// @access  Private (Collector)
const checkInPoint = async (req, res, next) => {
  try {
    const { pointId } = req.params;
    const { location, notes, photos, actualWeight } = req.body;

    const collectionPoint = await CollectionPoint.findById(pointId);
    
    if (!collectionPoint) {
      throw new AppError('Ponto de coleta não encontrado', 404);
    }

    if (collectionPoint.status === 'collected') {
      throw new AppError('Este ponto já foi coletado', 400);
    }

    // Criar registro de check-in
    const checkIn = await CheckIn.create({
      collectionPoint: pointId,
      collector: req.userId,
      location: {
        type: 'Point',
        coordinates: location.coordinates,
      },
      notes,
      photos,
      actualWeight,
    });

    // Atualizar ponto de coleta
    collectionPoint.status = 'collected';
    collectionPoint.collectedAt = new Date();
    collectionPoint.actualWeight = actualWeight;
    await collectionPoint.save();

    // Atualizar estatísticas do coletor
    const collector = await User.findById(req.userId);
    collector.collectorInfo.totalCollections += 1;
    await collector.save();

    // Notificar administradores em tempo real
    emitToAdmins('collection:updated', {
      pointId: collectionPoint._id,
      collectorId: req.userId,
      status: 'collected',
      timestamp: new Date(),
      location: location,
      actualWeight,
    });

    // Notificar cidadão
    if (collectionPoint.citizen) {
      emitToUser(collectionPoint.citizen, 'point:collected', {
        pointId: collectionPoint._id,
        collectedAt: new Date(),
        collector: collector.name,
      });
    }

    logger.info(`Check-in completed: Point ${pointId} by collector ${req.userId}`);

    res.json({
      success: true,
      message: 'Check-in realizado com sucesso',
      data: {
        checkIn,
        collectionPoint,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar localização do coletor
// @route   POST /api/collector/location
// @access  Private (Collector)
const updateLocation = async (req, res, next) => {
  try {
    const { coordinates } = req.body;

    const collector = await User.findById(req.userId);
    
    if (!collector) {
      throw new AppError('Coletor não encontrado', 404);
    }

    // Atualizar localização
    collector.collectorInfo.lastLocation = {
      type: 'Point',
      coordinates,
    };
    collector.collectorInfo.lastLocationUpdate = new Date();
    await collector.save();

    // Emitir localização para admins em tempo real
    emitToAdmins('collector:location', {
      collectorId: req.userId,
      location: {
        type: 'Point',
        coordinates,
      },
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: 'Localização atualizada',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Iniciar rota
// @route   POST /api/collector/routes/:routeId/start
// @access  Private (Collector)
const startRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;
    const { startLocation } = req.body;

    const route = await Route.findOne({
      _id: routeId,
      assignedCollector: req.userId,
    });

    if (!route) {
      throw new AppError('Rota não encontrada ou não atribuída a você', 404);
    }

    if (route.status !== 'scheduled') {
      throw new AppError('Esta rota não pode ser iniciada', 400);
    }

    // Atualizar rota
    route.status = 'in_progress';
    route.startedAt = new Date();
    route.startLocation = {
      type: 'Point',
      coordinates: startLocation.coordinates,
    };
    await route.save();

    // Atualizar pontos de coleta
    await CollectionPoint.updateMany(
      { _id: { $in: route.collectionPoints } },
      { status: 'in_progress' }
    );

    // Notificar admins
    emitToAdmins('route:started', {
      routeId: route._id,
      collectorId: req.userId,
      timestamp: new Date(),
    });

    logger.info(`Route started: ${routeId} by collector ${req.userId}`);

    res.json({
      success: true,
      message: 'Rota iniciada com sucesso',
      data: {
        route,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Finalizar rota
// @route   POST /api/collector/routes/:routeId/complete
// @access  Private (Collector)
const completeRoute = async (req, res, next) => {
  try {
    const { routeId } = req.params;
    const { endLocation, totalDistance, notes } = req.body;

    const route = await Route.findOne({
      _id: routeId,
      assignedCollector: req.userId,
    }).populate('collectionPoints');

    if (!route) {
      throw new AppError('Rota não encontrada', 404);
    }

    if (route.status !== 'in_progress') {
      throw new AppError('Esta rota não está em andamento', 400);
    }

    // Verificar se todos os pontos foram coletados
    const pendingPoints = route.collectionPoints.filter(
      point => point.status !== 'collected' && point.status !== 'cancelled'
    );

    if (pendingPoints.length > 0) {
      throw new AppError(
        `Ainda há ${pendingPoints.length} ponto(s) pendente(s) de coleta`,
        400
      );
    }

    // Calcular tempo total
    const totalTime = (new Date() - route.startedAt) / 1000 / 60; // em minutos

    // Atualizar rota
    route.status = 'completed';
    route.completedAt = new Date();
    route.endLocation = {
      type: 'Point',
      coordinates: endLocation.coordinates,
    };
    route.actualDistance = totalDistance;
    route.actualTime = totalTime;
    route.notes = notes;
    await route.save();

    // Atualizar estatísticas do coletor
    const collector = await User.findById(req.userId);
    collector.collectorInfo.totalKilometers += totalDistance;
    collector.collectorInfo.currentRoute = null;
    await collector.save();

    // Notificar admins
    emitToAdmins('route:completed', {
      routeId: route._id,
      collectorId: req.userId,
      totalDistance,
      totalTime,
      timestamp: new Date(),
    });

    logger.info(`Route completed: ${routeId} by collector ${req.userId}`);

    res.json({
      success: true,
      message: 'Rota finalizada com sucesso',
      data: {
        route,
        summary: {
          totalPoints: route.collectionPoints.length,
          totalDistance,
          totalTime: Math.round(totalTime),
          averageTimePerPoint: Math.round(totalTime / route.collectionPoints.length),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter histórico de rotas do coletor
// @route   GET /api/collector/routes/history
// @access  Private (Collector)
const getRouteHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const query = {
      assignedCollector: req.userId,
      status: 'completed',
    };

    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) query.completedAt.$gte = new Date(startDate);
      if (endDate) query.completedAt.$lte = new Date(endDate);
    }

    const routes = await Route.find(query)
      .populate('collectionPoints', 'address wasteType actualWeight')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Route.countDocuments(query);

    // Calcular estatísticas
    const stats = await Route.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRoutes: { $sum: 1 },
          totalDistance: { $sum: '$actualDistance' },
          totalTime: { $sum: '$actualTime' },
          avgDistance: { $avg: '$actualDistance' },
          avgTime: { $avg: '$actualTime' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        routes,
        statistics: stats[0] || {},
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter métricas do coletor
// @route   GET /api/collector/metrics
// @access  Private (Collector)
const getCollectorMetrics = async (req, res, next) => {
  try {
    const collector = await User.findById(req.userId);

    // Estatísticas do dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = await Route.aggregate([
      {
        $match: {
          assignedCollector: req.userId,
          completedAt: { $gte: today },
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          routesToday: { $sum: 1 },
          distanceToday: { $sum: '$actualDistance' },
          timeToday: { $sum: '$actualTime' },
        },
      },
    ]);

    // Estatísticas do mês
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthStats = await Route.aggregate([
      {
        $match: {
          assignedCollector: req.userId,
          completedAt: { $gte: startOfMonth },
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          routesMonth: { $sum: 1 },
          distanceMonth: { $sum: '$actualDistance' },
          timeMonth: { $sum: '$actualTime' },
        },
      },
    ]);

    // Check-ins do dia
    const checkInsToday = await CheckIn.countDocuments({
      collector: req.userId,
      createdAt: { $gte: today },
    });

    res.json({
      success: true,
      data: {
        overall: {
          totalCollections: collector.collectorInfo.totalCollections,
          totalKilometers: collector.collectorInfo.totalKilometers,
          rating: collector.collectorInfo.rating,
        },
        today: {
          routes: todayStats[0]?.routesToday || 0,
          distance: todayStats[0]?.distanceToday || 0,
          time: todayStats[0]?.timeToday || 0,
          checkIns: checkInsToday,
        },
        month: {
          routes: monthStats[0]?.routesMonth || 0,
          distance: monthStats[0]?.distanceMonth || 0,
          time: monthStats[0]?.timeMonth || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reportar problema
// @route   POST /api/collector/report-issue
// @access  Private (Collector)
const reportIssue = async (req, res, next) => {
  try {
    const { type, description, location, pointId } = req.body;

    // Notificar admins imediatamente
    emitToAdmins('emergency:alert', {
      collectorId: req.userId,
      type,
      description,
      location,
      pointId,
      timestamp: new Date(),
    });

    logger.warn(`Issue reported by collector ${req.userId}: ${type}`);

    res.json({
      success: true,
      message: 'Problema reportado com sucesso. Administradores foram notificados.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentRoute,
  checkInPoint,
  updateLocation,
  startRoute,
  completeRoute,
  getRouteHistory,
  getCollectorMetrics,
  reportIssue,
};
