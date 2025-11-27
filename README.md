# 🌿 Sistema de Coleta de Lixo Verde - Itacoatiara/AM

Sistema completo de gerenciamento de coleta de lixo verde para a cidade de Itacoatiara, Amazonas. Desenvolvido com tecnologias modernas para facilitar o agendamento, rastreamento e otimização das rotas de coleta.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documentação)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O Sistema de Coleta de Lixo Verde foi desenvolvido para modernizar e otimizar o processo de coleta de resíduos verdes (folhas, galhos, grama, etc.) em Itacoatiara. O sistema oferece:

- **Para Cidadãos:** Agendamento fácil de coletas, acompanhamento em tempo real
- **Para Coletores:** Rotas otimizadas, check-in em pontos de coleta
- **Para Administradores:** Gerenciamento completo, relatórios e estatísticas

## ✨ Funcionalidades

### 🏠 Página Pública
- ✅ Carrossel de notícias e eventos
- ✅ Estatísticas em tempo real
- ✅ Mapa público de coletas
- ✅ Calendário de coletas
- ✅ Informações de contato

### 👤 Portal do Usuário
- ✅ Cadastro e login
- ✅ Agendamento de coletas
- ✅ Histórico de coletas
- ✅ Notificações (Email, SMS, WhatsApp)
- ✅ Perfil personalizável

### 🚛 Portal do Coletor
- ✅ Visualização de rotas do dia
- ✅ Check-in em pontos de coleta
- ✅ Atualização de localização em tempo real
- ✅ Histórico e métricas de desempenho
- ✅ Reportar problemas

### 👨‍💼 Portal Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de usuários
- ✅ Criação e otimização de rotas
- ✅ Relatórios detalhados
- ✅ Gerenciamento de notícias (admins específicos)
- ✅ Mapa administrativo

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **Socket.io** - Comunicação em tempo real
- **Nodemailer** - Envio de emails
- **OSRM** - Otimização de rotas

### Frontend
- **React 18** + **TypeScript** - Interface do usuário
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **React Query** - Gerenciamento de estado e cache
- **React Router v6** - Roteamento
- **Zustand** - State management
- **Leaflet** - Mapas interativos
- **Axios** - Requisições HTTP
- **Zod** - Validação de formulários
- **Sonner** - Notificações toast

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- MongoDB 6+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/coleta-lixo-verde-itacoatiara.git
cd coleta-lixo-verde-itacoatiara
```

### 2. Instale as dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configure as variáveis de ambiente

#### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/coleta-lixo-verde

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=seu_refresh_secret_aqui
JWT_REFRESH_EXPIRE=30d

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# SMS (opcional)
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE_NUMBER=+5592999999999

# WhatsApp (opcional)
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_API_KEY=sua_api_key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### 4. Popule o banco de dados (opcional)
```bash
cd backend
npm run seed
```

Isso criará:
- 2 admins específicos (wamber.pacheco.12@gmail.com, apgxavier@gmail.com)
- 2 admins comuns
- 3 coletores
- 5 usuários
- 10 notícias de exemplo

**Senha padrão para todos:** `senha123`

### 5. Inicie os servidores

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Servidor rodando em: http://localhost:5000

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Aplicação rodando em: http://localhost:3000

## 🎮 Uso

### Acessar o Sistema

1. **Página Pública:** http://localhost:3000
   - Visualize notícias, estatísticas e mapa público
   - Não requer login

2. **Login:** http://localhost:3000/login
   - Use as credenciais do seed ou crie uma nova conta

3. **Registro:** http://localhost:3000/register
   - Crie uma conta de usuário

### Credenciais de Teste (após seed)

#### Admins Específicos (acesso total + notícias)
```
Email: wamber.pacheco.12@gmail.com
Senha: senha123

Email: apgxavier@gmail.com
Senha: senha123
```

#### Admin Comum
```
Email: admin@itacoatiara.am.gov.br
Senha: senha123
```

#### Coletor
```
Email: coletor1@itacoatiara.am.gov.br
Senha: senha123
```

#### Usuário
```
Email: usuario1@email.com
Senha: senha123
```

## 📁 Estrutura do Projeto

```
coleta-lixo-verde-itacoatiara/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (DB, Auth, Socket)
│   │   ├── controllers/     # Controladores
│   │   ├── middleware/      # Middlewares (Auth, Validation, etc)
│   │   ├── models/          # Modelos Mongoose
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Serviços (Email, SMS, etc)
│   │   ├── utils/           # Utilitários
│   │   ├── scripts/         # Scripts (seed, etc)
│   │   └── server.js        # Entrada do servidor
│   ├── logs/                # Logs da aplicação
│   ├── .env                 # Variáveis de ambiente
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── layout/      # Layouts (Admin, Public)
│   │   │   └── ui/          # Componentes UI reutilizáveis
│   │   ├── pages/           # Páginas
│   │   │   ├── admin/       # Páginas admin
│   │   │   ├── auth/        # Login/Register
│   │   │   ├── citizen/     # Páginas do usuário
│   │   │   ├── collector/   # Páginas do coletor
│   │   │   └── public/      # Páginas públicas
│   │   ├── services/        # Serviços de API
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilitários
│   │   ├── lib/             # Configurações de libs
│   │   ├── App.tsx          # Componente principal
│   │   └── main.tsx         # Entrada da aplicação
│   ├── .env                 # Variáveis de ambiente
│   └── package.json
│
├── docs/                    # Documentação adicional
├── .gitignore
└── README.md
```

## 📚 Documentação

- [**GUIA_RAPIDO.md**](./GUIA_RAPIDO.md) - Guia rápido de uso do sistema
- [**REFATORACAO_BACKEND.md**](./REFATORACAO_BACKEND.md) - Detalhes da refatoração do backend
- [**REFATORACAO_FRONTEND.md**](./REFATORACAO_FRONTEND.md) - Detalhes da refatoração do frontend
- [**RESUMO_REFATORACAO.md**](./RESUMO_REFATORACAO.md) - Resumo executivo das mudanças
- [**GUIA_TESTE_REFATORACAO.md**](./GUIA_TESTE_REFATORACAO.md) - Guia completo de testes
- [**TODO_FRONTEND.md**](./TODO_FRONTEND.md) - Lista de tarefas pendentes

## 🔐 Controle de Acesso

### Roles do Sistema
- **admin** - Acesso total ao sistema
- **coletor** - Acesso às rotas e coletas
- **user** - Acesso ao agendamento de coletas

### Admins Específicos
Apenas os emails abaixo têm acesso ao gerenciamento de notícias:
- wamber.pacheco.12@gmail.com
- apgxavier@gmail.com

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### Testes E2E
Consulte o [GUIA_TESTE_REFATORACAO.md](./GUIA_TESTE_REFATORACAO.md) para testes manuais completos.

## 🚀 Deploy

### Backend (Heroku/Railway/Render)
1. Configure as variáveis de ambiente
2. Configure o MongoDB Atlas
3. Deploy via Git

### Frontend (Vercel/Netlify)
1. Configure `VITE_API_URL` para a URL do backend
2. Build: `npm run build`
3. Deploy da pasta `dist/`

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Wamber Pacheco** - [wamber.pacheco.12@gmail.com](mailto:wamber.pacheco.12@gmail.com)
- **APG Xavier** - [apgxavier@gmail.com](mailto:apgxavier@gmail.com)

## 🙏 Agradecimentos

- Prefeitura de Itacoatiara
- Comunidade open source
- Todos os contribuidores

## 📞 Suporte

Para suporte, envie um email para wamber.pacheco.12@gmail.com ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para Itacoatiara, AM**
