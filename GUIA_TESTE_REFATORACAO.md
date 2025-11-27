# 🧪 Guia de Testes - Refatoração do Sistema

## 🎯 Objetivo
Este guia fornece um passo a passo para testar todas as funcionalidades implementadas na refatoração.

---

## 🚀 Preparação do Ambiente

### 1. Iniciar Backend
```bash
cd backend
npm install
npm run seed    # Popular banco com dados de teste
npm run dev     # Porta 5000
```

**Verificar:**
- ✅ Servidor rodando em http://localhost:5000
- ✅ MongoDB conectado
- ✅ Seed executado com sucesso

### 2. Iniciar Frontend
```bash
cd frontend
npm install
npm run dev     # Porta 5173
```

**Verificar:**
- ✅ Aplicação rodando em http://localhost:5173
- ✅ Sem erros no console
- ✅ Compilação TypeScript OK

---

## 📋 Checklist de Testes

### ✅ Fase 1: Página Pública (Sem Login)

#### 1.1 HomePage
```
URL: http://localhost:5173/
```

**Testar:**
- [ ] Página carrega sem erros
- [ ] Carrossel de notícias aparece
- [ ] Notícias rotacionam automaticamente (5s)
- [ ] Navegação manual do carrossel funciona (← →)
- [ ] Indicadores de slide funcionam
- [ ] Categorias têm cores corretas:
  - Notícia: Azul
  - Evento: Roxo
  - Alerta: Vermelho
  - Informação: Verde
- [ ] Estatísticas são exibidas:
  - Total de coletas
  - Kg coletados
  - Coletores ativos
  - Bairros atendidos
- [ ] Seção "Como Funciona" aparece
- [ ] Botões "Entrar" e "Cadastrar" funcionam
- [ ] Footer com links e contato

**Responsividade:**
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

#### 1.2 APIs Públicas
```bash
# Testar endpoints diretamente
curl http://localhost:5000/api/public/news
curl http://localhost:5000/api/public/statistics
curl http://localhost:5000/api/public/calendar
curl http://localhost:5000/api/public/map
curl http://localhost:5000/api/public/contact
```

**Verificar:**
- [ ] Todos retornam status 200
- [ ] Dados corretos no formato JSON
- [ ] Sem necessidade de autenticação

---

### ✅ Fase 2: Autenticação

#### 2.1 Login - Admin Específico
```
URL: http://localhost:5173/login
Email: wamber.pacheco.12@gmail.com
Senha: Admin@2025
```

**Testar:**
- [ ] Login bem-sucedido
- [ ] Redirecionamento para /admin/dashboard
- [ ] Token JWT armazenado
- [ ] Informações do usuário no header

#### 2.2 Login - Admin Comum
```
Email: admin2@coletaverde.com
Senha: Admin@2025
```

**Testar:**
- [ ] Login bem-sucedido
- [ ] Redirecionamento para /admin/dashboard
- [ ] Menu "Notícias" NÃO aparece no sidebar

#### 2.3 Login - Coletor
```
Email: coletor1@coletaverde.com
Senha: Coletor@2025
```

**Testar:**
- [ ] Login bem-sucedido
- [ ] Redirecionamento para /coletor/dashboard
- [ ] Acesso apenas a rotas de coletor

#### 2.4 Login - Usuário
```
Email: usuario1@gmail.com
Senha: User@2025
```

**Testar:**
- [ ] Login bem-sucedido
- [ ] Redirecionamento para /usuario/dashboard
- [ ] Acesso apenas a rotas de usuário

---

### ✅ Fase 3: Gerenciamento de Notícias (Admin Específico)

**Pré-requisito:** Login como wamber.pacheco.12@gmail.com

#### 3.1 Acessar Gerenciamento
```
URL: http://localhost:5173/admin/noticias
```

**Verificar:**
- [ ] Página carrega corretamente
- [ ] Lista de notícias aparece
- [ ] Filtros funcionam (Todas, Ativas, Inativas)
- [ ] Botão "Nova Notícia" visível

#### 3.2 Criar Notícia
**Passos:**
1. Clicar em "Nova Notícia"
2. Preencher formulário:
   ```
   Título: Teste de Notícia
   Resumo: Resumo de teste
   Conteúdo: Conteúdo completo de teste
   Imagem: https://picsum.photos/800/400
   Categoria: Notícia
   Prioridade: 5
   ```
3. Clicar em "Criar"

**Verificar:**
- [ ] Modal abre corretamente
- [ ] Todos os campos aparecem
- [ ] Validação funciona (campos obrigatórios)
- [ ] Toast de sucesso aparece
- [ ] Notícia aparece na lista
- [ ] Modal fecha automaticamente

