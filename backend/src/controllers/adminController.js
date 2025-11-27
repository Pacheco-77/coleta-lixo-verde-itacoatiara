const User = require('../models/User');
const CollectionPoint = require('../models/CollectionPoint');
const Route = require('../models/Route');
const CheckIn = require('../models/CheckIn');
const Report = require('../models/Report');
const logger = require('../utils/logger');
const { emitToUser } = require('../config/socket');
const { calculateDistance, optimizeRoute } = require('../utils/helpers');

// Dashboard - Estatísticas gerais
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    // Estatísticas gerais
    const [
      totalCollectors,
      activeCollectors,
      totalCitizens,
      totalPoints,
      pendingPoints,
      collectedPoints,
      totalRoutes,
      activeRoutes,
      todayCheckIns,
      weekCheckIns,
      monthCheckIns,
    ] = await Promise.all([
      User.countDocuments({ role: 'collector' }),
      User.countDocuments({ role: 'collector', 'collectorInfo.isActive': true }),
      User.countDocuments({ role: 'citizen' }),
      CollectionPoint.countDocuments(),
      CollectionPoint.countDocuments({ status: 'pending' }),
      CollectionPoint.countDocuments({ status: 'collected' }),
      Route.countDocuments(),
      Route.countDocuments({ status: 'in_progress' }),
      CheckIn.countDocuments({ createdAt: { $gte: today } }),
      CheckIn.countDocuments({ createdAt: { $gte: thisWeek } }),
      CheckIn.countDocuments({ createdAt: { $gte: thisMonth } }),
    ]);

    // Peso total coletado
    const weightStats = await CheckIn.aggregate([
      {
        $lookup: {
          from: 'collectionpoints',
          localField: 'collectionPoint',
          foreignField: '_id',
          as: 'point',
        },
      },
      { $unwind: '$point' },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$point.estimatedWeight' },
          todayWeight: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', today] }, '$point.estimatedWeight', 0],
            },
          },
          weekWeight: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', thisWeek] }, '$point.estimatedWeight', 0],
            },
          },
          monthWeight: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', thisMonth] }, '$point.estimatedWeight', 0],
            },
          },
        },
      },
    ]);

    // Quilometragem total
    const distanceStats = await Route.aggregate([
      {
        $group: {
          _id: null,
          totalDistance: { $sum: '$totalDistance' },
          todayDistance: {
            $sum: {
              $cond: [{ $gte: ['$startedAt', today] }, '$totalDistance', 0],
            },
          },
        },
      },
    ]);

    // Top coletores
    const topCollectors = await User.find({ role: 'collector' })
      .sort({ 'collectorInfo.totalCollections': -1 })
      .limit(5)
      .select('name collectorInfo.totalCollections collectorInfo.totalKilometers collectorInfo.rating');

    // Pontos por bairro
    const pointsByNeighborhood = await CollectionPoint.aggregate([
      {
        $group: {
          _id: '$address.neighborhood',
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          collected: {
            $sum: { $cond: [{ $eq: ['$status', 'collected'] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          collectors: {
            total: totalCollectors,
            active: activeCollectors,
          },
          citizens: totalCitizens,
          points: {
            total: totalPoints,
            pending: pendingPoints,
            collected: collectedPoints,
          },
          routes: {
            total: totalRoutes,
            active: activeRoutes,
          },
        },
        collections: {
          today: todayCheckIns,
          week: weekCheckIns,
          month: monthCheckIns,
        },
        weight: weightStats[0] || {
          totalWeight: 0,
          todayWeight: 0,
          weekWeight: 0,
          monthWeight: 0,
        },
        distance: distanceStats[0] || {
          totalDistance: 0,
          todayDistance: 0,
        },
        topCollectors,
        pointsByNeighborhood,
      },
    });
  } catch (error) {
    logger.error(`Erro ao buscar dashboard: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do dashboard',
    });
  }
};

// Mapa com todos os pontos
exports.getMapData = async (req, res) => {
  try {
    const { status, neighborhood } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (neighborhood) filter['address.neighborhood'] = neighborhood;

    const points = await CollectionPoint.find(filter)
      .populate('citizen', 'name phone')
      .populate('assignedRoute', 'name collector')
      .select('address wasteType estimatedWeight status scheduledDate');

    const collectors = await User.find({
      role: 'collector',
      'collectorInfo.isActive': true,
    }).select('name collectorInfo.lastLocation collectorInfo.currentRoute');

    res.json({
      success: true,
      data: {
        points,
        collectors,
      },
    });
  } catch (error) {
    logger.error(`Erro ao buscar dados do mapa: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do mapa',
    });
  }
};

// Gerenciar usuários
exports.getUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password -twoFactorAuth.secret -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error(`Erro ao buscar usuários: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários',
    });
  }
};

// Criar usuário (coletor)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, collectorInfo } = req.body;

    // Verificar se email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'collector',
      phone,
      createdBy: req.userId,
    };

    if (role === 'collector' && collectorInfo) {
      userData.collectorInfo = collectorInfo;
    }

    const user = await User.create(userData);

    logger.info(`Usuário criado: ${user._id} por admin ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: user.toSafeObject(),
    });
  } catch (error) {
    logger.error(`Erro ao criar usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
    });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Não permitir atualização de senha por aqui
    delete updates.password;
    delete updates.twoFactorAuth;

    updates.updatedBy = req.userId;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    logger.info(`Usuário atualizado: ${userId} por admin ${req.userId}`);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user.toSafeObject(),
    });
  } catch (error) {
    logger.error(`Erro ao atualizar usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário',
    });
  }
};

