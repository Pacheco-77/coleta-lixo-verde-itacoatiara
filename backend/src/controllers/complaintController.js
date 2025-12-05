const Complaint = require('../models/Complaint');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// @desc    Criar nova denúncia
// @route   POST /api/complaints
// @access  Private (user/coletor/admin)
const createComplaint = async (req, res, next) => {
  try {
    const {
      type,
      title,
      description,
      address,
      location,
      photos,
      isAnonymous
    } = req.body;

    // Criar denúncia
    const complaint = await Complaint.create({
      reporter: req.userId,
      reporterName: isAnonymous ? 'Anônimo' : req.user?.name,
      reporterEmail: isAnonymous ? null : req.user?.email,
      reporterPhone: isAnonymous ? null : req.user?.phone,
      type,
      title,
      description,
      address,
      location,
      photos: photos || [],
      isAnonymous: isAnonymous || false,
      timeline: [{
        action: 'criado',
        description: 'Denúncia registrada',
        user: req.userId,
        timestamp: new Date(),
      }]
    });

    logger.info(`Denúncia criada: ${complaint._id} por usuário ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Denúncia registrada com sucesso',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Listar todas as denúncias (admin)
// @route   GET /api/admin/complaints
// @access  Private (admin)
const getAllComplaints = async (req, res, next) => {
  try {
    const {
      status,
      type,
      neighborhood,
      priority,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (neighborhood) query['address.neighborhood'] = neighborhood;
    if (priority) query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('reporter', 'name email phone')
        .populate('assignedTo', 'name email')
        .populate('resolution.resolvedBy', 'name')
        .populate('rejection.rejectedBy', 'name')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buscar denúncia por ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reporter', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('resolution.resolvedBy', 'name')
      .populate('rejection.rejectedBy', 'name')
      .populate('timeline.user', 'name');

    if (!complaint) {
      throw new AppError('Denúncia não encontrada', 404);
    }

    // Incrementar visualizações
    complaint.views += 1;
    await complaint.save();

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Minhas denúncias
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { reporter: req.userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar denúncia
// @route   PUT /api/admin/complaints/:id
// @access  Private (admin)
const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      throw new AppError('Denúncia não encontrada', 404);
    }

    const { priority, assignedTo } = req.body;

    if (priority) {
      complaint.priority = priority;
      await complaint.addToTimeline('prioridade_mudada', `Prioridade alterada para ${priority}`, req.userId);
    }

    if (assignedTo) {
      await complaint.assignTo(assignedTo);
    }

    await complaint.save();

    res.json({
      success: true,
      message: 'Denúncia atualizada com sucesso',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mudar status da denúncia
// @route   PATCH /api/admin/complaints/:id/status
// @access  Private (admin)
const changeComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new AppError('Status é obrigatório', 400);
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      throw new AppError('Denúncia não encontrada', 404);
    }

    await complaint.changeStatus(status, req.userId);

    res.json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolver denúncia
// @route   POST /api/admin/complaints/:id/resolve
// @access  Private (admin)
const resolveComplaint = async (req, res, next) => {
  try {
    const { notes, actions } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      throw new AppError('Denúncia não encontrada', 404);
    }

    await complaint.resolve(notes, actions || [], req.userId);

    logger.info(`Denúncia resolvida: ${complaint._id} por ${req.userId}`);

    res.json({
      success: true,
      message: 'Denúncia resolvida com sucesso',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rejeitar denúncia
// @route   POST /api/admin/complaints/:id/reject
// @access  Private (admin)
const rejectComplaint = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      throw new AppError('Motivo da rejeição é obrigatório', 400);
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      throw new AppError('Denúncia não encontrada', 404);
    }

    await complaint.reject(reason, req.userId);

    logger.info(`Denúncia rejeitada: ${complaint._id} por ${req.userId}`);

    res.json({
      success: true,
      message: 'Denúncia rejeitada',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Estatísticas de denúncias
// @route   GET /api/admin/complaints/statistics
// @access  Private (admin)
const getComplaintStatistics = async (req, res, next) => {
  try {
    const { startDate, endDate, neighborhood } = req.query;

    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (neighborhood) filters.neighborhood = neighborhood;

    const [stats, byType, byNeighborhood] = await Promise.all([
      Complaint.getStatistics(filters),
      Complaint.getByType(),
      Complaint.getByNeighborhood()
    ]);

    res.json({
      success: true,
      data: {
        summary: stats,
        byType,
        byNeighborhood
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar denúncia (soft delete)
// @route   DELETE /api/admin/complaints/:id
// @access  Private (admin)
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      throw new AppError('Denúncia não encontrada', 404);
    }

    // Soft delete - apenas muda status para rejeitada
    await complaint.reject('Denúncia removida pelo administrador', req.userId);

    logger.info(`Denúncia deletada: ${complaint._id} por ${req.userId}`);

    res.json({
      success: true,
      message: 'Denúncia removida com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyComplaints,
  updateComplaint,
  changeComplaintStatus,
  resolveComplaint,
  rejectComplaint,
  getComplaintStatistics,
  deleteComplaint
};
