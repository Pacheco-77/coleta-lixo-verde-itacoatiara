# 📋 Resumo Completo do Projeto - Sistema de Coleta de Lixo Verde Itacoatiara

## 🎯 Visão Geral do Projeto

**Nome**: Sistema de Coleta de Lixo Verde - Itacoatiara/AM  
**Objetivo**: Plataforma web para gerenciar a coleta de resíduos verdes (folhas, galhos, podas) na cidade de Itacoatiara, conectando cidadãos, coletores e administradores.

---

## 🏗️ Arquitetura do Sistema

### **Modelo**: Client-Server (Cliente-Servidor)
- **Frontend**: Interface do usuário (navegador)
- **Backend**: Servidor de aplicação (API REST)
- **Banco de Dados**: MongoDB (NoSQL)

```
┌─────────────┐      HTTP/REST      ┌─────────────┐      Mongoose      ┌─────────────┐
│   FRONTEND  │ ◄─────────────────► │   BACKEND   │ ◄────────────────► │   MONGODB   │
│  (React)    │      Socket.io      │  (Node.js)  │                    │   (Atlas)   │
└─────────────┘                     └─────────────┘                    └─────────────┘
```

---

## 🎨 FRONTEND (Interface do Usuário)

### **Tecnologias Utilizadas**

#### **1. React 18.3.1** (Biblioteca JavaScript)
- **O que é**: Biblioteca para criar interfaces de usuário interativas
- **Por que usar**: Componentes reutilizáveis, performance, grande comunidade
- **Onde usa**: Toda a interface visual do projeto
- **Localização**: `/frontend/src/`

#### **2. TypeScript 5.4.5** (Linguagem)
- **O que é**: JavaScript com tipagem estática (detecta erros antes de rodar)
- **Por que usar**: Código mais seguro, autocompletar no editor, menos bugs
- **Onde usa**: Todos os arquivos `.tsx` e `.ts` do frontend
- **Exemplo**: Define tipos de dados como `User`, `CollectionPoint`, etc.

#### **3. Vite 7.2.4** (Bundler/Build Tool)
- **O que é**: Ferramenta moderna de build e desenvolvimento
- **Por que usar**: Extremamente rápido, hot reload instantâneo
- **Onde usa**: Compilação e servidor de desenvolvimento
- **Comando**: `npm run dev` inicia o servidor

#### **4. Tailwind CSS 3.4.3** (Framework CSS)
- **O que é**: Framework CSS utility-first (classes pré-prontas)
- **Por que usar**: Desenvolvimento rápido, design consistente, responsivo
- **Onde usa**: Estilização de todos os componentes
- **Exemplo**: `className="bg-green-700 text-white px-4 py-2 rounded-lg"`

#### **5. React Router DOM 7.1.1** (Roteamento)
- **O que é**: Biblioteca para navegação entre páginas
- **Por que usar**: SPA (Single Page Application) sem recarregar página
- **Onde usa**: Definição de rotas em `/frontend/src/App.tsx`
- **Rotas principais**:
  - `/` - Home pública
  - `/login` - Autenticação
  - `/admin/*` - Painel administrativo
  - `/cidadao/*` - Portal do cidadão
  - `/coletor/*` - Portal do coletor

#### **6. TanStack Query 5.64.2** (Gerenciamento de Estado)
- **O que é**: Biblioteca para cache e sincronização de dados do servidor
- **Por que usar**: Cache automático, revalidação, loading states
- **Onde usa**: Todas as requisições HTTP (fetch de dados)
- **Exemplo**: `useQuery` para buscar coletas, `useMutation` para criar

#### **7. Leaflet 1.9.4 + React Leaflet 4.2.1** (Mapas)
- **O que é**: Biblioteca de mapas interativos open-source
- **Por que usar**: Mapas sem custo, customizável, leve
- **Onde usa**: Visualização de pontos de coleta, rotas
- **Páginas com mapas**:
  - `/mapa` - Mapa público
  - `/mapa-coleta` - Pontos de coleta
  - `/admin/mapa-tempo-real` - Monitoramento

#### **8. Zustand 5.0.2** (Gerenciamento de Estado Global)
- **O que é**: Biblioteca minimalista para estado global
- **Por que usar**: Simples, performático, sem boilerplate
- **Onde usa**: Autenticação (estado do usuário logado)
- **Arquivo**: `/frontend/src/store/authStore.ts`

