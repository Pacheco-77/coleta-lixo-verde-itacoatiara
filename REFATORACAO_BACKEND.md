# 🔄 REFATORAÇÃO DO BACKEND - RESUMO COMPLETO

## 📅 Data: 2025
## 🎯 Objetivo: Adaptar backend para novo sistema de roles e funcionalidades

---

## ✅ MUDANÇAS IMPLEMENTADAS

### 1. 🔐 Sistema de Roles Atualizado

#### Antes:
```javascript
roles: ['admin', 'collector', 'citizen']
```

#### Depois:
```javascript
roles: ['admin', 'coletor', 'user']
```

**Motivo:** Padronização em português e simplificação do sistema.

---

### 2. 👤 Modelo User Atualizado

#### Novos Campos Adicionados:

```javascript
{
  cpf: String,              // CPF do usuário (11 dígitos)
  photo: String,            // URL da foto de perfil
  googleId: String,         // ID do Google OAuth
  createdBy: ObjectId,      // Quem criou o usuário (para coletores)
}
```

#### Métodos Adicionados:

```javascript
// Verificar se é admin
user.isAdmin()

// Verificar se é coletor
user.isColetor()

// Verificar se é usuário comum
user.isUser()

// Verificar se é um dos admins específicos
user.isSpecificAdmin()
```

#### Admins Hardcoded:
- wamber.pacheco.12@gmail.com
- apgxavier@gmail.com

**Arquivo:** `backend/src/models/User.js`

---

### 3. 📰 Modelo News Criado

Sistema de notícias para o carrossel da home pública.

```javascript
{
  title: String,           // Título da notícia
  content: String,         // Conteúdo completo
  summary: String,         // Resumo curto
  image: String,           // URL da imagem
  category: String,        // noticia, evento, alerta, informacao
  author: ObjectId,        // Referência ao User
  publishDate: Date,       // Data de publicação
  expiryDate: Date,        // Data de expiração (opcional)
  priority: Number,        // Prioridade (0-10)
  views: Number,           // Contador de visualizações
  isActive: Boolean,       // Ativa/Inativa
}
```

#### Métodos:
- `News.findActive()` - Buscar notícias ativas
- `News.findByCategory()` - Buscar por categoria
- `news.incrementViews()` - Incrementar visualizações

**Arquivo:** `backend/src/models/News.js`

---

### 4. 🛣️ Rotas Públicas Criadas

Novas rotas acessíveis sem autenticação:

```
GET  /api/public/news              - Listar notícias
GET  /api/public/news/:id          - Ver notícia específica
GET  /api/public/calendar          - Calendário de coletas
GET  /api/public/map               - Mapa público
GET  /api/public/statistics        - Estatísticas
GET  /api/public/contact           - Info de contato
POST /api/public/contact           - Enviar mensagem
```

**Arquivos:**
- `backend/src/routes/public.js`
- `backend/src/controllers/publicController.js`

---

### 5. 📝 Controller de Notícias (Admin)

Gerenciamento completo de notícias para administradores:

```
GET    /api/admin/news             - Listar todas as notícias
POST   /api/admin/news             - Criar notícia
GET    /api/admin/news/:id         - Ver notícia específica
PUT    /api/admin/news/:id         - Atualizar notícia
DELETE /api/admin/news/:id         - Deletar notícia
PATCH  /api/admin/news/:id/toggle  - Ativar/Desativar
```

**Arquivo:** `backend/src/controllers/newsController.js`

---

### 6. 👷 Endpoint de Cadastro de Coletores

Novo endpoint exclusivo para admins cadastrarem coletores:

```
POST /api/admin/collectors
```

**Body:**
```json
{
  "name": "Nome do Coletor",
  "email": "coletor@email.com",
  "cpf": "12345678901",
  "phone": "(92) 99999-9999",
  "vehiclePlate": "ABC-1234",
  "vehicleType": "truck",
  "photo": "https://..."
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Coletor cadastrado com sucesso",
  "data": {
    "collector": { ... },
    "tempPassword": "abc123xy"
  }
}
```

**Arquivo:** `backend/src/routes/admin.js`

---

### 7. 🔒 Middleware de Roles Atualizado

Atualização dos middlewares para novos roles:

```javascript
// Antes
requireCollector = requireRole('collector')
requireCitizen = requireRole('citizen')

// Depois
requireCollector = requireRole('coletor')
requireUser = requireRole('user')
```

**Permissões por Role:**

#### Admin:
- manage_users
- manage_routes
- manage_points
- view_reports
- export_reports
- manage_collectors
- view_all_data
- delete_data

#### Coletor:
- view_own_routes
- checkin_points
- view_own_performance
- update_location
- complete_collection

#### User:
- create_point
- view_own_points
- view_schedule
- view_public_map
- track_collection

**Arquivo:** `backend/src/middleware/roleCheck.js`

---

### 8. 🌱 Script de Seed do Banco

