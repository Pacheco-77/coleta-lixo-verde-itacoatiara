const News = require('../models/News');
const CollectionPoint = require('../models/CollectionPoint');
// Route model not needed in public controller (removed to avoid unused variable)
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @desc    Obter notícias ativas para o carrossel
 * @route   GET /api/public/news
 * @access  Public
 */
exports.getNews = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    let news;
    if (category) {
      news = await News.findByCategory(category, parseInt(limit));
    } else {
      news = await News.findActive(parseInt(limit));
    }

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    logger.error(`Erro ao buscar notícias: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar notícias',
      error: error.message,
    });
  }
};

/**
 * @desc    Obter uma notícia específica
 * @route   GET /api/public/news/:id
 * @access  Public
 */
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name photo');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada',
      });
    }

    // Incrementar visualizações
    await news.incrementViews();

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    logger.error(`Erro ao buscar notícia: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar notícia',
      error: error.message,
    });
  }
};

/**
 * @desc    Obter calendário de coletas
 * @route   GET /api/public/calendar
 * @access  Public
 */
exports.getCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {
      status: { $in: ['scheduled', 'in_progress'] },
      isActive: true,
    };

    if (startDate && endDate) {
      query.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const collections = await CollectionPoint.find(query)
      .select('scheduledDate scheduledTimeSlot address.neighborhood status')
      .sort({ scheduledDate: 1 });

    // Agrupar por data
    const calendar = collections.reduce((acc, collection) => {
      const date = collection.scheduledDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(collection);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: calendar,
    });
  } catch (error) {
    logger.error(`Erro ao buscar calendário: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar calendário',
      error: error.message,
    });
  }
};

/**
 * @desc    Obter mapa público com pontos de coleta
 * @route   GET /api/public/map
 * @access  Public
 */
exports.getPublicMap = async (req, res) => {
  try {
    const { neighborhood, status } = req.query;

    const query = {
      isActive: true,
    };

    if (neighborhood) {
      query['address.neighborhood'] = neighborhood;
    }

    if (status) {
      query.status = status;
    } else {
      // Por padrão, mostrar apenas agendadas e em progresso
      query.status = { $in: ['scheduled', 'in_progress'] };
    }

    const points = await CollectionPoint.find(query)
      .select('location address scheduledDate status wasteType estimatedQuantity')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: points.length,
      data: points,
    });
  } catch (error) {
    logger.error(`Erro ao buscar mapa público: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar mapa público',
      error: error.message,
    });
  }
};

/**
 * @desc    Obter estatísticas públicas
 * @route   GET /api/public/statistics
 * @access  Public
 */
exports.getStatistics = async (req, res) => {
  try {
    // Total de coletas realizadas
    const totalCollections = await CollectionPoint.countDocuments({
      status: 'collected',
    });

    // Total de kg coletados
    const collectedData = await CollectionPoint.aggregate([
      { $match: { status: 'collected' } },
      {
        $group: {
          _id: null,
          totalKg: { $sum: '$collectionInfo.actualQuantity.value' },
        },
      },
    ]);

    const totalKg = collectedData.length > 0 ? collectedData[0].totalKg : 0;

    // Total de coletores ativos
    const activeCollectors = await User.countDocuments({
      role: 'coletor',
      isActive: true,
      'collectorInfo.isActive': true,
    });

    // Coletas por bairro
    const collectionsByNeighborhood = await CollectionPoint.aggregate([
      { $match: { status: 'collected' } },
      {
        $group: {
          _id: '$address.neighborhood',
          count: { $sum: 1 },
          totalKg: { $sum: '$collectionInfo.actualQuantity.value' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Coletas por tipo de resíduo
    const collectionsByWasteType = await CollectionPoint.aggregate([
      { $match: { status: 'collected' } },
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
          totalKg: { $sum: '$collectionInfo.actualQuantity.value' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCollections,
        totalKg: Math.round(totalKg),
        activeCollectors,
        collectionsByNeighborhood,
        collectionsByWasteType,
      },
    });
  } catch (error) {
    logger.error(`Erro ao buscar estatísticas: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message,
    });
  }
};

/**
 * @desc    Obter informações de contato
 * @route   GET /api/public/contact
 * @access  Public
 */
exports.getContactInfo = async (req, res) => {
  try {
    const contactInfo = {
      phone: '(92) 3521-1234',
      whatsapp: '(92) 99999-9999',
      email: 'coleta.verde@itacoatiara.am.gov.br',
      address: {
        street: 'Rua Principal',
        number: '123',
        neighborhood: 'Centro',
        city: 'Itacoatiara',
        state: 'AM',
        zipCode: '69100-000',
      },
      socialMedia: {
        facebook: 'https://facebook.com/coletaverdeitacoatiara',
        instagram: 'https://instagram.com/coletaverdeitacoatiara',
        twitter: 'https://twitter.com/coletaverdeitc',
      },
      workingHours: {
        weekdays: '08:00 - 17:00',
        saturday: '08:00 - 12:00',
        sunday: 'Fechado',
      },
    };

    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    logger.error(`Erro ao buscar informações de contato: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar informações de contato',
      error: error.message,
    });
  }
};

/**
 * @desc    Enviar mensagem de contato
 * @route   POST /api/public/contact
 * @access  Public
 */
exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validar campos obrigatórios
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e mensagem são obrigatórios',
      });
    }

    // Aqui você pode implementar o envio de email
    // Por enquanto, apenas log
    logger.info(`Mensagem de contato recebida de ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    });
  } catch (error) {
    logger.error(`Erro ao enviar mensagem de contato: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem',
      error: error.message,
    });
  }
};