#### **9. Axios 1.7.9** (Cliente HTTP)
- **O que é**: Biblioteca para fazer requisições HTTP
- **Por que usar**: Interceptors, timeout, configuração centralizada
- **Onde usa**: Todas as chamadas à API
- **Arquivo**: `/frontend/src/lib/axios.ts`

#### **10. Sonner** (Notificações Toast)
- **O que é**: Biblioteca de notificações elegantes
- **Por que usar**: UX melhor, feedback visual
- **Onde usa**: Mensagens de sucesso/erro após ações

---

### **Estrutura do Frontend**

```
frontend/
├── src/
│   ├── App.tsx                    # Rotas principais
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Estilos globais
│   │
│   ├── components/                # Componentes reutilizáveis
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx        # Layout admin (verde)
│   │   │   ├── CitizenLayout.tsx      # Layout cidadão (azul)
│   │   │   └── CollectorLayout.tsx    # Layout coletor (laranja)
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx             # Botão customizado
│   │   │   ├── Card.tsx               # Cards
│   │   │   ├── DropdownMenu.tsx       # Menu suspenso recursivo
│   │   │   └── Loading.tsx            # Spinner de loading
│   │   │
│   │   ├── MapWrapper.tsx         # Wrapper para Leaflet
│   │   └── PrivateRoute.tsx       # Proteção de rotas
│   │
│   ├── pages/                     # Páginas do sistema
│   │   ├── public/                # Páginas públicas
│   │   │   ├── HomePage.tsx           # Landing page
│   │   │   ├── MapaColetaPage.tsx     # Mapa público
│   │   │   └── PublicMapPage.tsx      # Mapa geral
│   │   │
│   │   ├── auth/                  # Autenticação
│   │   │   ├── LoginPage.tsx          # Login
│   │   │   └── RegisterPage.tsx       # Cadastro
│   │   │
│   │   ├── admin/                 # Painel administrativo
│   │   │   ├── AdminDashboard.tsx     # Dashboard admin
│   │   │   ├── NewsManagementPage.tsx # Gerenciar notícias
│   │   │   └── MapaTempoRealPage.tsx  # Mapa tempo real
│   │   │
│   │   ├── citizen/               # Portal do cidadão
│   │   │   ├── CitizenDashboard.tsx   # Dashboard cidadão
│   │   │   ├── NewCollectionPage.tsx  # Solicitar coleta
│   │   │   └── MyCollectionsPage.tsx  # Minhas coletas
│   │   │
│   │   └── collector/             # Portal do coletor
│   │       ├── CollectorDashboard.tsx # Dashboard coletor
│   │       └── CurrentRoutePage.tsx   # Rota atual
│   │
│   ├── services/                  # Camada de comunicação com API
│   │   ├── authService.ts             # Login, registro
│   │   ├── citizenService.ts          # Serviços do cidadão
│   │   ├── collectorService.ts        # Serviços do coletor
│   │   ├── publicService.ts           # Dados públicos
│   │   └── pontosService.ts           # Pontos de coleta
│   │
│   ├── store/                     # Estado global
│   │   └── authStore.ts               # Zustand store (auth)
│   │
│   ├── types/                     # Definições TypeScript
│   │   └── index.ts                   # Todos os tipos
│   │
│   └── utils/                     # Utilitários
│       └── constants.ts               # Constantes
│
├── package.json                   # Dependências
├── vite.config.ts                 # Config Vite
├── tailwind.config.js             # Config Tailwind
└── tsconfig.json                  # Config TypeScript
```

---

## ⚙️ BACKEND (Servidor de Aplicação)

### **Tecnologias Utilizadas**

#### **1. Node.js 20.19.6** (Runtime JavaScript)
- **O que é**: Ambiente para executar JavaScript no servidor
- **Por que usar**: Performance, ecossistema npm, JavaScript full-stack
- **Onde usa**: Executa toda a lógica do servidor
- **Comando**: `npm start` inicia o servidor

#### **2. Express 4.18** (Framework Web)
- **O que é**: Framework minimalista para criar APIs REST
- **Por que usar**: Simples, flexível, middlewares
- **Onde usa**: Roteamento HTTP, middlewares, controllers
- **Arquivo**: `/backend/src/server.js`

#### **3. MongoDB + Mongoose 8.x** (Banco de Dados)
- **O que é**: 
  - MongoDB: Banco NoSQL orientado a documentos (JSON)
  - Mongoose: ODM (Object Document Mapper) - ORM do MongoDB
