# 📁 Estrutura Completa do Projeto

## Sistema de Coleta de Lixo Verde - Itacoatiara-AM

---

## 🌳 Árvore de Diretórios

```
projeto-web-2.0/
│
├── 📄 README.md                          # Documentação principal
├── 📄 TODO.md                            # Lista de tarefas e progresso
├── 📄 PROJECT_SUMMARY.md                 # Resumo completo do projeto
├── 📄 PROJECT_STRUCTURE.md               # Este arquivo
├── 📄 .gitignore                         # Arquivos ignorados pelo Git
│
├── 📁 backend/                           # API Node.js + Express
│   │
│   ├── 📄 package.json                   # Dependências do backend
│   ├── 📄 .env                           # Variáveis de ambiente (não versionado)
│   ├── 📄 .env.example                   # Exemplo de variáveis de ambiente
│   │
│   ├── 📁 src/                           # Código fonte
│   │   │
│   │   ├── 📄 server.js                  # Servidor principal Express
│   │   │
│   │   ├── 📁 config/                    # Configurações
│   │   │   ├── 📄 database.js            # Conexão MongoDB
│   │   │   ├── 📄 auth.js                # Configuração JWT e 2FA
│   │   │   └── 📄 socket.js              # Configuração Socket.io
│   │   │
│   │   ├── 📁 models/                    # Modelos Mongoose
│   │   │   ├── 📄 User.js                # Modelo de usuário
│   │   │   ├── 📄 CollectionPoint.js     # Modelo de ponto de coleta
│   │   │   ├── 📄 Route.js               # Modelo de rota
│   │   │   ├── 📄 CheckIn.js             # Modelo de check-in
│   │   │   └── 📄 Report.js              # Modelo de relatório
│   │   │
│   │   ├── 📁 controllers/               # Controladores
│   │   │   ├── 📄 authController.js      # Autenticação
│   │   │   ├── 📄 adminController.js     # Administração
│   │   │   ├── 📄 collectorController.js # Coletores
│   │   │   └── 📄 citizenController.js   # Cidadãos
│   │   │
│   │   ├── 📁 routes/                    # Rotas da API
│   │   │   ├── 📄 auth.js                # Rotas de autenticação
│   │   │   ├── 📄 admin.js               # Rotas administrativas
│   │   │   ├── 📄 collector.js           # Rotas dos coletores
│   │   │   └── 📄 citizen.js             # Rotas dos cidadãos
│   │   │
│   │   ├── 📁 middleware/                # Middlewares
│   │   │   ├── 📄 auth.js                # Autenticação JWT
│   │   │   ├── 📄 roleCheck.js           # Verificação de permissões
│   │   │   ├── 📄 validation.js          # Validações
│   │   │   └── 📄 errorHandler.js        # Tratamento de erros
│   │   │
│   │   ├── 📁 services/                  # Serviços externos
│   │   │   ├── 📄 emailService.js        # Envio de emails
│   │   │   ├── 📄 smsService.js          # Envio de SMS
│   │   │   ├── 📄 whatsappService.js     # Mensagens WhatsApp
│   │   │   ├── 📄 routeOptimizer.js      # Otimização de rotas
│   │   │   └── 📄 reportGenerator.js     # Geração de relatórios
│   │   │
│   │   ├── 📁 utils/                     # Utilitários
│   │   │   ├── 📄 logger.js              # Sistema de logs
│   │   │   ├── 📄 validators.js          # Validadores customizados
│   │   │   ├── 📄 helpers.js             # Funções auxiliares
│   │   │   └── 📄 constants.js           # Constantes do sistema
│   │   │
│   │   └── 📁 sockets/                   # Handlers WebSocket
│   │       └── 📄 collectionSocket.js    # Socket de coleta
│   │
│   ├── 📁 logs/                          # Logs do sistema
│   │   ├── 📄 error.log                  # Logs de erro
│   │   └── 📄 combined.log               # Logs combinados
│   │
│   └── 📁 uploads/                       # Arquivos enviados
│       └── 📄 .gitkeep
│
├── 📁 frontend/                          # Aplicação React
│   │
│   ├── 📄 package.json                   # Dependências do frontend
│   ├── 📄 .env                           # Variáveis de ambiente (não versionado)
│   ├── 📄 .env.example                   # Exemplo de variáveis de ambiente
│   │
│   ├── 📁 public/                        # Arquivos públicos
│   │   ├── 📄 index.html                 # HTML principal
│   │   ├── 📄 manifest.json              # Manifest PWA
│   │   ├── 📄 favicon.ico                # Ícone do site
│   │   ├── 📄 logo192.png                # Logo 192x192
│   │   ├── 📄 logo512.png                # Logo 512x512
│   │   └── 📁 assets/                    # Assets estáticos
│   │       ├── 📁 images/
│   │       └── 📁 icons/
│   │
│   └── 📁 src/                           # Código fonte React
│       │
│       ├── 📄 index.js                   # Ponto de entrada
│       ├── 📄 App.jsx                    # Componente principal
│       ├── 📄 routes.jsx                 # Configuração de rotas
│       ├── 📄 reportWebVitals.js         # Métricas de performance
│       │
│       ├── 📁 components/                # Componentes React
│       │   │
│       │   ├── 📁 common/                # Componentes comuns
│       │   │   ├── 📄 Header.jsx
│       │   │   ├── 📄 Footer.jsx
│       │   │   ├── 📄 Sidebar.jsx
│       │   │   ├── 📄 Button.jsx
│       │   │   ├── 📄 Modal.jsx
│       │   │   ├── 📄 Loader.jsx
│       │   │   └── 📄 Card.jsx
│       │   │
│       │   ├── 📁 maps/                  # Componentes de mapa
│       │   │   ├── 📄 InteractiveMap.jsx
│       │   │   ├── 📄 RouteMap.jsx
│       │   │   └── 📄 MarkerCluster.jsx
│       │   │
│       │   ├── 📁 dashboard/             # Componentes de dashboard
│       │   │   ├── 📄 StatCard.jsx
│       │   │   ├── 📄 Chart.jsx
│       │   │   └── 📄 ReportTable.jsx
│       │   │
│       │   └── 📁 forms/                 # Componentes de formulário
│       │       ├── 📄 LoginForm.jsx
│       │       ├── 📄 RegisterForm.jsx
│       │       └── 📄 WasteForm.jsx
│       │
│       ├── 📁 pages/                     # Páginas
│       │   │
│       │   ├── 📄 Home.jsx               # Página inicial
│       │   ├── 📄 Login.jsx              # Página de login
│       │   ├── 📄 Register.jsx           # Página de registro
│       │   │
│       │   ├── 📁 admin/                 # Páginas do admin
│       │   │   ├── 📄 Dashboard.jsx
│       │   │   ├── 📄 MapView.jsx
│       │   │   ├── 📄 Reports.jsx
│       │   │   ├── 📄 RouteManagement.jsx
│       │   │   └── 📄 UserManagement.jsx
│       │   │
│       │   ├── 📁 collector/             # Páginas do coletor
│       │   │   ├── 📄 Dashboard.jsx
│       │   │   ├── 📄 RouteView.jsx
│       │   │   ├── 📄 CheckIn.jsx
│       │   │   └── 📄 History.jsx
│       │   │
│       │   └── 📁 citizen/               # Páginas do cidadão
│       │       ├── 📄 Home.jsx
│       │       ├── 📄 RegisterWaste.jsx
│       │       ├── 📄 Schedule.jsx
│       │       └── 📄 PublicMap.jsx
│       │
│       ├── 📁 services/                  # Serviços
│       │   ├── 📄 api.js                 # Cliente API
│       │   ├── 📄 auth.js                # Serviço de autenticação
│       │   ├── 📄 map.js                 # Serviço de mapas
│       │   └── 📄 socket.js              # Cliente Socket.io
│       │
│       ├── 📁 context/                   # Context API
│       │   ├── 📄 AuthContext.jsx        # Contexto de autenticação
│       │   └── 📄 NotificationContext.jsx # Contexto de notificações
│       │
│       ├── 📁 hooks/                     # Custom Hooks
│       │   ├── 📄 useAuth.js
│       │   ├── 📄 useSocket.js
│       │   └── 📄 useMap.js
│       │
│       ├── 📁 utils/                     # Utilitários
│       │   ├── 📄 validators.js
│       │   ├── 📄 formatters.js
│       │   └── 📄 constants.js
│       │
│       └── 📁 styles/                    # Estilos
│           ├── 📄 global.css             # Estilos globais
│           ├── 📄 variables.css          # Variáveis CSS
│           └── 📄 responsive.css         # Media queries
│
└── 📁 docs/                              # Documentação
    ├── 📄 API.md                         # Documentação da API
    ├── 📄 SETUP.md                       # Guia de instalação
    └── 📄 DEPLOYMENT.md                  # Guia de deploy
```

