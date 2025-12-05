const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/complaintController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Rotas públicas/autenticadas
router.post(
  '/',
  authenticate,
  [
    body('type').notEmpty().withMessage('Tipo de denúncia é obrigatório'),
    body('title').notEmpty().withMessage('Título é obrigatório').isLength({ max: 200 }),
    body('description').notEmpty().withMessage('Descrição é obrigatória').isLength({ max: 1000 }),
    body('location.coordinates').isArray().withMessage('Coordenadas são obrigatórias'),
  ],
  handleValidationErrors,
  createComplaint
);

router.get('/my', authenticate, getMyComplaints);

// Rotas administrativas (devem vir antes de /:id)
router.get('/admin/statistics', authenticate, requireRole('admin'), getComplaintStatistics);
router.get('/admin/all', authenticate, requireRole('admin'), getAllComplaints);
router.put('/admin/:id', authenticate, requireRole('admin'), updateComplaint);
router.patch('/admin/:id/status', authenticate, requireRole('admin'), changeComplaintStatus);
router.post('/admin/:id/resolve', authenticate, requireRole('admin'), resolveComplaint);
router.post('/admin/:id/reject', authenticate, requireRole('admin'), rejectComplaint);
router.delete('/admin/:id', authenticate, requireRole('admin'), deleteComplaint);

// Rota dinâmica deve vir por último
router.get('/:id', authenticate, getComplaintById);

module.exports = router;