- **Por que usar**: Flexível, escalável, schemas dinâmicos
- **Onde usa**: Armazenamento de todos os dados
- **Conexão**: MongoDB Atlas (cloud) - cluster M0 (gratuito)
- **Arquivo**: `/backend/src/config/database.js`

#### **4. Socket.io** (WebSockets)
- **O que é**: Biblioteca para comunicação real-time
- **Por que usar**: Notificações instantâneas, atualização de mapas
- **Onde usa**: Notificar admins sobre novas coletas
- **Arquivo**: `/backend/src/config/socket.js`

#### **5. JWT (JsonWebToken)** (Autenticação)
- **O que é**: Padrão para tokens de autenticação
- **Por que usar**: Stateless, seguro, escalável
- **Onde usa**: Login/autenticação de usuários
- **Arquivo**: `/backend/src/middleware/auth.js`

#### **6. Bcryptjs** (Criptografia)
- **O que é**: Biblioteca para hash de senhas
- **Por que usar**: Segurança - senhas nunca são salvas em texto
- **Onde usa**: Criação e validação de senhas
- **Arquivo**: `/backend/src/models/User.js`

#### **7. Multer** (Upload de Arquivos)
- **O que é**: Middleware para upload de arquivos
- **Por que usar**: Processar imagens de denúncias/coletas
- **Onde usa**: Upload de fotos
- **Arquivo**: `/backend/src/middleware/upload.js`

#### **8. Express Validator** (Validação)
- **O que é**: Middleware para validar dados de entrada
- **Por que usar**: Segurança, validação consistente
- **Onde usa**: Validação de formulários
- **Arquivo**: `/backend/src/middleware/validation.js`

---

### **Estrutura do Backend**

```
backend/
├── src/
│   ├── server.js                  # Entry point do servidor
│   │
│   ├── config/                    # Configurações
│   │   ├── auth.js                    # Config JWT
│   │   ├── database.js                # Conexão MongoDB
│   │   ├── socket.js                  # Config Socket.io
│   │   └── seedNews.js                # Seed de notícias
│   │
│   ├── models/                    # Modelos de dados (Mongoose)
│   │   ├── User.js                    # Usuários (admin/coletor/cidadão)
│   │   ├── CollectionPoint.js         # Pontos de coleta
│   │   ├── PontoColeta.js             # Pontos fixos
│   │   ├── Route.js                   # Rotas dos coletores
│   │   ├── CheckIn.js                 # Check-ins
│   │   ├── Complaint.js               # Denúncias
│   │   ├── News.js                    # Notícias
│   │   └── Report.js                  # Relatórios
│   │
│   ├── controllers/               # Lógica de negócio
│   │   ├── authController.js          # Login, registro
│   │   ├── adminController.js         # Funções admin
│   │   ├── citizenController.js       # Funções cidadão
│   │   ├── collectorController.js     # Funções coletor
│   │   ├── complaintController.js     # Denúncias
│   │   ├── newsController.js          # Notícias
│   │   └── publicController.js        # Dados públicos
│   │
│   ├── routes/                    # Rotas HTTP
│   │   ├── auth.js                    # POST /api/auth/login
│   │   ├── admin.js                   # /api/admin/*
│   │   ├── citizen.js                 # /api/citizen/*
│   │   ├── collector.js               # /api/collector/*
│   │   ├── complaints.js              # /api/complaints/*
│   │   ├── public.js                  # /api/public/*
│   │   ├── pontos.js                  # /api/pontos/*
│   │   └── upload.js                  # /api/upload/*
│   │
│   ├── middleware/                # Middlewares
│   │   ├── auth.js                    # authenticate()
│   │   ├── roleCheck.js               # requireRole()
│   │   ├── validation.js              # handleValidationErrors()
│   │   ├── upload.js                  # uploadSingle(), uploadMultiple()
│   │   └── errorHandler.js            # Tratamento de erros
│   │
│   ├── services/                  # Serviços externos
│   │   ├── emailService.js            # Envio de emails
│   │   ├── smsService.js              # SMS (futuro)
│   │   ├── whatsappService.js         # WhatsApp (futuro)
│   │   ├── reportGenerator.js         # Gerar PDFs
│   │   └── routeOptimizer.js          # Otimizar rotas
│   │
│   └── utils/                     # Utilitários
│       ├── constants.js               # Constantes
│       ├── helpers.js                 # Funções auxiliares
│       ├── logger.js                  # Winston logger
│       └── validators.js              # Validadores custom
│
├── uploads/                       # Arquivos enviados
│   ├── complaints/                    # Fotos de denúncias
│   └── collections/                   # Fotos de coletas
│
├── logs/                          # Logs do sistema
│   ├── error.log                      # Erros
│   └── combined.log                   # Todos os logs
│
├── package.json                   # Dependências
├── .env                           # Variáveis de ambiente
└── create-admins.js               # Script criar admins
```

