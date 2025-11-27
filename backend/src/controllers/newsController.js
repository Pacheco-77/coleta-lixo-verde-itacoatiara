const News = require('../models/News');
const logger = require('../utils/logger');

/**
 * @desc    Criar nova notícia
 * @route   POST /api/admin/news
 * @access  Private/Admin
 */
exports.createNews = async (req, res) => {
  try {
    const { title, content, summary, image, category, publishDate, expiryDate, priority } = req.body;

    const news = await News.create({
      title,
      content,
      summary,
      image,
      category,
      publishDate: publishDate || Date.now(),
      expiryDate,
      priority: priority || 0,
      author: req.userId,
    });

    logger.info(`Notícia criada: ${news._id} por ${req.userId}`);

    res.status(201).json({
      success: true,
      message: 'Notícia criada com sucesso',
      data: news,
    });
  } catch (error) {
    logger.error(`Erro ao criar notícia: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar notícia',
      error: error.message,
    });
  }
};

/**
 * @desc    Obter todas as notícias (incluindo inativas)
 * @route   GET /api/admin/news
 * @access  Private/Admin
 */
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isActive } = req.query;

    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const news = await News.find(query)
      .populate('author', 'name photo email')
      .sort({ priority: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      count: news.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
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
 * @desc    Obter notícia por ID
 * @route   GET /api/admin/news/:id
 * @access  Private/Admin
 */
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name photo email');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada',
      });
    }

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
 * @desc    Atualizar notícia
 * @route   PUT /api/admin/news/:id
 * @access  Private/Admin
 */
exports.updateNews = async (req, res) => {
  try {
    const { title, content, summary, image, category, publishDate, expiryDate, priority, isActive } = req.body;

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada',
      });
    }

    // Atualizar campos
    if (title !== undefined) news.title = title;
    if (content !== undefined) news.content = content;
    if (summary !== undefined) news.summary = summary;
    if (image !== undefined) news.image = image;
    if (category !== undefined) news.category = category;
    if (publishDate !== undefined) news.publishDate = publishDate;
    if (expiryDate !== undefined) news.expiryDate = expiryDate;
    if (priority !== undefined) news.priority = priority;
    if (isActive !== undefined) news.isActive = isActive;

    await news.save();

    logger.info(`Notícia atualizada: ${news._id} por ${req.userId}`);

    res.status(200).json({
      success: true,
      message: 'Notícia atualizada com sucesso',
      data: news,
    });
  } catch (error) {
    logger.error(`Erro ao atualizar notícia: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar notícia',
      error: error.message,
    });
  }
};

/**
 * @desc    Deletar notícia
 * @route   DELETE /api/admin/news/:id
 * @access  Private/Admin
 */
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada',
      });
    }

    await news.deleteOne();

    logger.info(`Notícia deletada: ${req.params.id} por ${req.userId}`);

    res.status(200).json({
      success: true,
      message: 'Notícia deletada com sucesso',
    });
  } catch (error) {
    logger.error(`Erro ao deletar notícia: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar notícia',
      error: error.message,
    });
  }
};

/**
 * @desc    Ativar/Desativar notícia
 * @route   PATCH /api/admin/news/:id/toggle
 * @access  Private/Admin
 */
exports.toggleNewsStatus = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada',
      });
    }

    news.isActive = !news.isActive;
    await news.save();

    logger.info(`Status da notícia alterado: ${news._id} - ${news.isActive ? 'ativa' : 'inativa'}`);

    res.status(200).json({
      success: true,
      message: `Notícia ${news.isActive ? 'ativada' : 'desativada'} com sucesso`,
      data: news,
    });
  } catch (error) {
    logger.error(`Erro ao alterar status da notícia: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar status da notícia',
      error: error.message,
    });
  }
};
