const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsById,
  getCalendar,
  getPublicMap,
  getStatistics,
  getContactInfo,
  sendContactMessage,
} = require('../controllers/publicController');

// Rotas públicas (sem autenticação necessária)

// Notícias
router.get('/news', getNews);
router.get('/news/:id', getNewsById);

// Calendário de coletas
router.get('/calendar', getCalendar);

// Mapa público
router.get('/map', getPublicMap);

// Estatísticas
router.get('/statistics', getStatistics);

// Contato
router.get('/contact', getContactInfo);
router.post('/contact', sendContactMessage);

module.exports = router;
