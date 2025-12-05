# Mapeamento Completo de Endpoints - Frontend ↔ Backend

## 📊 Status: Sistema em Verificação

### 🔐 Autenticação (/api/auth)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| POST /api/auth/register | ✅ router.post('/register') | authController.register | ✅ Testado |
| POST /api/auth/login | ✅ router.post('/login') | authController.login | ✅ Testado (rate limit 5/15min) |
| POST /api/auth/logout | ✅ router.post('/logout') | authController.logout | ⏳ Testar |
| POST /api/auth/refresh-token | ✅ router.post('/refresh-token') | authController.refreshToken | ⏳ Testar |
| GET /api/auth/me | ✅ router.get('/me') | authController.getMe | ⏳ Testar |
| PUT /api/auth/profile | ✅ router.put('/profile') | authController.updateProfile | ⏳ Testar |
| PUT /api/auth/change-password | ✅ router.put('/change-password') | authController.changePassword | ⏳ Testar |
| POST /api/auth/enable-2fa | ✅ router.post('/enable-2fa') | authController.enable2FA | ⏳ Testar |
| POST /api/auth/verify-2fa | ✅ router.post('/verify-2fa') | authController.verify2FA | ⏳ Testar |
| POST /api/auth/disable-2fa | ✅ router.post('/disable-2fa') | authController.disable2FA | ⏳ Testar |

### 📰 Notícias - Admin (/api/admin/news)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/admin/news | ✅ router.get('/news') | newsController.getAllNews | ⏳ Testar |
| POST /api/admin/news | ✅ router.post('/news') | newsController.createNews | ⏳ Testar |
| GET /api/admin/news/:id | ✅ router.get('/news/:id') | newsController.getNewsById | ⏳ Testar |
| PUT /api/admin/news/:id | ✅ router.put('/news/:id') | newsController.updateNews | ⏳ Testar |
| DELETE /api/admin/news/:id | ✅ router.delete('/news/:id') | newsController.deleteNews | ⏳ Testar |
| PATCH /api/admin/news/:id/toggle | ✅ router.patch('/news/:id/toggle') | newsController.toggleNewsStatus | ⏳ Testar |

### 📰 Notícias - Público (/api/public/news)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/public/news | ✅ router.get('/news') | publicController.getNews | ✅ Testado (5 notícias) |
| GET /api/public/news/:id | ✅ router.get('/news/:id') | publicController.getNewsById | ⏳ Testar |

### 👥 Usuários - Admin (/api/admin/users)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/admin/users | ✅ router.get('/users') | adminController.getUsers | ⏳ Testar |
| POST /api/admin/users | ✅ router.post('/users') | adminController.createUser | ⏳ Testar |
| PUT /api/admin/users/:userId | ✅ router.put('/users/:userId') | adminController.updateUser | ⏳ Testar |
| PATCH /api/admin/users/:userId/toggle-status | ✅ router.patch('/users/:userId/toggle-status') | adminController.toggleUserStatus | ⏳ Testar |

### 🗺️ Rotas - Admin (/api/admin/routes)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/admin/routes | ✅ router.get('/routes') | adminController.getRoutes | ⏳ Testar |
| POST /api/admin/routes | ✅ router.post('/routes') | adminController.createRoute | ⏳ Testar |
| PUT /api/admin/routes/:routeId | ✅ router.put('/routes/:routeId') | adminController.updateRoute | ⏳ Testar |
| DELETE /api/admin/routes/:routeId | ✅ router.delete('/routes/:routeId') | adminController.deleteRoute | ⏳ Testar |

### 📊 Dashboard e Relatórios - Admin
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/admin/dashboard | ✅ router.get('/dashboard') | adminController.getDashboard | ⏳ Testar |
| GET /api/admin/map | ✅ router.get('/map') | adminController.getMapData | ⏳ Testar |
| GET /api/admin/reports | ✅ router.get('/reports') | adminController.getReports | ⏳ Testar |
| POST /api/admin/reports/generate | ✅ router.post('/reports/generate') | adminController.generateReport | ⏳ Testar |
| GET /api/admin/reports/:reportId/export/:format | ✅ router.get('/reports/:reportId/export/:format') | adminController.exportReport | ⏳ Testar |
| GET /api/admin/performance | ✅ router.get('/performance') | adminController.getPerformanceHistory | ⏳ Testar |

### 📍 Pontos de Coleta - Público (/api/pontos)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/pontos | ✅ router.get('/pontos') | inline handler | ✅ Testado (25 pontos) |
| GET /api/pontos/estatisticas | ✅ router.get('/pontos/estatisticas') | inline handler | ✅ Testado |
| GET /api/pontos/:id | ✅ router.get('/pontos/:id') | inline handler | ⏳ Testar |
| POST /api/pontos/:id/checkin | ✅ router.post('/pontos/:id/checkin') | inline handler | ⏳ Testar |

