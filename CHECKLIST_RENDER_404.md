# ✅ Checklist: Resolver 404 no Render

## 🎯 Problema Resolvido
**Erro:** `Request failed with status code 404`

---

## 📋 Configuração Atual (CORRIGIDA)

### 1️⃣ Backend no Render
- **URL pública:** `https://coleta-lixo-verde-backend.onrender.com`
- **Nome do serviço:** `coleta-lixo-verde-backend`
- **Porta:** Usa `process.env.PORT` (dinâmica do Render) ✅
- **Rotas da API:** Todas em `/api/*`

**Endpoints disponíveis:**
```
GET  /health                    → Health check
GET  /                          → Info da API
GET  /api/test                  → Teste rápido
POST /api/auth/login            → Login
POST /api/auth/register         → Registro
GET  /api/public/news           → Notícias públicas
GET  /api/public/stats          → Estatísticas
... todas as outras rotas em /api/*
```

### 2️⃣ Frontend no Render
- **URL pública:** `https://coleta-lixo-verde-frontend.onrender.com`
- **Nome do serviço:** `coleta-lixo-verde-frontend`
- **API URL configurada:** `https://coleta-lixo-verde-backend.onrender.com/api` ✅

### 3️⃣ Arquivos Corrigidos
- ✅ `render.yaml` - Nomes dos serviços corrigidos
- ✅ `frontend/.env.production` - URL da API correta com `/api`
- ✅ `frontend/src/lib/axios.ts` - baseURL usando VITE_API_URL
- ✅ `backend/src/server.js` - Usando process.env.PORT

---

## 🧪 Testes para Fazer AGORA

### Teste 1: Backend está rodando?
Abra no navegador:
```
https://coleta-lixo-verde-backend.onrender.com/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API está funcionando",
  "database": "connected",
  "environment": "production"
}
```

❌ **Se der erro 404 ou não carregar:**
- Entre no Render Dashboard
- Clique em "coleta-lixo-verde-backend"
- Veja o "Deploy Log"
- Procure por erros (linhas em vermelho)

### Teste 2: Rota de teste funciona?
Abra no navegador:
```
https://coleta-lixo-verde-backend.onrender.com/api/test
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API funcionando corretamente!",
  "timestamp": "2025-11-28T..."
}
```

### Teste 3: Frontend carregou?
Abra no navegador:
```
https://coleta-lixo-verde-frontend.onrender.com
```

**Esperado:**
- Página deve carregar (mesmo que demore ~30s no free tier)
- Não deve dar erro 404

### Teste 4: Frontend consegue chamar o backend?
1. Abra o frontend: `https://coleta-lixo-verde-frontend.onrender.com`
2. Pressione **F12** (abrir DevTools)
3. Vá na aba **Console**
4. Tente fazer login ou acessar página pública
5. Veja se aparecem erros

**No Console, NÃO deve aparecer:**
```
❌ GET https://coleta-lixo-verde-backend.onrender.com/auth → 404
❌ POST http://localhost:5000/api/auth/login → Failed
```

**Deve aparecer algo como:**
```
✅ POST https://coleta-lixo-verde-backend.onrender.com/api/auth/login → 200 OK
```

---

## 🔧 Troubleshooting

### Problema: Backend dá 404 no /health
**Causa:** Backend não subiu corretamente
**Solução:**
1. Entre no Render Dashboard → Backend Service
2. Veja os logs em tempo real
3. Procure por:
   - `❌ ERRO: MONGODB_URI não está configurado` → Configure no Render
   - `Error: listen EADDRINUSE` → Porta já em uso (raro no Render)
   - Erro de npm install → Dependências faltando

### Problema: Frontend chama localhost no Console
**Causa:** Variável VITE_API_URL não foi carregada no build
**Solução:**
1. Render Dashboard → Frontend Service → Environment
2. Adicione: `VITE_API_URL = https://coleta-lixo-verde-backend.onrender.com/api`
3. Clique em "Manual Deploy" → "Clear build cache & deploy"

### Problema: Backend retorna CORS error
**Causa:** FRONTEND_URL não está configurado no backend
**Solução:**
1. Render Dashboard → Backend Service → Environment
2. Verifique: `FRONTEND_URL = https://coleta-lixo-verde-frontend.onrender.com`
3. Se não existir, adicione e faça redeploy

### Problema: MongoDB não conecta
**Causa:** IP não está na whitelist do MongoDB Atlas
**Solução:**
1. Entre no MongoDB Atlas
2. Network Access → Add IP Address
3. Adicione: `0.0.0.0/0` (permitir todos - necessário no Render free tier)
4. Save

---

## ✅ Checklist Final

Marque cada item após verificar:

- [ ] Backend mostra "Live" no Render Dashboard
- [ ] `/health` retorna JSON com `"database": "connected"`
- [ ] `/api/test` retorna sucesso
- [ ] Frontend carrega sem erro 404
- [ ] Console do navegador não mostra erros de 404
- [ ] Login funciona sem erro de rede
- [ ] MongoDB Atlas tem `0.0.0.0/0` na whitelist

**Se TODOS estiverem ✅ → Seu app está 100% funcionando no Render!** 🎉

---

## 🚨 Últimas Correções Aplicadas

**Commit `056a325` (28/11/2025):**
- ✅ Corrigidos nomes dos serviços no `render.yaml`
- ✅ Removido PORT hardcoded (Render usa porta dinâmica)
- ✅ Backend agora usa `coleta-lixo-verde-backend`
- ✅ Frontend agora usa `coleta-lixo-verde-frontend`

**O deploy automático já foi acionado. Aguarde 2-3 minutos e teste!**