---

## 🗄️ BANCO DE DADOS (MongoDB)

### **Modelo de Dados**

#### **Collections (Tabelas)**

##### **1. users** - Usuários do Sistema
```javascript
{
  _id: ObjectId,
  name: String,              // Nome completo
  email: String,             // Email (único)
  password: String,          // Hash bcrypt
  phone: String,             // Telefone
  role: String,              // "admin", "coletor", "user"
  address: {
    street: String,
    number: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    location: {
      type: "Point",
      coordinates: [lng, lat]  // GeoJSON
    }
  },
  collectorInfo: {           // Apenas para role="coletor"
    vehicleType: String,
    vehiclePlate: String,
    currentRoute: ObjectId   // Ref: Route
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

##### **2. collectionpoints** - Pontos de Coleta (Solicitações)
```javascript
{
  _id: ObjectId,
  citizen: ObjectId,         // Ref: User (quem solicitou)
  wasteType: String,         // "folhas", "galhos", "podas", etc.
  estimatedQuantity: {
    value: Number,
    unit: String             // "kg", "m³", "sacas"
  },
  description: String,
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    reference: String,
    location: {
      type: "Point",
      coordinates: [lng, lat]
    }
  },
  photos: [String],          // URLs das fotos
  status: String,            // "pending", "scheduled", "collected", "cancelled"
  scheduledDate: Date,
  scheduledTimeSlot: {
    start: String,           // "08:00"
    end: String              // "12:00"
  },
  assignedCollector: ObjectId, // Ref: User
  route: ObjectId,           // Ref: Route
  actualQuantity: {
    value: Number,
    unit: String
  },
  collectionDate: Date,
  collectionNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

##### **3. pontocoletas** - Pontos Fixos de Coleta
```javascript
{
  _id: ObjectId,
  nome: String,
  descricao: String,
  endereco: String,
  bairro: String,
  latitude: Number,
  longitude: Number,
  horario_funcionamento: String,
  dias_coleta: [String],
  tipos_residuos: [String],
  status: String,            // "pendente", "em_andamento", "concluido"
  capacidade_maxima: Number,
  capacidade_atual: Number,
  responsavel: String,
  telefone: String,
  observacoes: String,
  ultima_coleta: Date,
  proxima_coleta: Date,
  createdAt: Date,
  updatedAt: Date
}
```

##### **4. routes** - Rotas de Coleta
```javascript
{
  _id: ObjectId,
  name: String,              // "Rota Zona Norte - 05/12"
  assignedCollector: ObjectId, // Ref: User
  collectionPoints: [ObjectId], // Refs: CollectionPoint
  scheduledDate: Date,
  startTime: Date,
  endTime: Date,
  status: String,            // "planned", "in-progress", "completed"
  estimatedDuration: Number, // minutos
  actualDuration: Number,
  distance: Number,          // km
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

##### **5. checkins** - Check-ins dos Coletores
```javascript
{
  _id: ObjectId,
  collector: ObjectId,       // Ref: User
  collectionPoint: ObjectId, // Ref: CollectionPoint
  route: ObjectId,           // Ref: Route
  checkInTime: Date,
  checkOutTime: Date,
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  photos: [String],
  notes: String,
  actualQuantity: {
    value: Number,
    unit: String
  },
  createdAt: Date
}
```

##### **6. complaints** - Denúncias
```javascript
{
  _id: ObjectId,
  citizen: ObjectId,         // Ref: User
  type: String,              // "descarte_irregular", "queimada", etc.
  title: String,
  description: String,
  location: {
    type: "Point",
    coordinates: [lng, lat]
  },
  address: {
    street: String,
    neighborhood: String
  },
  photos: [String],
  status: String,            // "pendente", "em-andamento", "resolvida", "rejeitada"
  priority: String,          // "baixa", "media", "alta", "urgente"
  assignedTo: ObjectId,      // Ref: User (admin)
  resolution: {
    resolvedAt: Date,
    resolvedBy: ObjectId,
    notes: String,
    actions: String
  },
  timeline: [{
    action: String,
    user: ObjectId,
    timestamp: Date,
    notes: String
  }],
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date            // Soft delete
}
```

##### **7. news** - Notícias
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,              // URL-friendly
  category: String,          // "noticia", "evento", "alerta", "informacao"
  summary: String,
  content: String,           // HTML
  featuredImage: String,     // URL
  images: [String],
  author: ObjectId,          // Ref: User
  status: String,            // "rascunho", "publicado", "arquivado"
  publishedAt: Date,
  tags: [String],
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### **Índices Geoespaciais**
- **users.address.location**: 2dsphere (busca por proximidade)
- **collectionpoints.address.location**: 2dsphere
- **pontocoletas**: compound index (latitude, longitude)
- **complaints.location**: 2dsphere

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### **Fluxo de Autenticação**

```
1. REGISTRO
   Usuário → POST /api/auth/register
   {
     name, email, password, phone, address
   }
   ↓
   Backend: Hash senha com bcrypt
   ↓
   Salva no MongoDB
   ↓
   Retorna: { user, token }

