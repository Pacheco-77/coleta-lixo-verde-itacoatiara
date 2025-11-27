// Roles de usuário
const USER_ROLES = {
  ADMIN: 'admin',
  COLLECTOR: 'collector',
  CITIZEN: 'citizen',
};

// Status de pontos de coleta
const COLLECTION_STATUS = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COLLECTED: 'collected',
  CANCELLED: 'cancelled',
};

// Status de rotas
const ROUTE_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Status de check-in
const CHECKIN_STATUS = {
  COMPLETED: 'completed',
  PARTIAL: 'partial',
  FAILED: 'failed',
  SKIPPED: 'skipped',
};

// Tipos de resíduos verdes
const WASTE_TYPES = {
  LEAVES: 'folhas',
  BRANCHES: 'galhos',
  GRASS: 'grama',
  FLOWERS: 'flores',
  FRUITS: 'frutas',
  VEGETABLES: 'vegetais',
  OTHERS: 'outros',
};

// Unidades de medida
const MEASUREMENT_UNITS = {
  KG: 'kg',
  BAGS: 'sacos',
  CUBIC_METERS: 'm3',
};

// Prioridades
const PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Tipos de veículos
const VEHICLE_TYPES = {
  TRUCK: 'truck',
  VAN: 'van',
  MOTORCYCLE: 'motorcycle',
  OTHER: 'other',
};

// Tipos de relatórios
const REPORT_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
  CUSTOM: 'custom',
  COLLECTOR_PERFORMANCE: 'collector_performance',
  ROUTE_EFFICIENCY: 'route_efficiency',
  WASTE_STATISTICS: 'waste_statistics',
  ENVIRONMENTAL_IMPACT: 'environmental_impact',
};

// Frequências de recorrência
const RECURRENCE_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
};

// Dias da semana
const DAYS_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const DAYS_OF_WEEK_PT = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
};

// Tipos de notificações
const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  PUSH: 'push',
};

// Tipos de incidentes
const INCIDENT_TYPES = {
  VEHICLE_ISSUE: 'vehicle_issue',
  TRAFFIC: 'traffic',
  WEATHER: 'weather',
  ACCESS_DENIED: 'access_denied',
  OTHER: 'other',
};

// Tipos de problemas em check-in
const ISSUE_TYPES = {
  ACCESS_DENIED: 'access_denied',
  WRONG_ADDRESS: 'wrong_address',
  NO_WASTE: 'no_waste',
  CONTAMINATED_WASTE: 'contaminated_waste',
  EXCESSIVE_QUANTITY: 'excessive_quantity',
  DANGEROUS_WASTE: 'dangerous_waste',
  OTHER: 'other',
};

// Severidades
const SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Condições de resíduo
const WASTE_CONDITIONS = {
  GOOD: 'good',
  WET: 'wet',
  MIXED: 'mixed',
  CONTAMINATED: 'contaminated',
};

// Tipos de fotos
const PHOTO_TYPES = {
  BEFORE: 'before',
  AFTER: 'after',
  WASTE: 'waste',
  LOCATION: 'location',
};

// Formatos de exportação
const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
};

// Tipos de gráficos
const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  SCATTER: 'scatter',
};

// Níveis de acesso
const ACCESS_LEVELS = {
  VIEW: 'view',
  DOWNLOAD: 'download',
  EDIT: 'edit',
};

// Tipos de insights
const INSIGHT_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
  WARNING: 'warning',
};

// Níveis de impacto
const IMPACT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Níveis de esforço
const EFFORT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Temas
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// Idiomas
const LANGUAGES = {
  PT_BR: 'pt-BR',
  EN_US: 'en-US',
  ES_ES: 'es-ES',
};

// Coordenadas padrão de Itacoatiara-AM
const DEFAULT_LOCATION = {
  LATITUDE: -3.1428,
  LONGITUDE: -58.4438,
  CITY: 'Itacoatiara',
  STATE: 'AM',
  COUNTRY: 'Brasil',
};

// Configurações de mapa
const MAP_CONFIG = {
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  MAX_DISTANCE_METERS: 5000, // 5km
  CLUSTER_RADIUS: 50,
};

