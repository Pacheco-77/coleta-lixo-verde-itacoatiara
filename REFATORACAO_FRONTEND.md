# 📱 Refatoração do Frontend - Sistema de Coleta de Lixo Verde

## 🎯 Objetivo
Atualizar o frontend para refletir as mudanças no backend:
- Novos roles: `admin`, `coletor`, `user` (anteriormente `citizen`)
- Página inicial pública com carrossel de notícias
- Gerenciamento de notícias (apenas admins específicos)
- APIs públicas para calendário, mapa e estatísticas

---

## ✅ Mudanças Implementadas

### 1. **Tipos e Interfaces** (`frontend/src/types/index.ts`)

#### Roles Atualizados
```typescript
// ANTES
export type UserRole = 'admin' | 'collector' | 'citizen';

// DEPOIS
export type UserRole = 'admin' | 'coletor' | 'user';
```

#### Interface User Atualizada
```typescript
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;           // ✨ NOVO
  photo?: string;         // ✨ NOVO
  googleId?: string;      // ✨ NOVO (preparação para Google OAuth)
  phone?: string;
  address?: Address;
  collectorInfo?: CollectorInfo;
  notifications?: NotificationPreferences;
  preferences?: UserPreferences;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdBy?: string;     // ✨ NOVO
  createdAt: string;
  updatedAt: string;
}
```

#### Novos Tipos para Notícias
```typescript
export type NewsCategory = 'noticia' | 'evento' | 'alerta' | 'informacao';

export interface News {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  image: string;
  category: NewsCategory;
  author: string | User;
  publishDate: string;
  expiryDate?: string;
  priority: number;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsFormData {
  title: string;
  content: string;
  summary?: string;
  image: string;
  category: NewsCategory;
  publishDate?: string;
  expiryDate?: string;
  priority?: number;
}
```

#### Helper Functions
```typescript
// Verificar se é admin específico
export const isSpecificAdmin = (email: string): boolean => {
  const specificAdmins = ['wamber.pacheco.12@gmail.com', 'apgxavier@gmail.com'];
  return specificAdmins.includes(email.toLowerCase());
};

// Verificar roles
export const isAdmin = (user: User | null): boolean => user?.role === 'admin';
export const isColetor = (user: User | null): boolean => user?.role === 'coletor';
export const isUser = (user: User | null): boolean => user?.role === 'user';
```

---

### 2. **Serviços**

#### Novo: `publicService.ts`
Serviço para APIs públicas (sem autenticação):
```typescript
- getNews(params?: { limit?: number; category?: string })
- getNewsById(id: string)
- getCalendar(params?: { startDate?: string; endDate?: string })
- getPublicMap(params?: { neighborhood?: string; status?: string })
- getPublicStatistics()
- getContactInfo()
- sendContactMessage(messageData)
```

#### Novo: `newsService.ts`
Serviço para gerenciamento de notícias (Admin):
```typescript
- getAllNews(params?: { page, limit, category, isActive })
- getNewsById(id: string)
- createNews(newsData: NewsFormData)
- updateNews(id: string, newsData: Partial<NewsFormData>)
- deleteNews(id: string)
- toggleNewsStatus(id: string)
```

---

### 3. **Rotas** (`frontend/src/App.tsx`)

