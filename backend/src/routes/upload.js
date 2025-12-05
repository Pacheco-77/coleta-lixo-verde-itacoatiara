const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, getFileUrl } = require('../middleware/upload');
const { AppError } = require('../middleware/errorHandler');

// @desc    Upload de imagem única
// @route   POST /api/upload/image
// @access  Private
router.post('/image', authenticate, uploadSingle('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Nenhum arquivo enviado', 400);
    }

    const url = getFileUrl(req, req.file.filename, req.body.type || 'general');

    res.json({
      success: true,
      message: 'Imagem enviada com sucesso',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url,
        uploadedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload de múltiplas imagens
// @route   POST /api/upload/images
// @access  Private
router.post('/images', authenticate, uploadMultiple('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new AppError('Nenhum arquivo enviado', 400);
    }

    const type = req.body.type || 'general';
    const images = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: getFileUrl(req, file.filename, type),
      uploadedAt: new Date()
    }));

    res.json({
      success: true,
      message: `${images.length} imagens enviadas com sucesso`,
      data: {
        images,
        count: images.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
