const CollectionPoint = require('../models/CollectionPoint');
const Route = require('../models/Route');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { emitToAdmins, emitToCollectors } = require('../config/socket');

// @desc    Cadastrar novo ponto de coleta (lixo verde)
// @route   POST /api/citizen/collection-points
// @access  Private (Citizen)
const registerCollectionPoint = async (req, res, next) => {
  try {
    const {
      address,
      wasteType,
      estimatedWeight,
      description,
      preferredCollectionTime,
      urgency,
    } = req.body;

    const citizen = await User.findById(req.userId);
    
    if (!citizen) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Criar ponto de coleta
    const collectionPoint = await CollectionPoint.create({
      citizen: req.userId,
      address: {
        ...address,
        location: {
          type: 'Point',
          coordinates: address.coordinates || [-58.4438, -3.1428], // Default Itacoatiara
        },
      },
      wasteType,
      estimatedWeight,
      description,
      preferredCollectionTime,
      urgency: urgency || 'normal',
      status: 'pending',
    });

    // Notificar administradores e coletores em tempo real
    emitToAdmins('point:new', {
      pointId: collectionPoint._id,
      citizen: {
        id: citizen._id,
        name: citizen.name,
        phone: citizen.phone,
      },
      address: collectionPoint.address,
      wasteType: collectionPoint.wasteType,
      urgency: collectionPoint.urgency,
      timestamp: new Date(),
    });

    emitToCollectors('point:new', {
      pointId: collectionPoint._id,
      address: collectionPoint.address,
      wasteType: collectionPoint.wasteType,
      urgency: collectionPoint.urgency,
    });

    logger.info(`New collection point registered: ${collectionPoint._id} by citizen ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Ponto de coleta cadastrado com sucesso',
      data: {
        collectionPoint,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Listar pontos de coleta do cidadão
// @route   GET /api/citizen/collection-points
// @access  Private (Citizen)
const getMyCollectionPoints = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { citizen: req.userId };
    
    if (status) {
      query.status = status;
    }

    const collectionPoints = await CollectionPoint.find(query)
      .populate('assignedCollector', 'name phone')
      .populate('route', 'name scheduledDate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CollectionPoint.countDocuments(query);

    res.json({
      success: true,
      data: {
        collectionPoints,
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

// @desc    Obter detalhes de um ponto de coleta
// @route   GET /api/citizen/collection-points/:id
// @access  Private (Citizen)
const getCollectionPointById = async (req, res, next) => {
  try {
    const collectionPoint = await CollectionPoint.findOne({
      _id: req.params.id,
      citizen: req.userId,
    })
      .populate('assignedCollector', 'name phone collectorInfo')
      .populate('route', 'name scheduledDate estimatedTime');

    if (!collectionPoint) {
      throw new AppError('Ponto de coleta não encontrado', 404);
    }

    res.json({
      success: true,
      data: {
        collectionPoint,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar ponto de coleta (apenas se status = pending)
// @route   PUT /api/citizen/collection-points/:id
// @access  Private (Citizen)
const updateCollectionPoint = async (req, res, next) => {
  try {
    const collectionPoint = await CollectionPoint.findOne({
      _id: req.params.id,
      citizen: req.userId,
    });

    if (!collectionPoint) {
      throw new AppError('Ponto de coleta não encontrado', 404);
    }

    if (collectionPoint.status !== 'pending') {
      throw new AppError('Apenas pontos pendentes podem ser editados', 400);
    }

    const {
      address,
      wasteType,
      estimatedWeight,
      description,
      preferredCollectionTime,
      urgency,
    } = req.body;

    // Atualizar campos permitidos
    if (address) collectionPoint.address = { ...collectionPoint.address, ...address };
    if (wasteType) collectionPoint.wasteType = wasteType;
    if (estimatedWeight) collectionPoint.estimatedWeight = estimatedWeight;
    if (description) collectionPoint.description = description;
    if (preferredCollectionTime) collectionPoint.preferredCollectionTime = preferredCollectionTime;
    if (urgency) collectionPoint.urgency = urgency;

    await collectionPoint.save();

    logger.info(`Collection point updated: ${collectionPoint._id}`);

    res.json({
      success: true,
      message: 'Ponto de coleta atualizado com sucesso',
      data: {
        collectionPoint,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar ponto de coleta (apenas se status = pending)
// @route   DELETE /api/citizen/collection-points/:id
// @access  Private (Citizen)
const cancelCollectionPoint = async (req, res, next) => {
  try {
    const collectionPoint = await CollectionPoint.findOne({
      _id: req.params.id,
      citizen: req.userId,
    });

    if (!collectionPoint) {
      throw new AppError('Ponto de coleta não encontrado', 404);
    }

    if (collectionPoint.status !== 'pending') {
      throw new AppError('Apenas pontos pendentes podem ser cancelados', 400);
    }

    collectionPoint.status = 'cancelled';
    await collectionPoint.save();

    // Notificar administradores
    emitToAdmins('point:cancelled', {
      pointId: collectionPoint._id,
      timestamp: new Date(),
    });

    logger.info(`Collection point cancelled: ${collectionPoint._id}`);

    res.json({
      success: true,
      message: 'Ponto de coleta cancelado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter horários de coleta por bairro
// @route   GET /api/citizen/schedules
// @access  Public
const getCollectionSchedules = async (req, res, next) => {
  try {
    const { neighborhood, city = 'Itacoatiara' } = req.query;

    const query = {
      status: { $in: ['scheduled', 'in_progress'] },
      scheduledDate: { $gte: new Date() },
    };

    if (neighborhood) {
      query['collectionPoints.address.neighborhood'] = new RegExp(neighborhood, 'i');
    }

    const routes = await Route.find(query)
      .populate('collectionPoints', 'address wasteType')
      .populate('assignedCollector', 'name phone')
      .sort({ scheduledDate: 1 })
      .limit(20);

    // Agrupar por bairro
    const schedulesByNeighborhood = {};

    routes.forEach(route => {
      route.collectionPoints.forEach(point => {
        const neighborhood = point.address.neighborhood || 'Outros';
        
        if (!schedulesByNeighborhood[neighborhood]) {
          schedulesByNeighborhood[neighborhood] = [];
        }

        schedulesByNeighborhood[neighborhood].push({
          routeName: route.name,
          scheduledDate: route.scheduledDate,
          estimatedTime: route.estimatedTime,
          collector: route.assignedCollector?.name,
          wasteTypes: [...new Set(route.collectionPoints.map(p => p.wasteType))],
        });
      });
    });

    res.json({
      success: true,
      data: {
        schedules: schedulesByNeighborhood,
        city,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter mapa público de rotas
// @route   GET /api/citizen/public-map
// @access  Public
const getPublicMap = async (req, res, next) => {
  try {
    const { date } = req.query;

    const query = {
      status: { $in: ['scheduled', 'in_progress'] },
    };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.scheduledDate = {
        $gte: startDate,
        $lte: endDate,
      };
    } else {
      query.scheduledDate = { $gte: new Date() };
    }

    const routes = await Route.find(query)
      .populate('collectionPoints', 'address wasteType status')
      .populate('assignedCollector', 'name')
      .select('name scheduledDate status collectionPoints assignedCollector')
      .limit(50);

    // Formatar dados para o mapa
    const mapData = routes.map(route => ({
      routeId: route._id,
      routeName: route.name,
      scheduledDate: route.scheduledDate,
      status: route.status,
      collector: route.assignedCollector?.name,
      points: route.collectionPoints.map(point => ({
        id: point._id,
        coordinates: point.address.location?.coordinates,
        neighborhood: point.address.neighborhood,
        wasteType: point.wasteType,
        status: point.status,
      })),
    }));

    res.json({
      success: true,
      data: {
        routes: mapData,
        totalRoutes: routes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter estatísticas públicas
// @route   GET /api/citizen/statistics
// @access  Public
const getPublicStatistics = async (req, res, next) => {
  try {
    // Total de lixo coletado
    const totalCollected = await CollectionPoint.aggregate([
      { $match: { status: 'collected' } },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$actualWeight' },
          totalPoints: { $sum: 1 },
        },
      },
    ]);

    // Estatísticas por bairro
    const byNeighborhood = await CollectionPoint.aggregate([
      { $match: { status: 'collected' } },
      {
        $group: {
          _id: '$address.neighborhood',
          totalWeight: { $sum: '$actualWeight' },
          totalPoints: { $sum: 1 },
        },
      },
      { $sort: { totalWeight: -1 } },
      { $limit: 10 },
    ]);

    // Estatísticas por tipo de resíduo
    const byWasteType = await CollectionPoint.aggregate([
      { $match: { status: 'collected' } },
      {
        $group: {
          _id: '$wasteType',
          totalWeight: { $sum: '$actualWeight' },
          totalPoints: { $sum: 1 },
        },
      },
      { $sort: { totalWeight: -1 } },
    ]);

    // Quilometragem total percorrida
    const totalDistance = await Route.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalKm: { $sum: '$actualDistance' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalWeight: totalCollected[0]?.totalWeight || 0,
          totalPoints: totalCollected[0]?.totalPoints || 0,
          totalDistance: totalDistance[0]?.totalKm || 0,
        },
        byNeighborhood,
        byWasteType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter informações de contato
// @route   GET /api/citizen/contact
// @access  Public
const getContactInfo = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        whatsapp: process.env.WHATSAPP_BUSINESS_NUMBER || '5592999999999',
        email: process.env.EMAIL_FROM || 'contato@coletaverde.com.br',
        phone: '(92) 99999-9999',
        address: {
          street: 'Rua Principal',
          number: '123',
          neighborhood: 'Centro',
          city: 'Itacoatiara',
          state: 'AM',
          zipCode: '69100-000',
        },
        workingHours: {
          weekdays: '08:00 - 18:00',
          saturday: '08:00 - 12:00',
          sunday: 'Fechado',
        },
        socialMedia: {
          facebook: 'https://facebook.com/coletaverde',
          instagram: 'https://instagram.com/coletaverde',
          twitter: 'https://twitter.com/coletaverde',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCollectionPoint,
  getMyCollectionPoints,
  getCollectionPointById,
  updateCollectionPoint,
  cancelCollectionPoint,
  getCollectionSchedules,
  getPublicMap,
  getPublicStatistics,
  getContactInfo,
};