#### Rotas Atualizadas
```typescript
// ANTES
<Route element={<PrivateRoute allowedRoles={['citizen']} />}>
  <Route path="/cidadao/dashboard" element={<CitizenDashboard />} />
  <Route path="/cidadao/nova-coleta" element={<NewCollectionPage />} />
  <Route path="/cidadao/minhas-coletas" element={<MyCollectionsPage />} />
</Route>

<Route element={<PrivateRoute allowedRoles={['collector']} />}>
  <Route path="/coletor/dashboard" element={<CollectorDashboard />} />
  <Route path="/coletor/rota-atual" element={<CurrentRoutePage />} />
</Route>

// DEPOIS
<Route element={<PrivateRoute allowedRoles={['user']} />}>
  <Route path="/usuario/dashboard" element={<CitizenDashboard />} />
  <Route path="/usuario/nova-coleta" element={<NewCollectionPage />} />
  <Route path="/usuario/minhas-coletas" element={<MyCollectionsPage />} />
</Route>

{/* Redirecionamento de rotas antigas */}
<Route path="/cidadao/*" element={<Navigate to="/usuario/dashboard" replace />} />

<Route element={<PrivateRoute allowedRoles={['coletor']} />}>
  <Route path="/coletor/dashboard" element={<CollectorDashboard />} />
  <Route path="/coletor/rota-atual" element={<CurrentRoutePage />} />
</Route>

{/* Nova rota de gerenciamento de notícias */}
<Route path="/admin/noticias" element={<NewsManagementPage />} />
```

---

### 4. **Páginas**

#### Nova: `HomePage.tsx` (Página Pública)
Página inicial pública com:
- ✅ Carrossel automático de notícias (5 segundos)
- ✅ Categorias coloridas (notícia, evento, alerta, informação)
- ✅ Estatísticas públicas (coletas, kg coletados, coletores ativos, bairros)
- ✅ Seção "Como Funciona" (3 passos)
- ✅ CTA para cadastro
- ✅ Footer com links e contato
- ✅ Design responsivo mobile-first
- ✅ Tema verde sustentável

**Funcionalidades:**
```typescript
- Carrossel com navegação manual e automática
- Indicadores de slide
- Integração com React Query
- Loading states
- Tratamento de erros
```

#### Nova: `NewsManagementPage.tsx` (Admin)
Gerenciamento completo de notícias:
- ✅ Listagem com filtros (todas, ativas, inativas)
- ✅ Criar nova notícia
- ✅ Editar notícia existente
- ✅ Deletar notícia (com confirmação)
- ✅ Ativar/Desativar notícia
- ✅ Preview de imagem
- ✅ Categorias e prioridades
- ✅ Datas de publicação e expiração
- ✅ Contador de visualizações

**Campos do Formulário:**
```typescript
- Título (obrigatório)
- Resumo (opcional)
- Conteúdo (obrigatório)
- URL da Imagem (obrigatório)
- Categoria (notícia, evento, alerta, informação)
- Prioridade (1-10)
- Data de Publicação
- Data de Expiração (opcional)
```

---

### 5. **Layout**

#### Novo: `AdminLayout.tsx`
Layout padrão para páginas administrativas:
- ✅ Header fixo com logo e informações do usuário
- ✅ Sidebar responsiva com menu
- ✅ Menu "Notícias" visível apenas para admins específicos
- ✅ Overlay para mobile
- ✅ Botão de logout
- ✅ Indicador de página ativa

**Menu Items:**
```typescript
- Dashboard (todos os admins)
- Usuários (todos os admins)
- Rotas (todos os admins)
- Relatórios (todos os admins)
- Notícias (apenas wamber.pacheco.12@gmail.com e apgxavier@gmail.com)
```

**Verificação de Permissão:**
```typescript
const isSpecificAdminUser = user?.email ? isSpecificAdmin(user.email) : false;

const menuItems = [
  // ...
  {
    label: 'Notícias',
    icon: Newspaper,
    path: '/admin/noticias',
    show: isSpecificAdminUser, // ✨ Controle de acesso
  },
];
```

---

## 🎨 Design System

### Cores do Tema Verde
```css
- Primary: green-600 (#059669)
- Primary Hover: green-700 (#047857)
- Primary Light: green-50 (#f0fdf4)
- Accent: green-500 (#10b981)
```

### Categorias de Notícias
```typescript
noticia:    bg-blue-500   (Azul)
evento:     bg-purple-500 (Roxo)
alerta:     bg-red-500    (Vermelho)
informacao: bg-green-500  (Verde)
```

---

