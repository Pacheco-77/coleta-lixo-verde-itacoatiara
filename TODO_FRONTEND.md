# 📋 TODO - Frontend Refatoração

## 🎯 Status Geral
- ✅ **Fase 1:** Tipos e Interfaces - CONCLUÍDO
- ✅ **Fase 2:** Serviços (Public e News) - CONCLUÍDO
- ✅ **Fase 3:** Rotas Atualizadas - CONCLUÍDO
- ✅ **Fase 4:** HomePage Pública - CONCLUÍDO
- ✅ **Fase 5:** NewsManagementPage - CONCLUÍDO
- ✅ **Fase 6:** AdminLayout - CONCLUÍDO
- 🔄 **Fase 7:** Atualizar Páginas Existentes - EM ANDAMENTO
- ⏳ **Fase 8:** Google OAuth - PENDENTE
- ⏳ **Fase 9:** Testes e Otimizações - PENDENTE

---

## 🔄 Tarefas Prioritárias

### 1. Atualizar Páginas de Usuário (ex-Cidadão)
- [ ] Renomear `CitizenDashboard` para `UserDashboard`
- [ ] Atualizar todas as referências de "cidadão" para "usuário"
- [ ] Atualizar chamadas de API de `/api/citizen` para `/api/user`
- [ ] Verificar e atualizar tipos em todos os componentes
- [ ] Testar fluxo completo de usuário

**Arquivos a Atualizar:**
```
frontend/src/pages/citizen/CitizenDashboard.tsx
frontend/src/pages/citizen/NewCollectionPage.tsx
frontend/src/pages/citizen/MyCollectionsPage.tsx
frontend/src/services/citizenService.ts (renomear para userService.ts)
```

### 2. Atualizar Páginas de Coletor
- [ ] Verificar uso correto do role `coletor` (não `collector`)
- [ ] Atualizar chamadas de API se necessário
- [ ] Testar fluxo completo de coletor

**Arquivos a Verificar:**
```
frontend/src/pages/collector/CollectorDashboard.tsx
frontend/src/pages/collector/CurrentRoutePage.tsx
frontend/src/services/collectorService.ts
```

### 3. Atualizar Páginas Admin
- [ ] Verificar integração com AdminLayout
- [ ] Adicionar verificação de admin específico onde necessário
- [ ] Testar todas as funcionalidades admin

**Arquivos a Verificar:**
```
frontend/src/pages/admin/AdminDashboard.tsx
frontend/src/pages/admin/UsersPage.tsx
frontend/src/pages/admin/RoutesPage.tsx
frontend/src/pages/admin/ReportsPage.tsx
```

### 4. Componentes Compartilhados
- [ ] Verificar uso de roles em todos os componentes
- [ ] Atualizar Header/Navbar se existir
- [ ] Atualizar Sidebar se existir
- [ ] Verificar componentes de autenticação

---

## 🆕 Novas Funcionalidades

### 5. Página de Visualização de Notícia
- [ ] Criar `NewsDetailPage.tsx`
- [ ] Rota: `/noticia/:id`
- [ ] Incrementar contador de visualizações
- [ ] Mostrar notícias relacionadas
- [ ] Compartilhamento social

**Estrutura:**
```typescript
- Imagem em destaque
- Título e categoria
- Data de publicação
- Conteúdo completo
- Autor (se disponível)
- Botão "Voltar"
- Notícias relacionadas (mesma categoria)
```

### 6. Google OAuth
- [ ] Instalar `@react-oauth/google`
- [ ] Configurar Google OAuth no backend
- [ ] Criar botão "Entrar com Google"
- [ ] Implementar callback de autenticação
- [ ] Atualizar LoginPage
- [ ] Atualizar RegisterPage
- [ ] Testar fluxo completo

**Dependências:**
```bash
npm install @react-oauth/google
```

### 7. Upload de Imagens
- [ ] Criar componente `ImageUpload`
- [ ] Integrar com serviço de upload (Cloudinary/AWS S3)
- [ ] Adicionar preview de imagem
- [ ] Validação de tamanho e formato
- [ ] Progress bar de upload
- [ ] Usar em NewsManagementPage

### 8. Página de Calendário Público
- [ ] Criar `CalendarPage.tsx`
- [ ] Integrar com `react-big-calendar` ou similar
- [ ] Mostrar próximas coletas
- [ ] Filtro por bairro
- [ ] Exportar para Google Calendar

---

## 🐛 Correções e Melhorias

### 9. Acessibilidade
- [ ] Adicionar aria-labels em todos os botões
- [ ] Melhorar navegação por teclado
- [ ] Adicionar skip links
- [ ] Testar com screen readers
- [ ] Verificar contraste de cores

### 10. Performance
- [ ] Implementar lazy loading de imagens
- [ ] Code splitting por rota
- [ ] Otimizar bundle size
- [ ] Adicionar service worker (PWA)
- [ ] Implementar cache de imagens

### 11. Responsividade
- [ ] Testar em diferentes dispositivos
- [ ] Melhorar layout mobile do carrossel
- [ ] Otimizar tabelas para mobile
- [ ] Testar em tablets

### 12. Validações
- [ ] Adicionar Zod schemas para todos os formulários
- [ ] Melhorar mensagens de erro
- [ ] Validação em tempo real
- [ ] Feedback visual de validação

---

## 🧪 Testes

### 13. Testes Unitários
- [ ] Configurar Jest e React Testing Library
- [ ] Testar componentes UI
- [ ] Testar hooks customizados
- [ ] Testar serviços
- [ ] Cobertura mínima de 80%

