const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { AppError } = require('./errorHandler');

// Criar diretório de uploads se não existir
const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const type = req.body.type || 'general';
    const typeDir = path.join(uploadsDir, type);
    
    try {
      await fs.mkdir(typeDir, { recursive: true });
      cb(null, typeDir);
    } catch (error) {
      cb(error, typeDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 50);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  // Tipos permitidos
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)', 400), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Middleware para upload único
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('Arquivo muito grande. Máximo 5MB', 400));
        }
        return next(new AppError(`Erro no upload: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Middleware para múltiplos arquivos
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('Arquivo muito grande. Máximo 5MB', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError(`Máximo ${maxCount} arquivos`, 400));
        }
        return next(new AppError(`Erro no upload: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

// Função para deletar arquivo
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
  }
};

// Função para gerar URL pública
const getFileUrl = (req, filename, type = 'general') => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${type}/${filename}`;
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  getFileUrl
};
