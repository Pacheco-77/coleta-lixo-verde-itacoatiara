const logger = require('../utils/logger');

// Middleware para verificar role específico
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Verificar se usuário está autenticado
      if (!req.user || !req.userRole) {
        return res.status(401).json({
          success: false,
          message: 'Autenticação necessária',
        });
      }

      // Verificar se o role do usuário está na lista de roles permitidos
      if (!allowedRoles.includes(req.userRole)) {
        logger.logAuth(
          `Access denied - Required: ${allowedRoles.join(', ')}, User role: ${req.userRole}`,
          req.userId,
          false
        );

        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Você não tem permissão para acessar este recurso.',
          requiredRoles: allowedRoles,
          userRole: req.userRole,
        });
      }

      logger.info(`Access granted - User: ${req.userId}, Role: ${req.userRole}`);
      next();
    } catch (error) {
      logger.error(`Erro na verificação de role: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Erro no servidor',
      });
    }
  };
};

// Middleware específico para admin
const requireAdmin = requireRole('admin');

// Middleware específico para coletor
const requireCollector = requireRole('coletor');

// Middleware específico para usuário comum
const requireUser = requireRole('user');

// Middleware para admin ou coletor
const requireAdminOrCollector = requireRole('admin', 'coletor');

// Middleware para verificar se é o próprio usuário ou admin
const requireSelfOrAdmin = (req, res, next) => {
  try {
    const targetUserId = req.params.userId || req.params.id;
    const currentUserId = req.userId.toString();
    const isAdmin = req.userRole === 'admin';

    // Permitir se for o próprio usuário ou admin
    if (currentUserId === targetUserId || isAdmin) {
      return next();
    }

    logger.logAuth(
      `Access denied - User ${currentUserId} tried to access user ${targetUserId}`,
      currentUserId,
      false
    );

    return res.status(403).json({
      success: false,
      message: 'Você só pode acessar seus próprios dados',
    });
  } catch (error) {
    logger.error(`Erro na verificação de propriedade: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor',
    });
  }
};

// Middleware para verificar se coletor pode acessar rota
const requireRouteAccess = async (req, res, next) => {
  try {
    const Route = require('../models/Route');
    const routeId = req.params.routeId || req.params.id;
    const userId = req.userId;
    const userRole = req.userRole;

    // Admin tem acesso a todas as rotas
    if (userRole === 'admin') {
      return next();
    }

    // Coletor só pode acessar suas próprias rotas
    if (userRole === 'coletor') {
      const route = await Route.findById(routeId);
      
      if (!route) {
        return res.status(404).json({
          success: false,
          message: 'Rota não encontrada',
        });
      }

      if (route.collector.toString() !== userId.toString()) {
        logger.logAuth(
          `Route access denied - Collector ${userId} tried to access route ${routeId}`,
          userId,
          false
        );

        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para acessar esta rota',
        });
      }

      return next();
    }

    // Outros roles não têm acesso
    return res.status(403).json({
      success: false,
      message: 'Acesso negado',
    });
  } catch (error) {
    logger.error(`Erro na verificação de acesso à rota: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor',
    });
  }
};

// Middleware para verificar se cidadão pode acessar ponto de coleta
const requirePointAccess = async (req, res, next) => {
  try {
    const CollectionPoint = require('../models/CollectionPoint');
    const pointId = req.params.pointId || req.params.id;
    const userId = req.userId;
    const userRole = req.userRole;

    // Admin e coletor têm acesso a todos os pontos
    if (userRole === 'admin' || userRole === 'coletor') {
      return next();
    }

    // Usuário comum só pode acessar seus próprios pontos
    if (userRole === 'user') {
      const point = await CollectionPoint.findById(pointId);
      
      if (!point) {
        return res.status(404).json({
          success: false,
          message: 'Ponto de coleta não encontrado',
        });
      }

      if (point.citizen.toString() !== userId.toString()) {
        logger.logAuth(
          `Point access denied - Citizen ${userId} tried to access point ${pointId}`,
          userId,
          false
        );

        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para acessar este ponto de coleta',
        });
      }

      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Acesso negado',
    });
  } catch (error) {
    logger.error(`Erro na verificação de acesso ao ponto: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor',
    });
  }
};

// Middleware para verificar permissões customizadas
const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      const userRole = req.userRole;

      // Definir permissões por role
      const permissions = {
        admin: [
          'manage_users',
          'manage_routes',
          'manage_points',
          'view_reports',
          'export_reports',
          'manage_collectors',
          'view_all_data',
          'delete_data',
        ],
        coletor: [
          'view_own_routes',
          'checkin_points',
          'view_own_performance',
          'update_location',
          'complete_collection',
        ],
        user: [
          'create_point',
          'view_own_points',
          'view_schedule',
          'view_public_map',
          'track_collection',
        ],
      };

      const userPermissions = permissions[userRole] || [];

      if (!userPermissions.includes(permission)) {
        logger.logAuth(
          `Permission denied - User ${req.userId} lacks permission: ${permission}`,
          req.userId,
          false
        );

        return res.status(403).json({
          success: false,
          message: `Permissão necessária: ${permission}`,
        });
      }

      next();
    } catch (error) {
      logger.error(`Erro na verificação de permissão: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Erro no servidor',
      });
    }
  };
};

module.exports = {
  requireRole,
  requireAdmin,
  requireCollector,
  requireUser,
  requireAdminOrCollector,
  requireSelfOrAdmin,
  requireRouteAccess,
  requirePointAccess,
  requirePermission,
};