### 14. Testes E2E
- [ ] Configurar Playwright ou Cypress
- [ ] Testar fluxo de login
- [ ] Testar fluxo de cadastro
- [ ] Testar criação de coleta
- [ ] Testar gerenciamento de notícias

### 15. Testes de Integração
- [ ] Testar integração com backend
- [ ] Testar autenticação JWT
- [ ] Testar refresh token
- [ ] Testar upload de arquivos

---

## 📚 Documentação

### 16. Documentação de Componentes
- [ ] Adicionar JSDoc em todos os componentes
- [ ] Criar Storybook
- [ ] Documentar props e tipos
- [ ] Exemplos de uso

### 17. Guias de Desenvolvimento
- [ ] Guia de estilo de código
- [ ] Guia de estrutura de pastas
- [ ] Guia de nomenclatura
- [ ] Guia de commits

### 18. README do Frontend
- [ ] Instruções de instalação
- [ ] Variáveis de ambiente
- [ ] Scripts disponíveis
- [ ] Estrutura do projeto
- [ ] Como contribuir

---

## 🔐 Segurança

### 19. Segurança Frontend
- [ ] Implementar CSP (Content Security Policy)
- [ ] Sanitizar inputs do usuário
- [ ] Proteger contra XSS
- [ ] Implementar rate limiting visual
- [ ] Adicionar CAPTCHA em formulários públicos

### 20. Gerenciamento de Tokens
- [ ] Implementar refresh token automático
- [ ] Limpar tokens ao fazer logout
- [ ] Verificar expiração de token
- [ ] Redirecionar para login se token inválido

---

## 🎨 UI/UX

### 21. Melhorias de Design
- [ ] Adicionar animações suaves
- [ ] Melhorar feedback visual
- [ ] Adicionar skeleton loaders
- [ ] Melhorar estados vazios
- [ ] Adicionar ilustrações

### 22. Dark Mode
- [ ] Implementar tema escuro
- [ ] Toggle de tema
- [ ] Salvar preferência do usuário
- [ ] Respeitar preferência do sistema

### 23. Internacionalização (i18n)
- [ ] Configurar react-i18next
- [ ] Traduzir para português
- [ ] Preparar para inglês
- [ ] Formatação de datas e números

---

## 📊 Analytics e Monitoramento

### 24. Analytics
- [ ] Integrar Google Analytics
- [ ] Rastrear eventos importantes
- [ ] Monitorar conversões
- [ ] Dashboards de métricas

### 25. Error Tracking
- [ ] Integrar Sentry ou similar
- [ ] Capturar erros de runtime
- [ ] Logs de erros de API
- [ ] Alertas de erros críticos

---

## 🚀 Deploy e CI/CD

### 26. Preparação para Deploy
- [ ] Configurar variáveis de ambiente de produção
- [ ] Otimizar build de produção
- [ ] Configurar CDN para assets
- [ ] Configurar cache headers

### 27. CI/CD
- [ ] Configurar GitHub Actions
- [ ] Testes automáticos em PRs
- [ ] Deploy automático em staging
- [ ] Deploy manual em produção

---

## 📱 PWA (Progressive Web App)

### 28. Funcionalidades PWA
- [ ] Configurar service worker
- [ ] Adicionar manifest.json
- [ ] Implementar offline mode
- [ ] Adicionar ícones de app
- [ ] Notificações push

---

## 🔄 Refatorações Técnicas

### 29. Otimizações de Código
- [ ] Remover código duplicado
- [ ] Extrair lógica para hooks customizados
- [ ] Melhorar estrutura de pastas
- [ ] Padronizar nomenclatura

### 30. Atualização de Dependências
- [ ] Atualizar React para última versão
- [ ] Atualizar todas as dependências
- [ ] Remover dependências não utilizadas
- [ ] Verificar vulnerabilidades

---

## ✅ Critérios de Conclusão

Cada tarefa deve atender:
- [ ] Código implementado e funcionando
- [ ] Testes escritos e passando
- [ ] Documentação atualizada
- [ ] Code review aprovado
- [ ] Sem warnings no console
- [ ] Performance aceitável
- [ ] Acessibilidade verificada
- [ ] Responsividade testada

---

## 📅 Cronograma Sugerido

### Semana 1
- Tarefas 1-4: Atualizar páginas existentes

### Semana 2
- Tarefas 5-8: Novas funcionalidades

### Semana 3
- Tarefas 9-12: Correções e melhorias

### Semana 4
- Tarefas 13-15: Testes

### Semana 5
- Tarefas 16-20: Documentação e segurança

### Semana 6
- Tarefas 21-25: UI/UX e monitoramento

### Semana 7
- Tarefas 26-30: Deploy e otimizações finais

---

## 🎯 Prioridades

### 🔴 Alta Prioridade
1. Atualizar páginas de usuário (Tarefa 1)
2. Google OAuth (Tarefa 6)
3. Testes básicos (Tarefa 13)
4. Segurança (Tarefas 19-20)

### 🟡 Média Prioridade
5. Página de notícia (Tarefa 5)
6. Upload de imagens (Tarefa 7)
7. Acessibilidade (Tarefa 9)
8. Performance (Tarefa 10)

### 🟢 Baixa Prioridade
9. Dark mode (Tarefa 22)
10. i18n (Tarefa 23)
11. PWA (Tarefa 28)
12. Analytics (Tarefa 24)

---

**Última atualização:** 2025-01-XX
**Status:** 📋 Planejamento Completo
