const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getMapData,
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getReports,
  generateReport,
  exportReport,
  getPerformanceHistory,
} = require('../controllers/adminController');
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  toggleNewsStatus,
} = require('../controllers/newsController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Todas as rotas requerem autenticação de admin
router.use(authenticate);
router.use(requireRole('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Mapa
router.get('/map', getMapData);

// Gerenciamento de usuários
router.get('/users', getUsers);
router.post(
  '/users',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Senha deve ter no mínimo 8 caracteres'),
    body('role')
      .isIn(['admin', 'coletor', 'user'])
      .withMessage('Role inválido'),
    handleValidationErrors,
  ],
  createUser
);
router.put('/users/:userId', updateUser);
router.patch('/users/:userId/toggle-status', toggleUserStatus);

// Gerenciamento de rotas
router.get('/routes', getRoutes);
router.post(
  '/routes',
  [
    body('name').trim().notEmpty().withMessage('Nome da rota é obrigatório'),
    body('collector').notEmpty().withMessage('Coletor é obrigatório'),
    body('points').isArray({ min: 1 }).withMessage('Pelo menos um ponto é necessário'),
    body('scheduledDate').isISO8601().withMessage('Data inválida'),
    handleValidationErrors,
  ],
  createRoute
);
router.put('/routes/:routeId', updateRoute);
router.delete('/routes/:routeId', deleteRoute);

// Relatórios
router.get('/reports', getReports);
router.post(
  '/reports/generate',
  [
    body('type').notEmpty().withMessage('Tipo de relatório é obrigatório'),
    body('startDate').isISO8601().withMessage('Data inicial inválida'),
    body('endDate').isISO8601().withMessage('Data final inválida'),
    handleValidationErrors,
  ],
  generateReport
);
router.get('/reports/:reportId/export/:format', exportReport);

// Histórico de desempenho
router.get('/performance', getPerformanceHistory);

// Gerenciamento de notícias
router.get('/news', getAllNews);
router.post(
  '/news',
  [
    body('title').trim().notEmpty().withMessage('Título é obrigatório'),
    body('content').trim().notEmpty().withMessage('Conteúdo é obrigatório'),
    body('image').trim().notEmpty().withMessage('Imagem é obrigatória'),
    body('category')
      .isIn(['noticia', 'evento', 'alerta', 'informacao'])
      .withMessage('Categoria inválida'),
    handleValidationErrors,
  ],
  createNews
);
router.get('/news/:id', getNewsById);
router.put('/news/:id', updateNews);
router.delete('/news/:id', deleteNews);
router.patch('/news/:id/toggle', toggleNewsStatus);

// Cadastrar coletor (endpoint especial)
router.post(
  '/collectors',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('cpf').matches(/^\d{11}$/).withMessage('CPF deve conter 11 dígitos'),
    body('phone').trim().notEmpty().withMessage('Telefone é obrigatório'),
    body('vehiclePlate').trim().notEmpty().withMessage('Placa do veículo é obrigatória'),
    body('vehicleType')
      .isIn(['truck', 'van', 'motorcycle', 'other'])
      .withMessage('Tipo de veículo inválido'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { name, email, cpf, phone, vehiclePlate, vehicleType, photo } = req.body;
      
      // Gerar senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Criar usuário coletor
      const User = require('../models/User');
      const collector = await User.create({
        name,
        email,
        cpf,
        phone,
        photo,
        password: tempPassword,
        role: 'coletor',
        collectorInfo: {
          vehiclePlate,
          vehicleType,
          isActive: true,
        },
        createdBy: req.userId,
      });

      // Aqui você pode enviar email/WhatsApp com as credenciais
      // Por enquanto, apenas retornar
      
      res.status(201).json({
        success: true,
        message: 'Coletor cadastrado com sucesso',
        data: {
          collector: collector.toSafeObject(),
          tempPassword, // Em produção, enviar por email/WhatsApp
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao cadastrar coletor',
        error: error.message,
      });
    }
  }
);

module.exports = router;