#### 3.3 Editar Notícia
**Passos:**
1. Clicar em "Editar" em uma notícia
2. Modificar título
3. Clicar em "Atualizar"

**Verificar:**
- [ ] Modal abre com dados preenchidos
- [ ] Alterações são salvas
- [ ] Toast de sucesso aparece
- [ ] Lista atualiza automaticamente

#### 3.4 Ativar/Desativar Notícia
**Passos:**
1. Clicar em "Desativar" em uma notícia ativa
2. Verificar mudança de status
3. Clicar em "Ativar" novamente

**Verificar:**
- [ ] Status muda corretamente
- [ ] Badge "Inativa" aparece quando desativada
- [ ] Toast de sucesso aparece
- [ ] Filtros funcionam com novo status

#### 3.5 Deletar Notícia
**Passos:**
1. Clicar em "Deletar" em uma notícia
2. Confirmar exclusão

**Verificar:**
- [ ] Confirmação aparece
- [ ] Notícia é removida da lista
- [ ] Toast de sucesso aparece
- [ ] Não aparece mais na lista

#### 3.6 Filtros
**Testar:**
- [ ] "Todas" mostra todas as notícias
- [ ] "Ativas" mostra apenas ativas
- [ ] "Inativas" mostra apenas inativas
- [ ] Contador de notícias correto

---

### ✅ Fase 4: Layout Administrativo

#### 4.1 Sidebar (Admin Específico)
**Login:** wamber.pacheco.12@gmail.com

**Verificar Menu:**
- [ ] Dashboard
- [ ] Usuários
- [ ] Rotas
- [ ] Relatórios
- [ ] Notícias ✨ (deve aparecer)

#### 4.2 Sidebar (Admin Comum)
**Login:** admin2@coletaverde.com

**Verificar Menu:**
- [ ] Dashboard
- [ ] Usuários
- [ ] Rotas
- [ ] Relatórios
- [ ] Notícias ❌ (NÃO deve aparecer)

#### 4.3 Responsividade do Layout
**Testar:**
- [ ] Desktop: Sidebar fixa à esquerda
- [ ] Mobile: Sidebar oculta, botão menu aparece
- [ ] Mobile: Overlay ao abrir sidebar
- [ ] Mobile: Sidebar fecha ao clicar em link
- [ ] Mobile: Sidebar fecha ao clicar no overlay

#### 4.4 Header
**Verificar:**
- [ ] Logo e nome do sistema
- [ ] Nome do usuário
- [ ] Email do usuário
- [ ] Botão "Sair" funciona
- [ ] Logout redireciona para /login

---

### ✅ Fase 5: Controle de Acesso

#### 5.1 Rotas Protegidas
**Testar sem login:**
```
/admin/dashboard    → Redireciona para /login
/admin/noticias     → Redireciona para /login
/coletor/dashboard  → Redireciona para /login
/usuario/dashboard  → Redireciona para /login
```

#### 5.2 Acesso por Role
**Login como Usuário:**
```
/usuario/dashboard  → ✅ Permitido
/coletor/dashboard  → ❌ Não autorizado
/admin/dashboard    → ❌ Não autorizado
```

**Login como Coletor:**
```
/coletor/dashboard  → ✅ Permitido
/usuario/dashboard  → ❌ Não autorizado
/admin/dashboard    → ❌ Não autorizado
```

**Login como Admin:**
```
/admin/dashboard    → ✅ Permitido
/admin/noticias     → ✅ Permitido (se específico)
/admin/noticias     → ❌ Não autorizado (se comum)
```

#### 5.3 Redirecionamento de Rotas Antigas
**Testar:**
```
/cidadao/dashboard       → Redireciona para /usuario/dashboard
/cidadao/nova-coleta     → Redireciona para /usuario/nova-coleta
/cidadao/minhas-coletas  → Redireciona para /usuario/minhas-coletas
```

---

### ✅ Fase 6: Integração Frontend-Backend

#### 6.1 Notícias na HomePage
**Verificar:**
- [ ] Notícias vêm do backend
- [ ] Apenas notícias ativas aparecem
- [ ] Ordenação por prioridade funciona
- [ ] Imagens carregam corretamente
- [ ] Contador de visualizações incrementa

#### 6.2 Estatísticas
**Verificar:**
- [ ] Dados vêm do backend
- [ ] Números são atualizados em tempo real
- [ ] Cálculos estão corretos

#### 6.3 Gerenciamento de Notícias
**Verificar:**
- [ ] CRUD completo funciona
- [ ] Validações do backend são respeitadas
- [ ] Erros são tratados corretamente
- [ ] Loading states aparecem

---

### ✅ Fase 7: Performance e UX

