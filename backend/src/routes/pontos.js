const express = require('express');
const router = express.Router();
const PontoColeta = require('../models/PontoColeta');

// GET /api/pontos - Retorna todos os pontos com status atualizados
router.get('/pontos', async (req, res) => {
  try {
    const pontos = await PontoColeta.find()
      .populate('coletorId', 'name email')
      .sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      data: pontos,
      total: pontos.length,
    });
  } catch (error) {
    console.error('Erro ao buscar pontos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pontos de coleta',
      error: error.message,
    });
  }
});

// GET /api/pontos/:id - Retorna um ponto específico
router.get('/pontos/:id', async (req, res) => {
  try {
    const ponto = await PontoColeta.findById(req.params.id)
      .populate('coletorId', 'name email');
    
    if (!ponto) {
      return res.status(404).json({
        success: false,
        message: 'Ponto de coleta não encontrado',
      });
    }
    
    res.json({
      success: true,
      data: ponto,
    });
  } catch (error) {
    console.error('Erro ao buscar ponto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ponto de coleta',
      error: error.message,
    });
  }
});

// POST /api/pontos/:id/checkin - Registrar coleta concluída
router.post('/pontos/:id/checkin', async (req, res) => {
  try {
    const ponto = await PontoColeta.findById(req.params.id);
    
    if (!ponto) {
      return res.status(404).json({
        success: false,
        message: 'Ponto de coleta não encontrado',
      });
    }
    
    // Marcar como concluído
    await ponto.marcarConcluido(req.body.coletorId);
    
    res.json({
      success: true,
      message: 'Coleta registrada com sucesso!',
      data: ponto,
    });
  } catch (error) {
    console.error('Erro ao registrar check-in:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar coleta',
      error: error.message,
    });
  }
});

// GET /api/pontos/estatisticas - Estatísticas gerais
router.get('/estatisticas', async (req, res) => {
  try {
    const total = await PontoColeta.countDocuments();
    const pendentes = await PontoColeta.countDocuments({ status: 'pendente' });
    const emAndamento = await PontoColeta.countDocuments({ status: 'em_andamento' });
    const concluidos = await PontoColeta.countDocuments({ status: 'concluido' });
    
    res.json({
      success: true,
      data: {
        total,
        pendentes,
        emAndamento,
        concluidos,
        percentualConcluido: total > 0 ? Math.round((concluidos / total) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message,
    });
  }
});

module.exports = router;