### 📍 Pontos de Coleta - Cidadão (/api/citizen)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/citizen/schedules | ✅ router.get('/schedules') | citizenController.getCollectionSchedules | ⏳ Testar |
| GET /api/citizen/public-map | ✅ router.get('/public-map') | citizenController.getPublicMap | ⏳ Testar |
| GET /api/citizen/statistics | ✅ router.get('/statistics') | citizenController.getPublicStatistics | ⏳ Testar |
| GET /api/citizen/contact | ✅ router.get('/contact') | citizenController.getContactInfo | ⏳ Testar |
| POST /api/citizen/collection-points | ✅ router.post('/collection-points') | citizenController.registerCollectionPoint | ⏳ Testar |
| GET /api/citizen/collection-points | ✅ router.get('/collection-points') | citizenController.getMyCollectionPoints | ⏳ Testar |
| GET /api/citizen/collection-points/:id | ✅ router.get('/collection-points/:id') | citizenController.getCollectionPointById | ⏳ Testar |
| PUT /api/citizen/collection-points/:id | ✅ router.put('/collection-points/:id') | citizenController.updateCollectionPoint | ⏳ Testar |
| DELETE /api/citizen/collection-points/:id | ✅ router.delete('/collection-points/:id') | citizenController.cancelCollectionPoint | ⏳ Testar |

### 🚛 Coletor (/api/collector)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/collector/current-route | ✅ router.get('/current-route') | collectorController.getCurrentRoute | ⏳ Testar |
| POST /api/collector/routes/:routeId/start | ✅ router.post('/routes/:routeId/start') | collectorController.startRoute | ⏳ Testar |
| POST /api/collector/routes/:routeId/complete | ✅ router.post('/routes/:routeId/complete') | collectorController.completeRoute | ⏳ Testar |
| POST /api/collector/checkin/:pointId | ✅ router.post('/checkin/:pointId') | collectorController.checkInPoint | ⏳ Testar |
| POST /api/collector/location | ✅ router.post('/location') | collectorController.updateLocation | ⏳ Testar |
| GET /api/collector/routes/history | ✅ router.get('/routes/history') | collectorController.getRouteHistory | ⏳ Testar |
| GET /api/collector/metrics | ✅ router.get('/metrics') | collectorController.getCollectorMetrics | ⏳ Testar |
| POST /api/collector/report-issue | ✅ router.post('/report-issue') | collectorController.reportIssue | ⏳ Testar |

### 🌐 Público (/api/public)
| Frontend | Backend Route | Controller | Status |
|----------|---------------|------------|--------|
| GET /api/public/calendar | ✅ router.get('/calendar') | publicController.getCalendar | ⏳ Testar |
| GET /api/public/map | ✅ router.get('/map') | publicController.getPublicMap | ⏳ Testar |
| GET /api/public/statistics | ✅ router.get('/statistics') | publicController.getStatistics | ✅ Testado |
| GET /api/public/contact | ✅ router.get('/contact') | publicController.getContactInfo | ⏳ Testar |
| POST /api/public/contact | ✅ router.post('/contact') | publicController.sendContactMessage | ⏳ Testar |

---

## ✅ Endpoints Testados e Funcionando
1. **POST /api/auth/register** - Cria usuário com senha forte
2. **POST /api/auth/login** - Retorna token e refreshToken (rate limit 5/15min)
3. **GET /api/pontos** - Retorna 25 pontos de coleta
4. **GET /api/pontos/estatisticas** - Retorna estatísticas dos pontos
5. **GET /api/public/news** - Retorna 5 notícias ativas
6. **GET /api/public/statistics** - Retorna estatísticas públicas

## 🔧 Endpoints que Precisam de Teste
- Todos os endpoints de admin (dashboard, usuários, rotas, relatórios)
- Endpoints de coletor (rota atual, check-in, métricas)
- Endpoints de cidadão (minhas coletas, nova coleta)
- Denúncias e reclamações (se existirem rotas)
- Check-in em pontos de coleta
- Upload de fotos (se houver)

## 🚨 Problemas Conhecidos
1. **insertBefore error**: Erro no console do Leaflet (não quebra funcionalidade)
2. **Rate limit 429**: 5 tentativas de login em 15 minutos
3. **Senha forte**: Mínimo 8 caracteres com maiúscula, minúscula, número e especial

## 📝 Credenciais de Teste
- **Admin**: wamber.pacheco.12@gmail.com / adim18272313
- **Admin 2**: apgxavier@gmail.com / adim18272313
- **Coletor 1**: coletor1@teste.com / Coletor@123
- **Coletor 2**: coletor2@teste.com / Coletor@123
- **Coletor 3**: coletor3@teste.com / Coletor@123
- **Usuário**: Criar via registro com senha no formato Senha@123
