# Sistema de Coleta de Lixo Verde - Frontend

Frontend moderno e responsivo para o Sistema de Coleta de Lixo Verde de Itacoatiara/AM.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utility-first
- **React Router v6** - Roteamento
- **TanStack Query (React Query)** - Gerenciamento de estado do servidor
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Leaflet** - Mapas interativos
- **Lucide React** - Ícones
- **Sonner** - Toast notifications
- **date-fns** - Manipulação de datas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend rodando em `http://localhost:5000`

## 🔧 Instalação

1. Clone o repositório e navegue até a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_MAP_CENTER_LAT=-3.1432
VITE_MAP_CENTER_LNG=-58.4442
VITE_MAP_DEFAULT_ZOOM=13
VITE_APP_NAME=Sistema de Coleta de Lixo Verde
VITE_APP_CITY=Itacoatiara
VITE_APP_STATE=AM
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── ui/         # Componentes de UI base
│   │   ├── layout/     # Componentes de layout
│   │   ├── maps/       # Componentes de mapa
│   │   └── shared/     # Componentes compartilhados
│   ├── pages/          # Páginas da aplicação
│   │   ├── auth/       # Páginas de autenticação
│   │   ├── citizen/    # Páginas do cidadão
│   │   ├── collector/  # Páginas do coletor
│   │   ├── admin/      # Páginas do admin
│   │   └── public/     # Páginas públicas
│   ├── services/       # Serviços de API
│   ├── store/          # Gerenciamento de estado (Zustand)
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Funções utilitárias
│   ├── types/          # Tipos TypeScript
│   ├── lib/            # Configurações de bibliotecas
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais
├── .env                # Variáveis de ambiente
├── .env.example        # Exemplo de variáveis de ambiente
├── index.html          # HTML template
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração TypeScript
├── vite.config.ts      # Configuração Vite
└── tailwind.config.js  # Configuração Tailwind
```

## 👥 Tipos de Usuário

### 1. Cidadão
- Agendar coletas de lixo verde
- Ver histórico de coletas
- Acompanhar status das coletas
- Ver próximas coletas no mapa

**Acesso:** `/cidadao/*`

### 2. Coletor
- Ver rota do dia
- Fazer check-in nos pontos de coleta
- Atualizar localização em tempo real
- Ver histórico e métricas

**Acesso:** `/coletor/*`

### 3. Administrador
- Gerenciar usuários
- Criar e gerenciar rotas
- Gerar relatórios
- Visualizar dashboard completo

**Acesso:** `/admin/*`

## 🗺️ Rotas Principais

### Públicas
- `/` - Página inicial
- `/mapa` - Mapa público com próximas coletas
- `/login` - Login
- `/register` - Cadastro

### Cidadão (Protegidas)
- `/cidadao/dashboard` - Dashboard do cidadão
- `/cidadao/nova-coleta` - Agendar nova coleta
- `/cidadao/minhas-coletas` - Minhas coletas

### Coletor (Protegidas)
- `/coletor/dashboard` - Dashboard do coletor
- `/coletor/rota-atual` - Rota atual

### Admin (Protegidas)
- `/admin/dashboard` - Dashboard administrativo
- `/admin/usuarios` - Gerenciar usuários
- `/admin/rotas` - Gerenciar rotas
- `/admin/relatorios` - Relatórios

### Compartilhadas (Protegidas)
- `/perfil` - Perfil do usuário

## 🎨 Tema e Design

O sistema utiliza um tema verde sustentável:

- **Cor Primária:** Verde (#16a34a) - Representa sustentabilidade
- **Cor Secundária:** Cinza - Para elementos neutros
- **Design:** Mobile-first, responsivo
- **Componentes:** Modernos com animações suaves

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- Token armazenado em localStorage
- Refresh token para renovação automática
- Interceptors Axios para adicionar token automaticamente
- Rotas protegidas por role (admin, collector, citizen)

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🗺️ Mapas

Utiliza Leaflet para mapas interativos:

- Visualização de pontos de coleta
- Rotas dos coletores
- Localização em tempo real
- Markers customizados por status

## 📊 Gerenciamento de Estado

### React Query (TanStack Query)
- Cache de dados do servidor
- Refetch automático
- Otimistic updates
- Sincronização em background

### Zustand
- Estado de autenticação
- Preferências do usuário
- Estado global da aplicação

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## 🚀 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🌐 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Configuração do Backend

Certifique-se de que o backend está rodando em `http://localhost:5000` ou atualize a variável `VITE_API_URL` no arquivo `.env`.

## 📝 Convenções de Código

- **Componentes:** PascalCase (ex: `Button.tsx`)
- **Hooks:** camelCase com prefixo `use` (ex: `useAuth.ts`)
- **Utilitários:** camelCase (ex: `formatDate.ts`)
- **Tipos:** PascalCase (ex: `User`, `CollectionPoint`)
- **Constantes:** UPPER_SNAKE_CASE

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se de que o backend está configurado para aceitar requisições do frontend.

### Mapa não carrega
Verifique se as coordenadas no `.env` estão corretas para Itacoatiara/AM.

### Erro de autenticação
Limpe o localStorage e faça login novamente:
```javascript
localStorage.clear()
```

## 📄 Licença

Este projeto é parte do Sistema de Coleta de Lixo Verde de Itacoatiara/AM.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ usando as melhores práticas de 2025.

---

**Versão:** 1.0.0  
**Última atualização:** 2025
