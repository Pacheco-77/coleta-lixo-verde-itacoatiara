const express = require('express');
const router = express.Router();
const {
  getCurrentRoute,
  checkInPoint,
  updateLocation,
  startRoute,
  completeRoute,
  getRouteHistory,
  getCollectorMetrics,
  reportIssue,
} = require('../controllers/collectorController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

// Todas as rotas requerem autenticação de coletor
router.use(authenticate);
router.use(requireRole('coletor'));

// Rotas de rota atual
router.get('/current-route', getCurrentRoute);
router.post('/routes/:routeId/start', startRoute);
router.post('/routes/:routeId/complete', completeRoute);

// Check-in
router.post('/checkin/:pointId', checkInPoint);

// Localização
router.post('/location', updateLocation);

// Histórico e métricas
router.get('/routes/history', getRouteHistory);
router.get('/metrics', getCollectorMetrics);

// Reportar problemas
router.post('/report-issue', reportIssue);

module.exports = router;