---

## 📊 Estatísticas do Projeto

### Arquivos Criados
- **Backend:** 30+ arquivos
- **Frontend:** 10+ arquivos (estrutura inicial)
- **Documentação:** 5 arquivos
- **Total:** 45+ arquivos

### Linhas de Código
- **Backend:** ~6.000 linhas
- **Frontend:** ~2.000 linhas (estrutura inicial)
- **Total:** ~8.000+ linhas

### Endpoints API
- **Autenticação:** 10 endpoints
- **Administrador:** 13 endpoints
- **Coletor:** 8 endpoints
- **Cidadão:** 9 endpoints
- **Total:** 40+ endpoints

---

## 🎯 Arquivos Principais

### Backend

#### Configuração
- `server.js` - Servidor Express principal
- `config/database.js` - Conexão MongoDB
- `config/auth.js` - JWT e 2FA
- `config/socket.js` - WebSocket

#### Modelos
- `models/User.js` - Usuários (admin, collector, citizen)
- `models/CollectionPoint.js` - Pontos de coleta
- `models/Route.js` - Rotas de coleta
- `models/CheckIn.js` - Check-ins
- `models/Report.js` - Relatórios

#### Controladores
- `controllers/authController.js` - Autenticação completa
- `controllers/adminController.js` - Gestão administrativa
- `controllers/collectorController.js` - Funcionalidades do coletor
- `controllers/citizenController.js` - Funcionalidades do cidadão