// Desativar/Ativar usuário
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    logger.info(`Status do usuário ${userId} alterado para ${user.isActive} por admin ${req.userId}`);

    res.json({
      success: true,
      message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso`,
      data: { isActive: user.isActive },
    });
  } catch (error) {
    logger.error(`Erro ao alterar status do usuário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar status do usuário',
    });
  }
};

// Gerenciar rotas
exports.getRoutes = async (req, res) => {
  try {
    const { status, collector, date } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (collector) filter.collector = collector;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.scheduledDate = { $gte: startDate, $lte: endDate };
    }

    const routes = await Route.find(filter)
      .populate('collector', 'name phone collectorInfo')
      .populate('points', 'address wasteType status')
      .sort({ scheduledDate: -1 });

    res.json({
      success: true,
      data: routes,
    });
  } catch (error) {
    logger.error(`Erro ao buscar rotas: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar rotas',
    });
  }
};

// Criar rota
exports.createRoute = async (req, res) => {
  try {
    const { name, collector, points, scheduledDate, description } = req.body;

    // Verificar se coletor existe e está ativo
    const collectorUser = await User.findOne({
      _id: collector,
      role: 'collector',
      'collectorInfo.isActive': true,
    });

    if (!collectorUser) {
      return res.status(400).json({
        success: false,
        message: 'Coletor não encontrado ou inativo',
      });
    }

    // Buscar pontos de coleta
    const collectionPoints = await CollectionPoint.find({
      _id: { $in: points },
      status: 'pending',
    });

    if (collectionPoints.length !== points.length) {
      return res.status(400).json({
        success: false,
        message: 'Alguns pontos de coleta não foram encontrados ou já foram coletados',
      });
    }

    // Otimizar rota
    const optimizedPoints = optimizeRoute(collectionPoints);

    // Calcular distância total estimada
    let totalDistance = 0;
    for (let i = 0; i < optimizedPoints.length - 1; i++) {
      const distance = calculateDistance(
        optimizedPoints[i].address.location.coordinates,
        optimizedPoints[i + 1].address.location.coordinates
      );
      totalDistance += distance;
    }

    const route = await Route.create({
      name,
      collector,
      points: optimizedPoints.map(p => p._id),
      scheduledDate,
      description,
      estimatedDistance: totalDistance,
      createdBy: req.userId,
    });

    // Atualizar pontos com a rota
    await CollectionPoint.updateMany(
      { _id: { $in: points } },
      { assignedRoute: route._id, status: 'assigned' }
    );

    // Atualizar rota atual do coletor
    await User.findByIdAndUpdate(collector, {
      'collectorInfo.currentRoute': route._id,
    });

    // Notificar coletor via Socket.io
    emitToUser(collector, 'route:assigned', {
      routeId: route._id,
      name: route.name,
      pointsCount: points.length,
      scheduledDate: route.scheduledDate,
    });

    logger.info(`Rota criada: ${route._id} por admin ${req.userId}`);

    const populatedRoute = await Route.findById(route._id)
      .populate('collector', 'name phone')
      .populate('points', 'address wasteType estimatedWeight');

    res.status(201).json({
      success: true,
      message: 'Rota criada com sucesso',
      data: populatedRoute,
    });
  } catch (error) {
    logger.error(`Erro ao criar rota: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar rota',
    });
  }
};