#### 7.1 Loading States
**Verificar:**
- [ ] Skeleton loaders aparecem
- [ ] Spinners em botões durante ações
- [ ] Feedback visual em todas as operações

#### 7.2 Toast Notifications
**Verificar:**
- [ ] Sucesso: Verde
- [ ] Erro: Vermelho
- [ ] Posição: Top-right
- [ ] Auto-dismiss após 3-5 segundos

#### 7.3 Validações de Formulário
**Testar:**
- [ ] Campos obrigatórios validados
- [ ] Mensagens de erro claras
- [ ] Validação em tempo real
- [ ] Feedback visual (bordas vermelhas)

#### 7.4 Cache (React Query)
**Verificar:**
- [ ] Dados em cache após primeira carga
- [ ] Revalidação automática
- [ ] Stale time configurado (5 minutos)

---

### ✅ Fase 8: Testes de Erro

#### 8.1 Backend Offline
**Simular:**
1. Parar o backend
2. Tentar acessar páginas

**Verificar:**
- [ ] Mensagens de erro amigáveis
- [ ] Não quebra a aplicação
- [ ] Retry automático (React Query)

#### 8.2 Token Expirado
**Simular:**
1. Fazer login
2. Esperar token expirar (ou modificar manualmente)
3. Tentar fazer ação

**Verificar:**
- [ ] Redirecionamento para login
- [ ] Mensagem de sessão expirada
- [ ] Token limpo do storage

#### 8.3 Permissões Negadas
**Simular:**
1. Login como admin comum
2. Tentar acessar /admin/noticias diretamente

**Verificar:**
- [ ] Acesso negado
- [ ] Redirecionamento apropriado
- [ ] Mensagem de erro

---

## 📊 Relatório de Testes

### Template de Relatório

```markdown
# Relatório de Testes - [Data]

## Ambiente
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Navegador: [Chrome/Firefox/Safari]
- Versão: [Versão do navegador]

## Resultados

### Fase 1: Página Pública
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

### Fase 2: Autenticação
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

### Fase 3: Gerenciamento de Notícias
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

### Fase 4: Layout Administrativo
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

### Fase 5: Controle de Acesso
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

### Fase 6: Integração
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

### Fase 7: Performance e UX
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

### Fase 8: Testes de Erro
- [ ] Todos os testes passaram
- [ ] Problemas encontrados: [Descrever]

## Bugs Encontrados
1. [Descrição do bug]
   - Severidade: [Alta/Média/Baixa]
   - Passos para reproduzir: [Passos]
   - Comportamento esperado: [Descrição]
   - Comportamento atual: [Descrição]

## Melhorias Sugeridas
1. [Sugestão]
2. [Sugestão]

## Conclusão
- Status Geral: [✅ Aprovado / ⚠️ Com Ressalvas / ❌ Reprovado]
- Observações: [Observações gerais]
```

---

## 🐛 Problemas Comuns e Soluções

### 1. Backend não inicia
```bash
# Verificar MongoDB
sudo systemctl status mongod

# Verificar porta 5000
lsof -i :5000

# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
```

### 2. Frontend não compila
```bash
# Limpar cache
rm -rf node_modules .vite package-lock.json
npm install

# Verificar TypeScript
npx tsc --noEmit
```

### 3. Seed não funciona
```bash
# Limpar banco de dados
mongo
use coleta_verde_db
db.dropDatabase()

# Executar seed novamente
npm run seed
```

### 4. Notícias não aparecem
```bash
# Verificar no MongoDB
mongo
use coleta_verde_db
db.news.find().pretty()

# Verificar console do navegador
# Verificar Network tab (F12)
```

---

## ✅ Critérios de Aceitação

Para considerar a refatoração aprovada:

- [ ] **100% dos testes da Fase 1** passam
- [ ] **100% dos testes da Fase 2** passam
- [ ] **100% dos testes da Fase 3** passam
- [ ] **100% dos testes da Fase 4** passam
- [ ] **100% dos testes da Fase 5** passam
- [ ] **90%+ dos testes da Fase 6** passam
- [ ] **90%+ dos testes da Fase 7** passam
- [ ] **80%+ dos testes da Fase 8** passam
- [ ] **Sem erros críticos** no console
- [ ] **Performance aceitável** (< 3s carregamento)
- [ ] **Responsividade** em todos os dispositivos

---

## 📞 Suporte

### Em caso de problemas:
1. Verificar logs do backend: `backend/logs/`
2. Verificar console do navegador (F12)
3. Consultar documentação: `REFATORACAO_*.md`
4. Contatar: wamber.pacheco.12@gmail.com

---

**Última atualização:** 2025-01-XX
**Versão:** 1.0.0
**Status:** 📋 Pronto para Testes