2. LOGIN
   Usuário → POST /api/auth/login
   {
     email, password
   }
   ↓
   Backend: Busca usuário por email
   ↓
   Compara senha com bcrypt
   ↓
   Gera JWT token (válido 7 dias)
   ↓
   Retorna: { user, token }

3. ACESSO A ROTAS PROTEGIDAS
   Usuário → GET /api/citizen/collection-points
   Header: Authorization: Bearer <token>
   ↓
   Middleware authenticate()
   ↓
   Verifica token JWT
   ↓
   Decodifica: { userId, role, email }
   ↓
   Adiciona req.userId, req.userRole
   ↓
   Middleware requireRole('user')
   ↓
   Verifica se role == 'user'
   ↓
   Executa controller
```

### **Papéis (Roles)**

#### **1. admin** - Administrador
- Gerenciar todos os usuários
- Ver todas as coletas e rotas
- Aprovar/rejeitar denúncias
- Criar/editar notícias
- Gerar relatórios
- Visualizar mapas em tempo real

#### **2. coletor** - Coletor
- Ver rota do dia
- Fazer check-in/check-out
- Atualizar localização
- Registrar coletas realizadas
- Reportar problemas

#### **3. user** - Cidadão
- Solicitar coletas
- Ver histórico de solicitações
- Fazer denúncias
- Ver mapa de pontos fixos
- Receber notificações

---

## 🌐 API REST - Endpoints Principais

### **Públicos (sem autenticação)**
```
GET  /api/public/news              # Listar notícias
GET  /api/public/news/:slug        # Detalhes da notícia
GET  /api/public/statistics        # Estatísticas públicas
GET  /api/pontos                   # Pontos fixos de coleta
```

### **Autenticação**
```
POST /api/auth/register            # Cadastro
POST /api/auth/login               # Login
GET  /api/auth/me                  # Dados do usuário logado
```

### **Cidadão (role: user)**
```
POST /api/citizen/collection-points          # Solicitar coleta
GET  /api/citizen/collection-points          # Minhas solicitações
GET  /api/citizen/collection-points/:id      # Detalhes
PUT  /api/citizen/collection-points/:id      # Atualizar
DELETE /api/citizen/collection-points/:id    # Cancelar
```

### **Coletor (role: coletor)**
```
GET  /api/collector/current-route            # Rota atual
POST /api/collector/routes/:id/start        # Iniciar rota
POST /api/collector/routes/:id/complete     # Finalizar rota
POST /api/collector/checkin/:pointId        # Check-in
POST /api/collector/location                # Atualizar GPS
GET  /api/collector/metrics                 # Métricas
```

### **Admin (role: admin)**
```
GET  /api/admin/users                       # Listar usuários
POST /api/admin/users                       # Criar usuário
GET  /api/admin/dashboard                   # Dashboard stats
GET  /api/admin/collection-points           # Todas as coletas
POST /api/admin/routes                      # Criar rota
```

### **Denúncias**
```
POST /api/complaints                        # Criar denúncia
GET  /api/complaints/my                     # Minhas denúncias
GET  /api/complaints/admin/all              # Todas (admin)
POST /api/complaints/admin/:id/resolve      # Resolver (admin)
POST /api/complaints/admin/:id/reject       # Rejeitar (admin)
```

### **Upload**
```
POST /api/upload/image                      # Upload single
POST /api/upload/images                     # Upload múltiplo
```

---

## 🚀 FLUXO DE FUNCIONAMENTO

### **1. Cidadão Solicita Coleta**
```
1. Acessa /cidadao/nova-coleta
2. Preenche formulário:
   - Tipo de resíduo
   - Quantidade estimada
   - Descrição
   - Endereço
   - GPS (captura automática)
   - Data desejada
   - Horário preferido
