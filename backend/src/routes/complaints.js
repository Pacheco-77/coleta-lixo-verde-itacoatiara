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
const { validate } = require('../middleware/validation');

// Rotas públicas/autenticadas
router.post(
  '/',
  authenticate,
  [
    body('type').notEmpty().withMessage('Tipo de denúncia é obrigatório'),
    body('title').notEmpty().withMessage('Título é obrigatório').isLength({ max: 200 }),
    body('description').notEmpty().withMessage('Descrição é obrigatória').isLength({ max: 1000 }),
    body('location.coordinates').isArray().withMessage('Coordenadas são obrigatórias'),
    validate
  ],
  createComplaint
);

router.get('/my', authenticate, getMyComplaints);
router.get('/:id', authenticate, getComplaintById);

// Rotas administrativas
router.use('/admin', authenticate, requireRole('admin'));

router.get('/admin/statistics', getComplaintStatistics);
router.get('/admin/all', getAllComplaints);
router.put('/admin/:id', updateComplaint);
router.patch('/admin/:id/status', changeComplaintStatus);
router.post('/admin/:id/resolve', resolveComplaint);
router.post('/admin/:id/reject', rejectComplaint);
router.delete('/admin/:id', deleteComplaint);

module.exports = router;