// Limites de paginação
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Limites de arquivo
const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_PHOTOS: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

// Timeouts
const TIMEOUTS = {
  REQUEST: 30000, // 30 segundos
  SOCKET: 60000, // 60 segundos
  SESSION: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

// Mensagens de erro comuns
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Recurso não encontrado',
  VALIDATION_ERROR: 'Erro de validação',
  SERVER_ERROR: 'Erro interno do servidor',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  TOKEN_EXPIRED: 'Token expirado',
  ACCOUNT_LOCKED: 'Conta bloqueada',
  EMAIL_NOT_VERIFIED: 'Email não verificado',
};

// Mensagens de sucesso comuns
const SUCCESS_MESSAGES = {
  CREATED: 'Criado com sucesso',
  UPDATED: 'Atualizado com sucesso',
  DELETED: 'Excluído com sucesso',
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso',
  EMAIL_SENT: 'Email enviado com sucesso',
  PASSWORD_RESET: 'Senha redefinida com sucesso',
};

// Códigos HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Eventos Socket.io
const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Coleta
  COLLECTION_CHECKIN: 'collection:checkin',
  COLLECTION_UPDATED: 'collection:updated',
  COLLECTION_CHECKIN_SUCCESS: 'collection:checkin:success',
  
  // Coletor
  COLLECTOR_LOCATION_UPDATE: 'collector:location:update',
  COLLECTOR_LOCATION: 'collector:location',
  COLLECTOR_OFFLINE: 'collector:offline',
  
  // Rota
  ROUTE_ASSIGNED: 'route:assigned',
  ROUTE_NEW: 'route:new',
  
  // Ponto
  POINT_ADDED: 'point:added',
  POINT_NEW: 'point:new',
  
  // Emergência
  EMERGENCY_ALERT: 'emergency:alert',
};

// Permissões
const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_ROUTES: 'manage_routes',
  MANAGE_POINTS: 'manage_points',
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',
  MANAGE_COLLECTORS: 'manage_collectors',
  VIEW_ALL_DATA: 'view_all_data',
  DELETE_DATA: 'delete_data',
  VIEW_OWN_ROUTES: 'view_own_routes',
  CHECKIN_POINTS: 'checkin_points',
  VIEW_OWN_PERFORMANCE: 'view_own_performance',
  UPDATE_LOCATION: 'update_location',
  CREATE_POINT: 'create_point',
  VIEW_OWN_POINTS: 'view_own_points',
  VIEW_SCHEDULE: 'view_schedule',
  VIEW_PUBLIC_MAP: 'view_public_map',
};

// Fatores de conversão ambiental
const ENVIRONMENTAL_FACTORS = {
  CO2_PER_KG: 0.5, // kg de CO2 economizado por kg de resíduo verde
  TREES_PER_TON: 17, // árvores equivalentes por tonelada
  COMPOST_RATIO: 0.3, // 30% vira composto
  ENERGY_PER_TON: 500, // kWh gerado por tonelada
  LANDFILL_SPACE_PER_TON: 1.5, // m³ de aterro economizado por tonelada
};

module.exports = {
  USER_ROLES,
  COLLECTION_STATUS,
  ROUTE_STATUS,
  CHECKIN_STATUS,
  WASTE_TYPES,
  MEASUREMENT_UNITS,
  PRIORITIES,
  VEHICLE_TYPES,
  REPORT_TYPES,
  RECURRENCE_FREQUENCIES,
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_PT,
  NOTIFICATION_TYPES,
  INCIDENT_TYPES,
  ISSUE_TYPES,
  SEVERITIES,
  WASTE_CONDITIONS,
  PHOTO_TYPES,
  EXPORT_FORMATS,
  CHART_TYPES,
  ACCESS_LEVELS,
  INSIGHT_TYPES,
  IMPACT_LEVELS,
  EFFORT_LEVELS,
  THEMES,
  LANGUAGES,
  DEFAULT_LOCATION,
  MAP_CONFIG,
  PAGINATION,
  FILE_LIMITS,
  TIMEOUTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  SOCKET_EVENTS,
  PERMISSIONS,
  ENVIRONMENTAL_FACTORS,
};
