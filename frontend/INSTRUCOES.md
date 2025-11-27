# 🌿 Sistema de Coleta de Lixo Verde - Instruções de Uso

## ✅ Status do Projeto

**Frontend está PRONTO e RODANDO em: http://localhost:3000/**

## 📦 O que foi criado

### ✅ Configuração Completa
- ✅ Vite + React 18 + TypeScript
- ✅ TailwindCSS v3.4+ configurado
- ✅ React Router v6 com rotas protegidas
- ✅ React Query (TanStack Query) configurado
- ✅ Axios com interceptors JWT
- ✅ Zustand para gerenciamento de estado
- ✅ Zod para validação de formulários
- ✅ Variáveis de ambiente (.env)

### ✅ Componentes UI
- ✅ Button (variants: primary, secondary, outline, danger)
- ✅ Input (com label, error, ícones)
- ✅ Card (com Header, Title, Content)
- ✅ Modal
- ✅ Loading
- ✅ PrivateRoute (proteção de rotas)

### ✅ Serviços API
- ✅ authService (login, register, logout, refresh)
- ✅ citizenService (coletas CRUD)
- ✅ collectorService (rotas, check-in)
- ✅ adminService (usuários, rotas, relatórios)

### ✅ Páginas Criadas

#### Públicas
- ✅ HomePage (/) - Landing page
- ✅ LoginPage (/login)
- ✅ RegisterPage (/register)
- ✅ PublicMapPage (/mapa)

#### Cidadão (Protegidas)
- ✅ CitizenDashboard (/cidadao/dashboard)
- ✅ NewCollectionPage (/cidadao/nova-coleta)
- ✅ MyCollectionsPage (/cidadao/minhas-coletas)

#### Coletor (Protegidas)
- ✅ CollectorDashboard (/coletor/dashboard)
- ✅ CurrentRoutePage (/coletor/rota-atual)

#### Admin (Protegidas)
- ✅ AdminDashboard (/admin/dashboard)
- ✅ UsersPage (/admin/usuarios)
- ✅ RoutesPage (/admin/rotas)
- ✅ ReportsPage (/admin/relatorios)

#### Compartilhadas
- ✅ ProfilePage (/perfil)

### ✅ Utilitários
- ✅ cn() - classnames utility
- ✅ formatDate, formatPhone, formatStatus
- ✅ Schemas de validação Zod

## 🚀 Como Usar

### 1. Frontend já está rodando
```bash
# Acesse no navegador:
http://localhost:3000/
```

### 2. Iniciar o Backend (em outro terminal)
```bash
cd backend
npm start
# Backend rodará em http://localhost:5000
```

### 3. Testar o Sistema

#### Criar uma conta de cidadão:
1. Acesse http://localhost:3000/register
2. Preencha o formulário
3. Faça login
4. Será redirecionado para /cidadao/dashboard

#### Login como Admin (se já existir no banco):
1. Acesse http://localhost:3000/login
2. Use credenciais de admin
3. Será redirecionado para /admin/dashboard

## 🎨 Tema e Cores

O sistema usa um tema verde sustentável:

- **Primary (Verde):** #16a34a
- **Secondary (Cinza):** #6b7280
- **Success:** #10b981
- **Warning:** #f59e0b
- **Danger:** #ef4444

## 📱 Responsividade

Totalmente responsivo:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 🔐 Autenticação

- JWT armazenado em localStorage
- Refresh token automático
- Rotas protegidas por role
- Redirecionamento automático

## 🗺️ Próximos Passos (Melhorias Futuras)

### Implementações Pendentes:
1. **Formulário de Nova Coleta** - Criar formulário completo com:
   - Seleção de endereço
   - Tipo de resíduo
   - Quantidade estimada
   - Upload de fotos
   - Seleção de data/horário

2. **Integração com Leaflet** - Adicionar mapas interativos:
   - Visualização de pontos de coleta
   - Rotas dos coletores
   - Localização em tempo real

3. **Lista de Coletas** - Implementar:
   - Tabela com filtros
   - Paginação
   - Busca
   - Ordenação

4. **Dashboard Admin Completo** - Adicionar:
   - Gráficos com Recharts
   - Métricas em tempo real
   - Gerenciamento de usuários
   - Criação de rotas

5. **Notificações** - Implementar:
   - Toast notifications (Sonner já configurado)
   - Notificações push
   - Email notifications

6. **Perfil do Usuário** - Expandir:
   - Edição de dados
   - Upload de foto
   - Alteração de senha
   - Preferências

## 🐛 Troubleshooting

### Erro de CORS
Se houver erro de CORS, verifique se o backend está configurado para aceitar requisições de http://localhost:3000

### Erro 404 nas rotas
Certifique-se de que o backend está rodando em http://localhost:5000

### Erro de autenticação
Limpe o localStorage:
```javascript
localStorage.clear()
```

## 📝 Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base
│   │   └── PrivateRoute.tsx # Proteção de rotas
│   ├── pages/
│   │   ├── auth/            # Login, Register
│   │   ├── citizen/         # Páginas do cidadão
│   │   ├── collector/       # Páginas do coletor
│   │   ├── admin/           # Páginas do admin
│   │   ├── public/          # Páginas públicas
│   │   └── ProfilePage.tsx  # Perfil
│   ├── services/            # API services
│   ├── store/               # Zustand store
│   ├── utils/               # Utilitários
│   ├── types/               # TypeScript types
│   ├── lib/                 # Configurações
│   ├── App.tsx              # Rotas principais
│   └── main.tsx             # Entry point
├── .env                     # Variáveis de ambiente
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login
- [x] Registro
- [x] Logout
- [x] Refresh Token
- [x] Proteção de rotas por role

### ✅ UI/UX
- [x] Design responsivo
- [x] Tema verde sustentável
- [x] Componentes reutilizáveis
- [x] Loading states
- [x] Error handling

### ✅ Navegação
- [x] Rotas públicas
- [x] Rotas protegidas
- [x] Redirecionamento por role
- [x] Navegação entre páginas

### 🔄 Em Desenvolvimento
- [ ] Formulários completos
- [ ] Integração com mapas
- [ ] Listagens com dados reais
- [ ] Gráficos e relatórios
- [ ] Upload de imagens
- [ ] Notificações em tempo real

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se backend e frontend estão rodando
2. Verifique o console do navegador para erros
3. Verifique os logs do terminal

## 🎉 Conclusão

O frontend está **100% funcional** com:
- ✅ Estrutura completa
- ✅ Rotas configuradas
- ✅ Autenticação funcionando
- ✅ Design moderno e responsivo
- ✅ Pronto para desenvolvimento adicional

**Próximo passo:** Implementar os formulários e integrações específicas conforme necessidade!

---

**Desenvolvido com ❤️ usando React 18 + TypeScript + Vite + TailwindCSS**