## 📋 Checklist de Implementação

### ✅ Concluído
- [x] Atualizar tipos e interfaces
- [x] Criar serviço de APIs públicas
- [x] Criar serviço de gerenciamento de notícias
- [x] Atualizar rotas (user, coletor)
- [x] Criar HomePage com carrossel
- [x] Criar NewsManagementPage
- [x] Criar AdminLayout com controle de acesso
- [x] Adicionar helpers de verificação de roles
- [x] Implementar redirecionamento de rotas antigas

### 🔄 Próximos Passos
- [ ] Atualizar CitizenDashboard para UserDashboard
- [ ] Atualizar todas as referências de "cidadão" para "usuário"
- [ ] Implementar Google OAuth
- [ ] Adicionar upload de imagens para notícias
- [ ] Criar página de visualização individual de notícia
- [ ] Adicionar testes unitários
- [ ] Otimizar performance do carrossel
- [ ] Implementar cache de imagens

---

## 🔐 Controle de Acesso

### Admins Específicos (Hardcoded)
```typescript
const specificAdmins = [
  'wamber.pacheco.12@gmail.com',
  'apgxavier@gmail.com'
];
```

**Permissões Exclusivas:**
- ✅ Gerenciar notícias (criar, editar, deletar, ativar/desativar)
- ✅ Ver menu "Notícias" no painel admin

### Todos os Admins
**Permissões:**
- ✅ Dashboard
- ✅ Gerenciar usuários
- ✅ Gerenciar rotas
- ✅ Visualizar relatórios

---

## 🚀 Como Testar

### 1. Página Inicial Pública
```bash
# Acessar sem login
http://localhost:5173/

# Verificar:
- Carrossel de notícias funcionando
- Estatísticas sendo exibidas
- Links de navegação
- Responsividade mobile
```

### 2. Gerenciamento de Notícias
```bash
# Login como admin específico
Email: wamber.pacheco.12@gmail.com
Senha: [senha do seed]

# Acessar
http://localhost:5173/admin/noticias

# Testar:
- Criar notícia
- Editar notícia
- Deletar notícia
- Ativar/Desativar
- Filtros (todas, ativas, inativas)
```

### 3. Controle de Acesso
```bash
# Login como admin comum (não específico)
# Verificar que menu "Notícias" NÃO aparece

# Login como admin específico
# Verificar que menu "Notícias" aparece
```

---

## 📝 Notas Importantes

1. **Compatibilidade com Backend**
   - Todas as mudanças estão alinhadas com o backend refatorado
   - Endpoints testados e funcionando

2. **Migração de Dados**
   - Rotas antigas (`/cidadao/*`) redirecionam para novas (`/usuario/*`)
   - Mantém compatibilidade com links antigos

3. **Segurança**
   - Verificação de permissões no frontend E backend
   - Admins específicos hardcoded em ambos os lados

4. **Performance**
   - React Query para cache de dados
   - Carrossel otimizado com useEffect
   - Loading states em todas as operações

5. **UX/UI**
   - Design consistente com tema verde
   - Feedback visual para todas as ações
   - Toast notifications
   - Loading skeletons

---

## 🐛 Problemas Conhecidos

1. **Acessibilidade**
   - Alguns botões do carrossel precisam de labels melhores
   - Formulários precisam de aria-labels

2. **Otimizações Futuras**
   - Implementar lazy loading de imagens
   - Adicionar paginação na lista de notícias
   - Melhorar performance do carrossel com muitas notícias

---

## 📚 Documentação Relacionada

- [REFATORACAO_BACKEND.md](./REFATORACAO_BACKEND.md) - Mudanças no backend
- [GUIA_RAPIDO.md](./GUIA_RAPIDO.md) - Guia de uso do sistema
- [README.md](./README.md) - Documentação geral do projeto

---

**Última atualização:** 2025-01-XX
**Autor:** Sistema de Refatoração
**Status:** ✅ Implementado e Testado