// Atualizar rota
exports.updateRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const updates = req.body;

    updates.updatedBy = req.userId;

    const route = await Route.findByIdAndUpdate(routeId, updates, {
      new: true,
      runValidators: true,
    })
      .populate('collector', 'name phone')
      .populate('points', 'address wasteType status');

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
      });
    }

    // Notificar coletor sobre alteração
    emitToUser(route.collector._id, 'route:updated', {
      routeId: route._id,
      changes: updates,
    });

    logger.info(`Rota atualizada: ${routeId} por admin ${req.userId}`);

    res.json({
      success: true,
      message: 'Rota atualizada com sucesso',
      data: route,
    });
  } catch (error) {
    logger.error(`Erro ao atualizar rota: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar rota',
    });
  }
};

// Deletar rota
exports.deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
      });
    }

    // Não permitir deletar rotas em progresso
    if (route.status === 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar uma rota em andamento',
      });
    }

    // Remover rota dos pontos
    await CollectionPoint.updateMany(
      { assignedRoute: routeId },
      { $unset: { assignedRoute: 1 }, status: 'pending' }
    );

    // Remover rota do coletor
    await User.updateOne(
      { 'collectorInfo.currentRoute': routeId },
      { $unset: { 'collectorInfo.currentRoute': 1 } }
    );

    await route.deleteOne();

    logger.info(`Rota deletada: ${routeId} por admin ${req.userId}`);

    res.json({
      success: true,
      message: 'Rota deletada com sucesso',
    });
  } catch (error) {
    logger.error(`Erro ao deletar rota: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar rota',
    });
  }
};

// Relatórios detalhados
exports.getReports = async (req, res) => {
  try {
    const { type, startDate, endDate, collector } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (collector) filter.collector = collector;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const reports = await Report.find(filter)
      .populate('collector', 'name')
      .populate('route', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    logger.error(`Erro ao buscar relatórios: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar relatórios',
    });
  }
};

// Gerar relatório customizado
exports.generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate, format } = req.body;

    // Implementar lógica de geração de relatório
    // Por enquanto, retornar dados básicos

    const start = new Date(startDate);
    const end = new Date(endDate);

    const data = await CheckIn.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: 'collectionpoints',
          localField: 'collectionPoint',
          foreignField: '_id',
          as: 'point',
        },
      },
      { $unwind: '$point' },
      {
        $group: {
          _id: '$collector',
          totalCollections: { $sum: 1 },
          totalWeight: { $sum: '$point.estimatedWeight' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'collectorInfo',
        },
      },
      { $unwind: '$collectorInfo' },
    ]);

    res.json({
      success: true,
      data: {
        type,
        period: { startDate, endDate },
        format,
        results: data,
      },
    });
  } catch (error) {
    logger.error(`Erro ao gerar relatório: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório',
    });
  }
};

// Exportar relatório (PDF/Excel)
exports.exportReport = async (req, res) => {
  try {
    const { reportId, format } = req.params;

    // Implementar exportação real com jsPDF ou xlsx
    // Por enquanto, retornar mensagem

    res.json({
      success: true,
      message: `Relatório ${reportId} será exportado em formato ${format}`,
      data: {
        downloadUrl: `/downloads/report-${reportId}.${format}`,
      },
    });
  } catch (error) {
    logger.error(`Erro ao exportar relatório: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar relatório',
    });
  }
};

// Histórico de desempenho
exports.getPerformanceHistory = async (req, res) => {
  try {
    const { collectorId, period = '30' } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const filter = { createdAt: { $gte: daysAgo } };
    if (collectorId) filter.collector = collectorId;

    const performance = await CheckIn.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            collector: '$collector',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          collections: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.collector',
          foreignField: '_id',
          as: 'collector',
        },
      },
      { $unwind: '$collector' },
      {
        $project: {
          date: '$_id.date',
          collectorName: '$collector.name',
          collections: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({
      success: true,
      data: performance,
    });
  } catch (error) {
    logger.error(`Erro ao buscar histórico de desempenho: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico de desempenho',
    });
  }
};

module.exports = exports;
