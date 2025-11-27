# 🚀 Guia Rápido - Sistema de Coleta de Lixo Verde

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
# Backend
cd backend && npm install

# Frontend (em outro terminal)
cd frontend && npm install
```

### 2. Configurar Ambiente
```bash
# Backend - copie e edite
cp backend/.env.example backend/.env

# Frontend - copie e edite
cp frontend/.env.example frontend/.env
```

### 3. Popular Banco de Dados
```bash
cd backend
npm run seed
```

### 4. Iniciar Servidores
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 5. Acessar
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 👤 Credenciais de Teste

### Admin Específico (Acesso Total + Notícias)
```
Email: wamber.pacheco.12@gmail.com
Senha: senha123
```

### Admin Comum
```
Email: admin@itacoatiara.am.gov.br
Senha: senha123
```

### Coletor
```
Email: coletor1@itacoatiara.am.gov.br
Senha: senha123
```

### Usuário
```
Email: usuario1@email.com
Senha: senha123
```

---

## 🎯 Fluxos Principais

### 📰 Gerenciar Notícias (Admin Específico)
1. Login com wamber.pacheco.12@gmail.com
2. Menu lateral → **Notícias**
3. Criar/Editar/Excluir notícias
4. Notícias aparecem na HomePage pública

### 📅 Agendar Coleta (Usuário)
1. Login como usuário
2. Dashboard → **Nova Coleta**
3. Preencher formulário (endereço, tipo de resíduo, quantidade)
4. Aguardar agendamento

### 🚛 Realizar Coleta (Coletor)
1. Login como coletor
2. Dashboard → **Rota do Dia**
3. Navegar até ponto de coleta
4. **Check-in** no ponto
5. Marcar como **Coletado**

### 📊 Ver Relatórios (Admin)
1. Login como admin
2. Dashboard → **Relatórios**
3. Selecionar período e tipo
4. Gerar e exportar (PDF/Excel)

---

## 🗺️ Estrutura de Rotas

### Públicas (sem login)
- `/` - Homepage com notícias
- `/login` - Login
- `/register` - Registro
- `/mapa` - Mapa público
- `/calendario` - Calendário de coletas

### Usuário (role: user)
- `/usuario/dashboard` - Dashboard
- `/usuario/coletas` - Minhas coletas
- `/usuario/nova-coleta` - Agendar coleta
- `/usuario/perfil` - Perfil

### Coletor (role: coletor)
- `/coletor/dashboard` - Dashboard
- `/coletor/rota` - Rota do dia
- `/coletor/historico` - Histórico
- `/coletor/metricas` - Métricas

### Admin (role: admin)
- `/admin/dashboard` - Dashboard geral
- `/admin/usuarios` - Gerenciar usuários
- `/admin/rotas` - Gerenciar rotas
- `/admin/relatorios` - Relatórios
- `/admin/mapa` - Mapa administrativo
- `/admin/noticias` - Notícias (apenas admins específicos)

---

## 🔧 Comandos Úteis

### Backend
```bash
npm run dev          # Desenvolvimento
npm start            # Produção
npm run seed         # Popular banco
npm test             # Testes
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build
npm run lint         # Linter
```

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verificar MongoDB
sudo systemctl status mongod

# Verificar porta 5000
lsof -i :5000
```

### Frontend não conecta
```bash
# Verificar .env
cat frontend/.env
# Deve ter: VITE_API_URL=http://localhost:5000

# Limpar cache
rm -rf frontend/node_modules/.vite
```

### Erro de autenticação
```bash
# Recriar usuários
cd backend
npm run seed
```

---

## 📱 Testar Responsividade

### Chrome DevTools
1. F12 → Toggle device toolbar
2. Testar em:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)

---

## 🔐 Controle de Acesso

### Verificar Permissões
```javascript
// Frontend - src/types/index.ts
export const isSpecificAdmin = (email?: string) => {
  return email === 'wamber.pacheco.12@gmail.com' || 
         email === 'apgxavier@gmail.com';
};
```

### Apenas Admins Específicos Veem
- Menu "Notícias" no AdminLayout
- Página `/admin/noticias`
- Botões de criar/editar/excluir notícias

---

## 📊 Endpoints da API

### Públicos
```bash
GET  /api/public/news          # Notícias
GET  /api/public/statistics    # Estatísticas
GET  /api/public/calendar      # Calendário
GET  /api/public/map           # Mapa
```

### Autenticação
```bash
POST /api/auth/register        # Registrar
POST /api/auth/login           # Login
POST /api/auth/logout          # Logout
GET  /api/auth/me              # Usuário atual
```

### Admin - Notícias (apenas admins específicos)
```bash
GET    /api/admin/news         # Listar
POST   /api/admin/news         # Criar
PUT    /api/admin/news/:id     # Atualizar
DELETE /api/admin/news/:id     # Excluir
PATCH  /api/admin/news/:id/publish  # Publicar
```

---

## 🎨 Personalização

### Cores do Tema
```css
/* frontend/src/index.css */
:root {
  --primary: #16a34a;      /* Verde principal */
  --secondary: #15803d;    /* Verde escuro */
  --accent: #22c55e;       /* Verde claro */
}
```

### Logo
Substitua: `frontend/public/logo.svg`

---

## 📦 Build para Produção

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Arquivos em: dist/
```

---

## 🚀 Deploy Rápido

### Backend (Railway)
```bash
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
vercel login
vercel
```

---

## 📞 Suporte

- **Email:** wamber.pacheco.12@gmail.com
- **GitHub Issues:** [Abrir issue](https://github.com/seu-usuario/coleta-lixo-verde-itacoatiara/issues)

---

**Pronto para usar! 🎉**