3. Frontend valida dados
4. POST /api/citizen/collection-points
5. Backend:
   - Valida autenticação (JWT)
   - Valida dados (express-validator)
   - Salva no MongoDB
   - Emite evento Socket.io para admins
6. Retorna confirmação
7. Frontend mostra toast de sucesso
```

### **2. Admin Organiza Rota**
```
1. Acessa /admin/dashboard
2. Vê coletas pendentes
3. Seleciona coletas por região
4. Atribui coletor
5. Define data/horário
6. POST /api/admin/routes
7. Backend:
   - Cria documento Route
   - Atualiza collectionPoints (status → scheduled)
   - Atualiza User.collectorInfo.currentRoute
   - Notifica coletor (Socket.io)
```

### **3. Coletor Executa Rota**
```
1. Acessa /coletor/rota-atual
2. GET /api/collector/current-route
3. Vê lista de pontos no mapa
4. POST /api/collector/routes/:id/start
5. Para cada ponto:
   a. Navega até endereço
   b. POST /api/collector/checkin/:pointId
      - Envia GPS atual
      - Registra hora
   c. Realiza coleta
   d. Tira fotos (opcional)
   e. Registra quantidade real
   f. POST /api/collector/checkin/:pointId (checkout)
6. POST /api/collector/routes/:id/complete
7. Backend atualiza status → completed
```

### **4. Atualização em Tempo Real**
```
Socket.io conecta:
- Admin Dashboard
- Mapa Tempo Real

Eventos emitidos:
- new-collection-point → Novo ponto solicitado
- route-started → Rota iniciada
- check-in → Coletor fez check-in
- collection-completed → Coleta finalizada
- location-update → GPS do coletor atualizado

Frontend ouve eventos e atualiza UI automaticamente
```

---

## 📱 MENUS E NAVEGAÇÃO

### **Menu Suspenso Recursivo** (DropdownMenu.tsx)
- **Desktop**: Hover abre submenu
- **Mobile**: Click abre submenu inline
- **Recursivo**: Suporta N níveis de profundidade
- **3 Esquemas de Cores**:
  - Verde (Admin)
  - Azul (Cidadão)
  - Laranja (Coletor)

### **Estrutura de Menus**

#### **Admin (Verde)**
```
- Dashboard
- Usuários
  └─ Gerenciar Usuários
  └─ Permissões
- Rotas
- Relatórios
  └─ Visão Geral
  └─ Análise de Dados
  └─ Estatísticas
- Notícias
```

#### **Cidadão (Azul)**
```
- Dashboard
- Coletas
  └─ Nova Solicitação
  └─ Minhas Coletas
- Mapa
- Denúncias
- Notificações
```

#### **Coletor (Laranja)**
```
- Dashboard
- Rotas
  └─ Rota Atual
  └─ Histórico
- Check-in
- Localização
- Desempenho
  └─ Minhas Métricas
  └─ Relatórios