Script para popular o banco com dados iniciais:

```bash
npm run seed
```

**Cria:**
- ✅ 2 Admins (wamber.pacheco.12@gmail.com e apgxavier@gmail.com)
- ✅ 1 Usuário teste (usuario@teste.com / senha123)
- ✅ 1 Coletor teste (coletor@teste.com / senha123)
- ✅ 5 Notícias de exemplo

**Arquivo:** `backend/src/scripts/seedDatabase.js`

---

### 9. 🚀 Server.js Atualizado

Rotas públicas adicionadas ao servidor:

```javascript
const publicRoutes = require('./routes/public');
app.use('/api/public', publicRoutes);
```

**Arquivo:** `backend/src/server.js`

---

## 📊 ESTRUTURA ATUALIZADA

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js              ✅ ATUALIZADO
│   │   ├── News.js              ✅ NOVO
│   │   ├── CollectionPoint.js
│   │   ├── Route.js
│   │   └── ...
│   │
│   ├── controllers/
│   │   ├── publicController.js  ✅ NOVO
│   │   ├── newsController.js    ✅ NOVO
│   │   ├── adminController.js
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── public.js            ✅ NOVO
│   │   ├── admin.js             ✅ ATUALIZADO
│   │   ├── auth.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── roleCheck.js         ✅ ATUALIZADO
│   │   └── ...
│   │
│   ├── scripts/
│   │   └── seedDatabase.js      ✅ NOVO
│   │
│   └── server.js                ✅ ATUALIZADO
│
└── package.json                 ✅ ATUALIZADO
```

---

## 🔑 CREDENCIAIS DE TESTE

### Administradores
```
Email: wamber.pacheco.12@gmail.com
Senha: adim18272313

Email: apgxavier@gmail.com
Senha: adim18272313
```

### Usuário Comum
```
Email: usuario@teste.com
Senha: senha123
```

### Coletor
```
Email: coletor@teste.com
Senha: senha123
```

---

## 🧪 COMO TESTAR

### 1. Popular o Banco
```bash
cd backend
npm run seed
```

### 2. Iniciar o Servidor
```bash
npm run dev
```

### 3. Testar Endpoints

#### Notícias Públicas
```bash
curl http://localhost:5000/api/public/news
```

#### Login Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wamber.pacheco.12@gmail.com","password":"adim18272313"}'
```

#### Criar Notícia (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "title": "Nova Notícia",
    "content": "Conteúdo da notícia",
    "image": "https://...",
    "category": "noticia"
  }'
```

#### Cadastrar Coletor (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/collectors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "phone": "(92) 99999-9999",
    "vehiclePlate": "XYZ-9876",
    "vehicleType": "truck"
  }'
```

---

## ⚠️ BREAKING CHANGES

### Para o Frontend:

1. **Roles mudaram:**
   - `collector` → `coletor`
   - `citizen` → `user`

2. **Novos campos no User:**
   - Adicionar suporte para `cpf`, `photo`, `googleId`

3. **Novas rotas públicas:**
   - Implementar carrossel de notícias na home
   - Consumir `/api/public/news`

4. **Verificação de admin:**
   - Sidebar admin só aparece para emails específicos
   - Usar `user.isSpecificAdmin()` ou verificar email no frontend

---

## 📝 PRÓXIMOS PASSOS

### Backend (Futuro)
- [ ] Implementar Google OAuth
- [ ] Integrar OSRM para rotas otimizadas
- [ ] Upload de imagens (Cloudinary/S3)
- [ ] Notificações push
- [ ] WebSocket para tracking em tempo real

### Frontend (Pendente)
- [ ] Refatorar para novos roles
- [ ] Criar home pública com carrossel
- [ ] Implementar Google OAuth
- [ ] Criar sidebar admin condicional
- [ ] Criar página exclusiva de coletores
- [ ] Atualizar todas as referências de roles

---

## 📚 DOCUMENTAÇÃO

- **GUIA_RAPIDO.md** - Guia rápido atualizado
- **REFATORACAO_BACKEND.md** - Este documento
- **backend/src/models/User.js** - Modelo User com comentários
- **backend/src/models/News.js** - Modelo News com comentários

---

## ✅ CHECKLIST DE REFATORAÇÃO

- [x] Atualizar roles no modelo User
- [x] Adicionar novos campos (cpf, photo, googleId)
- [x] Criar métodos de verificação de admin
- [x] Criar modelo News
- [x] Criar rotas públicas
- [x] Criar controller público
- [x] Criar controller de notícias
- [x] Atualizar rotas admin
- [x] Adicionar endpoint de cadastro de coletores
- [x] Atualizar middleware de roles
- [x] Criar script de seed
- [x] Atualizar server.js
- [x] Atualizar package.json
- [x] Atualizar documentação

---

**🎉 Refatoração do Backend Concluída!**

**Data:** 2025  
**Versão:** 2.0.0  
**Status:** ✅ Pronto para integração com frontend
