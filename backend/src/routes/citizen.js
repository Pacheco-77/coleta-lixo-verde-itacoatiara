const express = require('express');
const router = express.Router();
const {
  registerCollectionPoint,
  getMyCollectionPoints,
  getCollectionPointById,
  updateCollectionPoint,
  cancelCollectionPoint,
  getCollectionSchedules,
  getPublicMap,
  getPublicStatistics,
  getContactInfo,
} = require('../controllers/citizenController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

// Rotas públicas (sem autenticação)
router.get('/schedules', getCollectionSchedules);
router.get('/public-map', getPublicMap);
router.get('/statistics', getPublicStatistics);
router.get('/contact', getContactInfo);

// Rotas privadas (requerem autenticação de cidadão)
router.use(authenticate);
router.use(requireRole('citizen'));

router.post('/collection-points', registerCollectionPoint);
router.get('/collection-points', getMyCollectionPoints);
router.get('/collection-points/:id', getCollectionPointById);
router.put('/collection-points/:id', updateCollectionPoint);
router.delete('/collection-points/:id', cancelCollectionPoint);

module.exports = router;