- Problemas
```

---

## 🎨 DESIGN SYSTEM

### **Paleta de Cores**
```css
--verde-escuro: #2E7D32    (Primário)
--verde-medio: #4CAF50     (Secundário)
--azul: #1976D2            (Informação)
--laranja: #FF6D00         (Ação/Destaque)
--cinza-escuro: #455A64    (Texto)
--cinza-claro: #F5F5F5     (Fundo)
```

### **Componentes UI**
- **Button**: 4 variantes (primary, secondary, outline, ghost)
- **Card**: Container com sombra e hover
- **Loading**: Spinner em 3 tamanhos
- **DropdownMenu**: Menu recursivo com hover

---

## 🔧 VARIÁVEIS DE AMBIENTE

### **Backend (.env)**
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/coleta-lixo-verde

# JWT
JWT_SECRET=chave-secreta-super-segura
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:5000
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

### **Frontend (package.json)**
```json
{
  "react": "^18.3.1",
  "typescript": "^5.4.5",
  "vite": "^7.2.4",
  "tailwindcss": "^3.4.3",
  "react-router-dom": "^7.1.1",
  "@tanstack/react-query": "^5.64.2",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "zustand": "^5.0.2",
  "axios": "^1.7.9",
  "sonner": "^1.7.2"
}
```

### **Backend (package.json)**
```json
{
  "express": "^4.18.0",
  "mongoose": "^8.0.0",
  "socket.io": "^4.7.2",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "multer": "^1.4.5-lts.1",
  "express-validator": "^7.0.1",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "winston": "^3.11.0"
}
```

---

## 🚀 COMANDOS DE EXECUÇÃO

### **Desenvolvimento Local**

#### **Backend**
```bash
cd backend
npm install              # Instalar dependências
npm start                # Iniciar servidor (porta 5000)
```

#### **Frontend**
```bash
cd frontend
npm install              # Instalar dependências
npm run dev              # Iniciar Vite (porta 5173)
```

### **Produção (Render.com)**

#### **Backend**
```bash
npm install
npm start
```

#### **Frontend**
```bash
npm install
npm run build            # Gera pasta dist/
# Render serve os arquivos estáticos
```

---

## 🌍 DEPLOY (Render.com)

### **Backend**
- **Tipo**: Web Service
- **Ambiente**: Node
- **Build**: `npm install`
- **Start**: `npm start`
- **Porta**: 5000
- **Health Check**: GET /
- **Auto Deploy**: main branch (GitHub)

### **Frontend**
- **Tipo**: Static Site
- **Build**: `npm run build`
- **Publish**: `dist/`
- **Auto Deploy**: main branch (GitHub)

### **MongoDB**
- **Provider**: MongoDB Atlas
- **Tier**: M0 (Free)
- **Região**: AWS São Paulo (sa-east-1)

---

## 📊 ESTATÍSTICAS DO PROJETO

- **Linhas de Código Frontend**: ~15.000
- **Linhas de Código Backend**: ~8.000
- **Total de Componentes React**: 45+
- **Total de Endpoints API**: 80+
- **Total de Models MongoDB**: 7
- **Total de Páginas**: 20+
- **Tempo de Build Frontend**: ~5s
- **Tempo de Deploy**: ~3min

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

✅ Sistema de autenticação completo (JWT)  
✅ Cadastro e login de usuários  
✅ Dashboard para 3 tipos de usuários  
✅ Solicitação de coleta com GPS  
✅ Sistema de rotas para coletores  
✅ Check-in/check-out de coletas  
✅ Mapas interativos (Leaflet)  
✅ Sistema de denúncias  
✅ Gerenciamento de notícias  
✅ Upload de imagens  
✅ Notificações em tempo real (Socket.io)  
✅ Menus suspensos recursivos  
✅ Design responsivo (mobile-first)  
✅ Validação de formulários  
✅ Tratamento de erros  
✅ Logs do sistema  

---

## 📝 RESUMO PARA APRESENTAÇÃO

### **Em 30 Segundos**
Sistema web full-stack para gerenciar coleta de lixo verde em Itacoatiara. Frontend em React com TypeScript, backend em Node.js com Express, banco MongoDB. Possui 3 portais (Admin, Cidadão, Coletor), mapas interativos, autenticação JWT e notificações real-time.

### **Em 2 Minutos**
Plataforma completa de gestão de coleta de resíduos verdes desenvolvida com tecnologias modernas. O frontend usa React 18 com TypeScript para tipagem segura, Tailwind CSS para estilização rápida, e React Query para cache inteligente de dados. Mapas interativos com Leaflet permitem visualização geoespacial dos pontos de coleta.

O backend em Node.js com Express fornece API REST robusta, autenticação JWT com bcrypt para segurança de senhas, e MongoDB para persistência flexível de dados. Socket.io possibilita notificações instantâneas. O sistema tem 3 níveis de acesso: administrador gerencia tudo, coletor executa rotas, cidadão solicita coletas.

Totalmente responsivo, com menus suspensos recursivos que funcionam por hover no desktop e click no mobile. Deploy automatizado no Render.com com integração GitHub.

---

**Desenvolvido por:** Pacheco  
**Tecnologias:** React + TypeScript + Node.js + MongoDB  
**Repositório:** coleta-lixo-verde-itacoatiara  
**Última Atualização:** 05/12/2025
