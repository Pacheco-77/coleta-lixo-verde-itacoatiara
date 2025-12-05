# 🔧 Problemas Encontrados e Corrigidos - Verificação de Sistema

## Data: 05/12/2024

---

## 🐛 Problema 1: Inconsistência de Roles no Backend

### Descrição
O backend tinha uma inconsistência crítica entre o enum de roles no model User e os valores usados nos controllers e rotas.

### Model User (correto)
```javascript
role: {
  type: String,
  enum: ['admin', 'coletor', 'user'],  // ✅ Português
  default: 'user'
}
```

### Controllers e Rotas (INCORRETO)
```javascript
// authController.js
role: role || 'citizen'  // ❌ Deveria ser 'user'
if (role === 'collector' || role === 'admin')  // ❌ Deveria ser 'coletor'

// collector.js
router.use(requireRole('collector'));  // ❌ Deveria ser 'coletor'

// citizen.js
router.use(requireRole('citizen'));  // ❌ Deveria ser 'user'
```

### Impacto
- ❌ **Login de coletores falhando** - 401 Unauthorized
- ❌ **Registro de usuários falhando** - Erro de validação do enum
- ❌ **Rotas de coletor inacessíveis** - middleware rejeitando role 'coletor'
- ❌ **Rotas de cidadão inacessíveis** - middleware rejeitando role 'user'

### Correção
**Commit a24f27e** - "fix: Corrige roles nas rotas citizen e collector"
- ✅ authController: `'citizen'` → `'user'`, `'collector'` → `'coletor'`
- ✅ collector.js: `requireRole('collector')` → `requireRole('coletor')`
- ✅ citizen.js: `requireRole('citizen')` → `requireRole('user')`

### Arquivos Modificados
1. `backend/src/controllers/authController.js`
2. `backend/src/routes/collector.js`
3. `backend/src/routes/citizen.js`

---

## 📊 Status Atual do Sistema

### ✅ Endpoints Testados e Funcionando
| Endpoint | Método | Status | Resultado |
|----------|--------|--------|-----------|
| /api/pontos | GET | ✅ OK | 25 pontos retornados |
| /api/pontos/estatisticas | GET | ✅ OK | Estatísticas corretas |
| /api/public/news | GET | ✅ OK | 5 notícias ativas |
| /api/public/statistics | GET | ✅ OK | Estatísticas públicas |

### ⏳ Aguardando Deploy (após correção)
| Endpoint | Método | Status Esperado |
|----------|--------|-----------------|
| /api/auth/register | POST | ✅ Deve criar usuário com role 'user' |
| /api/auth/login | POST | ✅ Deve logar coletores |
| /api/collector/current-route | GET | ✅ Deve aceitar token de coletor |
| /api/citizen/collection-points | POST | ✅ Deve aceitar token de user |

---

## 🔍 Verificação Pendente

### Autenticação
- [ ] Registrar novo usuário via API
- [ ] Fazer login com coletor1@teste.com
- [ ] Fazer login com admin
- [ ] Testar /api/auth/me com token válido
- [ ] Testar refresh token
- [ ] Testar logout

### Coletores
- [ ] GET /api/collector/current-route
- [ ] POST /api/collector/checkin/:pointId
- [ ] GET /api/collector/metrics
- [ ] POST /api/collector/location

### Usuários (Cidadãos)
- [ ] POST /api/citizen/collection-points (criar nova coleta)
- [ ] GET /api/citizen/collection-points (minhas coletas)
- [ ] PUT /api/citizen/collection-points/:id (atualizar)
- [ ] DELETE /api/citizen/collection-points/:id (cancelar)

### Admin
- [ ] GET /api/admin/dashboard
- [ ] GET /api/admin/users
- [ ] POST /api/admin/users (criar usuário)
- [ ] GET /api/admin/routes
- [ ] POST /api/admin/routes (criar rota)
- [ ] GET /api/admin/news
- [ ] POST /api/admin/news (criar notícia)
- [ ] PUT /api/admin/news/:id (atualizar)
- [ ] DELETE /api/admin/news/:id (deletar)

---

## 🎯 Próximos Passos

1. **Aguardar deploy no Render** (~2-3 minutos)
2. **Testar autenticação**:
   ```bash
   # Registrar usuário
   curl -X POST https://coleta-lixo-api.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Teste","email":"teste@gmail.com","password":"Teste@123","phone":"(92) 99999-9999"}'
   
   # Login com coletor
   curl -X POST https://coleta-lixo-api.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"coletor1@teste.com","password":"Coletor@123"}'
   ```

3. **Testar endpoints protegidos com token**
4. **Verificar frontend conecta corretamente**
5. **Testar todas as páginas do painel admin**
6. **Testar todas as páginas do painel coletor**
7. **Testar todas as páginas do painel usuário**

---

## 📝 Credenciais de Teste

### Admin
- **Email**: wamber.pacheco.12@gmail.com
- **Senha**: adim18272313

### Coletores (após deploy)
- **Email**: coletor1@teste.com, coletor2@teste.com, coletor3@teste.com
- **Senha**: Coletor@123

### Usuários
- Criar via `/api/auth/register` com senha forte (ex: Teste@123)

---

## 🚨 Problemas Conhecidos (Não Críticos)

1. **insertBefore error** - Leaflet + React (não afeta funcionalidade)
2. **Rate limit** - 5 tentativas de login em 15 minutos
3. **Estatísticas zeradas** - Normal, sem coletas realizadas ainda

---

## 📚 Documentos Criados

1. **ENDPOINT_MAPPING.md** - Mapeamento completo de todos os endpoints
2. **PROBLEMAS_CORRIGIDOS.md** - Este documento

---

## ✅ Conclusão

O problema principal era a inconsistência de roles entre model e controllers. Com as correções aplicadas:
- ✅ Registro de usuários deve funcionar
- ✅ Login de coletores deve funcionar
- ✅ Acesso às rotas protegidas deve funcionar
- ✅ Middleware de role deve aceitar corretamente

**Status**: Aguardando deploy para confirmar correções 🚀