#### Serviços
- `services/emailService.js` - Envio de emails
- `services/smsService.js` - Envio de SMS
- `services/whatsappService.js` - Mensagens WhatsApp
- `services/routeOptimizer.js` - Otimização de rotas
- `services/reportGenerator.js` - Geração de relatórios

### Frontend

#### Estrutura Base
- `index.js` - Ponto de entrada React
- `App.jsx` - Componente principal
- `styles/global.css` - Estilos globais completos

#### Configuração
- `package.json` - Dependências React
- `.env` - Variáveis de ambiente
- `public/index.html` - HTML base

---

## 🔧 Tecnologias por Arquivo

### Backend

**JavaScript/Node.js:**
- Express.js (servidor)
- Mongoose (MongoDB)
- Socket.io (WebSocket)
- JWT (autenticação)
- Bcrypt (criptografia)
- Winston (logging)
- Nodemailer (email)
- Twilio (SMS)

### Frontend

**JavaScript/React:**
- React 18 (UI)
- React Router (rotas)
- Leaflet (mapas)
- Chart.js (gráficos)
- Axios (HTTP)
- Socket.io Client (WebSocket)

---

## 📦 Dependências

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "socket.io": "^4.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "speakeasy": "^2.0.0",
    "nodemailer": "^6.9.7",
    "twilio": "^4.19.0",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "socket.io-client": "^4.6.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  }
}
```

---

## 🚀 Comandos Úteis

### Backend
```bash
# Instalar dependências
cd backend && npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar servidor de produção
npm start

# Executar testes
npm test
```

### Frontend
```bash
# Instalar dependências
cd frontend && npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

---

## 📝 Convenções de Código

### Nomenclatura
- **Arquivos:** camelCase.js
- **Componentes:** PascalCase.jsx
- **Variáveis:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Classes:** PascalCase

### Estrutura
- **Controllers:** Funções assíncronas com try-catch
- **Models:** Schemas Mongoose com validações
- **Routes:** Agrupadas por funcionalidade
- **Components:** Componentes funcionais com hooks

---

## 🔒 Segurança

### Arquivos Sensíveis (não versionados)
- `backend/.env`
- `frontend/.env`
- `backend/logs/`
- `backend/uploads/`
- `node_modules/`

### Arquivos de Exemplo (versionados)
- `backend/.env.example`
- `frontend/.env.example`

---

## 📚 Documentação Adicional

- [README.md](./README.md) - Visão geral
- [TODO.md](./TODO.md) - Progresso
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Resumo completo
- [docs/SETUP.md](./docs/SETUP.md) - Instalação
- [docs/API.md](./docs/API.md) - API (a criar)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deploy (a criar)

---

**Última Atualização:** 2024  
**Versão:** 1.0.0  
**Status:** Backend 100% ✅ | Frontend 15% ⏳
